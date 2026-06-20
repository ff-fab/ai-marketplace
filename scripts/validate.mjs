#!/usr/bin/env node
/**
 * validate.mjs — structural + license-hygiene validation for the marketplace.
 * Read-only. Exits 1 if any check fails.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (msg) => errors.push(msg);

function readJsonSafe(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(`Invalid JSON: ${relative(ROOT, path)} — ${e.message}`);
    return null;
  }
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === ".git" || name === "node_modules") continue;
      walk(p, acc);
    } else {
      acc.push(p);
    }
  }
  return acc;
}

// 1. Registry parses and sources exist.
const marketplace = readJsonSafe(join(ROOT, ".claude-plugin", "marketplace.json"));
const registeredDirs = new Set();
if (marketplace) {
  if (!marketplace.name) fail("marketplace.json missing 'name'");
  for (const entry of marketplace.plugins || []) {
    if (!entry.name || !entry.source) {
      fail(`marketplace plugin entry missing name/source: ${JSON.stringify(entry)}`);
      continue;
    }
    const dir = entry.source.replace(/^\.\//, "");
    registeredDirs.add(dir);
    const manifestPath = join(ROOT, dir, ".claude-plugin", "plugin.json");
    if (!existsSync(manifestPath)) {
      fail(`Registered plugin '${entry.name}' missing manifest: ${dir}/.claude-plugin/plugin.json`);
      continue;
    }
    const manifest = readJsonSafe(manifestPath);
    if (manifest) {
      if (!manifest.name) fail(`${dir}/.claude-plugin/plugin.json missing 'name'`);
      if (!manifest.version) fail(`${dir}/.claude-plugin/plugin.json missing 'version'`);
      if (manifest.version !== entry.version)
        fail(`Version drift for '${entry.name}': manifest ${manifest.version} vs registry ${entry.version} (run generate.mjs)`);
    }
  }
}

// 2. Every plugin directory is registered.
const pluginsDir = join(ROOT, "plugins");
for (const name of existsSync(pluginsDir) ? readdirSync(pluginsDir) : []) {
  if (!statSync(join(pluginsDir, name)).isDirectory()) continue;
  if (!registeredDirs.has(`plugins/${name}`))
    fail(`Plugin directory not registered in marketplace.json: plugins/${name}`);
}

// 3. Skills: frontmatter name must match directory name.
for (const file of walk(pluginsDir)) {
  if (!file.endsWith("SKILL.md")) continue;
  const dirName = basename(dirname(file));
  const m = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  const nameLine = m && m[1].match(/^name:\s*(.+)$/m);
  if (!nameLine) fail(`SKILL.md missing frontmatter 'name': ${relative(ROOT, file)}`);
  else if (nameLine[1].trim() !== dirName)
    fail(`SKILL.md name '${nameLine[1].trim()}' != directory '${dirName}': ${relative(ROOT, file)}`);
}

// 4. License hygiene: every vendored dir (non-root LICENSE) is named in THIRD_PARTY_NOTICES.md.
const noticesPath = join(ROOT, "THIRD_PARTY_NOTICES.md");
const notices = existsSync(noticesPath) ? readFileSync(noticesPath, "utf8") : "";
if (!notices) fail("THIRD_PARTY_NOTICES.md is missing");
for (const file of walk(pluginsDir)) {
  if (file.endsWith("/LICENSE") || file.endsWith("\\LICENSE")) {
    const dir = relative(ROOT, dirname(file)).split(sep).join("/");
    if (!notices.includes(dir))
      fail(`Vendored dir not documented in THIRD_PARTY_NOTICES.md: ${dir}`);
  }
}

// 5. Secret hygiene: .mcp.json may only reference secrets via ${ENV_VAR} placeholders.
const PLACEHOLDER = /^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/;

// Any string value inside an `env` map must be a pure ${ENV_VAR} placeholder.
function checkMcpEnv(node, file) {
  if (!node || typeof node !== "object") return;
  for (const [key, val] of Object.entries(node)) {
    if (key === "env" && val && typeof val === "object" && !Array.isArray(val)) {
      for (const [k, v] of Object.entries(val)) {
        if (typeof v === "string" && !PLACEHOLDER.test(v))
          fail(`${relative(ROOT, file)}: env.${k} must be a \${ENV_VAR} placeholder, not a literal value`);
      }
    } else if (val && typeof val === "object") {
      checkMcpEnv(val, file);
    }
  }
}

for (const file of walk(ROOT)) {
  if (!file.endsWith(".mcp.json")) continue;
  const text = readFileSync(file, "utf8");
  // Enforce the documented placeholder-only policy for env values.
  try {
    checkMcpEnv(JSON.parse(text), file);
  } catch (e) {
    fail(`Invalid JSON: ${relative(ROOT, file)} — ${e.message}`);
  }
  // Backstop: catch obvious credential literals anywhere in the file.
  const suspicious = text.match(/(sk-[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16})/);
  if (suspicious) fail(`Possible committed secret in ${relative(ROOT, file)}: ${suspicious[0].slice(0, 8)}…`);
}

if (errors.length) {
  console.error("Validation FAILED:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log("Validation passed.");

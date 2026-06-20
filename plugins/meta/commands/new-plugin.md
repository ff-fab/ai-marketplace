---
description: Scaffold a new themed plugin in this marketplace (manifest + directory layout).
---

Scaffold a new plugin in `plugins/<name>/` for this marketplace. Steps:

1. Ask for the plugin name (kebab-case), a one-line description, and a category if not provided in `$ARGUMENTS`.
2. Create `plugins/<name>/.claude-plugin/plugin.json` with: `name`, `version` ("0.1.0"), `description`, `author` (Fabian Koerner / mail@fabiankoerner.com), `license` ("MIT"), `homepage` and `repository` (https://github.com/ff-fab/ai-marketplace), `category`, and `keywords`.
3. Create `plugins/<name>/skills/` and/or `plugins/<name>/commands/` as needed.
4. Add the plugin entry to `.claude-plugin/marketplace.json` (mirror the fields from the manifest).
5. Add the plugin to `release-please-config.json` and `.release-please-manifest.json` (version "0.1.0").
6. Run `node scripts/generate.mjs` to produce the `.github/` mirrors, then remind the user to commit with a conventional-commit message (e.g. `feat(<name>): scaffold plugin`).

Follow the conventions documented in `CLAUDE.md`. Never put secrets in any committed file.

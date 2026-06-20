# CLAUDE.md — working in this marketplace

This is a personal, public, MIT-licensed **cross-tool plugin marketplace** that serves
**Claude Code**, **GitHub Copilot CLI**, and **VS Code Copilot** from one repository.

## How portability works

- The canonical, hand-edited sources are the Claude-native files:
  - `.claude-plugin/marketplace.json` — the registry (read by Claude Code and Copilot CLI).
  - `plugins/<name>/.claude-plugin/plugin.json` — per-plugin manifest; the **version source of truth**.
  - `plugins/<name>/skills/<skill>/SKILL.md`, `plugins/<name>/commands/*.md`, `plugins/<name>/agents/*.md`.
- The `.github/` mirrors are **generated** by `scripts/generate.mjs` — never edit them by hand:
  - `.github/plugin/marketplace.json`, `plugins/<name>/.github/plugin.json`
  - `plugins/<name>/.github/prompts/*.prompt.md` (VS Code prompt files from `commands/`)
  - `plugins/<name>/agents/*.agent.md` (Copilot agent naming from `agents/*.md`)
- Skills, hooks (`hooks.json`), and MCP (`.mcp.json`) are portable as-is across all tools.

After any change to a source file, run:

```bash
node scripts/generate.mjs      # regenerate mirrors + sync the registry
node scripts/validate.mjs      # structural + license-hygiene checks
```

CI (`.github/workflows/validate.yml`) runs the generator and commits any drift back to the
branch automatically, then validates — so registry/mirror sync is self-healing.

## Adding plugins / skills

Use the `meta` plugin commands (`/new-plugin`, `/add-skill`, `/validate`) or follow their
steps manually. New plugins must be added to `marketplace.json`,
`release-please-config.json`, and `.release-please-manifest.json`.

## Versioning & releases

Conventional Commits drive `release-please`:
- `feat(<plugin>): …` → minor bump for that plugin
- `fix(<plugin>): …` → patch bump
- `feat(<plugin>)!:` or `BREAKING CHANGE:` → major bump

release-please bumps `plugins/<plugin>/.claude-plugin/plugin.json`; the validate workflow
then re-syncs `marketplace.json` and the `.github/` mirrors.

## License rules (strict — this repo is public)

- Root `LICENSE` (MIT © 2026 Fabian Koerner) covers **only** original work here.
- **Never relicense or strip attribution from third-party content.** When vendoring
  (copying) third-party material:
  1. Co-locate a `LICENSE` in the item's directory with the **original** author's copyright.
  2. Add an attribution header to each file (source URL, author, license, retrieval date,
     and an explicit note of any modifications).
  3. Add an entry to `THIRD_PARTY_NOTICES.md` listing the exact vendored paths.
  4. Prefer verbatim copies; mark every change.
- See `plugins/productivity/skills/grilling` and `plugins/engineering/skills/domain-modeling`
  as worked examples (Matt Pocock's MIT skills).

## Secrets

The repo is public. MCP configs (`.mcp.json`) reference secrets only via `${ENV_VAR}`
placeholders; document required vars in `.env.example`. Never commit real values.

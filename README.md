# ff-fab-marketplace

A personal, cross-tool **AI plugin marketplace** by Fabian Koerner, usable from **Claude
Code**, **GitHub Copilot CLI**, and **VS Code Copilot** out of one repository. Skills,
agents, hooks, and MCP servers are authored once and work across all three tools; the
tool-specific bits (VS Code prompt files and `.github/` manifests) are generated.

## Plugins

| Plugin | What's in it |
|---|---|
| `productivity` | `grill-me` / `grilling` — relentless plan-stress-testing interviews |
| `engineering` | `grill-with-docs`, `domain-modeling` (with ADR/CONTEXT format guides) |
| `writing` | `tighten-prose` — concise, voice-preserving edits |
| `meta` | scaffolding commands (`new-plugin`, `add-skill`, `validate`) |

## Install

### One-shot bootstrap (recommended, per machine)

```bash
git clone https://github.com/ff-fab/ai-marketplace
./ai-marketplace/scripts/bootstrap.sh
# or a subset:  PLUGINS="productivity meta" ./ai-marketplace/scripts/bootstrap.sh
```

### Manual

**Claude Code**
```
/plugin marketplace add ff-fab/ai-marketplace
/plugin install productivity@ff-fab-marketplace
```

**GitHub Copilot CLI**
```
copilot plugin marketplace add ff-fab/ai-marketplace
copilot plugin install productivity@ff-fab-marketplace
```

**VS Code Copilot** — plugins installed via the Copilot CLI are auto-discovered (they
appear under *Agent Plugins – Installed*). Or run **Chat: Install Plugin From Source** from
the Command Palette and paste `https://github.com/ff-fab/ai-marketplace`.

### Make the marketplace known automatically (Claude Code)

Add to `~/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "ff-fab-marketplace": {
      "source": { "source": "github", "repo": "ff-fab/ai-marketplace" }
    }
  }
}
```

## Developing

```bash
node scripts/generate.mjs    # regenerate .github mirrors + sync the registry
node scripts/validate.mjs    # structural + license-hygiene checks
```

See [CLAUDE.md](./CLAUDE.md) for conventions, versioning, and the strict third-party
license rules.

## Licensing

This repo is **MIT** © 2026 Fabian Koerner (see [LICENSE](./LICENSE)), covering original
work only. Vendored third-party content keeps its own license and attribution — see
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). The `grilling` skill family is by
[Matt Pocock](https://github.com/mattpocock/skills) (MIT); the authoring-DX and
release-automation designs were inspired by
[ivan-magda/claude-code-plugin-template](https://github.com/ivan-magda/claude-code-plugin-template)
(MIT) and [Nagell/claude-marketplace-template](https://github.com/Nagell/claude-marketplace-template)
(Unlicense).

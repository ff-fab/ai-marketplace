# Third-Party Notices

This repository is MIT-licensed (see `LICENSE`), copyright © 2026 Fabian Koerner.
That license covers **only** the original work in this repository. Content that
originates elsewhere is listed below with its own author, license, and the exact
locations where it lives. Each vendored directory also carries a co-located
`LICENSE` file bearing the original author's copyright, and each vendored file
carries an attribution header.

If you add or remove third-party content, update this file in the same change.

---

## 1. Matt Pocock — `mattpocock/skills` (vendored, MIT)

- **Author:** Matt Pocock
- **Source:** https://github.com/mattpocock/skills
- **License:** MIT — Copyright (c) 2026 Matt Pocock
- **Retrieved:** 2026-06-20
- **What was taken:** the "grilling" skill family and its dependencies, copied
  verbatim. Each file has an attribution header; each directory has a `LICENSE`
  copy of Matt Pocock's MIT license.
- **Vendored locations:**
  - `plugins/productivity/skills/grilling` — the model-invoked grilling engine
    (`skills/productivity/grilling/SKILL.md` upstream)
  - `plugins/productivity/skills/grill-me` — user-invoked entry point
    (`skills/productivity/grill-me/SKILL.md` upstream)
  - `plugins/engineering/skills/grill-with-docs` — user-invoked entry point that
    combines grilling with domain modeling (`skills/engineering/grill-with-docs/SKILL.md` upstream)
  - `plugins/engineering/skills/domain-modeling` — model-invoked domain-modeling
    skill plus its `CONTEXT-FORMAT.md` and `ADR-FORMAT.md` companions
    (`skills/engineering/domain-modeling/` upstream)
- **Modifications:** Bodies are verbatim. Added: an HTML-comment attribution header
  in each file; in `domain-modeling/SKILL.md` a `name`/`description` YAML frontmatter
  block was added (upstream relies on directory-name discovery) — noted in that file.

---

## 2. Ivan Magda — `ivan-magda/claude-code-plugin-template` (MIT, design inspiration)

- **Author:** Ivan Magda
- **Source:** https://github.com/ivan-magda/claude-code-plugin-template
- **License:** MIT (the upstream `LICENSE` carries a `"Your Organization"` placeholder;
  the actual author/copyright holder is Ivan Magda)
- **Use here:** The `meta` plugin's scaffolding command concepts (`new-plugin`,
  `add-skill`, `validate`) and the marketplace's authoring-DX layout were inspired by
  this template. The command files in `plugins/meta/commands/` were authored fresh for
  this repository (not copied verbatim), so no upstream code is redistributed; this
  entry is recorded as attribution for the design inspiration.

---

## 3. Nagell — `Nagell/claude-marketplace-template` (The Unlicense, design inspiration)

- **Author:** Nagell (Daniel Nagel)
- **Source:** https://github.com/Nagell/claude-marketplace-template
- **License:** The Unlicense (public domain) — no attribution legally required
- **Use here:** The release-automation approach (release-please + conventional commits +
  auto-syncing the marketplace registry from per-plugin manifests) was modeled on this
  template. The config and `scripts/generate.mjs` were authored fresh for this repository.
  Credited here as a courtesy.

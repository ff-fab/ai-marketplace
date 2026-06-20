#!/usr/bin/env bash
#
# bootstrap.sh — add the ff-fab-marketplace and install its plugins on a new machine,
# for both Claude Code (`claude`) and GitHub Copilot CLI (`copilot`).
#
# Usage:
#   scripts/bootstrap.sh            # add marketplace + install all plugins in both CLIs
#   PLUGINS="productivity meta" scripts/bootstrap.sh   # install a subset
#
# VS Code Copilot: it auto-discovers plugins installed via the Copilot CLI
# (~/.copilot/installed-plugins/). You can also run "Chat: Install Plugin From Source"
# from the Command Palette and paste: https://github.com/ff-fab/ai-marketplace
#
set -euo pipefail

REPO="ff-fab/ai-marketplace"
MARKETPLACE="ff-fab-marketplace"
PLUGINS="${PLUGINS:-productivity engineering writing meta}"

add_and_install() {
  local cli="$1"
  if ! command -v "$cli" >/dev/null 2>&1; then
    echo "skip: '$cli' not found on PATH"
    return 0
  fi
  echo "==> $cli: adding marketplace $REPO"
  "$cli" plugin marketplace add "$REPO" || true
  for p in $PLUGINS; do
    echo "==> $cli: installing ${p}@${MARKETPLACE}"
    "$cli" plugin install "${p}@${MARKETPLACE}" || echo "  (install of ${p} failed; continuing)"
  done
}

add_and_install claude
add_and_install copilot

echo
echo "Done. For VS Code, the CLI-installed plugins should appear under"
echo "Agent Plugins - Installed, or use 'Chat: Install Plugin From Source' with:"
echo "  https://github.com/${REPO}"

#!/usr/bin/env bash
set -euo pipefail

PR_NUMBER="${1:-}"
if [[ -z "$PR_NUMBER" ]]; then
  echo "usage: scripts/verify-pr.sh <pr-number>" >&2
  exit 2
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PR_FILES="$(gh pr diff "$PR_NUMBER" --name-only)"
PR_JSON="$(gh pr view "$PR_NUMBER" --json files)"

if [[ -z "$PR_FILES" ]]; then
  echo "❌ PR #$PR_NUMBER has no changed files."
  exit 1
fi

DISALLOWED_ADDITIONS="$(python3 - <<'PY' "$PR_JSON"
import json, sys, re
payload = json.loads(sys.argv[1])
pat = re.compile(r'(^|/)(\.codexprompt\.txt|issue-[0-9]+-assignee\.txt)$')
for item in payload.get('files', []):
    path = item.get('path', '')
    change = item.get('changeType', '')
    if pat.search(path) and change != 'DELETED':
        print(f"{change}\t{path}")
PY
)"
if [[ -n "$DISALLOWED_ADDITIONS" ]]; then
  echo "❌ PR #$PR_NUMBER contains prompt/assignment artifact files that must not be merged unless they are being deleted."
  printf '%s
' "$DISALLOWED_ADDITIONS"
  exit 1
fi

if printf '%s
' "$PR_FILES" | grep -E '^(\.hermes/|\.hermes_|.*\.tmp$|.*\.log$)' >/dev/null; then
  echo "❌ PR #$PR_NUMBER contains local runtime/review artifact files that must never be merged."
  printf '%s
' "$PR_FILES" | grep -E '^(\.hermes/|\.hermes_|.*\.tmp$|.*\.log$)'
  exit 1
fi

CODE_FILE_REGEX='^(src/.*\.(ts|tsx|js|jsx|css|scss|html)|scripts/.*\.sh|docs/.*\.md|package\.json|package-lock\.json)$'
if ! printf '%s
' "$PR_FILES" | grep -E "$CODE_FILE_REGEX" >/dev/null; then
  echo "❌ PR #$PR_NUMBER has no app, automation, or documentation files changed; refusing auto-merge."
  printf '%s
' "$PR_FILES"
  exit 1
fi

if printf '%s
' "$PR_FILES" | grep -E '^\.github/workflows/' >/dev/null && ! printf '%s
' "$PR_FILES" | grep -E '^((scripts/.*\.sh)|(docs/.*\.md))$' >/dev/null; then
  echo "❌ PR #$PR_NUMBER only changes GitHub workflow files without matching implementation or automation changes."
  printf '%s
' "$PR_FILES"
  exit 1
fi

echo "== Changed files =="
printf '%s
' "$PR_FILES"

echo "== Build =="
BUILD_OUTPUT="$(npm run build 2>&1)"
printf '%s
' "$BUILD_OUTPUT"

echo "✅ PR #$PR_NUMBER passed guard checks."

# Guard: ensure .js files under src/blocks are actually referenced somewhere in the codebase
echo "== Unreferenced src/blocks files check =="
unused_blocks=""
while IFS= read -r f; do
  # basename without extension
  name="$(basename "$f" .js)"
  # look for references to the basename or the relative path elsewhere in repo,
  # excluding node_modules/dist and excluding the file itself
  if ! grep -R --exclude-dir=node_modules --exclude-dir=dist -n -- "\b${name}\b" . | grep -v "^${f}:" >/dev/null 2>&1 && \
     ! grep -R --exclude-dir=node_modules --exclude-dir=dist -n -- "${f}" . | grep -v "^${f}:" >/dev/null 2>&1; then
    unused_blocks+="${f}\n"
  fi
done < <(find src/blocks -type f -name '*.js' 2>/dev/null || true)

if [[ -n "$unused_blocks" ]]; then
  echo "❌ The following src/blocks/*.js files appear to be unreferenced (imports/uses not found):"
  printf '%s' "$unused_blocks"
  echo
  echo "Please remove unused placeholder files or add references."
  exit 1
fi
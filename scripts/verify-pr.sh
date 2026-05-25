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

if [[ -z "$PR_FILES" ]]; then
  echo "❌ PR #$PR_NUMBER has no changed files."
  exit 1
fi

DISALLOWED_REGEX='(^|/)(\.codexprompt\.txt|issue-[0-9]+-assignee\.txt)$'
if printf '%s
' "$PR_FILES" | grep -E "$DISALLOWED_REGEX" >/dev/null; then
  echo "❌ PR #$PR_NUMBER contains prompt/assignment artifact files that must not be merged."
  printf '%s
' "$PR_FILES" | grep -E "$DISALLOWED_REGEX" || true
  exit 1
fi

CODE_FILE_REGEX='\.(ts|tsx|js|jsx|css|scss|html|json)$'
if ! printf '%s
' "$PR_FILES" | grep -E "$CODE_FILE_REGEX" >/dev/null; then
  echo "❌ PR #$PR_NUMBER has no code/app files changed; refusing auto-merge."
  printf '%s
' "$PR_FILES"
  exit 1
fi

echo "== Changed files =="
printf '%s
' "$PR_FILES"

echo "== Build =="
npm run build

echo "✅ PR #$PR_NUMBER passed guard checks."

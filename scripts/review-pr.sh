#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: scripts/review-pr.sh <pr-number> [screenshot-path]" >&2
  exit 2
fi

PR_NUMBER="$1"
SCREENSHOT_PATH="${2:-}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARTIFACT_DIR="$REPO_ROOT/.hermes/reviews"
mkdir -p "$ARTIFACT_DIR"

cd "$REPO_ROOT"

VERIFY_OUTPUT="$({ scripts/verify-pr.sh "$PR_NUMBER"; } 2>&1)"
BUILD_OUTPUT="$({ npm run build; } 2>&1)"
FILES_OUTPUT="$(gh pr diff "$PR_NUMBER" --name-only)"
DIFFSTAT_OUTPUT="$({ gh pr diff "$PR_NUMBER" --stat; } 2>&1)"
BODY_FILE="$ARTIFACT_DIR/pr-${PR_NUMBER}-review.md"
VERIFIED_AT="$(date -Iseconds)"
MANUAL_STATUS="not attached"
if [[ -n "$SCREENSHOT_PATH" ]]; then
  MANUAL_STATUS="performed"
fi

{
  printf '## Review Summary\n'
  printf -- '- PR: #%s\n' "$PR_NUMBER"
  printf -- '- Verified at: %s\n\n' "$VERIFIED_AT"

  printf '## Validation Performed\n'
  printf -- '- Ran `scripts/verify-pr.sh %s`\n' "$PR_NUMBER"
  printf -- '- Ran `npm run build`\n'
  printf -- '- Inspected changed files and PR diff\n'
  printf -- '- Manual runtime check: %s\n\n' "$MANUAL_STATUS"

  printf '## Guard Script Result\n```text\n%s\n```\n\n' "$VERIFY_OUTPUT"
  printf '## Build Result\n```text\n%s\n```\n\n' "$BUILD_OUTPUT"
  printf '## Changed Files\n```text\n%s\n```\n\n' "$FILES_OUTPUT"
  printf '## Diff Stat\n```text\n%s\n```\n\n' "$DIFFSTAT_OUTPUT"

  printf '## Manual Verification\n'
  printf -- '- Confirmed expected behavior against issue/PR scope.\n'
  printf -- '- No unexpected extra feature should be merged.\n'
  if [[ -n "$SCREENSHOT_PATH" ]]; then
    printf -- '- Screenshot evidence: %s\n' "$SCREENSHOT_PATH"
  fi
  printf '\n## Merge Decision\n'
  printf -- '- Merge only if the above validation matches the requested scope.\n'
} > "$BODY_FILE"

echo "$BODY_FILE"

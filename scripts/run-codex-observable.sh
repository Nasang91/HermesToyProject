#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "usage: scripts/run-codex-observable.sh <issue-number> <branch-name> <prompt-file>" >&2
  exit 2
fi

ISSUE_NUMBER="$1"
BRANCH_NAME="$2"
PROMPT_FILE="$3"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$REPO_ROOT/.hermes/codex-runs"
mkdir -p "$LOG_DIR"

RUN_ID="issue-${ISSUE_NUMBER}-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$LOG_DIR/${RUN_ID}.log"
STATE_FILE="$LOG_DIR/${RUN_ID}.state"
PROMPT_COPY="$LOG_DIR/${RUN_ID}.prompt.txt"

cp "$PROMPT_FILE" "$PROMPT_COPY"

cd "$REPO_ROOT"

git fetch origin main
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]]; then
  if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    git checkout "$BRANCH_NAME"
  else
    git checkout -b "$BRANCH_NAME" origin/main
  fi
fi

echo "RUN_ID=$RUN_ID" | tee "$STATE_FILE"
echo "BRANCH_NAME=$BRANCH_NAME" | tee -a "$STATE_FILE"
echo "PROMPT_COPY=$PROMPT_COPY" | tee -a "$STATE_FILE"
echo "LOG_FILE=$LOG_FILE" | tee -a "$STATE_FILE"
echo "STARTED_AT=$(date -Iseconds)" | tee -a "$STATE_FILE"

echo "== Codex observable run ==" | tee "$LOG_FILE"
echo "run_id=$RUN_ID" | tee -a "$LOG_FILE"
echo "issue=$ISSUE_NUMBER" | tee -a "$LOG_FILE"
echo "branch=$BRANCH_NAME" | tee -a "$LOG_FILE"
echo "pwd=$(pwd)" | tee -a "$LOG_FILE"
echo "prompt=$PROMPT_COPY" | tee -a "$LOG_FILE"
echo | tee -a "$LOG_FILE"

echo "[preflight] git status" | tee -a "$LOG_FILE"
git status --short | tee -a "$LOG_FILE" || true

echo "[launch] codex exec --full-auto" | tee -a "$LOG_FILE"
{
  codex exec --full-auto "$(cat "$PROMPT_COPY")"
} 2>&1 | tee -a "$LOG_FILE"

echo "[postflight] git status" | tee -a "$LOG_FILE"
git status --short | tee -a "$LOG_FILE" || true

echo "[postflight] git log" | tee -a "$LOG_FILE"
git log --oneline -3 | tee -a "$LOG_FILE" || true

echo "FINISHED_AT=$(date -Iseconds)" | tee -a "$STATE_FILE"
echo "DONE" | tee -a "$LOG_FILE"

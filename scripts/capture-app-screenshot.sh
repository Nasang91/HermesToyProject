#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: scripts/capture-app-screenshot.sh <url> <output-path>" >&2
  exit 2
fi

URL="$1"
OUTPUT_PATH="$2"

mkdir -p "$(dirname "$OUTPUT_PATH")"

osascript <<APPLESCRIPT
set outputPath to POSIX file "$OUTPUT_PATH"
set targetUrl to "$URL"

tell application "Safari"
  activate
  if (count of windows) = 0 then
    make new document
  end if
  set URL of front document to targetUrl
end tell

delay 2

tell application "System Events"
  tell process "Safari"
    keystroke "4" using {command down, shift down}
  end tell
end tell

delay 1

tell application "System Events"
  keystroke "g" using {command down, shift down}
  delay 0.5
  keystroke POSIX path of outputPath
  delay 0.5
  keystroke return
  delay 0.5
  keystroke return
end tell
APPLESCRIPT

echo "$OUTPUT_PATH"

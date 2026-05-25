# Observable Codex + PR Review Workflow

이 저장소에서 Codex를 실행할 때는 숨기지 않고 관찰 가능한 방식으로 운영합니다.

## 1) Codex 실행 준비

이슈별 프롬프트를 파일로 저장합니다.

예시:

```bash
cat > /tmp/issue-13-prompt.txt <<'EOF'
Implement issue #13 in this repository.
Requirements:
- Keep scope narrow
- Commit changes
- Push branch
- Create a PR that closes #13
EOF
```

## 2) Observable Codex 실행

```bash
scripts/run-codex-observable.sh 13 fix/issue-13 /tmp/issue-13-prompt.txt
```

이 스크립트는:
- branch를 준비하고
- `.hermes/codex-runs/` 아래에 prompt/log/state 파일을 남기고
- Codex 실행 전후 `git status`, `git log`를 기록합니다.

Hermes에서는 이 스크립트를 **background PTY**로 실행한 뒤 process handle을 보존하고,
주기적으로 `process poll/log`, `git status --short`, `git diff --stat` 를 확인하는 식으로 운용합니다.

## 3) 스크린샷 캡처

앱을 띄운 뒤 macOS에서 스크린샷을 저장합니다.

```bash
scripts/capture-app-screenshot.sh http://localhost:5173 .hermes/screenshots/pr-13.png
```

주의:
- Safari와 시스템 권한(화면 기록/자동화)이 필요할 수 있습니다.
- 권한이 없다면 Hermes가 별도 요청해야 합니다.

## 4) PR 리뷰 코멘트 초안 생성

```bash
scripts/review-pr.sh 13 .hermes/screenshots/pr-13.png
```

생성 결과:
- `.hermes/reviews/pr-13-review.md`

이 파일에는 다음이 포함됩니다.
- verify-pr 결과
- build 결과
- changed files
- diff stat
- 수동 검증/스크린샷 근거

## 5) GitHub PR 코멘트 게시

```bash
gh pr comment 13 --body-file .hermes/reviews/pr-13-review.md
```

## 6) 자동 머지 전 필수 기준

다음 조건을 모두 만족할 때만 머지합니다.
- `scripts/verify-pr.sh <PR번호>` 성공
- `npm run build` 성공
- 요구사항 범위 충족
- 임시 파일 미포함
- 리뷰 코멘트에 검증 내용 기록 완료

## 권장 Hermes 운영 패턴

1. Codex를 `background=true, pty=true` 로 실행
2. process handle 유지
3. 짧은 주기 진행 공유
4. 실행 중간에 아래를 반복 확인
   - `process(action='poll')`
   - `process(action='log')`
   - `git status --short`
   - `git diff --stat`
5. 완료 후 `scripts/review-pr.sh`
6. 코멘트 게시 후 조건 만족 시 merge

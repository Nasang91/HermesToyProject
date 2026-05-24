# Hermes가 Codex를 호출하는 실전 워크플로

## 개요

이 문서는 **Hermes Agent**와 **Codex**를 함께 활용하는 실전 운영 패턴을 정리한 가이드다.

핵심 원칙은 단순하다.

- **Hermes**는 분석, 오케스트레이션, 검증, 리포트를 맡는다.
- **Codex**는 실제 구현, 수정, 테스트 보강을 맡는다.

즉, **Hermes는 “무엇을 해야 하는가”를 정의하고**, **Codex는 “어떻게 코드로 바꿀 것인가”를 수행**한다.

---

## 왜 이 조합이 잘 맞는가

Hermes와 Codex를 분리해서 운영하면 다음 이점이 있다.

### Hermes가 잘하는 일
- repo 구조 파악
- 로그, 실패 테스트, stack trace 분석
- 이슈 재현과 원인 가설 수립
- 수정 범위와 제약 정의
- Codex에 넘길 작업 프롬프트 작성
- 결과 검증
- 최종 리포트 작성

### Codex가 잘하는 일
- 여러 파일에 걸친 코드 수정
- 테스트 추가/수정
- 반복적인 리팩터링
- 비교적 명확한 구현 작업 수행
- patch/commit 초안 생성

### 얻는 효과
- 막연한 구현 요청 감소
- 과수정(over-change) 리스크 감소
- 분석과 구현의 책임 분리
- 검증 루프 자동화
- 결과 리포트까지 일관된 흐름 구축
- worktree 기반 병렬 작업 가능

---

## 권장 역할 분담

### Hermes 책임
- harness 설계
- 실패 로그 분석
- 이슈 triage
- 수정 전략 결정
- 작업 단위 분해
- 테스트 및 리스크 검증
- 최종 요약 리포트 작성

### Codex 책임
- 구현 코드 작성
- 테스트 수정 및 추가
- 기계적 리팩터링
- 여러 파일 patch 생성
- 명시된 범위 내 작업 수행
- 작업 결과 요약 반환

### 운영 원칙

> Hermes가 먼저 분석하고 Codex는 구현한다. 마감은 다시 Hermes가 한다.

---

## End-to-End 워크플로

실전에서는 아래 흐름이 가장 안정적이다.

### 1. Discover
Hermes가 repo, 로그, 실패 테스트, 관련 파일을 스캔한다.

### 2. Diagnose
Hermes가 원인 가설과 수정 전략을 정리하고 범위를 제한한다.

### 3. Dispatch
Hermes가 Codex CLI에 구체적인 프롬프트로 구현을 지시한다.

### 4. Validate
Hermes가 diff 리뷰, 테스트 재실행, 회귀 여부를 확인한다.

### 5. Report
Hermes가 변경 파일, 원인, 결과, 리스크를 요약해 보고한다.

### 중요한 원칙

> Codex 결과를 그대로 종료하지 말고, Hermes가 반드시 테스트와 리스크 확인까지 완료해야 운영 품질이 올라간다.

---

## Hermes가 Codex를 호출하는 기본 패턴

Hermes는 Codex에게 다음 4가지를 반드시 함께 넘기는 것이 좋다.

1. **문제 정의**
2. **수정 범위**
3. **제약 조건**
4. **완료 조건**

### Hermes가 먼저 준비할 것
- 문제 설명 1~3줄
- 수정 대상 경로
- 건드리면 안 되는 것
- 테스트 기준
- 기대 출력 형식

### Codex CLI 예시

```bash
codex exec --full-auto "Fix the session refresh bug.

Context:
- Suspected area: src/auth/session_manager.py
- Preserve backward compatibility
- Update tests under tests/auth

Done criteria:
- Existing auth tests pass
- New regression test added
- Return changed files summary"
```

### 핵심 포인트

> 프롬프트가 구체적일수록 Codex의 수정 폭이 안정된다.

---

## 운영 시나리오 ① 이슈 해결

가장 범용적인 패턴이다.

### 흐름
1. **Hermes**가 실패 테스트, 로그, stack trace를 수집한다.
2. **Hermes**가 root cause 가설과 수정 범위를 정리한다.
3. **Codex**가 관련 파일을 수정하고 테스트를 추가/수정한다.
4. **Hermes**가 diff를 리뷰하고 테스트를 재실행한다.
5. **Hermes**가 최종 결과와 영향 범위를 리포트한다.

### 추천 적용 상황
- 특정 버그 수정
- 테스트 실패 해결
- 회귀 이슈 대응
- 로그 기반 원인 분석 후 패치

---

## 운영 시나리오 ② Harness 구축

Harness 구축은 **Hermes가 설계하고 Codex가 구현하는 구조**가 효율적이다.

### Hermes 설계 영역
- 목표/입출력 정의
- 폴더 구조 설계
- 실행 순서 설계
- 수집 포맷 규정
- README 초안 작성

### Codex 구현 영역
- 스크립트 작성
- 설정 파일 생성
- 샘플 테스트 작성
- 반복 수정

### Hermes 검증 영역
- 실행 결과 확인
- 문서 정리
- 리포트 템플릿 작성
- 남은 리스크 기록

### 추천 적용 상황
- benchmark harness
- test harness
- regression 검증 파이프라인
- 운영 리포트용 수집기

---

## 운영 시나리오 ③ Worktree 병렬 처리

큰 작업은 브랜치/워크트리를 분리해서 여러 Codex 작업을 병렬로 돌리고, Hermes가 상위에서 조정하는 방식이 좋다.

### 예시 구조
- **Hermes Coordinator**
  - issue triage
  - 작업 분해
  - 검증/통합
  - 최종 리포트

- **Codex A**
  - `feature/login-rework`

- **Codex B**
  - `fix/session-timeout`

- **Codex C**
  - `refactor/test-harness`

### 장점
- 충돌 감소
- 병렬 처리량 증가
- 구현과 검증 분리
- 대형 변경을 안전하게 분할 가능

---

## 실전 명령 예시

아래는 CLI 기준의 최소 운영 패턴 예시다.

### 1) Hermes가 이슈 분석

```bash
hermes chat -q "Analyze failing auth tests, identify root cause, and produce a Codex-ready fix prompt"
```

### 2) Codex가 구현

```bash
codex exec --full-auto "Fix the auth refresh bug with backward compatibility and update tests"
```

### 3) Hermes가 검증/리포트

```bash
hermes chat -q "Review the git diff, rerun tests, summarize risks and changed files"
```

### 운영 팁
- 긴 작업은 Codex를 background/PTy로 돌리는 것이 좋다.
- Hermes는 별도 세션에서 결과 검증과 보고를 맡게 하면 좋다.
- 작업량이 크면 worktree를 사용해 브랜치를 분리한다.

---

## Codex에 넘길 프롬프트 템플릿

막연한 요청 대신 제약을 명확히 쓰는 것이 중요하다.

```text
Task: Fix the session refresh bug.

Context:
- Users are logged out after token refresh.
- Suspected files: src/auth/session_manager.py, tests/auth/*

Constraints:
- Preserve backward compatibility
- Do not change public API signatures
- Add/update regression tests
- Limit edits to auth-related files

Done criteria:
- Existing auth tests pass
- New regression test added
- Return changed files and rationale
```

### 좋은 프롬프트의 특징
- 문제와 범위가 짧고 명확함
- 수정 금지 영역이 있음
- 테스트 기준이 포함됨
- 결과 보고 형식이 지정됨

### 한 줄 요약

> Hermes의 역할은 “잘 시키는 것”이고, Codex의 역할은 “그 범위 안에서 잘 고치는 것”이다.

---

## 주의점과 운영 가드레일

좋은 조합이지만, 검증 없이 연결하면 오히려 위험해질 수 있다.

### 주의할 점
- Codex에 범위를 너무 넓게 주지 말 것
- 결과를 그대로 신뢰하지 말 것
- 같은 repo에서 병렬 수정 시 worktree를 분리할 것
- 분석/구현/검증 경계를 섞지 말 것

### 권장 가드레일
- Hermes가 항상 완료 조건을 정의할 것
- Codex는 git repo/worktree 단위로 실행할 것
- Hermes가 테스트를 재실행할 것
- Hermes가 결과 리포트로 마감할 것

---

## 추천 운영 원칙

### 최종 원칙

> Hermes는 분석·조정·검증을 맡고, Codex는 구현에 집중시켜라.

이 구조는 특히 아래 영역에서 강하다.

- harness 구성
- 이슈 분석
- 리포트 자동화
- worktree 기반 병렬 처리

---

## 부록: 짧은 운영 요약

### 가장 추천하는 실무 패턴
1. Hermes가 문제를 분석한다.
2. Hermes가 Codex용 프롬프트를 만든다.
3. Codex가 코드와 테스트를 수정한다.
4. Hermes가 diff와 테스트를 검증한다.
5. Hermes가 결과를 리포트한다.

### 한 줄 정의
- **Hermes = PM + Tech Lead + Investigator**
- **Codex = Implementation Engineer**

---

## 관련 파일

- PPT: `Hermes_Codex_Practical_Workflow.pptx`
- 생성 스크립트: `hermes_codex_workflow_ppt.js`

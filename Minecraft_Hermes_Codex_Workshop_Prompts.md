# Minecraft-inspired Mini Block Builder 실전 프롬프트 모음집

부제: **강의 중 Hermes에게 그대로 붙여넣어 사용할 수 있는 운영 프롬프트 세트**

---

# 0. 이 문서의 목적

이 문서는 강의자와 수강생이 **Hermes에게 그대로 붙여넣어 사용할 수 있는 실전 프롬프트 모음집**이다.

핵심 목표는 다음과 같다.

1. 사용자가 직접 `codex exec ...`를 치지 않아도 되게 한다.
2. Hermes가 오케스트레이터로 움직이게 한다.
3. Codex는 구현 에이전트로 사용되게 한다.
4. 따라가다 보면 `Minecraft-inspired Mini Block Builder`가 완성되도록 한다.

즉, 이 문서는 **강의용 운영 스크립트**에 가깝다.

---

# 1. 기본 운영 원칙

## 역할 재확인

### 사용자
- 목표 제시
- 범위 확인
- 브라우저 수동 검증

### Hermes
- 요구사항 정리
- 범위 제한
- 작업 분해
- Codex 실행 지시
- 결과 리뷰
- 다음 단계 제안

### Codex
- 실제 코드 작성
- 파일 수정
- 기능 구현
- 리팩터링 및 수정

---

# 2. 강의 시작 전 공통 프롬프트

## 2-1. Hermes에게 역할 고정하기

강의 시작 시 가장 먼저 아래 프롬프트를 Hermes에 넣는다.

```text
You are the orchestrator for this workshop project.
We are building a Minecraft-inspired Mini Block Builder.
Your role is:
- define scope
- keep the implementation small and workshop-friendly
- break work into Day 1 / Day 2 / Day 3
- use Codex as the coding agent when implementation is needed
- review Codex output after each implementation step
- tell me what to verify manually in the browser

Important constraints:
- Keep the project simple
- Do not add advanced features unless explicitly requested
- Prefer maintainable React + TypeScript code
- Explain what you are doing in short, workshop-friendly language
```

## 기대 효과
- Hermes가 자기 역할을 오케스트레이터로 인식한다.
- Codex를 구현 담당으로 쓰는 흐름이 고정된다.
- 강의 중 범위가 과하게 커지는 것을 줄일 수 있다.

---

## 2-2. 현재 repo 상태 점검 프롬프트

프로젝트 폴더에 들어온 뒤, 아래 프롬프트로 시작한다.

```text
Please inspect the current repository and prepare this workshop project.
Do the following:
1. Check whether this is a valid git repository
2. Check whether this looks like a Vite React TypeScript project
3. Summarize the current project structure briefly
4. Tell me whether Codex can be used safely here
5. If anything is missing, tell me the smallest next step
```

## 이 프롬프트를 쓰는 타이밍
- 강의 시작 직후
- 수강생 환경이 제각각일 때
- 실습 도중 repo 상태가 꼬였는지 확인할 때

---

# 3. 설치/연동 확인용 프롬프트

## 3-1. Hermes 설치 확인 프롬프트

```text
Please verify whether Hermes is installed and usable in this environment.
Check the installation status and tell me:
1. whether Hermes is available
2. whether configuration is needed
3. what the next setup step is if something is missing
Keep the answer short and practical.
```

---

## 3-2. Codex 설치 및 smoke test 프롬프트

```text
We need to verify that Codex is usable for this workshop.
Please do the following:
1. Check whether Codex CLI is installed
2. Check whether authentication appears to be available
3. If possible, run a tiny Codex smoke test in a safe git repository
4. Review the result
5. Tell me whether Codex is ready for workshop use
```

## 강의 포인트
이 프롬프트는 “Codex를 사람이 직접 치는 것”이 아니라 **Hermes가 확인과 테스트를 대신하는 모습**을 보여주기 좋다.

---

# 4. 프로젝트 초기화 프롬프트

## 4-1. 프로젝트 생성 점검 프롬프트

Vite 프로젝트를 만든 뒤 아래 프롬프트를 넣는다.

```text
Please inspect this newly created project and prepare it for the workshop.
Do the following:
1. Confirm the project is a React + TypeScript Vite app
2. Suggest the smallest clean file structure for a Mini Block Builder
3. Identify which files should be created or modified first
4. Do not implement anything yet
5. Give me a short Day 1 plan
```

---

## 4-2. Day 1 scope 정의 프롬프트

```text
We are starting Day 1 of the Minecraft-inspired Mini Block Builder workshop.
Please define a very small Day 1 scope.
Requirements:
- 2D grid world
- visible cells
- clicking a cell places the selected block
Constraints:
- keep it simple
- do not add save/load yet
- do not add erase mode yet
- do not add advanced styling yet

Please provide:
1. Day 1 scope summary
2. suggested file structure
3. what Codex should implement
4. what I should verify manually afterwards
```

---

# 5. Day 1 구현 프롬프트 세트

## 5-1. Day 1 구현 오케스트레이션 프롬프트

이 프롬프트가 Day 1 핵심이다.

```text
Please act as the orchestrator for Day 1 in this repository.
Use Codex as the coding agent.

Your responsibilities:
1. Restate the Day 1 scope clearly
2. Prepare a precise Codex implementation prompt
3. Run Codex in this repository
4. Review the changed files after Codex finishes
5. Summarize what was implemented
6. Tell me exactly what to test manually in the browser

Day 1 scope:
- Create a 2D grid world
- Render cells visually
- Clicking a cell places the currently selected block
- Keep the implementation simple and maintainable
- Do not add saving, erasing, multiple tools, or advanced extra features yet
```

## 강의 멘트 예시
- “이제 코드를 직접 치는 게 아니라 Hermes에게 구현 오케스트레이션을 맡깁니다.”
- “Hermes는 Codex를 coding agent로 사용하고, 끝나면 리뷰까지 합니다.”

---

## 5-2. Day 1 완료 후 리뷰 프롬프트

```text
Please review the Day 1 implementation that was just produced.
Focus on:
1. whether the implementation matches scope
2. whether the code is simple enough for a workshop
3. whether the file structure is reasonable
4. what should be improved later, but not yet
5. what should become the Day 2 scope
```

---

## 5-3. Day 1 브라우저 검증 체크 요청 프롬프트

```text
Please give me a manual browser verification checklist for Day 1.
Keep it short and concrete.
I want checkbox-style steps for workshop participants.
```

---

# 6. Day 2 구현 프롬프트 세트

## 6-1. Day 2 범위 정의 프롬프트

```text
We finished Day 1.
Now define a workshop-friendly Day 2 scope.
Required goals:
- add at least 3 block types
- add erase functionality
- add a toolbar UI
- add save/load/reset using localStorage

Please provide:
1. a small and safe Day 2 scope
2. risks to avoid
3. which parts Codex should implement now
4. what should be postponed
```

---

## 6-2. Day 2 구현 오케스트레이션 프롬프트

```text
Please act as the orchestrator for Day 2 in this repository.
Use Codex as the coding agent.

Your job:
1. Restate the Day 2 scope clearly
2. Prepare the Codex implementation prompt
3. Run Codex for the implementation
4. Review the resulting changes
5. Tell me exactly what to test manually

Day 2 scope:
- Add at least 3 block types
- Add erase functionality
- Add a toolbar for block and action selection
- Add save/load/reset using localStorage
- Keep the UI simple and workshop-friendly
- Do not add advanced features beyond this scope
```

---

## 6-3. Day 2 구조 리뷰 프롬프트

```text
Please review the current Day 2 implementation.
Focus on:
1. code organization
2. whether state management is still simple enough
3. whether localStorage handling is understandable for workshop learners
4. what should be polished on Day 3 only
```

---

## 6-4. Day 2 브라우저 검증 체크 요청 프롬프트

```text
Please give me a manual browser verification checklist for Day 2.
Include:
- block type switching
- erase behavior
- toolbar usage
- save/load/reset checks
Keep it short and classroom-friendly.
```

---

# 7. Day 3 구현 프롬프트 세트

## 7-1. Day 3 polish 범위 정의 프롬프트

```text
We are now on Day 3.
Please define the smallest useful final polish scope for this workshop project.
Focus on:
- readability
- button clarity
- selected block visibility
- spacing/layout cleanup
- small bug fixes
- demo readiness

Please keep it small and do not expand scope.
```

---

## 7-2. Day 3 구현 오케스트레이션 프롬프트

```text
Please act as the orchestrator for the final Day 3 polish pass.
Use Codex as the coding agent.

Your job:
1. Confirm the final small scope
2. Prepare the Codex implementation prompt
3. Run Codex in this repository
4. Review the changes
5. Tell me whether the project is ready for demo
6. Tell me what I should verify manually one last time

Focus on:
- button clarity
- selected block visibility
- layout spacing
- small bug fixes
- workshop-friendly simplicity
```

---

## 7-3. 최종 리뷰 프롬프트

```text
Please perform a final review of the Minecraft-inspired Mini Block Builder.
Provide:
1. a short implementation summary
2. a feature checklist
3. remaining limitations
4. 3 possible future improvements
5. a short workshop-ready closing summary
```

---

## 7-4. 최종 브라우저 검증 체크 요청 프롬프트

```text
Please give me the final manual verification checklist for this project.
The checklist should confirm:
- app runs
- grid renders
- blocks can be placed
- blocks can be erased
- block types switch correctly
- save/load/reset works
- UI is clear enough for demo
```

---

# 8. README/정리 문서용 프롬프트

## 8-1. README 초안 생성 프롬프트

```text
Please draft a README for this project.
The README should include:
1. project name
2. short description
3. features
4. tech stack
5. how to run locally
6. how to use the controls
7. how Hermes and Codex were used in the workshop
8. possible future improvements
Keep it concise but complete.
```

---

## 8-2. 강의 요약 문안 생성 프롬프트

```text
Please write a short workshop summary for this project.
The summary should explain:
- what we built
- how Hermes was used
- how Codex was used
- why this collaboration model is useful
Keep it suitable for speaking at the end of a lecture.
```

---

# 9. 문제 발생 시 복구 프롬프트

## 9-1. scope가 커졌을 때 줄이는 프롬프트

```text
The implementation scope seems to be getting too large.
Please reduce the scope back to the smallest workshop-friendly version.
Tell me:
1. what to keep
2. what to postpone
3. what the next smallest safe implementation step is
```

---

## 9-2. 구조가 복잡해졌을 때 정리 요청 프롬프트

```text
The project structure may be getting too complex for a workshop.
Please review the current structure and tell me:
1. what is unnecessarily complex
2. what should be simplified
3. what should remain unchanged to avoid churn
Do not rewrite the whole architecture unless truly necessary.
```

---

## 9-3. Codex 결과 검수 강화 프롬프트

```text
Please do a stricter review of the latest Codex result.
Focus on:
- scope compliance
- unnecessary complexity
- workshop readability
- possible bugs
- what I should verify manually before continuing
```

---

# 10. 강의자용 운영 팁

## 팁 1
Day 1~3 내내 **Hermes에게 목표와 범위를 말하고, Codex 실행은 Hermes에게 맡긴다**는 구조를 유지한다.

## 팁 2
강의 중에는 `codex exec ...`를 직접 보여주더라도, 그건 **내부 메커니즘 설명용**이라고 말해주는 게 좋다.

## 팁 3
항상 구현 뒤에는 Hermes에게 다음 두 가지를 시킨다.
- 결과 리뷰
- 브라우저 수동 검증 체크리스트 생성

## 팁 4
강의 성공 기준은 “완벽한 앱”이 아니라 **수강생이 에이전트 협업 흐름을 이해하고 결과물을 완성하는 것**이다.

---

# 11. 한 줄 정리

> 이 문서의 프롬프트를 순서대로 사용하면, 사용자는 Hermes에게 오케스트레이션을 맡기고 Codex는 구현 에이전트로 활용하면서, Minecraft-inspired Mini Block Builder를 강의형 실습 프로젝트로 완성할 수 있다.

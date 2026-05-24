# Minecraft-inspired Mini Block Builder 실습 가이드

부제: **Hermes + Codex를 실제로 설치하고 연동해서, 따라 하다 보면 자연스럽게 완성되는 강의형 실습 문서**

---

# 0. 이 문서의 목표

이 문서는 수강생이 아래를 **직접 따라 하면서** 수행할 수 있도록 작성되었다.

1. Hermes 설치
2. Codex 설치
3. Hermes와 Codex를 같은 프로젝트에서 함께 사용
4. `Minecraft-inspired Mini Block Builder` 구현
5. 최종적으로 실행 가능한 웹 앱 완성

이 문서를 끝까지 따라오면, 참가자는 아래 결과를 얻게 된다.

- Hermes가 요구사항을 정리하고 작업을 쪼개는 경험
- Codex가 실제로 코드를 작성하는 경험
- 두 에이전트를 같이 써서 작은 게임형 웹 프로젝트를 완성하는 경험

---

# 1. 이번 실습에서 만드는 것

## 프로젝트 이름
**Minecraft-inspired Mini Block Builder**

## 최종 결과물
브라우저에서 실행되는 작은 블록 빌더 앱.

### 구현 기능
- 2D grid world 렌더링
- 블록 놓기
- 블록 제거
- 블록 타입 3종 선택
- 툴바 UI
- 저장 / 불러오기 / 초기화

### 구현하지 않는 것
- 진짜 마인크래프트급 3D
- inventory/crafting
- multiplayer
- physics
- lighting

---

# 2. Hermes와 Codex를 어떻게 같이 쓰는가

## 가장 중요한 운영 원칙

이 강의에서는 **사용자가 직접 Codex CLI를 매번 조작하는 방식보다, Hermes에게 Codex 실행까지 맡기는 방식**을 기본 운영 모델로 삼는다.

즉,
- 사용자는 Hermes에게 목표와 범위를 말하고,
- Hermes는 작업을 분해하고,
- Hermes가 필요할 때 Codex를 coding agent로 호출하고,
- Hermes가 다시 결과를 검토하고 보고한다.

직접 `codex exec ...`를 치는 방식은 **내부적으로 어떤 일이 일어나는지 설명하기 위한 참고 형태**로만 사용한다.

## 역할 분담

### Hermes
- 요구사항 정리
- MVP 범위 정의
- 작업 분해
- Codex에게 줄 prompt 작성
- 구현 결과 리뷰
- 최종 리포트

### Codex
- 실제 코드 작성
- 컴포넌트 생성
- UI 구현
- 상태 로직 구현
- 버그 수정

## 핵심 원칙

> Hermes는 먼저 생각하고, Codex는 구현하고, Hermes가 다시 검증한다.

즉,
- **Hermes = 기획/분석/검증 담당**
- **Codex = 구현 담당**

---

# 3. 사전 준비물

아래가 설치되어 있어야 한다.

- macOS / Linux / Windows
- Node.js 18+
- npm
- Git
- 인터넷 연결
- OpenAI/Codex 사용 가능한 인증 수단

## 설치 확인 명령어

```bash
node -v
npm -v
git --version
```

정상이라면 버전이 출력되어야 한다.

---

# 4. Hermes 설치

## 4-1. 설치

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

설치 후 셸을 다시 열거나, 필요 시 PATH를 반영한다.

## 4-2. 설치 확인

```bash
hermes --version
hermes doctor
```

## 4-3. 초기 설정

```bash
hermes setup
```

또는

```bash
hermes model
```

### 권장 설정
- 기본 모델/provider 설정
- terminal / file tool 사용 가능 상태 확인

## 4-4. Hermes 실행 확인

```bash
hermes chat -q "Say hello and confirm you can help with software projects"
```

정상 응답이 오면 완료.

---

# 5. Codex 설치

## 5-1. 설치

```bash
npm install -g @openai/codex
```

## 5-2. 설치 확인

```bash
codex --help
```

또는

```bash
codex --version
```

## 5-3. 인증

Codex CLI 환경에 맞게 OpenAI API 키 또는 Codex 로그인 흐름을 설정한다.

실습에서는 다음 둘 중 하나면 충분하다.

### 방법 A. API 키 사용
```bash
export OPENAI_API_KEY="YOUR_KEY"
```

### 방법 B. Codex CLI 로그인 플로우 사용
Codex CLI 문서에 맞게 로그인 절차를 완료한다.

## 5-4. 동작 확인

Codex는 git repo 안에서 실행하는 것이 안전하다.

가장 단순한 확인은 직접 실행이다.

```bash
mkdir codex-smoke-test
cd codex-smoke-test
git init
codex exec "Create a tiny hello world html file"
```

하지만 강의에서는 아래처럼 **Hermes에게 Codex smoke test까지 맡기는 방식**을 권장한다.

```text
We are testing whether Codex is working correctly.
Please do the following in the current git repository:
1. Prepare a tiny Codex task
2. Run Codex for that task
3. Verify what files changed
4. Tell me whether Codex is working properly
```

정상적으로 파일 생성 또는 작업 결과가 나오면 완료.

---

# 6. 실습 프로젝트 만들기

## 6-1. 작업 폴더 생성

```bash
mkdir minecraft-mini-block-builder
cd minecraft-mini-block-builder
```

## 6-2. React + Vite + TypeScript 프로젝트 생성

```bash
npm create vite@latest . -- --template react-ts
npm install
```

## 6-3. Git 초기화

```bash
git init
git add .
git commit -m "chore: initialize vite react ts project"
```

## 6-4. 실행 확인

```bash
npm run dev
```

브라우저에서 기본 Vite 페이지가 뜨면 성공.

---

# 7. 프로젝트 구조 목표

실습에서는 아래 구조를 목표로 한다.

```text
src/
  App.tsx
  main.tsx
  index.css
  components/
    WorldGrid.tsx
    Toolbar.tsx
  hooks/
    useWorld.ts
  lib/
    storage.ts
  types/
    world.ts
```

---

# 8. Day 1 실습 — Grid와 블록 놓기

## Day 1 목표
- Hermes에게 MVP 요구사항을 정리시킨다.
- Codex에게 첫 구현을 맡긴다.
- grid world와 block placing까지 만든다.

---

## 8-1. Hermes에게 MVP 정의 요청

Hermes를 실행한다.

```bash
hermes
```

그리고 아래처럼 요청한다.

```text
We are building a Minecraft-inspired Mini Block Builder as a web app.
Keep the MVP small enough for a workshop.
Please do these things:
1. Define the MVP clearly.
2. Propose a simple React + TypeScript file structure.
3. Write a Codex prompt for implementing Day 1 only.

Day 1 scope:
- Render a 2D grid world
- Click a cell to place the selected block
- Keep the implementation simple and maintainable
```

## 8-2. Hermes의 결과를 확인한다

Hermes는 보통 아래를 정리해줄 것이다.
- MVP 범위
- 권장 파일 구조
- Codex에게 전달할 prompt

핵심은 Hermes가 작업을 잘게 쪼개고, Codex가 과하게 구현하지 않게 범위를 제한하는 것이다.

---

## 8-3. Hermes에게 Codex 실행까지 맡기기

이 실습의 더 권장되는 방식은 **사용자가 직접 `codex exec`를 치는 것이 아니라, Hermes에게 Codex 실행을 포함한 오케스트레이션을 맡기는 것**이다.

즉, 사용자는 Hermes에게 이렇게 요청한다.

```text
Please act as the orchestrator for this repository.
Use Codex as the coding agent for Day 1 implementation.
Your job:
1. Confirm the Day 1 scope
2. Prepare a precise Codex prompt
3. Run Codex in this repository for the Day 1 task
4. Review the changed files
5. Report what was implemented and what I should verify manually

Day 1 requirements:
- Create a 2D grid world
- Render cells visually
- Clicking a cell places the currently selected block
- Keep the code simple and maintainable
- Do not add saving, erasing, or advanced extra features yet
```

Hermes 운영 관점에서 보면, 내부적으로는 아래와 같은 흐름으로 움직이게 된다.

```bash
codex exec --full-auto "Implement Day 1 of a Minecraft-inspired Mini Block Builder in this React + TypeScript project.
Requirements:
- Create a 2D grid world
- Render cells visually
- Clicking a cell places the currently selected block
- Keep the code simple and clean
- Use a maintainable component structure
- Do not add extra features like saving, erasing, or multiple tools yet
- Return a summary of changed files"
```

하지만 **강의 수강생 관점에서는 이 명령을 직접 치기보다, Hermes에게 위임하는 흐름**으로 설명하는 것이 더 좋다.

## 8-4. 실행 후 사람이 확인할 것

확인 포인트:
- 앱이 여전히 실행되는가
- grid가 보이는가
- 셀 클릭 시 블록이 놓이는가

```bash
npm run dev
```

브라우저에서 직접 클릭해 확인한다.

---

## 8-5. Hermes에게 리뷰 요청

이제 Hermes에게 검토를 맡긴다.

예시:

```text
Review the current implementation of Day 1 for the Minecraft-inspired Mini Block Builder.
Please do these things:
1. Check whether the implementation matches the MVP scope.
2. Point out structural issues if any.
3. Suggest the next Day 2 Codex prompt.
```

Hermes는 다음 단계 범위를 정리해줄 것이다.

---

# 9. Day 2 실습 — 블록 종류/삭제/툴바/저장

## Day 2 목표
- 블록 타입 3종 추가
- 블록 삭제 기능 추가
- 툴바 UI 추가
- 저장/불러오기 기능 추가

---

## 9-1. Hermes에게 Day 2 작업 분해 요청

```text
We finished Day 1.
Now plan Day 2 for the Minecraft-inspired Mini Block Builder.
Please break Day 2 into a small scope and write a Codex prompt.
Day 2 scope:
- Add 3 block types
- Add erase mode
- Add toolbar UI
- Add save/load/reset using localStorage
Keep the implementation workshop-friendly.
```

---

## 9-2. Hermes에게 Day 2 구현 오케스트레이션 맡기기

사용자는 직접 Codex를 호출하지 않고 Hermes에게 이렇게 요청할 수 있다.

```text
Use Codex as the coding agent for Day 2 in this repository.
Please do the following:
1. Restate the Day 2 scope clearly
2. Generate the Codex execution prompt
3. Run Codex for the implementation
4. Review the result against the scope
5. Tell me what to test manually

Day 2 scope:
- Add at least 3 block types
- Add erase functionality
- Add a toolbar for selecting blocks and actions
- Add save/load/reset using localStorage
- Keep the UI simple and clear
- Do not add advanced features beyond this scope
```

Hermes가 내부적으로 Codex를 실행한다면, 실제 실행 형태는 대체로 아래와 유사하다.

```bash
codex exec --full-auto "Implement Day 2 of the Minecraft-inspired Mini Block Builder.
Requirements:
- Add at least 3 block types
- Add erase functionality
- Add a toolbar for selecting blocks and actions
- Add save/load/reset using localStorage
- Keep the UI simple and clear
- Do not add advanced features beyond this scope
- Return changed files and a short summary"
```

---

## 9-3. 사람이 확인할 것

체크리스트:
- [ ] 블록 종류 3개 이상 선택 가능
- [ ] 지우기 가능
- [ ] 저장 가능
- [ ] 새로고침 후 불러오기 가능
- [ ] reset 가능

브라우저에서 직접 확인한다.

---

## 9-4. Hermes에게 구조 검토 요청

```text
Review the current Day 2 implementation.
Focus on:
- code organization
- whether state handling is getting messy
- whether localStorage handling is clean enough
- what should be improved on Day 3 only
```

---

# 10. Day 3 실습 — polish + 검증 + README

## Day 3 목표
- UI 정리
- 남은 버그 수정
- README 작성
- 강의 데모용 마감

---

## 10-1. Hermes에게 최종 polish 범위 요청

```text
We are on Day 3.
Please define a small polish scope for the Minecraft-inspired Mini Block Builder.
Focus on:
- UI cleanup
- bug fixes
- readability
- demo readiness
Also write a Codex prompt for this final pass.
```

---

## 10-2. Hermes에게 Day 3 마감 구현까지 맡기기

강의 흐름상 Day 3도 동일하게, Hermes에게 아래처럼 요청하는 방식이 더 자연스럽다.

```text
Use Codex as the coding agent for the final Day 3 polish pass.
Please do the following:
1. Define the smallest useful polish scope
2. Prepare the Codex implementation prompt
3. Run Codex in this repository
4. Review the final changes
5. Report demo readiness and any remaining issues

Focus on:
- button clarity
- selected block visibility
- layout spacing
- small bug fixes
- workshop-friendly simplicity
```

Hermes가 내부적으로 Codex를 호출한다면 실행 예시는 아래와 유사하다.

```bash
codex exec --full-auto "Polish the Minecraft-inspired Mini Block Builder for final demo readiness.
Requirements:
- Improve button clarity and selected block visibility
- Improve layout spacing and readability
- Fix small usability issues
- Keep the project simple and workshop-friendly
- Do not add unrelated advanced features
- Return changed files and summary"
```

---

## 10-3. Hermes에게 최종 검증 요청

```text
Perform a final review of the Minecraft-inspired Mini Block Builder.
Please provide:
1. A short implementation summary
2. A feature checklist
3. Remaining risks or improvement ideas
4. A draft README outline for workshop participants
```

---

## 10-4. README 작성

README에 최소한 아래를 넣는다.

### README 템플릿

```md
# Minecraft-inspired Mini Block Builder

A workshop project built with Hermes + Codex collaboration.

## Features
- 2D grid world
- Place blocks
- Erase blocks
- Select block types
- Save/load/reset with localStorage

## Tech Stack
- React
- TypeScript
- Vite

## Run
```bash
npm install
npm run dev
```

## Controls
- Click: place selected block
- Erase mode: remove block
- Save: save world to localStorage
- Load: load saved world
- Reset: clear world

## Workshop Theme
Hermes was used for planning, decomposition, and review.
Codex was used for implementation.
```

---

# 11. 추천 구현 방식

## 상태 데이터 구조 예시

월드는 2D 배열 또는 1차원 배열로 관리하면 된다.

예시 타입:

```ts
type BlockType = 'empty' | 'grass' | 'dirt' | 'stone'
```

예시 world shape:

```ts
type WorldGrid = BlockType[][]
```

## 가장 단순한 접근
- 16 x 16 grid
- 각 칸은 하나의 block type 보유
- 클릭 시 현재 선택 block으로 덮어쓰기
- erase mode면 `empty`

이 방식이 강의용으로 가장 좋다.

---

# 12. Hermes prompt 작성 원칙

Hermes에게는 막연히 “게임 만들어줘”라고 하지 않는다.

좋은 요청 예:
- 범위를 제한한다.
- 오늘 구현할 것만 말한다.
- Codex에게 넘길 prompt를 써달라고 요청한다.
- 검토 기준도 요청한다.

## 좋은 Hermes prompt 예시

```text
We are building a workshop-friendly Minecraft-inspired Mini Block Builder.
Keep the scope small.
Please define only the Day 1 MVP and write a Codex prompt for it.
Focus only on grid rendering and block placement.
```

---

# 13. Codex prompt 작성 원칙

Codex에게는 아래가 들어가야 한다.

- 오늘 구현할 범위
- 수정 금지 또는 제외 범위
- 기술 스택
- 완료 기준

## 좋은 Codex prompt 예시

```text
Implement Day 2 of the Minecraft-inspired Mini Block Builder.
Requirements:
- Add 3 block types
- Add erase mode
- Add toolbar actions
- Add save/load/reset via localStorage
Constraints:
- Keep it simple
- Do not add advanced features
Done criteria:
- The app runs
- Users can place and erase blocks
- Users can save and load the world
- Return changed files summary
```

---

# 14. 강의 중 설명 포인트

강의에서는 단순히 결과물만 보여주지 말고, 아래를 계속 강조해야 한다.

## 포인트 1
Hermes는 “코드 생성기”가 아니라 **오케스트레이터**다.

## 포인트 2
Codex는 “답변형 챗봇”이 아니라 **구현 agent**다.

## 포인트 3
사람은 둘 사이의 범위를 통제하는 감독 역할을 한다.

## 포인트 4
좋은 결과는 좋은 분업에서 나온다.

---

# 15. 문제 발생 시 체크리스트

## Hermes가 안 될 때
- `hermes --version`
- `hermes doctor`
- `hermes setup`
- provider/model 설정 확인

## Codex가 안 될 때
- `codex --help`
- 설치 여부 확인
- 인증 확인
- git repo 안에서 실행 중인지 확인

## 프로젝트가 안 뜰 때
- `npm install`
- `npm run dev`
- 포트 충돌 확인
- TypeScript 에러 확인

## 저장이 안 될 때
- 브라우저 localStorage 확인
- 저장 key 이름 확인
- world serialization 확인

---

# 16. 수강생용 최종 체크리스트

## 설치
- [ ] Hermes 설치
- [ ] Codex 설치
- [ ] 인증 완료

## 프로젝트 준비
- [ ] Vite React TS 프로젝트 생성
- [ ] Git 초기화
- [ ] 앱 실행 확인

## 기능
- [ ] grid 렌더링
- [ ] block placement
- [ ] block erase
- [ ] toolbar
- [ ] save/load/reset

## 협업 체험
- [ ] Hermes로 Day 1 범위 정의
- [ ] Codex로 Day 1 구현
- [ ] Hermes로 Day 2 검토
- [ ] Codex로 Day 2 구현
- [ ] Hermes로 최종 검토

## 마무리
- [ ] README 작성
- [ ] 시연 가능

---

# 17. 한 줄 마무리

> 이 실습의 핵심은 “작은 웹 블록 빌더를 만드는 것”과 “Hermes와 Codex를 실제로 함께 써보는 것”을 동시에 경험하는 데 있다. 이 문서를 순서대로 따라 하면, 자연스럽게 프로젝트가 완성된다.

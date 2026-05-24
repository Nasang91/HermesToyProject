# Minecraft-inspired Mini Block Builder with Real Hermes + Codex 연동 계획

> **For Hermes:** 이 문서는 계획 전용이다. 구현은 하지 않고, 실제 Hermes/Codex 연동을 전제로 강의 및 실습을 진행할 수 있도록 단계별 계획을 제공한다.

**Goal:** 참가자들이 Hermes와 Codex를 실제로 설치하고 연동한 뒤, 이를 이용해 `Minecraft-inspired Mini Block Builder`를 3일 동안 직접 구현할 수 있도록 하는 강의용 계획을 만든다.

**Architecture:** 프로젝트는 웹 프론트엔드 앱으로 만들고, 실제 구현 과정에서는 Hermes를 오케스트레이터/분석가/검증자, Codex를 코딩 에이전트로 사용한다. 앱 자체는 브라우저에서 동작하는 mini block builder이며, 강의에서는 “직접 만들기”와 “에이전트 협업 체험”을 동시에 달성한다.

**Tech Stack:** Hermes CLI, Codex CLI, Node.js, npm, Git, Vite + React + TypeScript, localStorage.

---

# 1. 핵심 결론

## 가능한가?

**가능하다.**
단, 중요한 점은 다음과 같다.

- Hermes와 Codex가 앱 내부에서 API처럼 자동 통합되는 것이 아니라,
- **같은 프로젝트 저장소를 대상으로 Hermes가 분석/지시/검증을 맡고 Codex가 실제 구현을 맡는 운영 흐름**으로 연동된다.

즉, 이번 강의의 핵심은 아래 구조다.

### 실제 연동 구조
- **Hermes**
  - 요구사항 구조화
  - 작업 분해
  - Codex에 줄 prompt 작성
  - 구현 결과 검토
  - 테스트/리포트

- **Codex**
  - 실제 코드 작성
  - UI/상태/저장 기능 구현
  - 반복 수정
  - 버그 수정

---

# 2. 최종 실습 결과물

강의를 모두 따라오면 참가자는 다음을 갖게 된다.

1. Hermes 설치 및 기본 설정 완료
2. Codex CLI 설치 및 인증 완료
3. Hermes가 Codex를 호출하는 실전 워크플로 이해
4. `Minecraft-inspired Mini Block Builder` 프로젝트 생성
5. 다음 기능을 가진 웹 앱 MVP 완성
   - 블록 grid 렌더링
   - 블록 놓기
   - 블록 제거
   - 블록 종류 3종 이상
   - localStorage 저장/불러오기
   - 간단한 툴바 UI
6. Hermes/Codex 협업 로그 또는 운영 흐름 체험
7. README 및 데모 준비

---

# 3. 실습 프로젝트 범위

## 앱 이름
`Minecraft-inspired Mini Block Builder`

## MVP 기능
- 2D grid 기반 보드
- 셀 클릭으로 블록 놓기
- 우클릭 또는 erase 모드로 블록 제거
- 블록 타입 3종 이상
- 선택된 블록 타입 툴바
- 저장/불러오기(localStorage)
- 초기화(reset world)

## 넣지 않을 기능
- 3D voxel engine
- physics
- multiplayer
- chunk loading
- crafting/inventory
- procedural terrain
- lighting system

## 강의 목표에 맞는 포인트
이 프로젝트는 “게임 완성도”보다 아래가 중요하다.

- 참가자가 실제로 결과물을 만든다.
- Hermes/Codex 협업을 직접 체험한다.
- 따라하다 보면 자연스럽게 완성된다.

---

# 4. 강의 운영 방식

## 권장 강의 구조

### 파트 A. 설치와 연동
- Hermes 설치
- Codex 설치
- 인증
- 둘이 같은 repo에서 작업하도록 준비

### 파트 B. 프로젝트 스캐폴딩
- Vite React TS 프로젝트 생성
- Git 초기화
- Hermes/Codex가 작업할 repo 만들기

### 파트 C. 기본 기능 구현
- grid 렌더링
- block paint/erase
- toolbar

### 파트 D. 상태 저장 및 polish
- localStorage 저장
- reset / load
- UI polish

### 파트 E. Hermes/Codex 협업 시연
- Hermes가 작업 분해
- Codex가 구현
- Hermes가 검증/리포트

---

# 5. 3일 상세 계획

총 3일, 하루 2시간 기준.

---

# Day 1 — 환경 구축 + 프로젝트 골격 + 첫 블록 그리기

## 목표
- Hermes 설치/확인
- Codex 설치/확인
- 프로젝트 repo 생성
- React 앱 실행
- grid 렌더링 및 블록 하나 놓기까지 구현

## Day 1 상세 작업

### 1. Hermes 설치 및 확인
- Hermes 설치
- `hermes --version`
- `hermes doctor`
- 필요 시 `hermes setup`

### 2. Codex 설치 및 확인
- `npm install -g @openai/codex`
- `codex --help` 또는 `codex --version`
- OpenAI 인증 또는 Codex CLI 로그인

### 3. 프로젝트 생성
- Vite + React + TypeScript 앱 생성
- Git repo 초기화
- 첫 커밋

### 4. Hermes 세션 시작
Hermes에게 아래 종류의 일을 맡긴다.
- 프로젝트 MVP 정리
- 폴더 구조 제안
- 첫 번째 Codex prompt 작성

### 5. Codex로 첫 기능 구현
Codex에게 맡길 최초 범위:
- 전체 grid 화면
- 셀 렌더링
- 셀 클릭 시 현재 선택된 블록 놓기

## Day 1 완료 기준
- 앱 실행 성공
- 빈 world grid 보임
- 클릭 시 블록이 놓임

---

# Day 2 — 블록 종류/삭제/툴바/저장 기능

## 목표
- 블록 종류 3종 이상
- erase 기능
- 툴바 UI
- 저장/불러오기
- Hermes가 중간 검토

## Day 2 상세 작업

### 1. Hermes에게 중간 리뷰 요청
- 현재 구조 평가
- 기술 부채/리팩터링 포인트 확인
- 다음 Codex 작업 prompt 생성

### 2. Codex로 블록 타입 확장
- grass
- dirt
- stone
또는 유사 색상 블록 3종

### 3. Codex로 erase mode 추가
- 블록 제거 모드
- 우클릭 삭제 또는 별도 버튼

### 4. Codex로 툴바 추가
- 현재 블록 선택 표시
- 블록 전환 버튼
- erase / save / load / reset 버튼

### 5. Codex로 localStorage 저장
- save world
- load world
- reset world

## Day 2 완료 기준
- 블록 종류 3종 이상 전환 가능
- 블록 삭제 가능
- 저장/불러오기 가능

---

# Day 3 — polish + 검증 + README + 강의 데모 정리

## 목표
- UI 정리
- 버그 수정
- Hermes 검증 및 리포트
- README 작성
- 강의용 데모 흐름 완성

## Day 3 상세 작업

### 1. Hermes에게 최종 점검 요청
- 남은 버그 후보
- UX 개선 포인트
- README에 꼭 넣어야 할 내용

### 2. Codex로 polish 작업
- grid spacing
- 선택 상태 강조
- 버튼 정리
- 반응성 최소 개선

### 3. Hermes로 검증
- 실행 절차 확인
- 기능 체크리스트 검증
- 데모 스크립트 초안 작성

### 4. README 작성
README에 포함:
- 프로젝트 소개
- 실행 방법
- 조작 방법
- Hermes/Codex 협업 방식
- 향후 확장 아이디어

## Day 3 완료 기준
- 데모 가능한 수준의 앱
- README 완성
- 강의 중 따라 만들 수 있는 흐름 정리 완료

---

# 6. Hermes/Codex 실제 연동 방식

## 핵심 운영 패턴

### Step 1. Hermes에게 먼저 요구사항 분석을 맡긴다
예:
- 어떤 파일 구조로 갈지
- MVP 범위를 어디까지로 제한할지
- Codex에게 무엇을 시킬지

### Step 2. Hermes가 Codex prompt를 만든다
예:
- 어떤 파일을 수정할지
- 어떤 기능만 구현할지
- 테스트/완료 기준은 무엇인지

### Step 3. Codex가 구현한다
예:
- `src/App.tsx`
- `src/components/Grid.tsx`
- `src/components/Toolbar.tsx`
- `src/lib/storage.ts`

### Step 4. Hermes가 검토한다
- diff 확인
- 구조 문제 확인
- 다음 작업 분해
- 최종 리포트

---

# 7. 강의 중 꼭 보여줄 포인트

## 보여줘야 하는 것 1
Hermes는 그냥 채팅 도구가 아니라 **기획/분해/검증 담당**이라는 점.

## 보여줘야 하는 것 2
Codex는 그냥 답변하는 모델이 아니라 **실제 구현 담당 agent**라는 점.

## 보여줘야 하는 것 3
둘을 같이 쓰면,
- 사람이 모든 세부사항을 일일이 설계하지 않아도 되고,
- 사람이 직접 모든 코드를 쓰지 않아도 되며,
- 그래도 전체 흐름은 통제할 수 있다는 점.

---

# 8. 강의용 체크포인트

## 설치 파트 체크포인트
- [ ] Hermes 실행 가능
- [ ] Codex 실행 가능
- [ ] Git repo 준비 완료

## 구현 파트 체크포인트
- [ ] grid 표시
- [ ] block place 동작
- [ ] block erase 동작
- [ ] toolbar 동작
- [ ] save/load/reset 동작

## 마무리 체크포인트
- [ ] Hermes review 실행
- [ ] README 작성
- [ ] 시연 가능

---

# 9. 리스크와 대응

## 리스크 1
Codex 설치/인증에서 막힐 수 있다.

**대응:** 강의 문서에 설치 검증 절차와 실패 시 fallback을 반드시 넣는다.

## 리스크 2
3D를 하려다가 시간이 부족해진다.

**대응:** 이번 강의는 반드시 2D grid 기반으로 고정한다.

## 리스크 3
참가자가 Hermes/Codex 역할을 헷갈릴 수 있다.

**대응:** 문서에 “Hermes는 생각/검증, Codex는 구현”을 반복해서 명시한다.

---

# 10. 다음 문서에서 반드시 다룰 내용

이 계획 다음에는 실제 강의용 실행 가이드 문서가 필요하다. 그 문서에는 반드시 아래가 포함되어야 한다.

1. 사전 준비물
2. Hermes 설치 방법
3. Codex 설치 방법
4. 인증 확인 방법
5. 프로젝트 생성 명령어
6. Day 1/2/3 실습 명령어
7. Hermes prompt 예시
8. Codex prompt 예시
9. 최종 README 예시
10. 문제 발생 시 troubleshooting

---

# 11. 한 줄 결론

> 이 프로젝트는 실제 Hermes + Codex 연동을 체험하기에 매우 좋은 강의형 데모다. 단, “자동 통합 시스템”이 아니라 “같은 repo를 대상으로 Hermes가 오케스트레이션하고 Codex가 구현하는 실전 협업 흐름”으로 설명해야 한다.

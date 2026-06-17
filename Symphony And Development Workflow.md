# Symphony And Development Workflow

단일 AI에게 모든 작업을 맡기는 방식이 아니라, Codex를 중심으로 여러 역할을 나누고 이를 하나의 흐름으로 조율하는 Symphony 방식으로 구축했다.

여기서 Symphony는 Codex의 공식 기능명이라기보다, 이 프로젝트에서 사용하는 multi-agent orchestration workflow를 의미한다. 즉, conductor가 전체 방향과 품질 기준을 잡고, frontend, backend, database, security, QA, devops 같은 역할별 agent가 각자 맡은 범위를 수행한 뒤, PR과 검증 과정을 통해 하나의 안정된 결과물로 합치는 방식이다.

## What Counts As Symphony

이 프로젝트에서 Symphony에 해당하는 부분은 다음과 같다.

- 역할별 agent 구조를 `.agents/`에 정의했다.
- `conductor`가 전체 작업 흐름, 범위, 통합, 검증, merge 판단을 맡는다.
- `frontend`, `backend`, `database`, `security`, `qa`, `devops`, `architecture`, `product-design` 등이 역할별 owner로 동작한다.
- runtime subagent는 필요한 작업 단위마다 임시로 생성되고, 작업이 끝나면 결과만 남기고 종료된다.
- 역할은 문서와 PR 이력에 지속적으로 남고, subagent 인스턴스는 일회성 실행자로 취급한다.
- 구현 전 문서와 contract를 먼저 고정하고, 그 기준에 맞춰 구현한다.
- 구현, 검토, 검증, merge를 하나의 반복 가능한 흐름으로 관리한다.

## What Counts As Workflow

이 프로젝트에서 Workflow에 해당하는 부분은 실제 작업이 진행되는 절차다.

1. 사용자 요청 또는 GitHub Issue가 들어온다.
2. `conductor`가 요청을 work packet으로 정리한다.
3. 작업 성격에 따라 담당 agent role을 정한다.
4. 필요한 경우 subagent를 생성해 조사, 구현, 보안 검토, QA 검토를 맡긴다.
5. 구현은 `codex/*` 브랜치에서 진행한다.
6. 변경사항을 commit하고 원격 브랜치로 push한다.
7. GitHub Connector를 사용해 Pull Request를 생성한다.
8. `conductor`가 PR diff, acceptance criteria, 검증 결과를 확인한다.
9. 문제가 있으면 수정 요청 후 다시 검증한다.
10. 문제가 없으면 merge하고 결과를 보고한다.

작은 문서 수정이나 단순 변경은 conductor가 직접 처리할 수 있지만, 비사소한 구현은 역할별 agent 검토와 PR 기반 검증을 거치는 것을 기본값으로 둔다.

## Role-Based Agent System

Agent 역할은 `.agents/` 아래에 정의되어 있다.

- `conductor`: 요청 분석, 작업 분배, 통합, 검증, merge 판단
- `product-design`: UX flow, 한국어 문구, acceptance criteria
- `architecture`: domain model, route, API/DTO contract, 확장성
- `frontend`: React/Vite UI, 반응형 화면, 사용자 상호작용
- `backend`: API contract, validation, auth/inquiry/seller workflow
- `database`: schema, migration, seed, persistence boundary
- `security`: privacy, auth, sensitive data exposure, payment-adjacent risk
- `qa`: smoke test, regression, browser/preview 검증
- `devops`: CI, release, deployment, rollback, environment
- `github-issue-manager`: issue, label, milestone, PR linkage

이 구조는 누가 무엇을 책임지는지 명확하게 하기 위한 장치다. 실제 subagent 이름은 임시적이지만, 위 역할들은 프로젝트의 지속적인 ownership 단위로 유지된다.

## GitHub-Based Workflow

HeavyDeal은 GitHub Connector와 SSH 기반 git remote를 함께 사용한다.

- local git push는 SSH remote를 사용한다.
- PR 생성, PR 조회, merge 같은 GitHub 작업은 GitHub Connector를 사용한다.
- `gh` CLI는 token 이슈가 있었기 때문에 핵심 workflow에는 의존하지 않는다.
- 모든 주요 변경은 branch, commit, PR, review, merge 흐름을 거친다.
- 단일 작업 PR은 squash merge를 기본으로 한다.

## Issue And PR Orchestration

비사소한 작업은 GitHub Issue 또는 work packet 단위로 관리한다.

Issue에는 다음 정보가 포함되는 것을 기준으로 한다.

- 작업 요약
- 담당 agent
- 지원 agent
- scope / out of scope
- contract 변경 여부
- acceptance criteria
- verification
- risk

PR에는 다음 정보가 포함된다.

- 작업 범위
- 변경된 contract
- 검증 명령
- UI 변경 시 screenshot 또는 responsive QA note
- 남은 follow-up

이 방식은 작업이 커질수록 중요하다. 기능을 바로 붙이는 대신, issue와 PR을 통해 무엇을 끝냈고 무엇이 아직 남았는지 추적한다.

## Documentation-First Workflow

이 프로젝트는 구현보다 먼저 문서와 contract를 고정하는 방식을 사용한다.

주요 문서 역할은 다음과 같다.

- `docs/PRD.md`: 제품 목표와 MVP 범위
- `docs/ARCHITECTURE.md`: 시스템 경계와 확장 원칙
- `docs/API_AND_DATA_DESIGN.md`: API, DTO, database concept
- `docs/DOMAIN_QUERY_CONTRACTS.md`: domain term, enum, query contract
- `docs/NEXT_IMPLEMENTATION_STEPS.md`: 실제 구현 순서와 담당 agent
- `docs/AUTH_ROLE_ACCESS_PLAN.md`: 계정/권한/역할 설계
- `docs/AUTH_SESSION_CONTRACT.md`: session, actor, capability boundary
- `docs/DATABASE_BASELINE.md`: schema, migration, privacy boundary
- `docs/QUALITY_SECURITY_RELEASE.md`: QA, security, release 기준
- `docs/PRODUCTION_DEPLOYMENT_ROLLBACK.md`: 배포와 rollback 기준

이 문서들은 단순 설명서가 아니라, 구현자가 따라야 하는 작업 기준이다. Contract가 바뀌는 PR은 관련 문서도 같이 갱신한다.

## Verification Workflow

구현이 끝난 뒤에는 정해진 검증 명령을 실행한다.

```bash
npm run build
npm run check:db
npm run migrations:check
npm run check:auth-routes
npm run smoke:api
npm run smoke:preview
npm run smoke:release
```

`npm run smoke:release`는 release 전 통합 검증 gate로 사용된다. build, DB baseline, migration check, auth route check, API smoke, preview smoke를 한 번에 확인한다.

## Linear Position

Linear는 향후 issue delegation과 project tracking에 연결할 수 있는 후보로 둔다. 다만 Linear에서 Codex가 자동으로 작업을 시작하려면 repo mapping뿐 아니라 Codex cloud environment 설정이 필요하다.

따라서 현재 핵심 구현 workflow는 GitHub Issue/PR 중심으로 안정화하고, Linear는 environment 설정이 완료된 뒤 자동 위임 경로로 확장하는 구조가 적절하다.

## Summary

HeavyDeal의 Symphony는 다음을 의미한다.

- 역할별 agent를 나눈다.
- conductor가 전체 흐름을 조율한다.
- 문서와 contract를 먼저 고정한다.
- 구현은 branch와 PR로 관리한다.
- subagent는 필요한 작업에만 사용한다.
- 검증 명령과 CI로 품질 gate를 둔다.
- merge 판단은 conductor가 책임진다.

즉, HeavyDeal의 개발 방식은 AI가 코드를 바로 생성하는 방식이 아니라, Codex 기반 역할 분담, 문서 중심 설계, GitHub PR workflow, 반복 검증을 결합한 orchestration 방식이다.

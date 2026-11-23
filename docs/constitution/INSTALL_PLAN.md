# 헌법 설치 계획서 — blog (첫 설치)

> 이 문서는 헌법 설치 flow 한 번의 상태 원장이다. 다른 세션도 여기서 재개한다(§진행 · §미완 대장).

| 칸 | 값 |
| --- | --- |
| 일 | blog 저장소에 최신 canon 판 헌법을 처음 설치한다 |
| 착수 티켓 | T-002701 (owner harness / 민원과 · holder blog code-main / constitution-setup) |
| SPEC | canon 칸 18 `wf.install` — 0.45.0 공포 전이라 `canon/PENDING.md` 의 C236 · C237 · C246 행이 문면(지금 효력) · 단계 꼴은 canon 칸 2 · 러너 = 스킬 business-flow |
| 판정 | 법제처 T-002697 — kind web · id 범위 `R-BLOG-` · base `main` · 통합선 `main-cicd`(첫 착지에 main 머리에서 섬) · 배포 = 사람(main push → `deploy.yml` GitHub Pages) |
| 원천 | canon **0.44.0**(harness `c26edbd8a` 기준 canon 머리) · web-kind **0.1.0**(2026-11-08 공포) · 레포 `main`＠`16cb73c` |
| 레인 가지 | `docs/constitution-setup`(main＠16cb73c 에서 땀 · 추적 파일 129) |
| 들어오는 길 | (가) 기존 실물 — 이미 도는 규칙이 있다: `AGENTS.md`(= `CLAUDE.md`) · `WRITING_GUIDE.md` · 스킬 `blog-compose` · `blog-wording` · `blog-seo` · `blog-write` · `scripts/check-*.mjs`(tokens · posts · wording · seo) · `.github/workflows/check.yml` · `deploy.yml`. 지우지 않고 **들인다**(분모 행에 «있다(경로:줄)» 로 댄다) |
| 선언 판 | 없음(헌법 0) → 분모 = 설치 분모 표 **전수**(C246 ⑴ ⑵ — 기준선 없음) |
| 선배 대조 권고 | 보급과 T-002698 → harness `desks/guide/checks/2026-11-23-peer-learn-blog.md`＠`2bc24fa3a` — 선배 old_person(web · main-cicd＠1bc7688) · content(1.0.0/cicd＠9ce7f71). 첫 ADR 필수 묶음: 헌법 넷 · ADR · 기존 규범(CLAUDE.md 운영 규칙 15 줄 · WRITING_GUIDE · 스킬 넷) 처분 표 · 술어 있는 조문 셋(토큰 R1 ~ R3 · 공개 글 P1 ~ P5 · 분류 정본) · localci(build = PR CI 와 같음) · 통합선 main-cicd(main push = 공개 배포) · 가지 처분 · 배포 = 사람 몫 |
| 정지점 | Execute 직전 하나(칸 2). 헌법 문면은 단계마다 사용자 합의(business-flow §3 «에이전트 단독 작성 금지») |
| 끝 | `main-cicd` 착지 sha + 보급과 감수 ② PASS → 민원과가 사용자에게 «감독 레인을 만들까» (C237 ⑴) |

## 단계

| # | 단계 | 할 일 | 산출(자리) | 통과 |
| --- | --- | --- | --- | --- |
| 0 | sync | 원천 셋 고정 — canon 판 · web-kind 판 · 레포 sha. 통합선 `main-cicd` 는 아직 없음(첫 착지가 세움) | 이 표 머리 | 원천 셋 sha 가 적힘 |
| 1 | Survey | **kind 판정 먼저** — 등록부 kind ↔ 실측(언어 · 빌드 단위 · 배포 꼴 · 도메인 유무). layout(통합형 예정) · 기존 규칙 문서 전수 · `claude/*` 다섯 가지 머리와 머지 여부(지우지 않음) · 기계 전제(node · npm · astro · sharp 판) · 빌드 · 검사 명령 실측 | `SURVEY.md` | 판정과 실측이 맞음(어긋나면 멈추고 법제처 물음) |
| 1b | 감사 | Survey 를 다른 세션이 다시 잼 — 빠진 규칙 원천 · 셈 명령 재실행 | `SURVEY.md` §감사 | 막음 0 |
| 2 | Architecture | **설치 분모 표** — 행 = canon 칸(구조 M · `rules.*` · 워크플로우 칸 1 ~ 18 · SUPERVISOR 칸) + web-kind 영역 규칙 전부(걸리는 조건 판정) + **바탕 행**(아래). 칸 = 등급 · 레포 자리(문서 · 절) · 집행 · 상태(있다 · 일부 · 없다 · 공란 + 까닭 · 해당 없음 + 까닭). 칸은 세우고 값만 비운다(C246 ⑶) | `INSTALL_DENOMINATOR.md` | 빈 칸 0 · 셈법 줄 있음 |
| 2b | 감사 | 분모 표 대조 — canon 칸 전수 존재(A0) · kind 영역 빠짐 · 선배 대조(같은 kind 로 PASS 난 레포 — 보급과 T-002698 권고) | 같은 파일 §감사 | 막음 0 |
| 3 | BDD | 설치 됐을 때 장면 — 블로그 글 요청이 Supervisor · 티켓으로 와서 Business Flow(글 한 편)가 돈다 · 글 규칙 · 검사 · 배포가 어디 적혀 있나 답할 절이 있다. 문제 장면 — 필수 영역이 빈 채 «끝» · kind 오판 | `INSTALL_BDD.md` | 장면마다 답할 절 이름 |
| 3b | 감사 | 장면이 분모 표 행을 다 덮나 | 같은 파일 | 막음 0 |
| 4 | SDD | 헌법 문서 설계 — `docs/constitution/{WORKFLOW,RULES,AMENDMENT,CHANGELOG}.md` · `docs/adr/{constitution,workflow}/` · `docs/adr/TEMPLATE.md` · 글 규칙 조문(R-BLOG-WRITING · R-BLOG-SEO · R-BLOG-TOKENS · R-BLOG-POSTS 등 — 기존 검사를 집행 줄로) · Business Flow 루트 플로우 = 글 한 편(blog-compose 다섯 단계와 칸 2 대응) · MUST 마다 집행 줄 · `AGENTS.md` 판 포인터 | `INSTALL_SDD.md` | MUST 마다 집행 줄 |
| 4b | 감사 | 조문 문면 · 집행 줄 대조 | 같은 파일 | 막음 0 |
| 5 | Plan | 착지 묶음 · 커밋 차례 · localci 선언(`npm run build` 와 같은 명령 · `check.yml` 과 두 벌 금지) · 첫 ADR(헌법 도입) | 이 문서 §계획 | 커밋 차례 확정 |
| 5b | 감사 | 계획 대조 | 이 문서 §감사 | 막음 0 |
| 6 | DoD 관문 | 설치 완료 잣대 여섯(C236 ⑶) + 바탕 행 빈 칸 0 · 감독 대조 대신 법제처 심사(첫 ADR · 민원과 경유 review) | 이 문서 §DoD | 잣대 여섯 통과 · 심사 적합 |
| — | **정지점** | **Execute 직전 — 사용자 확인** | | |
| 7 | Execute | 헌법 문서 작성 · 통합선 `main-cicd` 에 착지(헌법만이면 문서 큐) | 레포 | 착지 sha |
| 8 | 검증 | 적용 감수 두 번(레인 자체 ① · 보급과 ②) · **«설치 끝» 은 ② PASS 만** | 이 문서 §검증 | ② PASS |

## 바탕 행 (C237 ⑵ — 분모 표에 더함 · 빈 칸이면 DoD 를 지나지 않는다)

| 행 | 주인 | 상태 |
| --- | --- | --- |
| 등록부 행(kind · layout · path) | 민원과 | 있다 — `targets.yaml` blog 행(status intake · layout 은 제정 때 확정) |
| 명부 자리 | 민원과 | 있다 — `blog code-main / constitution-setup`(bind seq 36510) |
| 통합선 가지 `main-cicd` | 설치 레인 · tool | 없다 — 첫 착지가 main 머리에서 세움 |
| 원장 줄 | 민원과 · tool | 확인 전 |
| 러너 프로필(linestore 등) | tool | 확인 전 |
| 레포 가드 선언(`localci_guards`) | 설치 레인 | 없다 — 4 SDD 에서 설계(기존 check:* 를 들임) |
| 기계 전제(node · npm · astro) | 설치 레인 → tool | 확인 전 — 1 Survey 에서 잼 |
| 전역 정지 · 문서 큐 통과 확인 | 설치 레인(막히면 tool 결함 티켓) | 확인 전 |
| 에이전트 지침 파일의 판 포인터(`AGENTS.md` = `CLAUDE.md`) | 설치 레인 | 없다 — 7 Execute |
| 레포 훅 선언 | 설치 레인 | 확인 전 — `.claude/settings*.json` 실측 |
| 포트(V2 3300 · V1 3310 ~ 3319) | 민원과(표 행 청) | 판정에 있음 — SYSTEMS 표 행은 민원과가 청 |
| 배포(사람 main push → GitHub Pages) | 사용자 | 있다 — `deploy.yml` |

## 사용자에게 물을 것 (모아서 한 번에 — 해당 단계 전)

1. **작업 가지와 main** — 지금까지 블로그 일은 Claude 가 main 에 바로 커밋하고 사용자가 push 했다. 헌법이 서면 일은 레인 가지 → `main-cicd` 착지 → 사용자가 main 머지 · push 가 된다. 이 바뀜을 받을지(3 BDD 전).
2. **Business Flow = 글 한 편** — blog-compose 다섯 단계(뼈대 → 질문 → 살 붙이기 → 사실 확인 → 초안 마무리)를 칸 2 단계(0 sync ~ 8 검증)에 어떻게 대응시킬지(4 SDD 전).
3. **헌법 문면 합의** — 조문은 단계마다 보여 드리고 합의받는다(business-flow §3).

## 사용자 결정 · 제안 기록

- 2026-11-23 사용자: «너도 감독레인을 만들고 지금 까지 했던 블로그 작성 플로우를 루트 플로우로 만들자» → 감독 시점은 «설치 PASS 뒤에»(사용자 선택 · C237 ⑴ 그대로). 루트 플로우는 이 설치의 4 SDD 몫으로 넣는다.
- 루트 플로우 대응 제안(합의 전) — 글 한 편 = Business Flow 한 번:

| 칸 2 단계 | 글 한 편에서 | 지금 blog-compose |
| --- | --- | --- |
| 0 sync | 가지 `post/<slug>` 를 통합선에서 땀 · 원천 저장소 sha 고정 | — |
| 1 Survey | 뼈대 초안 + 원천 세션 조사 요청 · 회신 · 블로그가 다시 셈 | ① 뼈대 · ② 질문 |
| 1b 감사 | 숫자 이중 측정(두 세션이 따로 셈) · 기준 시점 확인 | ② |
| 2 Architecture | 글 구조 확정 — 독자 · 메뉴(분류) · 편 구성 · 절 차례 · 그림 목록 | ① |
| 3 BDD | 됐을 때 장면(독자가 읽고 할 수 있는 것) · 문제 장면(공개 금지 정보 · 원천과 다른 숫자 · 실측 없는 단정) | (새로) |
| 4 SDD | 초안 본문 · 그림 · 표(make-charts 구간) | ③ 살 붙이기 |
| 5 Plan | 사실 확인 주장 목록 · 발행 묶음 | ④ 준비 |
| 5b 감사 | 사실 확인 회차(R1 · R2 …) — 원천이 판정 · 블로그가 다시 셈 | ④ 사실 확인 |
| 6 DoD 관문 | 개발자 용어 · SEO · GEO · check:posts · build 0 · 사실 확인 닫힘 · 공개 금지 훑기 → 초안 커밋 | ⑤ 초안 마무리 |
| **정지점** | **사용자가 초안을 보고 «발행»** | 발행 |
| 7 Execute | 발행 — `draft: false` · pubDate · 통합선 착지 | 발행 |
| 8 검증 | 사용자 push 뒤 공개 페이지 · llms.txt · 사이트맵 확인 · 발행 뒤 정정 | 발행 뒤 |

## 진행

| 단계 | 상태 | 메모 |
| --- | --- | --- |
| 0 sync | ✅ | 원천 셋 고정(위 표 머리) |
| 1 Survey | ✅ | `SURVEY.md` — kind web 맞음 · 통합형 · 규칙 원천 14 · 기계 전제 · 가지 11 |
| 1b 감사 | ✅ | 주장 23 · 맞음 20 · 막음 6 반영 → 막음 0 |
| 2 Architecture | ✅ | `INSTALL_DENOMINATOR.md` — 69 행 전수 · 기존 규범 처분 15 줄 |
| 2b 감사 | ✅ | A0 빠짐 0 · 막음 3 반영(주인 · 확인 때 열 · 메모 · B 행 까닭) → 막음 0 |
| 3 BDD | ⬜ | |
| 3b 감사 | ⬜ | |
| 4 SDD | ⬜ | |
| 4b 감사 | ⬜ | |
| 5 Plan | ⬜ | |
| 5b 감사 | ⬜ | |
| 6 DoD 관문 | ⬜ | |
| 7 Execute | ⬜ | 정지점 뒤 |
| 8 검증 | ⬜ | |

## 미완 대장

| 무엇 | 왜 안 끝났나 | 풀리는 조건 |
| --- | --- | --- |
| 3 BDD | 장면 쓰기 전 | — |

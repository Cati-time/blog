# 헌법 설치 2 Architecture — 설치 분모 표 (blog · 전수)

- 원천: canon **0.44.0** · web-kind **0.1.0** · 레포 `docs/constitution-setup`(원천 `main`＠16cb73c).
- **선언 판 없음 · 기준선 없음 → 분모 = 전수**(C246 ⑴ ⑵). 틀은 보급과 설치 플레이북의 63 행(`desks/guide/pages/content-reinstall-0.44.0.md` §1)을 그대로 깔고, kind 행은 web-kind 규칙 1 ~ 7 로 바꿨다. 행을 빼지 않는다. 값이 없는 칸은 «공란 + 까닭 + 주인 · 확인 때»(C246 ⑶).
- 셈: canon 칸 = `WORKFLOW.md` 칸 목록 17 + 칸 18(PENDING) · `RULES.md` M1 ~ M9 + M1-S + 지향 + telemetry + §0-1 ⑤ · `SUPERVISOR.md` 절 17 · 공용 넷 · kind 7 · 바탕 9 = **H1 1 + W 18 + S 13 + V 17 + C 4 + K 7 + B 9 = 69 행.**
- 칸 «지금» 은 설치 전 blog 실측(헌법 0 이라 거의 «없다»), «설치 뒤 자리» 는 7 Execute 가 세울 곳이다. 문서 이름 약자 — W = `docs/constitution/WORKFLOW.md` · R = `RULES.md` · A = `AMENDMENT.md` · CL = `CHANGELOG.md` · ADR = `docs/adr/…`.

## 1. 분모 표

| 행 | 칸 | 등급 | 지금(blog) | 설치 뒤 자리 | 집행 | 메모 · 처분 |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | 판 표지 canon 0.44.0 · web-kind 0.1.0 | MUST | 없다 | W · R 머리 한 줄 · `AGENTS.md` 판 포인터 | 확인기 정규식(보급과) | 0.45.0 공포 뒤 판 올림 |
| W1 | 칸 1 `wf.layer` 흐름 층 | MUST | 없다 | W §흐름 층 — Subflow ⊂ Business Flow(글 한 편) ⊂ Supervisor · 감독 레인 «설치 PASS 뒤» | 리뷰 | 사용자 합의 2026-11-23 |
| W2 | 칸 2 `wf.bf-stages` 단계 · 정지점 | MUST | 일부 — `blog-compose` 다섯 단계 · AGENTS.md 초안 순서 줄 | W §루트 플로우 «글 한 편»(0 sync ~ 8 검증 · 정지점 = 사용자 «발행») | 리뷰 + check:seo · build | 대응표는 `INSTALL_PLAN.md` §사용자 결정 |
| W3 | 칸 3 `wf.layout` 문서 자리 | MUST | 일부 — 글 = `src/content/blog/<slug>/` · 조사 = `../blog-notes/`(저장소 밖) | W §문서 자리 — BF 대상 폴더 = `src/content/blog/<slug>/` · 전역 `docs/` 허용 목록 | 리뷰 | 사실 확인 표는 저장소 밖 유지 |
| W4 | 칸 4 `wf.roles` 역할 · 등급 | MUST | 없다 | W §역할 | 리뷰 | canon 표 가리킴 |
| W5 | 칸 5 `wf.done` 완료 기준 · 변경 책임 | MUST | 일부 — «커밋 전 build 통과» · 초안 순서 | W §완료 기준 — 초안 = build · wording · seo 0 · 사실 확인 닫힘 / 발행 = build · check:seo 오류 0 | localci · check:* | |
| W6 | 칸 6 `wf.lane-line` 레인 선 | MUST | 없다 — main 하나 | W §레인 선 — base `main` · 통합선 `main-cicd` · 레인 가지 `post/<slug>` · `docs/<slug>` 등 | localci | 판정 T-002697 |
| W7 | 칸 7 `wf.audit-loop` 감사 고리 | MUST | 일부 — 사실 확인 회차(R1 · R2) | W §감사 — 사실 확인 회차 = 감사 · 상한 · 합격선 | 리뷰 | 값은 7 Execute 전 합의 |
| W8 | 칸 8 `wf.supervisor` | MUST | 없다 | W §감독 → SUPERVISOR 절(V 행) | 리뷰 | 감독은 PASS 뒤 |
| W9 | 칸 9 `wf.kickoff` 착수 3문 | MUST | 없다 | W §착수 | 리뷰 | |
| W10 | 칸 10 `wf.human-decision` | MUST | 일부 — «분류가 애매하면 묻는다» · «발행은 사용자» | W §사람 결정 길 | 리뷰 | canon 그대로 |
| W11 | 칸 11 `wf.metrics` 지표 | MUST | 없다 | W §지표 — BF 층 열둘(축마다 셋) · SUBF 층 | 안 잼 행 표기 | C246 ⑷ — 층마다 행은 세운다 |
| W12 | 칸 12 `wf.seam-rules` 이음매 | MUST | 없다 | W → R 섹터 맵(S7) 가리킴 | 리뷰 | |
| W13 | 칸 13 `wf.systems` 공용 시스템 | MUST | 없다 | W §시스템 — svts · localci 단계 표 | 리뷰 | |
| W14 | 칸 14 `wf.receive` 개정 수신 | MUST | 없다 | W §개정 수신 · A §5 | 리뷰 | |
| W15 | 칸 15 `wf.verify` 실환경 검증 | MUST | 일부 — dev 서버 미리보기 · 공개 페이지 확인 | W §검증 — V0 build · V1 3310 ~ 3319 · V2 3300 · V3 사람 push 뒤 공개 페이지 | localci · 리뷰 | 포트는 판정 · SYSTEMS 표 행 청(민원과) |
| W16 | 칸 16 `wf.subflow` Subflow 계약 | MUST | 없다 | W §Subflow 계약 표 — 조사 요청 · 다시 세기 · 그림 · 사실 확인 · 용어 · SEO 등 | 선언 수 = 행 수 가드 | |
| W17 | 칸 17 `wf.collab` 협업 | MUST | 일부 — 원천 세션 조사 · 사실 확인(다른 저장소 읽기만) | W §협업 — 블로그는 코어가 아님 · 원천 레포 가리킴 | 리뷰 | |
| W18 | 칸 18 `wf.install` (PENDING · 지금 효력) | MUST | 진행 중 | 이 설치 · W §설치 가리킴 | 감수 ② | |
| S1 | M1 `rules.layer` 계층 · 의존 | MUST | 없다 | R 몸통 — K2 와 한 절 | 가드 후보 | |
| S2 | M1-S `rules.layer-body` | MUST(server 만) | 해당 없음 | — | — | 해당 없음 — web kind · server 몸통 없음 |
| S3 | M1 지향 기본값 | MUST | 없다 | R §지향 — K6 | 리뷰 | |
| S4 | M2 `rules.boundary` 바깥 접점 | MUST | 일부 — GitHub Pages · Giscus · GA · 원천 레포 | R §바깥 접점 | 리뷰 | 사용자 확인: `gh api` 설정 변경 |
| S5 | M3 `rules.enforce-line` | MUST | 없다 | R §조문 꼴(조문마다 집행 한 줄) | 리뷰 | |
| S6 | M4 `rules.guard-entry` | MUST | 일부 — `npm run check`(tokens · posts · astro check) | R §가드 진입점 + `scripts/localci.sh` | localci | check:wording · seo 를 들일지 4 SDD |
| S7 | M5 `rules.sector-map` | MUST | 없다 | R §섹터 맵(워크플로우 대응 열) | 리뷰 | |
| S8 | M6 `rules.blank` 빈칸 | MUST | 없다 | R §빈칸 | 리뷰 | |
| S9 | M7 `rules.logging` | MUST | 없다 | R §로그 — «안 정함 · 정적 사이트 · 빌드 로그만» | 리뷰 | 자리 MUST |
| S10 | M8 `rules.errors` | MUST | 일부 — 404 페이지 · check 오류 / 경고 | R §오류 | 리뷰 | |
| S11 | M9 `rules.structure-graph` | MUST | 없다 | R 몸통 첫 절 개관 그래프 | 노드 = 코드 대조 | «안 정함» 없음 |
| S12 | `rules.telemetry`(M 밖) | M 밖 | 일부 — GA(`site.config.mjs`) | R §텔레메트리 | 리뷰 | |
| S13 | §0-1 ⑤ 구조 칸 실물 분모 | MUST | 없다 | R — 역할 목록 셈 명령 · 기준 ref · 양성 대조 | 명령 | K7 과 같은 셈 |
| V1 | SUPERVISOR §1 정의 | MUST | 없다 | W §감독(통합형 절) | 리뷰 | 감독 레인은 PASS 뒤 — 절은 설치가 세움 |
| V2 | §1-4 참조 그림 | SHOULD | 없다 | W §감독 그림 | 리뷰 | |
| V3 | §2 구성요소 · 소유 | MUST | 없다 | W §감독 | 리뷰 | |
| V4 | §3 책임 · 범위 | MUST | 없다 | W §감독 | 리뷰 | |
| V5 | §4-1 BF 생애 흐름 | MUST | 없다 | W §감독 — 글 한 편 생애 | 리뷰 | |
| V6 | §4-2 매일 도는 흐름 일곱 | MUST | 없다 | W §감독 | 리뷰 | |
| V7 | §4-3 병렬 · 직렬 마감 | MUST | 없다 | W §감독 | 리뷰 | |
| V8 | §4-4 점호 보고 양식 | MUST | 없다 | W §감독 | 리뷰 | |
| V9 | §5 활용 의무 | MUST | 없다 | W §감독 | 리뷰 | |
| V10 | §5-1 사람 청은 티켓 | MUST | 없다 | W §감독 | 리뷰 | |
| V11 | §5-2 줄의 상태 넷 | MUST | 없다 | W §감독 | 리뷰 | |
| V12 | §6 넘김 형식 | MUST | 없다 | W §감독 | 리뷰 | |
| V13 | §7 반환 성능 칸 | MUST | 없다 | W §감독 | 리뷰 | |
| V14 | §7-1 진단 지표 | MUST | 없다 | W §지표(W11) 가리킴 | 리뷰 | |
| V15 | §8 개정 · 공포 경계 | MUST | 없다 | W §감독 · A | 리뷰 | |
| V16 | §9 감독 없는 레포의 과도 | MUST | **해당** — 감독 없음 | W §감독 — «설치 PASS 뒤 연다(C237 ⑴) · 그때까지 이 세션이 받음» | 리뷰 | |
| V17 | §10 레포가 정하는 것 | MUST | 없다 | W §감독 | 리뷰 | |
| C1 | SYSTEMS 공용 시스템 | MUST | 없다 | W §시스템(W13) | 리뷰 | |
| C2 | TICKETS | MUST | 일부 — 명부 자리 bind | W §시스템 | svts | |
| C3 | WORKTREE(분모 밖 · 한 줄) | MUST | 없다 | W §레인 선 한 줄 | 리뷰 | |
| C4 | canon AMENDMENT | MUST | 없다 | A(레포 개정 절차) | 리뷰 | |
| K1 | web 규칙 1 꼴 — 첫 몸통 절 = «현재 1» | MUST | 없다 | R 범위 다음 첫 절 | 절 차례 대조(가드 후보) | 걸림 — 화면 코드 있음 |
| K2 | 규칙 2 현재 1 어디에 두나 — 역할 처분 0 | MUST | 없다 | R 현재 1 표 — pages · layouts · components · lib · styles · data · content(blog · team · projects) · scripts · 뿌리 설정 | 폴더 목록 ↔ 표 대조 | 분모는 K7 셈 |
| K3 | 규칙 3 현재 2 어떻게 만드나 | MUST | 일부 — 토큰 · 글 생성(new-post) · 그림(make-charts) | R 현재 2 | 리뷰 | |
| K4 | 규칙 4 현재 3 어떻게 시험하나 | MUST | 일부 — astro check · check:* · 브라우저 확인 | R 현재 3 — 단위 시험 없음 · 무엇을 대체하나 | 리뷰 | |
| K5 | 규칙 5 현재 4 옆과 잇기 | MUST | 일부 | R 현재 4 — (가) 서버 계약 «해당 없음 · 정적» (나) 오류 → 404 · 빌드 실패 (다) 상태 «클라이언트 상태 거의 없음 · Giscus 외부» | 리뷰 | 서버 · 인증 · 상태 칸 = 해당 없음 + 까닭(판정) |
| K6 | 규칙 6 지향 · 간극 | MUST | 일부 — «다크 모드 없음»(사용자 2026-09-29) | R 지향(출처 한 줄) · 간극 행 | 리뷰 | |
| K7 | 규칙 7 gate 분모는 코드 | MUST | 없다 | R — 역할 목록 명령 · 수 · 기준 ref | 명령 | S13 과 같은 셈 |
| B1 | 등록부 행 | 바탕 | 있다 — `targets.yaml` blog | W 머리 가리킴 | 민원과 | layout = 통합형(제정 때 확정) |
| B2 | 명부 자리 | 바탕 | 있다 — `blog code-main / constitution-setup` | W §시스템 | 민원과 | |
| B3 | 통합선 가지 `main-cicd` | 바탕 | 없다 | W §레인 선 | 첫 착지 | |
| B4 | 원장 줄 | 바탕 | 확인 전 | — | 민원과 · tool | 6 DoD 전 확인 |
| B5 | 러너 프로필 | 바탕 | 확인 전 | — | tool | 〃 |
| B6 | 레포 가드 선언 `localci_guards` | 바탕 | 없다 | `scripts/localci.sh` | localci | 4 SDD |
| B7 | 기계 전제 | 바탕 | 있다 — node 24.22 · npm 11.6 · astro 7.3.2 | W §검증 | Survey §4 | node 판 적힌 곳 불일치 → 간극 행 |
| B8 | 전역 정지 · 문서 큐 | 바탕 | 확인 전 | — | tool | 7 Execute 때 |
| B9 | 지침 판 포인터 | 바탕 | 없다 | `AGENTS.md`(= `CLAUDE.md`) 머리 | 확인기 | |

**셈**(스크립트로 다시 셈): 69 행 · 지금 있다 3 · 일부 16 · 없다 44 · 해당 없음 1(S2) · 해당 1(V16) · 확인 전 3 · 진행 중 1(W18) · 빈 칸 0.

## 2. 기존 규범 처분 표 (들어오는 길 (가) — `AGENTS.md` 운영 규칙 15 줄)

| # | 지금 줄(`AGENTS.md`) | 처분 | 설치 뒤 자리 |
| --- | --- | --- | --- |
| 1 | 저장소 · 사이트 · `base` · 링크는 `BASE_URL` 기준 | 조문 | R `R-BLOG-BASE-URL`(check-posts W7 · 경고 → 일부) |
| 2 | 글 만들기 `npm run new` | 흐름 | W 루트 플로우 0 sync |
| 3 | 메뉴 · 분류 정본 `site.config.mjs` | 조문 | R `R-BLOG-TAXONOMY`(스키마 refine = 빌드) |
| 4 | push 하지 않음 · main push = 공개 배포 | 조문 + 흐름 | W §레인 선 · 배포 = 사람 |
| 5 | 커밋 전 build 통과 | 흐름 | W §완료 기준 · localci |
| 6 | 커밋 메시지 접두어 | 안내 | WRITING_GUIDE(그대로) · W 가리킴 |
| 7 | 받은 문서는 blog-write — 내용 그대로 | 조문 + 흐름 | R `R-BLOG-VERBATIM`(import 대조 · smartPunctuation false) · W Subflow |
| 8 | 취재 글은 blog-compose | 흐름 | W 루트 플로우(글 한 편) |
| 9 | 팀원 · 프로젝트는 실존 정보 — 지어내지 않음 | 조문(간극) | R `R-BLOG-REAL-PEOPLE`(리뷰 · 검사 범위 밖 → 간극 행) |
| 10 | 새 글 `draft: true` · «발행» 은 사용자 말만 | 조문 + 흐름 | W 정지점 · R `R-BLOG-DRAFT` |
| 11 | `gh api` 저장소 설정 변경은 사용자 확인 | 조문 | R §바깥 접점(S4) |
| 12 | 초안 완성 순서(작성 → 용어 → SEO · GEO → 초안) | 흐름 | W 루트 플로우 4 ~ 6 |
| 13 | 검색 · AI 전달 check:seo | 조문 | R `R-BLOG-SEO`(초안 0 · 0 / 발행 오류 0) |
| 14 | 토큰 · 비밀값을 파일 · 채팅에 남기지 않음 | 조문 | R `R-BLOG-PUBLIC-SAFE`(check-posts P1 ~ P5 와 한 조문) |
| 15 | 스타일은 디자인 토큰으로만 · 다크 모드 없음 | 조문 둘 | R `R-BLOG-TOKENS`(check-tokens R1 ~ R3) · 지향 «다크 모드 없음»(사용자 2026-09-29) |

- 조문 이름은 4 SDD 의 후보다(합의 전). 스킬 넷은 절차로 남기고 MUST 줄은 헌법으로 옮겨 스킬이 헌법을 가리키게 한다(선배 대조 권고 W).
- 같은 커밋 동기화 둘(`WRITING_GUIDE` ↔ 글쓰기 규칙 · `tokens.css` ↔ `design-tokens.md`) — 술어 없음 → «일부 + 주인 · 확인 때».

## 감사 (2b)

(분모 표 대조 — canon 칸 전수 존재 · kind 영역 빠짐 · 선배 대조 결과를 여기 적는다)

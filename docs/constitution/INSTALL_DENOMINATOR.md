# 헌법 설치 2 Architecture — 설치 분모 표 (blog · 전수)

- 원천: canon **0.44.0** · web-kind **0.1.0** · 레포 `docs/constitution-setup`(원천 `main`＠16cb73c).
- **선언 판 없음 · 기준선 없음 → 분모 = 전수**(C246 ⑴ ⑵). 틀은 보급과 설치 플레이북의 63 행(`desks/guide/pages/content-reinstall-0.44.0.md` §1)을 그대로 깔고, kind 행은 web-kind 규칙 1 ~ 7 로 바꿨다. 행을 빼지 않는다. 값이 없는 칸은 «공란 + 까닭 + 주인 · 확인 때»(C246 ⑶).
- 셈: canon 칸 = `WORKFLOW.md` 칸 목록 17 + 칸 18(PENDING) · `RULES.md` M1 ~ M9 + M1-S + 지향 + telemetry + §0-1 ⑤ · `SUPERVISOR.md` 절 17 · 공용 넷 · kind 7 · 바탕 9 = **H1 1 + W 18 + S 13 + V 17 + C 4 + K 7 + B 9 = 69 행.**
- 칸 «지금» 은 설치 전 blog 실측(헌법 0 이라 거의 «없다»), «설치 뒤 자리» 는 7 Execute 가 세울 곳이다. 문서 이름 약자 — W = `docs/constitution/WORKFLOW.md` · R = `RULES.md` · A = `AMENDMENT.md` · CL = `CHANGELOG.md` · ADR = `docs/adr/…`.

## 1. 분모 표

| 행 | 칸 | 등급 | 지금(blog) | 설치 뒤 자리 | 집행 | 주인 · 확인 때 | 메모 · 처분 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H1 | 판 표지 canon 0.44.0 · web-kind 0.1.0 | MUST | 없다 | W · R 머리 한 줄 · `AGENTS.md` 판 포인터 | 확인기 정규식(보급과) | 설치 레인 · 7 Execute | 0.45.0 공포 뒤 판 올림 |
| W1 | 칸 1 `wf.layer` 흐름 층 | MUST | 없다 | W §흐름 층 — Subflow ⊂ Business Flow(글 한 편) ⊂ Supervisor · 감독 레인 «설치 PASS 뒤» | 리뷰 | 설치 레인 · 7 Execute | 사용자 합의 2026-11-23 |
| W2 | 칸 2 `wf.bf-stages` 단계 · 정지점 | MUST | 일부 — `blog-compose` 다섯 단계 · AGENTS.md 초안 순서 줄 | W §루트 플로우 «글 한 편»(0 sync ~ 8 검증 · 정지점 = 사용자 «발행») | 리뷰 + check:seo · build | 설치 레인 · 7 Execute | 대응표는 `INSTALL_PLAN.md` §사용자 결정 |
| W3 | 칸 3 `wf.layout` 문서 자리 | MUST | 일부 — 글 = `src/content/blog/<slug>/` · 조사 = `../blog-notes/`(저장소 밖) | W §문서 자리 — BF 대상 폴더 = `src/content/blog/<slug>/` · 전역 `docs/` 허용 목록 | 리뷰 | 설치 레인 · 7 Execute | 사실 확인 표는 저장소 밖 유지 |
| W4 | 칸 4 `wf.roles` 역할 · 등급 | MUST | 없다 | W §역할 | 리뷰 | 설치 레인 · 7 Execute | canon 표 가리킴 |
| W5 | 칸 5 `wf.done` 완료 기준 · 변경 책임 | MUST | 일부 — «커밋 전 build 통과» · 초안 순서 · PR 은 `check.yml`(npm run build) | W §완료 기준 — 초안 = build · wording · seo 0 · 사실 확인 닫힘 / 발행 = build · check:seo 오류 0 | localci · check:* | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| W6 | 칸 6 `wf.lane-line` 레인 선 | MUST | 없다 — 통합선 없음 · 기준은 main 하나(가지 13 · Survey §5) | W §레인 선 — base `main` · 통합선 `main-cicd` · 레인 가지 `post/<slug>` · `docs/<slug>` 등 | localci | 설치 레인 · 7 Execute | 판정 T-002697 |
| W7 | 칸 7 `wf.audit-loop` 감사 고리 | MUST | 일부 — 사실 확인 회차(R1 · R2) | W §감사 — 사실 확인 회차 = 감사 · 상한 · 합격선 | 리뷰 | 설치 레인 · 7 Execute | 값은 7 Execute 전 합의 |
| W8 | 칸 8 `wf.supervisor` | MUST | 없다 | W §감독 → SUPERVISOR 절(V 행) | 리뷰 | 설치 레인 · 7 Execute | 감독은 PASS 뒤 |
| W9 | 칸 9 `wf.kickoff` 착수 3문 | MUST | 없다 | W §착수 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| W10 | 칸 10 `wf.human-decision` | MUST | 일부 — «분류가 애매하면 묻는다» · «발행은 사용자» | W §사람 결정 길 | 리뷰 | 설치 레인 · 7 Execute | canon 그대로 |
| W11 | 칸 11 `wf.metrics` 지표 | MUST | 없다 | W §지표 — BF 층 열둘(축마다 셋) · SUBF 층 | 안 잼 행 표기 | 설치 레인 · 7 Execute | C246 ⑷ — 층마다 행은 세운다 |
| W12 | 칸 12 `wf.seam-rules` 이음매 | MUST | 없다 | W → R 섹터 맵(S7) 가리킴 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| W13 | 칸 13 `wf.systems` 공용 시스템 | MUST | 없다 | W §시스템 — svts · localci 단계 표 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| W14 | 칸 14 `wf.receive` 개정 수신 | MUST | 없다 | W §개정 수신 · A §5 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| W15 | 칸 15 `wf.verify` 실환경 검증 | MUST | 일부 — dev 서버 미리보기 · 공개 페이지 확인 · 배포 `deploy.yml` | W §검증 — V0 build · V1 3310 ~ 3319 · V2 3300 · V3 사람 push 뒤 공개 페이지 | localci · 리뷰 | 설치 레인 · 7 Execute | 포트는 판정 · SYSTEMS 표 행 청(민원과) |
| W16 | 칸 16 `wf.subflow` Subflow 계약 | MUST | 없다 | W §Subflow 계약 표 — 조사 요청 · 다시 세기 · 그림 · 사실 확인 · 용어 · SEO 등 | 선언 수 = 행 수 가드 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| W17 | 칸 17 `wf.collab` 협업 | MUST | 일부 — 원천 세션 조사 · 사실 확인(다른 저장소 읽기만) | W §협업 — 블로그는 코어가 아님 · 원천 레포 가리킴 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| W18 | 칸 18 `wf.install` (PENDING · 지금 효력) | MUST | 진행 중 | 이 설치 · W §설치 가리킴 | 감수 ② | 설치 레인 · 8 검증(감수 ② PASS) | 설치 레인이 세움 |
| S1 | M1 `rules.layer` 계층 · 의존 | MUST | 없다 | R 몸통 — K2 와 한 절 | 가드 후보 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| S2 | M1-S `rules.layer-body` | MUST(server 만) | 해당 없음 | — | — | — (해당 없음) | 해당 없음 — web kind · server 몸통 없음 |
| S3 | M1 지향 기본값 | MUST | 없다 | R §지향 — K6 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| S4 | M2 `rules.boundary` 바깥 접점 | MUST | 일부 — GitHub Pages · Giscus · GA · 원천 레포 | R §바깥 접점 | 리뷰 | 설치 레인 · 7 Execute | 사용자 확인: `gh api` 설정 변경 |
| S5 | M3 `rules.enforce-line` | MUST | 없다 | R §조문 꼴(조문마다 집행 한 줄) | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| S6 | M4 `rules.guard-entry` | MUST | 일부 — 로컬 `npm run check`(tokens · posts · astro check) · PR `check.yml` | R §가드 진입점 + `scripts/localci.sh` | localci | 설치 레인 · 7 Execute | check:wording · seo 를 들일지 4 SDD |
| S7 | M5 `rules.sector-map` | MUST | 없다 | R §섹터 맵(워크플로우 대응 열) | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| S8 | M6 `rules.blank` 빈칸 | MUST | 없다 | R §빈칸 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| S9 | M7 `rules.logging` | MUST | 없다 | R §로그 — «안 정함 · 정적 사이트 · 빌드 로그만» | 리뷰 | 설치 레인 · 7 Execute | 자리 MUST |
| S10 | M8 `rules.errors` | MUST | 일부 — 404 페이지 · check 오류 / 경고 | R §오류 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| S11 | M9 `rules.structure-graph` | MUST | 없다 | R 몸통 첫 절 개관 그래프 | 노드 = 코드 대조 | 설치 레인 · 7 Execute | «안 정함» 없음 |
| S12 | `rules.telemetry`(M 밖) | M 밖 | 일부 — GA(`site.config.mjs`) | R §텔레메트리 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| S13 | §0-1 ⑤ 구조 칸 실물 분모 | MUST | 없다 | R — 역할 목록 셈 명령 · 기준 ref · 양성 대조 | 명령 | 설치 레인 · 7 Execute | K7 과 같은 셈 |
| V1 | SUPERVISOR §1 정의 | MUST | 없다 | W §감독(통합형 절) | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 감독 레인은 PASS 뒤 — 절은 설치가 세움 |
| V2 | §1-4 참조 그림 | SHOULD | 없다 | W §감독 그림 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V3 | §2 구성요소 · 소유 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V4 | §3 책임 · 범위 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V5 | §4-1 BF 생애 흐름 | MUST | 없다 | W §감독 — 글 한 편 생애 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V6 | §4-2 매일 도는 흐름 일곱 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V7 | §4-3 병렬 · 직렬 마감 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V8 | §4-4 점호 보고 양식 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V9 | §5 활용 의무 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V10 | §5-1 사람 청은 티켓 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V11 | §5-2 줄의 상태 넷 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V12 | §6 넘김 형식 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V13 | §7 반환 성능 칸 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V14 | §7-1 진단 지표 | MUST | 없다 | W §지표(W11) 가리킴 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V15 | §8 개정 · 공포 경계 | MUST | 없다 | W §감독 · A | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V16 | §9 감독 없는 레포의 과도 | MUST | **해당** — 감독 없음 | W §감독 — «설치 PASS 뒤 연다(C237 ⑴) · 그때까지 이 세션이 받음» | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| V17 | §10 레포가 정하는 것 | MUST | 없다 | W §감독 | 리뷰 | 설치 레인 · 7 Execute(절) · 감독 레인은 PASS 뒤 | 설치 레인이 세움 |
| C1 | SYSTEMS 공용 시스템 | MUST | 없다 | W §시스템(W13) | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| C2 | TICKETS | MUST | 일부 — 명부 자리 bind | W §시스템 | svts | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| C3 | WORKTREE(분모 밖 · 한 줄) | MUST | 없다 | W §레인 선 한 줄 | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| C4 | canon AMENDMENT | MUST | 없다 | A(레포 개정 절차) | 리뷰 | 설치 레인 · 7 Execute | 설치 레인이 세움 |
| K1 | web 규칙 1 꼴 — 첫 몸통 절 = «현재 1» | MUST | 없다 | R 범위 다음 첫 절 | 절 차례 대조(가드 후보) | 설치 레인 · 7 Execute | 걸림 — 화면 코드 있음 |
| K2 | 규칙 2 현재 1 어디에 두나 — 역할 처분 0 | MUST | 없다 | R 현재 1 표 — pages · layouts · components · lib · styles · data · content(blog · team · projects) · scripts · 뿌리 설정 | 폴더 목록 ↔ 표 대조 | 설치 레인 · 7 Execute | 걸림 — 화면 코드 있음 · 셈법: `git ls-tree -r --name-only <ref> src scripts` 폴더 목록 ↔ 현재 1 표 · 분모는 K7 셈 |
| K3 | 규칙 3 현재 2 어떻게 만드나 | MUST | 일부 — 토큰 · 글 생성(new-post) · 그림(make-charts) | R 현재 2 | 리뷰 | 설치 레인 · 7 Execute | 걸림 — 화면 코드 있음 |
| K4 | 규칙 4 현재 3 어떻게 시험하나 | MUST | 일부 — astro check · check:* · 브라우저 확인 | R 현재 3 — 단위 시험 없음 · 무엇을 대체하나 | 리뷰 | 설치 레인 · 7 Execute | 걸림 — 화면 코드 있음 |
| K5 | 규칙 5 현재 4 옆과 잇기 | MUST | 일부 | R 현재 4 — (가) 서버 계약 «해당 없음 · 정적» (나) 오류 → 404 · 빌드 실패 (다) 상태 «클라이언트 상태 거의 없음 · Giscus 외부» | 리뷰 | 설치 레인 · 7 Execute | 서버 · 인증 · 상태 칸 = 해당 없음 + 까닭(판정) |
| K6 | 규칙 6 지향 · 간극 | MUST | 일부 — «다크 모드 없음»(사용자 2026-09-29) | R 지향(출처 한 줄) · 간극 행 | 리뷰 | 설치 레인 · 7 Execute | 걸림 — 화면 코드 있음 · 지향은 출처 한 줄 |
| K7 | 규칙 7 gate 분모는 코드 | MUST | 없다 | R — 역할 목록 명령 · 수 · 기준 ref | 명령 | 설치 레인 · 7 Execute | 걸림 — 화면 코드 있음 · 셈법 K2 와 같음 · 기준 ref = 심사 sha · S13 과 같은 셈 |
| B1 | 등록부 행 | 바탕 | 있다 — `targets.yaml` blog | W 머리 가리킴 | 민원과 | 민원과 · 6 DoD 전 재확인 | layout = 통합형(제정 때 확정) |
| B2 | 명부 자리 | 바탕 | 있다 — `blog code-main / constitution-setup` | W §시스템 | 민원과 | 민원과 · 6 DoD 전 재확인 | 설치 레인이 세움 |
| B3 | 통합선 가지 `main-cicd` | 바탕 | 없다 | W §레인 선 | 첫 착지 | 설치 레인 · 7 Execute(첫 착지) | 설치 레인이 세움 |
| B4 | 원장 줄 | 바탕 | 확인 전 | — | 민원과 · tool | 민원과 · tool · 감독이 선 뒤 첫 점호 | 공란 — 까닭: 원장 줄은 harness 쪽 장부라 이 레인은 읽기만 · 자리 불요(분모 행) · 감독이 선 뒤 첫 점호에서 확인(처음 «6 DoD 전» 은 지났다 · 감수 ② 정정 7) |
| B5 | 러너 프로필 | 바탕 | 확인 전 | — | tool | tool · 6 DoD 전 | 공란 — 까닭: 러너 프로필(linestore 등)은 tool 설정 · 자리 불요(분모 행) · 〃 |
| B6 | 레포 가드 선언 `localci_guards` | 바탕 | 없다 | `scripts/localci.sh` | localci | 설치 레인 · 7 Execute | 4 SDD |
| B7 | 기계 전제 | 바탕 | 있다 — node 24.22 · npm 11.6 · astro 7.3.2 | W §검증 | Survey §4 | 설치 레인 · 1 Survey 확인됨 · 간극 행은 7 Execute | node 판 적힌 곳 불일치 → 간극 행 |
| B8 | 전역 정지 · 문서 큐 | 바탕 | 확인 전 | — | tool | tool · 감독이 선 뒤 첫 점호 | 공란 — 까닭: 전역 정지 · 문서 큐 통과는 착지할 때만 잴 수 있음 · 막히면 tool 결함 티켓 · 감독이 선 뒤 첫 점호에서 확인(처음 «7 Execute» 는 지났다 · 감수 ② 정정 7) |
| B9 | 지침 판 포인터 | 바탕 | 없다 | `AGENTS.md`(= `CLAUDE.md`) 머리 | 확인기 | 설치 레인 · 7 Execute | 설치 레인이 세움 |

**셈**(스크립트로 다시 셈): 69 행 · 지금 있다 3 · 일부 16 · 없다 44 · 해당 없음 1(S2) · 해당 1(V16) · 확인 전 3 · 진행 중 1(W18) · 빈 칸 0(주인 · 확인 때 열 포함 · 메모 열도 채움).

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

| 16 | 머리 «Development» — `astro dev --background` 로 dev 서버 | 흐름(바꿈) | W §검증 V1 — 전역 규칙 «dev 서버를 직접 띄우지 않는다 · 큐로» 와 맞춰 고침(localci · 미리보기 포트 3310 ~ 3319) |
| 17 | 절 머리 «설정 · 절차 전체는 `docs/claude-management.md` · 글쓰기 정본 WRITING_GUIDE» | 안내 | `docs/claude-management.md` 는 안내 문서로 남기고 W 가 가리킴 · 헌법과 겹치는 절은 헌법을 가리키게 고침(7 Execute) |

간극 행(술어 없음 · 잣대 ②):

| 간극 | 주인 | 확인 때 |
| --- | --- | --- |
| 같은 커밋 동기화 ① `WRITING_GUIDE` ↔ 글쓰기 규칙(R) | 설치 레인 → 상설 헌법 레인 | 첫 글쓰기 규칙 개정 때 |
| 같은 커밋 동기화 ② `src/styles/tokens.css` ↔ `docs/design-tokens.md` | 설치 레인 → 글 · 코드 레인 | 첫 토큰 변경 때 |
| 실존 인물 자료 검사 범위(`check-posts` 가 `team` · `projects` 를 안 읽음) | 설치 레인 → 상설 도구 레인 | 7 Execute 뒤 첫 도구 개정 |
| node 판 적힌 곳 불일치(README · engines 22.12 · `.nvmrc` · deploy 24) | 설치 레인 | 7 Execute |

- 조문 이름은 4 SDD 의 후보다(합의 전). 스킬 넷은 절차로 남기고 MUST 줄은 헌법으로 옮겨 스킬이 헌법을 가리키게 한다(선배 대조 권고 W).
- 같은 커밋 동기화 둘(`WRITING_GUIDE` ↔ 글쓰기 규칙 · `tokens.css` ↔ `design-tokens.md`) — 술어 없음 → «일부 + 주인 · 확인 때».


## 3. 설치 뒤 자리 — 6 DoD 관문 (레인 가지 a07e4ea 기준 · 설치 기록 · 갱신 안 함)

셈: 행 id 마다 그 절 머리의 경로:줄(파이썬 — 문서 머리 정규식 대조). 기준 ref = 레인 가지 `docs/constitution-setup`＠a07e4ea.

- **이 절은 설치 때의 기록이다 — 줄 번호를 따라 고치지 않는다.** 그 뒤 개정으로 46 행(W3 ~ W18 · V1 ~ V17 · S4 · S6 ~ S8 · S10 · S12 · S13 · K7 · B6 · C1 ~ C3 · B7)의 줄이 움직였다(보급과 감수 ② 정정 1 · `main-cicd`＠0af4d7c 기준). 지금 자리는 같은 셈(절 머리 대조)을 그 sha 에서 다시 돌려 얻는다. 절은 모두 있다.
- 기록 당시의 잘못 둘은 아래 행에서 바로잡았다 — B7(CI/CD 표 줄을 가리켰음) · B8(본문에 없는 «PAUSED» 를 근거로 적었음).

| 행 | 설치 뒤 |
| --- | --- |
| H1 | 있다 — `RULES.md:3` |
| W1 | 있다 — `WORKFLOW.md:7` |
| W2 | 있다 — `WORKFLOW.md:17` |
| W3 | 있다 — `WORKFLOW.md:47` |
| W4 | 있다 — `WORKFLOW.md:59` |
| W5 | 있다 — `WORKFLOW.md:63` |
| W6 | 있다 — `WORKFLOW.md:75` |
| W7 | 있다 — `WORKFLOW.md:87` |
| W8 | 있다 — `WORKFLOW.md:92` |
| W9 | 있다 — `WORKFLOW.md:96` |
| W10 | 있다 — `WORKFLOW.md:100` |
| W11 | 있다 — `WORKFLOW.md:106` |
| W12 | 있다 — `WORKFLOW.md:119` |
| W13 | 있다 — `WORKFLOW.md:123` |
| W14 | 있다 — `WORKFLOW.md:132` |
| W15 | 있다 — `WORKFLOW.md:136` |
| W16 | 있다 — `WORKFLOW.md:147` |
| W17 | 있다 — `WORKFLOW.md:162` |
| W18 | 있다 — `WORKFLOW.md:166` |
| S1 | 있다 — `RULES.md:53` |
| S2 | 해당 없음 — web kind · server 몸통 없음(RULES.md §4 (가)) |
| S3 | 있다 — `RULES.md:97` |
| S4 | 있다 — `RULES.md:174` |
| S5 | 있다 — `RULES.md:112` |
| S6 | 있다 — `RULES.md:192` |
| S7 | 있다 — `RULES.md:196` |
| S8 | 있다 — `RULES.md:206` |
| S9 | 있다 — `RULES.md:186` |
| S10 | 있다 — `RULES.md:187` |
| S11 | 있다 — `RULES.md:13` |
| S12 | 있다 — `RULES.md:188` |
| S13 | 있다 — `RULES.md:210` |
| V1 | 있다 — `WORKFLOW.md:176` |
| V2 | 있다 — `WORKFLOW.md:177` |
| V3 | 있다 — `WORKFLOW.md:178` |
| V4 | 있다 — `WORKFLOW.md:179` |
| V5 | 있다 — `WORKFLOW.md:180` |
| V6 | 있다 — `WORKFLOW.md:181` |
| V7 | 있다 — `WORKFLOW.md:182` |
| V8 | 있다 — `WORKFLOW.md:183` |
| V9 | 있다 — `WORKFLOW.md:184` |
| V10 | 있다 — `WORKFLOW.md:185` |
| V11 | 있다 — `WORKFLOW.md:186` |
| V12 | 있다 — `WORKFLOW.md:187` |
| V13 | 있다 — `WORKFLOW.md:188` |
| V14 | 있다 — `WORKFLOW.md:189` |
| V15 | 있다 — `WORKFLOW.md:190` |
| V16 | 있다 — `WORKFLOW.md:191` |
| V17 | 있다 — `WORKFLOW.md:192` |
| C1 | 있다 — `WORKFLOW.md:123` |
| C2 | 있다 — `WORKFLOW.md:127` |
| C3 | 있다 — `WORKFLOW.md:85` |
| C4 | 있다 — `AMENDMENT.md:28` |
| K1 | 있다 — `RULES.md:11` |
| K2 | 있다 — `RULES.md:53` |
| K3 | 있다 — `RULES.md:73` |
| K4 | 있다 — `RULES.md:82` |
| K5 | 있다 — `RULES.md:91` |
| K6 | 있다 — `RULES.md:97` |
| K7 | 있다 — `RULES.md:210` |
| B1 | 있다 — harness `targets.yaml` blog 행(민원과) |
| B2 | 있다 — 명부 `blog code-main / constitution-setup` bound |
| B3 | 있다 — `main-cicd` 섰음(2026-11-23 첫 착지 `c8630ba` · 원천 `main@16cb73c`) |
| B4 | 집행 대기 — 원장 줄은 감독이 선 뒤(감독 레인 PASS 뒤 · 주인 민원과) |
| B5 | 있다 — `localci gate` kind=web 무게 기록(러너 프로필 동작 · 2026-11-23) |
| B6 | 있다 — `RULES.md:192` |
| B7 | 있다 — `SURVEY.md:57-59`(§4 기계 전제 표 · 고침: 처음엔 W 의 CI/CD 표 줄을 가리켰다) |
| B8 | 일부 — 전역 정지 · 문서 큐는 레포 밖(tool 소유)이라 이 레포 본문에 근거가 없다 · 게이트는 돌았음(rc 0) · 착지가 막히면 tool 결함 티켓(canon C221) · 고침: 처음엔 본문에 없는 «PAUSED 있음» 을 적었다 |
| B9 | 있다 — `AGENTS.md:20` |

## 감사 (2b)

- 독립 서브에이전트 대조(읽기 전용 · 2026-11-23): A0 canon 칸 빠짐 0(SUPERVISOR 제목 17 전부) · K1 ~ K7 · B1 ~ B9 있음 · «지금» 13 행 표본 모두 사실 · 셈 69 일치.
- 막음 3 → 반영: ① 주인 · 확인 때 열 추가(전 행) ② 메모 빈 칸 채움 ③ B4 · B5 · B8 까닭 · 자리 불요 명시.
- 권고 반영: K 행 걸리는 조건 · 셈법 · W5 · W15 · S6 에 CI 보강 · W6 문구 · 처분 표 16 · 17 행 · 간극 행 넷.
- 선배 대조(잣대 ⑤): web 선배 = old_person(main-cicd＠1bc7688 · 보급과 peer-learn 대조) — 분모 틀 행 종류 빠짐 0(content 재설치 63 행 틀의 K 한 행을 web 규칙 7 행으로 바꾼 꼴). 행 대 행 맞대기는 6 DoD 관문에서 보급과 감수가 다시 잰다.
- 막음 0.

# ADR-0001 — 헌법 도입 — canon 0.44.0 · web-kind 0.1.0 첫 설치

- **상태**: 제안(법제처 심사 전)
- **날짜**: 2026-11-23
- **범위**: RULES · WORKFLOW · AMENDMENT(첫 설치 — 셋 다)
- **관련**: `docs/constitution/CHANGELOG.md` 첫 줄 · 착수 티켓 T-002701 · 편입 판정 T-002697 · 선배 대조 권고 T-002698 · 설치 기록 `docs/constitution/INSTALL_PLAN.md` · `SURVEY.md` · `INSTALL_DENOMINATOR.md` · `INSTALL_BDD.md` · `INSTALL_SDD.md`

## Context — 발단

- 사용자 지시(2026-11-23 · CTO 레인 창 경유 · IN-7003): «블로그로 작성할수 있도록 블로깅에 전달해줘» · «거기 감독을 세우라고 하고, 헌법을 세우게 하고 전달하자». 같은 날 이 세션에서 «너도 감독레인을 만들고 지금 까지 했던 블로그 작성 플로우를 루트 플로우로 만들자».
- 이 저장소에는 헌법이 없었다(`docs/constitution/` 0 · harness 등록부에 없음). 규범은 다섯 곳에 흩어져 있었다 — `AGENTS.md`(= `CLAUDE.md`) 운영 규칙 15 줄 · `WRITING_GUIDE.md`(711 줄) · `docs/design-tokens.md` · 스킬 넷(`blog-compose` · `blog-write` · `blog-wording` · `blog-seo`) · 검사 스크립트 넷(Survey §3 · 셈은 그 절).
- 그래서 생긴 일(실측):
  - 사용자 결정 «다크 모드 안 함»(2026-09-29)이 `AGENTS.md` 한 줄로만 남아 까닭 · 대안이 기록 밖이었다.
  - 스킬에 MUST 가 있어 스킬을 고칠 때 개정 절차를 지나지 않았다.
  - `check:wording` 은 위반이 있어도 항상 exit 0 · `npm run new` 는 기본이 `draft: false` 라 «새 글은 초안» 규칙과 도구가 어긋났다(4b 감사 · `scripts/new-post.mjs:13`).
  - 일하는 길이 «Claude 가 main 에 바로 커밋 · 사용자가 push(= 공개 배포)» 라 레인 착지선과 배포선이 같았다.
- 편입 판정(법제처 T-002697): kind web · id `R-BLOG-` · base `main` · 통합선 `main-cicd` · 배포 = 사람.

## 논의된 대안

| 안 | 내용 | 장점 | 단점 | 판정 |
| --- | --- | --- | --- | --- |
| A | canon 칸 전수(69 행)를 분모로 헌법 넷을 세우고, 기존 규범을 처분 표로 헌법에 들인다(지우지 않음) | 빠짐이 분모로 드러남 · 이미 도는 규칙과 검사가 그대로 집행 줄이 됨 | 첫 설치 분량이 큼 | **채택** |
| B | 규범은 스킬 · 안내 문서에 두고 헌법은 포인터만 둔다 | 작업이 적음 | 스킬 · 안내를 고칠 때 개정 절차를 지나지 않음 — 지금 문제 그대로 | 기각 — 발단의 문제가 남음 |
| C | `main` 을 통합선으로 쓴다(지금처럼 main 에 바로 착지) | 가지가 하나라 단순 | `main` push = 공개 배포라 착지선과 배포선이 같음 · 판정 T-002697 과 다름 | 기각 — 판정 · 선배 대조 권고 |
| D | 선배 저장소(web · content)의 헌법 문장을 옮겨 온다 | 빠름 | 동의하지 않은 규범을 떠안음 · 출처 ADR 번호가 딸려 옴 | 기각 — canon 들어오는 길 «X 처럼» 은 결정만 · 문장은 옮기지 않음 |
| E | 감독 레인을 지금 연다(사용자 첫 지시) | 빨리 섬 | 헌법이 서기 전 감독이 옛 규칙을 읽는 문제(content 실례 · canon C237) | 기각 — 사용자 선택 «설치 PASS 뒤에» |

## 토론 히스토리

- **사용자**: «너도 감독레인을 만들고 지금 까지 했던 블로그 작성 플로우를 루트 플로우로 만들자» → 에이전트가 canon C237 ⑴(감독은 설치 PASS 뒤)과 부딪힘을 짚고 물음 → **사용자 선택 «설치 PASS 뒤에»**. 감독 절은 이번 설치가 세우고(§감독 · 과도), 감독 레인은 PASS 뒤.
- **에이전트**: 블로그 작성 흐름을 canon 칸 2 단계에 대응시키는 표를 제안(정지점 = 사용자 «발행» · Execute = 발행) → **사용자 «좋아 그대로 가자»** — 일하는 길(레인 가지 → `main-cicd` → 사용자 main 머지 · push)도 함께 받음.
- **에이전트**: 조문 후보 12 + 지향 «다크 모드 없음» · 글 레인 게이트에 `check:seo` · `check:wording` · `docs/claude-management.md` 처분을 물음 → **사용자 셋 다 추천안 채택**(이대로 · 게이트에 넣기 · 안내로 남기고 헌법이 가리킴).
- **독립 감사(1b · 2b · 4b)**: 셈 기준 ref 섞임 · 주인 · 확인 때 열 없음 · `check:wording` exit 0 · `new-post` 기본값 · 뿌리 파일 처분 빠짐 등 막음 13 → 모두 반영(각 단계 문서 §감사). 막음 반영으로 `check-wording` · `check-seo` 에 `--strict` · `new-post` 기본 `draft: true` · 가드 둘과 짝 시험을 같은 설치에 넣음.
- **합의 지점**: 안 A · 일하는 길 · 루트 플로우 대응 · 조문 12 + 지향 1 · 게이트 · 감독은 PASS 뒤.

## Decision

1. `docs/constitution/{RULES,WORKFLOW,AMENDMENT,CHANGELOG}.md` · `docs/adr/{TEMPLATE.md,constitution/,workflow/}` 를 세운다(통합형). 판 줄 canon 0.44.0 · web-kind 0.1.0.
2. RULES 몸통 첫 절 = 현재 1(개관 그래프 · 층 처분 표) · 글 규칙 `R-BLOG-*` 12 · 지향 «다크 모드 없음»(출처 사용자 2026-09-29) · 간극 행 다섯.
3. WORKFLOW 루트 플로우 «글 한 편»(0 sync ~ 8 검증 · 정지점 = 사용자 «발행») · 코드 변경은 표준 단계 · Subflow 계약 8 행 · 레인 선(base `main` · 통합선 `main-cicd` · 레인 가지 `<kind>/<slug>`) · 감독 절(과도 = 지금 해당).
4. 게이트 `scripts/localci.sh` — `npm ci --no-audit --no-fund` → `npm run build`(PR `check.yml` 과 같음) · 가드(check-tokens · check-posts · layer · base-url · 짝 시험) · 글 레인 덧(`check:seo --strict` · `check:wording --strict` · 발행 기준 `check:seo`).
5. 도구 손봄 셋: `check-wording --strict` · `check-seo --strict` · `new-post` 기본 `draft: true`(`--publish` 로만 false).
6. 기존 규범은 처분 표(`INSTALL_DENOMINATOR.md` §2 · 17 줄)대로 — `AGENTS.md` 는 포인터로 줄이고, 스킬 넷 · 안내 문서는 헌법을 가리킨다.

## Consequences

- 일하는 길이 바뀐다: Claude 는 레인 가지에서 일하고 `main-cicd` 에 착지한다. `main` 머지 · push 는 사용자(= 공개 배포).
- 글 초안의 완료 기준이 사람 손에서 게이트로 간다 — `--strict` 로 경고도 막는다. 옛 글을 고치면 그 글의 경고도 0 이어야 착지한다(옛 글 일곱의 «## 한 줄로» 경고는 별도 레인 `edit/seo-summaries` 에 있음 — 사용자 처분 대기).
- 감독 레인은 설치 감수 ② PASS 뒤 민원과가 사용자에게 묻고 연다.
- 남는 간극(`RULES.md` §5): check-posts 검사 범위 · 분류 하드코딩 · 같은 커밋 동기화 둘 · node 판 · check-tokens 범위.
- **반영 대상**: `RULES.md` ✅ · `WORKFLOW.md` ✅ · `AMENDMENT.md` ✅ · `CHANGELOG.md` ✅ · `AGENTS.md`(= `CLAUDE.md`) ✅ · 스킬 넷 ✅ · `docs/claude-management.md` ✅ · `scripts/` ✅
- **분모 대조**: 설치 분모 표 69 행 — `INSTALL_DENOMINATOR.md` §1(기준선 없음 → 전수 · C246 ⑴). 착지 뒤 상태 갱신은 6 DoD 관문에서.

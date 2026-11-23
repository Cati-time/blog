# 헌법 설치 4 SDD — 헌법 문서 설계 (blog · 합의 전)

- 기준: 레인 `docs/constitution-setup`＠7beaa47 · 분모 `INSTALL_DENOMINATOR.md` 69 행 · 장면 `INSTALL_BDD.md`.
- 🔶 **조문 문면은 사용자 합의 뒤에 쓴다**(business-flow §3). 이 문서는 «무엇을 어디에 · 무엇으로 집행» 설계다.

## 1. 세울 파일

| 파일 | 내용 | 분모 행 |
| --- | --- | --- |
| `docs/constitution/WORKFLOW.md`(통합형) | 머리(판 표지 · 인스턴스 줄 · 개정 수신 자리) → 흐름 층 → **루트 플로우 «글 한 편»** → Subflow 계약 표 → 완료 기준 → 감사 고리 → 레인 선 → 문서 자리 → 검증 사다리 → 사람 결정 길 → 역할 → 착수 → 지표 → 시스템 → 협업 → 감독(과도 포함) → 개정 수신 → 설치 | H1 W1 ~ W18 V1 ~ V17 C1 ~ C3 |
| `docs/constitution/RULES.md` | 머리(판 줄 canon · web-kind · 범위) → **몸통 현재 1 ~ 4**(개관 그래프 · 층 표 · 만드는 법 · 시험 · 잇기) → 지향 · 간극 → 글 규칙(R-BLOG-*) → 바깥 접점 → 로그 · 오류 · 텔레메트리 → 거버넌스(조문 꼴 · 가드 진입점 · 섹터 맵 · 빈칸) | H1 S1 ~ S13 K1 ~ K7 |
| `docs/constitution/AMENDMENT.md` | 개정 절차(제안 → 합의 → ADR → CL → 반영 → 지침 동기화) · 미러 규칙(`AGENTS.md` = `CLAUDE.md` 심링크) · 개정 수신 §5 | C4 W14 |
| `docs/constitution/CHANGELOG.md` | 변경 색인(날짜 · 변경 · ADR) | C4 |
| `docs/adr/TEMPLATE.md` · `docs/adr/constitution/` · `docs/adr/workflow/` | ADR 틀(Context · 대안 · 토론 · Decision · Consequences) · 첫 ADR «헌법 도입» | C4 |
| `scripts/localci.sh` | `LOCALCI_KIND=web` · `localci_ci` = `npm ci` → `npm run build`(PR `check.yml` 과 같은 명령 · 두 벌 금지) · `localci_guards` 아래 §4 | S6 B6 |
| `AGENTS.md`(= `CLAUDE.md`) | 머리에 판 포인터 · «헌법 위치 + 단독 편집 금지 → AMENDMENT» · 운영 규칙 15 줄은 처분대로 줄임 | B9 |
| 스킬 넷 | 절차는 남기고 MUST 줄은 헌법 조문을 가리키게 고침 | W2 W16 |

## 2. RULES 몸통 — 현재 1 어디에 두나 (K2 · 실측 7beaa47)

셈: `git ls-tree -r --name-only 7beaa47 src scripts public` · 역할 처분 안 된 것 0 이 목표.

| 층 · 역할 | 폴더 | 파일 | 책임 | 의존 가능 |
| --- | --- | --- | --- | --- |
| route(페이지) | `src/pages/` | 13 | 주소 하나 = 파일 하나 · 정적 생성(`.astro` · `.md.ts` · `.txt.ts` · `rss.xml.js`) | layouts · components · lib · consts · `site.config.mjs` · content |
| layout | `src/layouts/` | 1 | 글 한 편의 틀(BlogPost) | components · lib · consts |
| component | `src/components/` | 9 | 화면 조각(Head · Header · Nav · PostList · Giscus …) | lib · consts · styles |
| lib | `src/lib/` | 3 | 글 목록 · 읽기 시간 · AI 용 출력(llms) | consts · `site.config.mjs` · content |
| style | `src/styles/` | 2 | 토큰 정본 `tokens.css` · 전역 CSS | — |
| data | `src/data/` | 1 | 용어집 `glossary.json` | — |
| content | `src/content/{blog,team,projects}/` | 61 | 글 · 팀원 · 프로젝트(스키마 `content.config.ts`) | — |
| 설정 정본 | `src/consts.ts` · `site.config.mjs` · `astro.config.mjs` | 3 | 분류 · 주소 · SEO · 빌드 설정 | — |
| 도구 | `scripts/` | 9 | check-* · new-post · import-doc · make-charts · make-og · setup | content · 설정 |
| 정적 파일 | `public/` | 3 | 이미지 · 아이콘 | — |

- **의존 방향**(관찰): route → layout → component → lib · consts · 설정 · style. lib 는 component · route 를 부르지 않는다(실측 `grep` 0). 조문 `R-BLOG-LAYER` + 가드 후보(lib · styles 에서 components · pages import 0).
- 서버 계약 · 인증 · 서버 상태: **해당 없음 — 정적 사이트**(K5 · 판정 T-002697).

## 3. 조문 후보 (R-BLOG-* · 문면은 합의 뒤)

| id 후보 | 뜻 | 집행 | 원천 |
| --- | --- | --- | --- |
| R-BLOG-LAYER | 의존은 route → layout → component → lib 한 방향 | 가드(신규 · grep) | 관찰 |
| R-BLOG-TOKENS | 스타일은 토큰으로만 | check-tokens R1 ~ R3(build) · 대상 0 = 실패로 고침 | AGENTS 15 |
| R-BLOG-PUBLIC-SAFE | 공개 글에 비밀값 · 금지 HTML · alt 누락 없음 | check-posts P1 ~ P5(build) | AGENTS 14 |
| R-BLOG-TAXONOMY | 분류 정본은 `site.config.mjs` 한 곳 | 스키마 refine(build) | AGENTS 3 |
| R-BLOG-BASE-URL | 링크는 `BASE_URL` 기준 | check-posts W7(경고) → 일부 | AGENTS 1 |
| R-BLOG-VERBATIM | 받은 문서는 본문 그대로(smartPunctuation 끔) | import 대조 · astro.config | AGENTS 7 |
| R-BLOG-DRAFT | 새 글은 초안 · «발행» 은 사용자 말만 | 리뷰(정지점) | AGENTS 10 |
| R-BLOG-REAL-PEOPLE | 팀원 · 프로젝트는 받은 그대로 | 리뷰 + 간극(검사 범위 밖) | AGENTS 9 |
| R-BLOG-SEO | 초안 check:seo 오류 0 · 경고 0 · 발행 오류 0 | check:seo | AGENTS 13 |
| R-BLOG-WORDING | 개발자 말 · 용어집 대표 이름 | check:wording | 스킬 blog-wording |
| R-BLOG-FACTS | 숫자는 실측 · 두 세션이 따로 셈 · 기준 시점 · 실측 없는 효과는 판단 + 단서 | 리뷰(사실 확인 회차) | 스킬 blog-compose · 사용자 지적 |
| R-BLOG-QUOTES | 외부 인용은 필자 주장과 뜻이 같을 때만 · 원문 확인 | 리뷰 | 사용자 결정 |
| (지향) 다크 모드 없음 | 출처: 사용자 2026-09-29 | — | AGENTS 15 |

## 4. 게이트 — `scripts/localci.sh` (S6 · B6)

| 칸 | 명령 | 까닭 |
| --- | --- | --- |
| `localci_ci` | `npm ci` → `npm run build` | PR `check.yml` 과 같은 명령 — 로컬 초록 = PR 초록 |
| `localci_guards` | `check:tokens` · `check:posts` · 새 의존 방향 가드 | 빌드 없이 빠르게 |
| 글 레인 덧(제안) | 바뀐 글마다 `check:seo -- <slug>` · `check:wording` | 초안 완료 기준(0 · 0)을 게이트로 — 지금은 사람이 돌림 |

## 5. WORKFLOW 루트 플로우 «글 한 편» · Subflow 계약 (W2 · W16)

- 단계 대응은 `INSTALL_PLAN.md` §사용자 결정 표 그대로(합의 2026-11-23).
- Subflow 계약 행 후보: 조사 요청 · 다시 세기 · 뼈대 · 그림 · 사실 확인 회차 · 용어 손봄 · SEO · GEO · 옮기기(blog-write) · 발행 확인(V3). 행마다 입력 · 방법 · 결과물 · 통과 체크 · 결정 기록 · 반려되는 곳.

## 6. 사용자에게 물을 것 (합의 전)

1. 조문 후보 12 개와 지향 한 줄 — 이대로 세울지 · 빼거나 더할 것.
2. 글 레인 게이트에 `check:seo` · `check:wording` 을 넣을지(§4 덧).
3. `docs/claude-management.md` 는 안내로 남기고 헌법이 가리키게 할지.

## 감사 (4b)

(조문 · 집행 줄 대조 결과)

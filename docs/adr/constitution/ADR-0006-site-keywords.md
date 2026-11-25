# ADR-0006: 사이트 핵심 키워드(하네스 · AI 에이전트 · 자동화) — 정본 한 곳 · 글마다 최소 기준 · 사이트 머리 · JSON-LD · llms

- **상태**: 조건부 적합 — 법제처 T-003385 · 정정 둘 반영(T-003388 · 아래 «정정») · 빠른 확인 대기
- **날짜**: 2026-11-25
- **범위**: RULES(R-BLOG-SEO «사이트 핵심 키워드» 뜻 · 집행 · 어긋나면 · §9-1 localci 줄) · `site.config.mjs` `SITE_KEYWORDS` · `src/consts.ts` · `BaseHead.astro` · `BlogPost.astro` · `posts/[...slug].astro` · `index.astro` · `src/lib/llms.ts` · `scripts/check-seo.mjs` · `scripts/localci.sh` · 스킬 `blog-seo` · 용어집 «공통 규칙 쪽»
- **관련**: 감독 티켓 T-003381 · CHANGELOG 2026-11-25 · [ADR-0004](../workflow/ADR-0004-inbound-links-on-publish.md)(R-BLOG-SEO 앞 개정) · [ADR-0005](../workflow/ADR-0005-wording-decision-registration.md)(용어 결정 등록)

## Context — 발단

- 사용자(2026-11-25): «모든 포스트에 하네스 에이전트 자동화 이걸로 잘 키워드 검색될수 있도록 seo. geo 되도록 관련 스킬 혹은 워크 플로우 수정하고 모든 포스트 수정해서 배포해줘». 감독은 이 일을 둘로 나눴다. 규칙 · 스킬 · 검사는 이 레인이 맡고, 글 본문 수정은 다음 글 레인이 맡는다.
- 실측(`main-cicd`＠2ca83a1): R-BLOG-SEO 에 사이트 전체의 핵심 키워드가 없었다. `site.config.mjs` · `BaseHead.astro` 에 키워드 자리가 없었고(`meta keywords` 0) · 홈 JSON-LD 에 `keywords` · `about` 이 없었다. `llms.txt` 머리도 사이트 설명 한 줄뿐이었다. 글 JSON-LD `keywords` 는 태그만 담았다.
- 용어집은 harness 의 첫 등장을 «공통 규칙 쪽(harness)» 으로 정해 두었다(T-003314). 한글 «하네스» 가 글에 드러나지 않아, 하네스를 다룬 team-harness-propagation 도 요약 · 첫 단락 기준에 걸린다.

## 논의된 대안 (Options)

| 안 | 내용 | 장점 | 단점 | 판정 |
|---|---|---|---|---|
| A | 키워드 정본을 `site.config.mjs` 한 곳에 두고 머리 · JSON-LD · llms · 검사가 읽는다 | 키워드를 바꿀 때 한 줄만 고친다 · 검사와 페이지가 어긋나지 않는다 | 설정 파일이 하나 더 큰다 | **채택** |
| B | 조문에 낱말을 적고 검사 · 머리에 따로 박는다 | 파일이 안 는다 | 같은 목록이 네 곳에 생긴다 | 기각 |

글마다 기준을 어디에 두나:

| 안 | 내용 | 판정 |
|---|---|---|
| ① | 제목 또는 설명 하나 이상 + «## 한 줄로» 또는 첫 단락 하나 이상 | **채택** — 검색 결과(제목 · 설명)와 AI 요약(앞부분) 두 자리를 다 덮는 최소 기준 |
| ② | 태그에도 반드시 | 기각 — 태그는 «기존 태그를 다시 쓴다»(blog-seo 7) 와 부딪힌다 · 글 JSON-LD `keywords` 가 드러난 키워드를 이미 싣는다 |
| ③ | 세 키워드 모두 | 기각 — 아키텍처 글에 하네스를 넣으면 무관한 삽입(채우기)이 된다 |

강도:

| 안 | 내용 | 판정 |
|---|---|---|
| 가 | 글 기준은 경고 — 글 레인 `--strict` 에서 실패 · 발행 전체 점검은 경고 · 사이트 머리 · JSON-LD · llms 는 오류 | **채택** — 지금 발행 17 편이 기준에 못 미친다. 발행 전체를 오류로 하면 글 레인이 맞추기 전까지 모든 회차가 빨강이 된다. 글을 고치는 레인은 그 글에서 반드시 맞춘다 |
| 나 | 글 기준도 오류 | 기각 — 위 까닭 |

드러났다고 칠 꼴: 한글 «하네스 · 에이전트 · 자동화» 만 센다(영어 `harness` · `agent` 는 세지 않는다). 사용자가 검색될 말로 정한 것이 한글이기 때문이다. «자동화율» 처럼 붙은 꼴도 든다.

## Decision

1. `site.config.mjs` `SITE_KEYWORDS` = 하네스(harness) · AI 에이전트(AI agent) · 자동화(automation) — 각각 `name` · `en` · `match`(한글 꼴).
2. 사이트 머리 `meta keywords` — 글은 그 글에 드러난 키워드 + 태그, 다른 페이지는 키워드 전체. 홈 JSON-LD `keywords` · `about`. 글 JSON-LD 는 드러난 키워드만 `keywords`(태그와 합침) · `about`. `llms.txt` 머리에 «핵심 주제: 하네스(harness) · AI 에이전트(AI agent) · 자동화(automation)».
3. `check-seo.mjs` — 원문: ① 제목 · 설명 ② «## 한 줄로» · 첫 단락에 키워드 0 이면 경고 · 설명에 키워드 3 번 넘게 · 제목에 같은 키워드 두 번이면 «채우기» 경고. 빌드: 홈 meta · 홈 JSON-LD `about` · llms 핵심 주제 줄 · 키워드가 드러난 글의 JSON-LD `about` 이 없으면 오류.
4. `localci.sh` — 발행 전체 `check:seo`(오류만)를 글이 바뀐 회차만이 아니라 **회차마다** 돈다. 사이트 머리 · llms 를 바꾸는 코드 회차에도 키워드 오류를 잡기 위해서다(이 변경이 바로 그런 회차다).
5. 용어집 «공통 규칙 쪽» 첫 등장 꼴을 «공통 규칙 쪽(하네스 · harness)» 으로 바꾼다. 사용자 결정이라 ADR-0005 대로 같은 묶음에서 등록한다(가드 `wording-decision.sh`).
6. 스킬 `blog-seo` — 체크리스트 9(사이트 핵심 키워드) · GEO 한 줄 · 하지 않는 일 한 줄.
7. 글 본문은 고치지 않는다 — 다음 글 레인이 아래 목록을 맞춘다.

## 기준선 — 키워드 기준 실패 목록(`main-cicd`＠2ca83a1 · `npm run check:seo -- <slug>` 원문 점검)

| 상태 | 글 | 걸린 곳 |
|---|---|---|
| 발행 | android-architecture-1-one-truth | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | android-architecture-2-build-and-fix | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | android-architecture-3-how-we-moved | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | backend-workflow-adoption | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | business-flow-story | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | hello-world | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | subflow-1-smallest-unit | 한 줄로 · 첫 단락 |
| 발행 | subflow-2-incident-to-contract | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | subflow-3-grow-and-assemble | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | subflow-guide-1-what | 제목 · 설명 |
| 발행 | subflow-guide-2-contract | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | subflow-guide-3-across-repos | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | team-harness-propagation | 한 줄로 · 첫 단락 |
| 발행 | web-admin-architecture-1-structure | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | web-admin-architecture-2-build-and-fix | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | web-admin-architecture-3-how-we-moved | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 발행 | why-architecture-in-ai-era | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 초안 | admin-server-architecture-1-one-way | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 초안 | admin-server-architecture-2-what-went-wrong | 제목 · 설명 ; 한 줄로 · 첫 단락 |
| 초안 | android-ui-joint-spec | 제목 · 설명 ; 한 줄로 · 첫 단락 |

- 셈: 발행 19 편 중 실패 17 편(통과 backend-ax-automation-rate · business-flow-adoption-guide) · 초안 4 편 중 실패 3 편(통과 admin-server-architecture-3-how-we-moved). 채우기 경고는 0 건.
- 다시 재는 명령: `for s in $(ls src/content/blog); do node scripts/check-seo.mjs $s | grep -q '핵심 키워드' && echo $s; done`

## Consequences

- 이 판이 착지하면 기존 글을 고치는 글 레인은 그 글을 키워드 기준에 맞춰야 착지한다(`--strict`).
- 홈 · 모든 페이지 머리에 `meta keywords` 가 생긴다. 구글은 이 태그를 순위에 쓰지 않는다고 밝혀 왔다. 네이버 · 다른 엔진 · AI 크롤러가 읽을 수 있는 자리라 둔다. 효과는 잰 적이 없다(판단).
- 키워드를 바꾸는 것은 사용자 결정이고 `SITE_KEYWORDS` 한 줄만 고친다. 검사 · 머리 · llms 는 따라온다.

## 정정 — 법제처 T-003385 조건부 적합(2026-11-25 · T-003388)

1. **막음 — 기준과 금지가 부딪침**: «글마다 하나 이상» 과 «무관한 삽입 금지» 를 함께 지킬 수 없는 글(본문에 키워드 0 인 발행 글 6 편)이 있는데 풀 꼴이 없었다. `--strict` 가 무관 삽입을 강요하는 꼴이었다. → 본문 머리 표지 `<!-- site-keyword-skip: <까닭> -->`. `check:seo` 는 표지가 있으면 그 글의 ① · ② 를 건너뛰고, 출력에 «건너뜀 <slug>: <까닭>» 줄과 «키워드 건너뜀 n» 수를 싣는다. 까닭이 빈 표지는 경고다(`--strict` 실패). 짝 시험 둘(`test-guards.sh` — 까닭 있음 0 · 빈 표지 1). 사용자 원문이 «모든 포스트» 라서 건너뜀은 레인이 혼자 확정하지 않는다. 발행 정지점(또는 그 글을 고친 레인의 관문 보고)에서 사용자가 목록을 보고 정한다.
2. **안 막음 — 용어집 출처**: «공통 규칙 쪽(하네스 · harness)» 의 `evidence` 를 «사용자 결정(핵심 키워드)에서 레인이 맞춘 꼴 · 이 꼴의 확인 = 발행 정지점» 으로 바꿨다. 사용자가 이 꼴을 직접 정한 것처럼 읽히던 문구를 고쳤다.

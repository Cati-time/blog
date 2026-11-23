# 헌법 설치 4 SDD — 헌법 문서 설계 (blog · 설계 합의 2026-11-23)

- 기준: 레인 `docs/constitution-setup`＠7beaa47 · 분모 `INSTALL_DENOMINATOR.md` 69 행 · 장면 `INSTALL_BDD.md`.
- 설계(무엇을 어디에 · 무엇으로 집행)는 사용자 합의(§6). **조문 문면은 7 Execute 전에 한 번 더 보인다**(business-flow §3).

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

## 2. RULES 몸통 — 현재 1 ~ 4 (K2 ~ K5 · 실측 HEAD＠175ed1d)

### 2-1. 현재 1 어디에 두나 — 역할 처분 (web-kind 규칙 2)

행마다 셈 명령 = `git ls-tree -r --name-only <ref> <폴더> | wc -l`. 처분 안 된 역할 0 이 목표 · **양성 대조**: 한 폴더 행을 지운 표로 대조하면 «처분 안 된 폴더 1» 로 실패해야 한다(가드 후보 · 7 Execute 에서 짝 시험).

| 층 · 역할 | 폴더 · 파일 | 수 | 책임 | 소유(이 층만) | 의존 가능 | 관찰 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| route(페이지) | `src/pages/` | 13 | 주소 하나 = 파일 하나 · 정적 생성 | URL 구조 · `getStaticPaths` | layouts · components · lib · consts · 설정 · content | `src/pages/posts/[...slug].astro` |
| layout | `src/layouts/` | 1 | 글 한 편의 틀 | 글 머리 · JSON-LD 조립 | components · lib · consts · content(`astro:content`) | `src/layouts/BlogPost.astro` |
| component | `src/components/` | 9 | 화면 조각 | 헤더 · 내비 · 글 목록 · 댓글 위젯 | lib · consts · styles · 같은 층 components | `PostList.astro` → `Tags.astro` |
| lib | `src/lib/` | 3 | 글 목록 · 읽기 시간 · AI 용 출력 | 글 고르기 · llms 문서 조립 | consts · 설정 · content | `src/lib/posts.ts` |
| style | `src/styles/` | 2 | 토큰 정본 · 전역 CSS | 색 · 글꼴 · 간격 값 | — | `src/styles/tokens.css` |
| data | `src/data/` | 1 | 용어집 | 대표 이름 · 피할 말 | — | `src/data/glossary.json` |
| content | `src/content/{blog,team,projects}/` | 61(56 · 4 · 1) | 글 · 팀원 · 프로젝트 | 본문 · frontmatter | — | `src/content/blog/*/index.md` |
| 설정 정본 | `src/consts.ts` · `src/content.config.ts` · `site.config.mjs` · `astro.config.mjs` | 4 | 분류 · 주소 · 스키마 · 빌드 설정 | 분류 목록 · 스키마 refine · smartPunctuation | — | `site.config.mjs` CATEGORIES |
| 도구 | `scripts/` | 9 | check-* · new-post · import-doc · make-charts · make-og · setup | 검사 · 생성 | content · 설정 · `src/data` · `src/styles` | `scripts/check-tokens.mjs` |
| 정적 파일 | `public/` | 3 | 아이콘 · 이미지 | — | — | `public/` |
| 층 밖 — 헌법 · 안내 | `docs/`(7) · `README.md` · `WRITING_GUIDE.md` · `AGENTS.md`(= `CLAUDE.md`) · `LICENSE` | — | 규칙 · 안내 · 지침 | — | — | 까닭: 코드가 아님 · 헌법이 가리킴 |
| 층 밖 — 에이전트 절차 | `.claude/skills/`(6) · `.claude/launch.json` | — | 스킬 넷 · 미리보기 | — | — | 까닭: 절차 · MUST 는 헌법이 가짐 |
| 층 밖 — 빌드 · CI 설정 | `package.json` · `package-lock.json` · `tsconfig.json` · `.nvmrc` · `.gitignore` · `.github/workflows/`(2) · `.vscode/` | — | 의존성 · 타입 · 노드 판 · CI · 배포 | — | — | 까닭: 도구 설정 · 게이트가 읽음 |

- **의존 방향**(관찰 · `grep` 실측): route → layout → component → lib. route 는 lib · consts 를 바로 불러도 된다(같은 방향 건너뛰기) · component 는 같은 층 component 를 불러도 된다 · lib · styles 는 components · pages · layouts 를 부르지 않는다(0 건). 조문 `R-BLOG-LAYER` · 가드 정규식 = «`src/lib` · `src/styles` → components · pages · layouts import 0».

### 2-2. 현재 2 어떻게 만드나 (K3 · 뼈대)

| 층 | 해야 | 하지 말 것 | 공개 표면 | 본보기 |
| --- | --- | --- | --- | --- |
| route | 링크는 `import.meta.env.BASE_URL` 기준 | 하드코딩 `href="/…"` | 주소 | `src/pages/posts/index.astro` |
| component · layout | 색 · 간격은 토큰 변수 | 색상 값 · 원시 토큰 `--p-*` | props | `src/components/Header.astro` |
| content | `npm run new … --draft` 로 만들고 frontmatter 스키마를 따름 | 분류 값을 지어냄 | frontmatter | `src/content/blog/<slug>/index.md` |
| 도구 | 그림 숫자는 글 숫자와 같은 데이터 | 그림에 직접 숫자 손입력 | 명령 | `scripts/make-charts.mjs` |

### 2-3. 현재 3 어떻게 시험하나 (K4 · 뼈대)

- 단위 시험 없음. 대신 `astro check`(타입) · `check-tokens` · `check-posts` · 스키마 refine(빌드) · `check:seo` · `check:wording` · 브라우저 미리보기(V1) · 공개 페이지(V3)가 대체한다.
- 바깥 HTTP · 저장소 · 시계 · 라우터 대체: 해당 없음 — 정적 생성 · 런타임 요청 없음(Giscus · GA 는 외부 위젯 · 빌드 밖).

### 2-4. 현재 4 옆과 잇기 (K5)

- (가) 서버 계약 — 해당 없음 · 정적 사이트(판정 T-002697).
- (나) 오류가 화면까지 — 없는 주소 → `src/pages/404.astro` · 빌드 오류(스키마 · check)는 배포 전에 막힘.
- (다) 상태 경계 — 클라이언트 상태 거의 없음 · 댓글은 Giscus(외부) · 분석은 GA(외부) — 소유자는 각 외부 서비스.

## 3. 조문 후보 — 집행 줄 (감사 4b 반영)

| id | 뜻 | 등급 | 집행(정확히) | 간극 |
| --- | --- | --- | --- | --- |
| R-BLOG-LAYER | 의존 한 방향(§2-1 문면 포함) | MUST | 새 가드(grep · error) | — |
| R-BLOG-TOKENS | 스타일은 토큰으로만 | MUST | check-tokens R1 ~ R3(build) · 대상 0 이면 이미 실패(exit 2) | 범위 밖: `public/` · 글 본문 · make-charts SVG 색 · `.ts` 주입 스타일 · `tokens.css` ↔ `design-tokens.md` 한 커밋(도구 없음) |
| R-BLOG-PUBLIC-SAFE | **공개 글(blog)** 에 비밀값 · 금지 HTML · alt 누락 없음 | MUST | check-posts P1 ~ P5(build) — `src/content/blog` 만 | team · projects · docs · scripts · 채팅은 검사 밖 → 간극 |
| R-BLOG-TAXONOMY | 글 분류는 `site.config.mjs` 값만 | MUST | 스키마 enum · refine(build) | «정본 한 곳» 은 미집행 — `check-posts.mjs:124` 에 분류 하드코딩 → 간극(설정에서 읽게) |
| R-BLOG-BASE-URL | 링크는 `BASE_URL` 기준 | MUST(코드) · SHOULD(글 본문) | 코드: 새 가드 `(href\|src)="/[a-z]` in src → error · 글 본문: check-posts W7 경고 | — |
| R-BLOG-VERBATIM | 받은 문서는 본문 그대로 | MUST | `npm run import` 시점 대조(불일치 exit 3) + 설정값 `smartPunctuation: false` | import 뒤 손 편집 · 설정 변경은 검사 밖 → 리뷰 |
| R-BLOG-DRAFT | 새 글은 초안 · «발행» 은 사용자 말만 | MUST | 리뷰(정지점) | `new-post.mjs` 기본이 `draft: false`(:13) → 7 Execute 에서 기본을 true 로 고침 |
| R-BLOG-REAL-PEOPLE | 팀원 · 프로젝트는 받은 그대로 | MUST | 리뷰 | 검사 범위 밖 → 간극 |
| R-BLOG-SEO | 초안 check:seo 오류 0 · 경고 0 / 발행 build 뒤 오류 0 | MUST | 초안: `check:seo -- <slug>`(오류만 exit 1) / 발행: 전체 모드(dist 필요) | 경고는 exit 0 → 7 Execute 에서 `--strict`(경고도 exit 1) 추가 |
| R-BLOG-WORDING | 개발자 말 · 용어집 대표 이름 | MUST | `check:wording` | 지금 항상 exit 0 → 7 Execute 에서 `--strict`(경고 있으면 exit 1) 추가 · 그 전엔 정보성 |
| R-BLOG-FACTS | 숫자 실측 · 두 세션 셈 · 기준 시점 · 판단 + 단서 | MUST | 리뷰(사실 확인 회차) | — |
| R-BLOG-QUOTES | 외부 인용은 뜻이 같을 때만 | MUST | 리뷰 | — |
| (지향) 다크 모드 없음 | 출처: 사용자 2026-09-29 | — | — | — |

## 4. 게이트 — `scripts/localci.sh` (S6 · B6)

| 칸 | 명령 | 까닭 |
| --- | --- | --- |
| `localci_ci` | `npm ci --no-audit --no-fund` → `npm run build` | PR `check.yml` 과 같은 명령(플래그까지) |
| `localci_guards` | `check:tokens` · `check:posts` · R-BLOG-LAYER 가드 · R-BLOG-BASE-URL 코드 가드 | 빌드 없이 빠르게 |
| 글 레인 덧(합의) | 바뀐 글마다 `check:seo -- <slug> --strict` · `check:wording --strict` | 초안 완료 기준 0 · 0 을 게이트로 — `--strict` 는 7 Execute 에서 도구에 더함 |
| 발행 | 착지 전 `npm run build` → `check:seo`(전체 · 오류 0) | 발행 기준 |

- 7 Execute 에 들어가는 도구 손봄 셋(집행 줄을 세우려면 필요): `check-wording --strict` · `check-seo --strict` · `new-post` 기본 `draft: true`. 모두 이 레포 안 · 작은 변경.

## 5. WORKFLOW 루트 플로우 «글 한 편» · Subflow 계약 (W2 · W16)

- 단계 대응은 `INSTALL_PLAN.md` §사용자 결정 표 그대로(합의 2026-11-23).
- Subflow 계약 행 후보: 조사 요청 · 다시 세기 · 뼈대 · 그림 · 사실 확인 회차 · 용어 손봄 · SEO · GEO · 옮기기(blog-write) · 발행 확인(V3). 행마다 입력 · 방법 · 결과물 · 통과 체크 · 결정 기록 · 반려되는 곳.

## 6. 사용자 합의 (2026-11-23)

1. 조문 후보 12 개 + 지향 «다크 모드 없음» — **이대로 세운다.** 문면은 7 Execute 전에 한 번 더 보인다.
2. 글 레인 게이트에 `check:seo -- <slug>` · `check:wording` — **넣는다**(§4 덧 확정).
3. `docs/claude-management.md` — **안내로 남기고 헌법이 가리킨다.** 겹치는 절만 헌법을 가리키게 고친다.

## 감사 (4b)

- 독립 서브에이전트(읽기 전용): 막음 4 · 권고 7.
- 막음 반영: ① 뿌리 파일 · 층 밖 폴더 처분 행 셋 ② 셈 합 맞춤(src · scripts · public = 104 · 설정 정본 4) · 행마다 셈 명령 · 양성 대조 ③ 소유 · 관찰 근거 열 ④ R-BLOG-WORDING 은 지금 exit 0 → `--strict` 도구 손봄을 7 Execute 에(그 전엔 정보성).
- 권고 반영: DRAFT 기본값 간극 · BASE-URL 코드 가드 · TOKENS «이미 exit 2» · 범위 한계 · PUBLIC-SAFE 범위 · TAXONOMY 하드코딩 간극 · VERBATIM 정확한 집행 · LAYER 문면(건너뛰기 · 같은 층) · 현재 2 ~ 4 뼈대 · localci 플래그 · 발행 게이트 칸.
- 막음 0.

# blog 구조 헌법 — RULES

> 판: canon **0.44.0** · web-kind **0.1.0** · 이 헌법은 canon 판 0.44.0 의 인스턴스다 · 틀: harness `canon/` · 개정 수신: `AMENDMENT.md` §5.
> 개정은 `AMENDMENT.md` 절차로만. 조문 id 범위 `R-BLOG-`.

## 범위

- **규정한다**: 이 저장소의 코드(`src/` · `scripts/` · 설정)와 공개 글(`src/content/`)이 따라야 하는 것 — 어디에 두나 · 어떻게 만드나 · 무엇으로 확인하나 · 바깥과 어떻게 잇나 · 글 규칙.
- **규정하지 않는다**: 일하는 흐름(→ `WORKFLOW.md`) · 개정 절차(→ `AMENDMENT.md`) · 글쓰기 문체 안내(→ `WRITING_GUIDE.md`) · 설정 안내(→ `docs/claude-management.md`).

## 1. 현재 1 — 어디에 두나

### 1-1. 개관 그래프

```mermaid
flowchart TB
  subgraph axis_code["axis.code — 화면 코드"]
    route["route · src/pages"] --> layout["layout · src/layouts"]
    layout --> component["component · src/components"]
    route --> component
    component --> lib["lib · src/lib"]
    route --> lib
    layout --> lib
    component --> style["style · src/styles"]
  end
  subgraph axis_content["axis.content — 글 · 데이터"]
    content["content · src/content"]
    data["data · src/data"]
    config["설정 정본 · consts · content.config · site.config · astro.config"]
  end
  subgraph enforce["enforce — 검사 · 게이트"]
    scripts["도구 · scripts/check-*"]
    localci["scripts/localci.sh"]
  end
  subgraph seam_out["seam.outside — 바깥"]
    pages_gh["GitHub Pages"]
    giscus["Giscus 댓글"]
    ga["GA 분석"]
  end
  lib --> content
  layout --> content
  route --> config
  lib --> config
  scripts --> content
  scripts --> data
  scripts --> style
  localci --> scripts
  route -. 빌드 결과 .-> pages_gh
  component -. 위젯 .-> giscus
  component -. 스크립트 .-> ga
```

### 1-2. 층 · 역할 처분 (web-kind 규칙 2)

셈 명령: `git ls-tree -r --name-only <ref> <폴더> | wc -l` · 기준 ref = 이 판을 착지한 통합선 sha. **처분 안 된 역할 0** — 새 폴더 · 뿌리 파일이 생기면 같은 변경에서 이 표에 행을 둔다.

| 층 · 역할 | 폴더 · 파일 | 수 | 책임 | 소유(이 층만) | 의존 가능 | 관찰 근거 |
| --- | --- | --- | --- | --- | --- | --- |
| route | `src/pages/` | 13 | 주소 하나 = 파일 하나 · 정적 생성 | URL 구조 · `getStaticPaths` | layout · component · lib · 설정 정본 · content | `src/pages/posts/[...slug].astro` |
| layout | `src/layouts/` | 1 | 글 한 편의 틀 | 글 머리 · 구조화 데이터 조립 | component · lib · 설정 정본 · content | `src/layouts/BlogPost.astro` |
| component | `src/components/` | 9 | 화면 조각 | 헤더 · 내비 · 글 목록 · 댓글 위젯 | lib · 설정 정본 · style · 같은 층 component | `src/components/PostList.astro` |
| lib | `src/lib/` | 3 | 글 목록 · 읽기 시간 · AI 용 출력 | 글 고르기 · llms 문서 조립 | 설정 정본 · content | `src/lib/posts.ts` |
| style | `src/styles/` | 2 | 토큰 정본 · 전역 CSS | 색 · 글꼴 · 간격 값 | — | `src/styles/tokens.css` |
| data | `src/data/` | 1 | 용어집 | 대표 이름 · 피할 말 | — | `src/data/glossary.json` |
| content | `src/content/{blog,team,projects}/` | 61 | 글 · 팀원 · 프로젝트 | 본문 · frontmatter | — | `src/content/blog/*/index.md` |
| 설정 정본 | `src/consts.ts` · `src/content.config.ts` · `site.config.mjs` · `astro.config.mjs` | 4 | 분류 · 주소 · 스키마 · 빌드 설정 | 분류 목록 · 스키마 refine · 본문 글자 보존 설정 | — | `site.config.mjs` |
| 도구 | `scripts/` | 10 | 검사 · 글 생성 · 원본 대조 · 그림 · 게이트 | 검사 술어 | content · 설정 정본 · data · style | `scripts/check-tokens.mjs` |
| 정적 파일 | `public/` | 3 | 아이콘 · 이미지 | — | — | `public/` |
| 층 밖 — 헌법 · 안내 | `docs/` · `README.md` · `WRITING_GUIDE.md` · `AGENTS.md`(= `CLAUDE.md`) · `LICENSE` | — | 규칙 · 안내 · 지침 | — | — | 까닭: 코드가 아님 |
| 층 밖 — 에이전트 절차 | `.claude/skills/` · `.claude/launch.json` | — | 스킬 넷 · 미리보기 | — | — | 까닭: 절차 · MUST 는 헌법이 가짐 |
| 층 밖 — 빌드 · CI 설정 | `package.json` · `package-lock.json` · `tsconfig.json` · `.nvmrc` · `.gitignore` · `.github/workflows/` · `.vscode/` | — | 의존성 · 타입 · 노드 판 · CI · 배포 | — | — | 까닭: 게이트가 읽는 설정 |

## 2. 현재 2 — 어떻게 만드나

| 층 | 해야 | 하지 말 것 | 공개 표면 | 본보기 |
| --- | --- | --- | --- | --- |
| route | 링크 · 자원 경로는 `import.meta.env.BASE_URL` 기준 | 하드코딩 `href="/…"` · `src="/…"` | 주소 | `src/pages/posts/index.astro` |
| component · layout | 색 · 간격은 토큰 변수 | 색상 값 · 원시 토큰 `--p-*` · 정의 안 된 토큰 | props | `src/components/Header.astro` |
| content | `npm run new … ` 로 만들고 스키마를 따른다 | 분류 값을 지어냄 · 실존 인물 정보를 지어냄 | frontmatter | `src/content/blog/<slug>/index.md` |
| 도구 | 그림 숫자는 글 숫자와 같은 데이터에서(`scripts/make-charts.mjs` 구간) | 그림에 숫자를 손으로 옮겨 적음 | 명령 | `scripts/make-charts.mjs` |

## 3. 현재 3 — 어떻게 확인하나

- 단위 시험은 없다. 대신 아래가 확인한다(무엇을 대체하나):
  - `astro check` — 타입 · 컴포넌트 props
  - `check-tokens` · `check-posts` · 콘텐츠 스키마 — 토큰 · 공개 글 안전 · 분류(빌드 안)
  - `check:seo` · `check:wording` — 검색 · AI 전달 · 용어(글 레인 게이트)
  - 브라우저 미리보기(V1) · 공개 페이지(V3) — 화면
- 바깥 HTTP · 저장소 · 시계 · 라우터 대체: **해당 없음** — 정적 생성이라 런타임 요청이 없다.

## 4. 현재 4 — 옆과 어떻게 잇나

- (가) 서버 계약 — **해당 없음**: 정적 사이트 · API 없음.
- (나) 오류가 화면까지 — 없는 주소는 `src/pages/404.astro` · 스키마 · 검사 오류는 빌드에서 막혀 배포되지 않는다.
- (다) 상태 경계 — 클라이언트 상태는 거의 없다 · 댓글(Giscus) · 분석(GA)은 외부 서비스가 상태를 소유한다.

## 5. 지향 · 간극

- **지향** — 다크 모드는 지원하지 않는다(출처: 사용자 결정 2026-09-29). 다크 테마 · 토글을 다시 넣지 않는다.
- **간극**(경로마다 한 행 · 맞출 때 = 그 자리를 처음 쓰거나 다시 쓰는 변경 · 소급 없음):

| 간극 | 주인 | 닫는 조건 |
| --- | --- | --- |
| `check-posts` 가 `src/content/team` · `projects` 를 읽지 않는다(R-BLOG-PUBLIC-SAFE · R-BLOG-REAL-PEOPLE) | 상설 도구 레인 | 검사 범위에 둘을 더함 |
| `check-posts.mjs` 의 분류 하드코딩(R-BLOG-TAXONOMY) | 상설 도구 레인 | 분류를 `site.config.mjs` 에서 읽음 |
| `tokens.css` ↔ `docs/design-tokens.md` 같은 커밋 · `WRITING_GUIDE` ↔ 글 규칙 같은 커밋(술어 없음) | 상설 헌법 레인 | 첫 해당 개정 때 가드 또는 리뷰 줄 |
| node 판 적힌 곳 불일치(README · engines 22.12 · `.nvmrc` · deploy 24) | 설치 레인 | 한 판으로 맞춤 |
| `check-tokens` 범위 밖(`public/` · 글 본문 · 그림 SVG 색 · `.ts` 주입 스타일) | 상설 도구 레인 | 범위를 정하거나 «범위 밖» 을 조문에 둠 |

## 6. 글 규칙 — `R-BLOG-*`

조문 꼴: **id · 뜻 · 집행 · 어긋나면**. 집행이 «리뷰» 인 조문은 사람이(또는 감수 세션이) 읽어 판정한다.

### R-BLOG-LAYER — 의존은 한 방향
- **뜻**: 의존은 route → layout → component → lib 한 방향이다. route 는 lib · 설정 정본을 바로 불러도 되고(같은 방향 건너뛰기), component 는 같은 층 component 를 불러도 된다. lib · style 은 component · route · layout 을 부르지 않는다.
- **집행**: 가드 `scripts/guards/layer.sh`(localci_guards) — `src/lib` · `src/styles` 에서 components · pages · layouts import 0 · 검사 대상 0 이면 실패.
- **어긋나면**: 게이트 빨강.

### R-BLOG-TOKENS — 스타일은 토큰으로만
- **뜻**: 컴포넌트 · 페이지 스타일은 `src/styles/tokens.css` 에 정의된 토큰만 쓴다. 색상 값 · 원시 토큰 · 정의 안 된 토큰을 쓰지 않는다. 토큰 정본을 바꾸면 정의서 `docs/design-tokens.md` 도 같은 커밋에서 고친다.
- **집행**: `scripts/check-tokens.mjs` R1 ~ R3(빌드 안) · 검사 대상 0 이면 실패(exit 2). 범위는 `src/**/*.css` 와 `.astro` 의 스타일 — 범위 밖은 §5 간극.
- **어긋나면**: 빌드 실패.

### R-BLOG-PUBLIC-SAFE — 공개 글은 안전하게
- **뜻**: 공개 글(`src/content/blog`)에 비밀값 · 내부 주소 · 금지 HTML 이 없고 그림에 설명(alt)이 있다. 토큰 · 비밀값은 파일 · 채팅 어디에도 남기지 않는다.
- **집행**: `scripts/check-posts.mjs` P1 ~ P5(빌드 안 · 오류) · 범위 밖(team · projects · docs · 채팅)은 리뷰 + §5 간극.
- **어긋나면**: 빌드 실패.

### R-BLOG-TAXONOMY — 분류는 한 곳에서
- **뜻**: 글의 대분류 · 하위 메뉴는 `site.config.mjs` 의 `CATEGORIES` · `PLATFORMS` 값만 쓴다. 분류가 애매하면 사람에게 묻는다.
- **집행**: 콘텐츠 스키마 enum · refine(`src/content.config.ts` · 빌드 안).
- **어긋나면**: 빌드 실패. 정본 한 곳 미집행 자리는 §5 간극.

### R-BLOG-BASE-URL — 주소는 BASE_URL 기준
- **뜻**: 사이트는 `/blog` 아래에 있다. 코드의 링크 · 자원 경로는 `import.meta.env.BASE_URL` 로 만들고, 글 본문의 다른 글 링크는 상대 경로(`../<slug>/`)로 쓴다.
- **집행**: 코드 — 가드 `scripts/guards/base-url.sh`(`src` 의 `href="/…"` · `src="/…"` 0 · 오류) · 글 본문 — `check-posts` W7(경고).
- **어긋나면**: 코드는 게이트 빨강 · 글 본문은 경고(리뷰).

### R-BLOG-VERBATIM — 받은 문서는 본문 그대로
- **뜻**: 사용자가 준 Markdown · HTML 문서는 스타일만 걷어내고 본문 글자를 바꾸지 않는다(허용: frontmatter · alt · 비밀값 가리기 · 강조 표기 · 사용자가 콕 집은 곳). 문장부호 자동 변환은 끈다.
- **집행**: `npm run import` 가 원본과 본문 글자를 대조(불일치 exit 3) · `astro.config.mjs` `smartPunctuation: false` · 그 뒤 손 편집은 리뷰.
- **어긋나면**: 옮기기 실패 · 리뷰 반려.

### R-BLOG-DRAFT — 새 글은 초안, 발행은 사용자 말로
- **뜻**: 새 글은 `draft: true` 로 시작한다. `draft: false` 로 바꾸는 것은 사용자가 «발행» 이라고 했을 때뿐이다.
- **집행**: `npm run new` 기본값 `draft: true` · 정지점(WORKFLOW 루트 플로우) · 리뷰.
- **어긋나면**: 리뷰 반려 · 발행 커밋 되돌림.

### R-BLOG-REAL-PEOPLE — 실존 인물 정보는 받은 그대로
- **뜻**: 소개 페이지의 팀원(`src/content/team/`) · 프로젝트(`src/content/projects/`)는 실존 인물 · 실제 업무 정보다. 이름 · 역할 · 소개 · 프로젝트 내용을 지어내지 않고 사용자에게 받은 그대로 넣는다.
- **집행**: 리뷰 · 스키마 형식(빌드) · 내용 검사는 §5 간극.
- **어긋나면**: 리뷰 반려.

### R-BLOG-SEO — 검색 · AI 전달
- **뜻**: 초안은 `check:seo -- <slug>` 오류 0 · 경고 0, 발행은 빌드 뒤 `check:seo` 오류 0.
- **집행**: `scripts/check-seo.mjs` — 초안 게이트는 `--strict`(경고도 실패).
- **어긋나면**: 글 레인 게이트 빨강.

### R-BLOG-WORDING — 개발자가 쓰는 말
- **뜻**: 글은 한국 개발자가 실제로 쓰는 말로 쓰고, 용어는 용어집(`src/data/glossary.json`)의 대표 이름을 쓴다. 사람이 한 말의 인용은 원문 그대로 둔다(`<!-- wording-ok -->`).
- **집행**: `scripts/check-wording.mjs` — 글 레인 게이트는 `--strict`(경고 있으면 실패).
- **어긋나면**: 글 레인 게이트 빨강.

### R-BLOG-FACTS — 숫자는 실측으로
- **뜻**: 글의 숫자는 실측 값만 쓴다. 원천 세션 값은 블로그 세션이 따로 다시 세어 맞추고, 원천 주장이 언제 잰 값인지 확인한다. 실측 없는 효과는 «판단 + 단서» 로만 쓰고, 달력 기간을 작업 시간처럼 쓰지 않는다.
- **집행**: 리뷰 — 사실 확인 회차(WORKFLOW 루트 플로우 5b) · 표는 저장소 밖(`../blog-notes/fact-checks/`).
- **어긋나면**: 사실 확인 반려 · 발행 뒤 정정.

### R-BLOG-QUOTES — 인용은 뜻이 같을 때만
- **뜻**: 외부 인물 · 글의 인용은 필자 주장과 뜻이 정확히 같을 때만 쓰고, 원문을 확인해 나란히 보여 확인받는다.
- **집행**: 리뷰.
- **어긋나면**: 리뷰 반려.

## 7. 바깥 접점 (M2)

| 접점 | 무엇 | 규칙 |
| --- | --- | --- |
| GitHub Pages | `main` push → `.github/workflows/deploy.yml` → 공개 | 배포는 사람(push) |
| PR 검사 | `.github/workflows/check.yml`(`npm ci` → `npm run build`) | 로컬 CI 와 같은 명령 |
| 저장소 설정(Pages · Discussions 등) | `gh api` | 바꾸기 전 사용자 확인 · 조회는 바로 |
| Giscus · GA | 댓글 · 분석(외부) | 설정 정본 `site.config.mjs` |
| 원천 저장소 | 글의 사실(다른 레포) | 읽기만 · 조사 · 사실 확인은 그 레포 세션에 |

## 8. 로그 · 오류 · 텔레메트리 (M7 · M8 · telemetry)

- **로그(M7)** — 안 정함: 정적 사이트라 런타임 로그가 없다. 빌드 · 검사 로그는 로컬 CI · GitHub Actions 출력이 갖는다.
- **오류(M8)** — 검사는 «오류 = 빌드 · 게이트 실패 · 경고 = 출력만» 두 단계. 화면 오류는 404 페이지.
- **텔레메트리** — GA(외부). 측정 ID 는 `site.config.mjs` · 개인 정보는 수집 설정 밖.

## 9. 거버넌스

### 9-1. 가드 진입점 (M4)

- `scripts/localci.sh` 하나 — `localci_ci`(`npm ci --no-audit --no-fund` → `npm run build` — PR `check.yml` 과 같은 명령) · `localci_guards`(check-tokens · check-posts · R-BLOG-LAYER · R-BLOG-BASE-URL 가드) · 글 레인 덧(바뀐 글마다 `check:seo -- <slug> --strict` · `check:wording --strict`).

### 9-2. 섹터 맵 (M5)

| 섹터 | 이 저장소 | 조문 | 워크플로우 대응 |
| --- | --- | --- | --- |
| `axis.code` | route · layout · component · lib · style | R-BLOG-LAYER · TOKENS · BASE-URL | 코드 변경(Business Flow 표준 단계) |
| `axis.content` | content · data · 설정 정본 | R-BLOG-TAXONOMY · PUBLIC-SAFE · DRAFT · REAL-PEOPLE · VERBATIM · SEO · WORDING · FACTS · QUOTES | 루트 플로우 «글 한 편» |
| `seam.outside` | Pages · PR 검사 · Giscus · GA · 원천 저장소 | §7 | 루트 플로우 7 · 8 · Subflow «조사 요청» |
| `enforce` | `scripts/` · `scripts/localci.sh` | §9-1 | 완료 기준 · 게이트 |
| `gov` | 이 절 | — | `AMENDMENT.md` |

### 9-3. 빈칸 (M6)

- `[X]` 표지 — 아직 정하지 않은 것은 «안 정함 + 까닭» 으로 둔다. 지금: M7 로그(§8).

### 9-4. 구조 칸의 분모 (web-kind 규칙 7 · canon §0-1 ⑤)

- 심사 · 판 올림 대조는 그 sha 의 역할 목록을 명령으로 뽑아(§1-2 셈 명령 · 수 기록) 처분 표와 대조한다. 처분 안 된 역할 0 · 관찰 근거 없는 «현재» 문장 0 · 그래프 노드가 코드에 있음. 양성 대조: 표에서 한 행을 뺀 대조는 «처분 안 된 폴더 1» 로 실패해야 한다.

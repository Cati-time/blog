# 헌법 설치 1 Survey — blog

- 기준: 레인 가지 `docs/constitution-setup`＠`902feb1`(원천 `main`＠`16cb73c`) · 2026-11-23 실측 · 셈은 모두 아래 명령으로 다시 낼 수 있다.

## 1. kind 판정 — 등록부 web ↔ 실측

| 축 | 실측 | 셈 명령 | web 행과 |
| --- | --- | --- | --- |
| 언어 · 프레임워크 | Astro 7.3.2 · TypeScript · `.astro` 19 · `.ts` 8 · `.mjs` 10 | `git ls-files \| sed 's/.*\.//' \| sort \| uniq -c` · `npm ls astro` | 맞음 — 화면 코드 |
| 빌드 단위 | `npm run build` = `check`(check-tokens → check-posts → astro check) → `astro build --force` · 한 단위 | `package.json` scripts | 맞음 |
| 배포 꼴 | 정적 사이트 · `main` push → `deploy.yml`(withastro/action → GitHub Pages) · PR 은 `check.yml`(npm run build) | `.github/workflows/*.yml` | 맞음 — 배포 = 사람 |
| 도메인 · 서버 | 서버 · 인증 · 상태 저장 없음(정적 HTML) | `ls src/pages src/lib` | 서버 · 인증 · 상태 칸은 «해당 없음 + 까닭(정적 사이트)» |
| 확인 수단 | 브라우저(dev 서버 `astro dev`) · 빌드 결과 `dist/` 검사(check:seo) | `.claude/launch.json` | 맞음 — 브라우저 확인 |
| 콘텐츠 비중 | 추적 129 중 `.md` 37 · `.svg` 34 · 글 22(초안 6) | `git ls-files` · `ls src/content/blog` | content kind 와 겹치는 단서 — 판정(T-002697)은 web · 글 규칙은 레포 조문으로 |

**판정: 등록부 web 과 실측이 맞는다.** 멈출 일 없음.

## 2. layout

- 헌법 문서 0(이번이 첫 설치) · 플로우는 하나(글 한 편 = Business Flow — 사용자 합의 2026-11-23) → **통합형**(`docs/constitution/WORKFLOW.md` 하나)으로 시작한다. 플로우가 둘 이상 생기면 나눈다.

## 3. 이미 도는 규칙 원천 (들어오는 길 (가) — 지우지 않고 들인다)

| 원천 | 줄 | 다스리는 것 | 집행 |
| --- | --- | --- | --- |
| `AGENTS.md`(= `CLAUDE.md` 심링크) | 42 | 운영 규칙 15 줄 — 저장소 · 메뉴 · push 금지 · build 먼저 · 커밋 접두어 · 스킬 넷 · 팀원 정보 · draft 기본 · gh api 확인 · 초안 완성 순서 · SEO · 비밀값 · 디자인 토큰 · 다크 모드 없음 | 문서(전역 push 훅) |
| `WRITING_GUIDE.md` | 711 | 팀원용 글쓰기 정본 — 분류 기준 · frontmatter · 공개 금지 정보 · 발행 절차 · 개발자 말 · 용어 · 검색과 AI | 문서 + check-posts |
| `docs/claude-management.md` | 313 | 설정 · 절차 전체 | 문서 |
| `docs/design-tokens.md` | 219 | 디자인 토큰 정의서(정본 `src/styles/tokens.css`) | check-tokens(build 안) |
| 스킬 `blog-compose` | 103 | 취재해서 쓰는 글 — 뼈대 → 질문 → 살 붙이기 → 사실 확인 → 초안 마무리 | 문서 |
| 스킬 `blog-write` | 137 | 받은 문서 옮기기 — 내용 그대로 · 원본 대조 | `npm run import` 대조 |
| 스킬 `blog-wording` | 75 | 개발자 용어 · 용어집(`src/data/glossary.json`) | check-wording(build 밖) |
| 스킬 `blog-seo` | 61 | 검색 · AI 전달 | check-seo(build 뒤 · 초안 모드) |
| `scripts/check-tokens.mjs` | 73 | 색상 값 · 원시 토큰 · 정의 안 된 토큰 금지 | `npm run build` 안 |
| `scripts/check-posts.mjs` | 139 | 비밀값 · 금지 HTML · alt 누락 | `npm run build` 안 |
| `scripts/check-wording.mjs` | 176 | 피할 말 · 용어집 | 따로 실행(build 밖) |
| `scripts/check-seo.mjs` | 98 | 제목 · 설명 길이 · 요약 절 · 글 링크 · 빌드 결과 메타 | 따로 실행(build 뒤) |
| `.github/workflows/check.yml` | — | PR 빌드 확인 | GitHub Actions |
| `.github/workflows/deploy.yml` | — | main push → Pages | GitHub Actions |

- 집행의 빈틈: check-wording · check-seo 는 `npm run build` 에 들어 있지 않다(규칙 문서가 «초안 마무리 때 돌린다» 고만 적음).

## 4. 기계 전제

| 도구 | 판 | 명령 |
| --- | --- | --- |
| node | v24.22.0(`.nvmrc` 24) | `node -v` |
| npm | 11.6.1 | `npm -v` |
| astro | 7.3.2 | `npm ls astro` |
| sharp | 0.35.4(그림 PNG 확인용) | `npm ls sharp` |
| 빌드 | `npm run build` rc 0 · 약 68 초(이 기계) | `time npm run build` |

## 5. 가지 · 원격

| 가지 | 머리 | main 에 들어 있나 | 처분 |
| --- | --- | --- | --- |
| `main` | 16cb73c | — | origin/main 보다 5 커밋 앞(초안 커밋 · push 는 사용자) |
| `claude/*` 다섯 | 7e4281f · f0d5d1c · 7e4281f · 9b0aa35 · a5f42cd | 모두 예 | 지우지 않음 · 처분은 사용자(판정 단서) |
| `config/google-analytics` | a4fb923 | 예 | 〃 |
| `edit/seo-summaries` | 60673a8 | **아니오 — 1 커밋**(옛 글 일곱 «한 줄로» · 별도 작업) | 사용자에게 물음 |
| `style/default-og-image` | 3002af8 | **아니오 — 1 커밋** | 사용자에게 물음 |
| `post/backend-ax-automation-rate` | 11ce73a | 아니오(글 수정 2) | 글 레인 |
| `docs/constitution-setup` | 이 레인 | — | — |

- 원격 `github.com/Cati-time/blog`(다른 org) · 통합선 `main-cicd` 없음(첫 착지가 세움).

## 6. 훅 · 세션 설정

- 레포 `.claude/settings*.json` 없음 — 훅은 전역(`~/.claude`)뿐 · 레포 훅 선언 0.
- `.claude/launch.json` 있음(dev 서버 미리보기) · `.claude/worktrees/` 있음.

## 7. 사용자 결정 (2026-11-23)

1. 글 한 편 = Business Flow 한 번 · 정지점 = 사용자가 초안을 보고 «발행» · 대응표는 `INSTALL_PLAN.md` §사용자 결정.
2. 일하는 길: 글 가지 `post/<slug>` → 통합선 `main-cicd` 착지 → 사용자가 main 머지 · push.
3. 감독 레인은 설치 감수 ② PASS 뒤(C237 ⑴).

## 감사 (1b)

(다른 세션이 다시 잰 결과를 여기 적는다)

## Development

dev 서버는 직접 띄우지 않고 로컬 CI 큐로 띄운다(전역 규칙 · WORKFLOW 칸 15 V1 · 포트 3310 ~ 3319). 손으로 볼 때만 `astro dev --background` · `astro dev stop` · `astro dev status` · `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## 블로그 운영 규칙 (Claude)

> **헌법**: 이 저장소는 canon 판 **0.44.0** · web-kind **0.1.0** 의 인스턴스다 — `docs/constitution/RULES.md`(코드 · 글 규칙 `R-BLOG-*`) · `WORKFLOW.md`(루트 플로우 «글 한 편» · 레인 선 · 감독) · `AMENDMENT.md`(개정 절차). **헌법은 단독 편집 금지 — `AMENDMENT.md` 절차로.** 이 파일과 안내 문서 · 스킬은 헌법을 가리킨다. 겹치면 헌법이 이긴다. `CLAUDE.md` 는 이 파일의 심링크다.

설정 · 절차 안내는 [docs/claude-management.md](docs/claude-management.md), 팀원용 글쓰기 안내는 [WRITING_GUIDE.md](WRITING_GUIDE.md).

- 저장소 `Cati-time/blog` · 사이트 `https://cati-time.github.io/blog/`. 링크는 `BASE_URL` 기준 — R-BLOG-BASE-URL.
- 새 글: `npm run new "제목" slug --category <…> --platform <…> --tags a,b` → `src/content/blog/<slug>/index.md`(기본 `draft: true` · 발행은 `--publish` 가 아니라 사용자 «발행» 뒤 frontmatter 로) — R-BLOG-DRAFT.
- 메뉴 · 분류의 정본은 `site.config.mjs` 의 `CATEGORIES` · `PLATFORMS`. 애매하면 사용자에게 묻는다 — R-BLOG-TAXONOMY.
- **일하는 길**: 레인 가지(`post/<slug>` · `docs/<slug>` 등) → 로컬 CI(`localci`) 초록 → 통합선 `main-cicd`. **`main` 머지 · push(= 공개 배포)는 사용자** — WORKFLOW 칸 6. «push 하면 배포됩니다» 대신 «main-cicd 에 착지했습니다 · main 머지 · push 하면 배포됩니다» 라고 알린다.
- 완료 기준은 WORKFLOW 칸 5 — 글 초안은 build · `check:seo -- <slug> --strict` · `check:wording --strict` 0 · 사실 확인 막음 0.
- 커밋 메시지 접두어: `post:` 새 글 · 발행 · `edit:` 글 수정 · `fix:` 버그 · `style:` 디자인 · `config:` 설정 · `chore:` 의존성 · 도구 · `docs(constitution):` 헌법.
- 글 흐름: 취재해서 쓰는 글 = WORKFLOW 칸 2 루트 플로우(스킬 `blog-compose` 가 절차) · 받은 문서 = R-BLOG-VERBATIM(스킬 `blog-write`) · 용어 = R-BLOG-WORDING(`blog-wording`) · AI 티 걷어내기 · 새 패턴 배우기 = `blog-humanize`(서브에이전트가 고치고 본체가 판정) · 검색 · AI = R-BLOG-SEO(`blog-seo`) · 숫자 = R-BLOG-FACTS · 인용 = R-BLOG-QUOTES.
- 팀원 · 프로젝트는 받은 그대로 — R-BLOG-REAL-PEOPLE.
- 공개 글 안전 · 비밀값 — R-BLOG-PUBLIC-SAFE. 저장소 설정(`gh api`) 변경은 사용자 확인 — RULES §7.
- 스타일은 토큰으로만 · 다크 모드 없음(사용자 2026-09-29) — R-BLOG-TOKENS · RULES §5 지향.

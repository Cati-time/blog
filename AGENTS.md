## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

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

설정·절차 전체는 [docs/claude-management.md](docs/claude-management.md) 참고. 팀원용 글쓰기 안내의 정본은 [WRITING_GUIDE.md](WRITING_GUIDE.md) — 글쓰기 규칙(분류 기준, frontmatter, 공개 금지 정보, 발행 절차)을 바꾸면 이 문서도 같은 커밋에서 고친다.

- 저장소: `Cati-time/blog`, 사이트: `https://cati-time.github.io/blog/` (`site.config.mjs` 의 `base: '/blog'`). 링크는 항상 `import.meta.env.BASE_URL` 기준으로 만든다.
- 글: `npm run new "제목" slug --category <ax|architecture> --platform <android|ios|spring|web|back-office> --tags a,b [--draft]` → `src/content/blog/<slug>/index.md`, 주소는 `/posts/<slug>/`.
- 메뉴: 상단 대분류 2개(AX, Architecture) × 하위 플랫폼 5개. 목록의 정본은 `site.config.mjs` 의 `CATEGORIES`·`PLATFORMS` 이고 스키마·메뉴·페이지·새 글 스크립트가 모두 여기서 읽는다. 글의 분류가 애매하면 사용자에게 묻는다.
- **push 는 하지 않는다.** 전역 hook 이 막고, main push 는 곧 공개 배포다. 커밋까지 하고 "push 하면 배포됩니다" 라고 알린다.
- 커밋 전 반드시 `npm run build` 통과를 확인한다. build 는 `astro check`(타입 검사) 후 빌드하므로 GitHub Actions 배포도 타입 오류가 있으면 멈춘다.
- 커밋 메시지 접두어: `post:` 새 글·발행, `edit:` 글 수정, `fix:` 버그, `style:` 디자인, `config:` 설정, `chore:` 의존성·도구.
- **사용자가 Markdown·HTML 문서를 주면 `blog-write` 스킬(`.claude/skills/blog-write/`)을 따른다 — 스타일만 걷어내고 내용은 그대로.** 변환은 `npm run import` 가 하고 원본과 본문 글자를 대조한다. Claude 는 결과 본문을 고치지 않는다(허용: frontmatter·alt·비밀값 가리기·강조 표기, 사용자가 콕 집은 곳). HTML 은 `index.md` 안 블록으로만, `npm run check:posts` 가 비밀값·금지 HTML·alt 누락을 빌드에서 막는다. 문장부호 자동 변환(smartPunctuation)은 꺼 둔다.
- 소개 페이지의 팀원(`src/content/team/*.yaml`)·프로젝트(`src/content/projects/*.yaml`)는 **실존 인물·실제 업무 정보**다. 이름·역할·소개·프로젝트 내용을 지어내지 않고 사용자에게 받은 그대로 넣는다. 형식은 WRITING_GUIDE.md §11 "소개 페이지에 팀원·프로젝트 추가".
- 새 글은 기본 `draft: true` 로 만들고, 사용자가 "발행" 이라고 할 때만 `draft: false` 로 바꾼다.
- `gh api` 로 저장소 설정(Pages, Discussions 등)을 바꾸는 작업은 실행 전에 사용자에게 확인한다. 조회(`gh run list`, graphql 읽기)는 바로 해도 된다.
- 토큰·비밀값은 파일이나 채팅에 남기지 않는다.
- **스타일은 디자인 토큰으로만 쓴다.** 정본 `src/styles/tokens.css`, 정의서 [docs/design-tokens.md](docs/design-tokens.md) (두 파일은 같은 커밋에서 수정). 컴포넌트에 색상 값·원시 토큰(`--p-*`)·정의 안 된 토큰을 쓰면 `npm run check:tokens` 가 빌드를 막는다. **다크 모드는 지원하지 않는다**(사용자 결정 2026-09-29) — 다크 테마·토글을 다시 넣지 않는다.

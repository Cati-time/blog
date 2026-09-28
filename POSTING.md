# 글쓰기 가이드

## 1. 새 글 만들기

```bash
npm run new "글 제목" my-post-slug --tags astro,blog
```

- `my-post-slug` 는 URL 이 됩니다 → `/posts/my-post-slug/` (사이트 기준 `https://cati-time.github.io/blog/posts/my-post-slug/`). 영문 소문자·숫자·하이픈만 쓰세요.
- 한글 제목만 넣고 slug 를 생략하면 `2026-09-14-1130` 같은 날짜 slug 가 자동 생성됩니다.
- `--draft` 를 붙이면 초안으로 생성됩니다. 초안은 개발 서버에서만 보이고 배포에는 포함되지 않습니다.

생성되는 파일: `src/content/blog/my-post-slug/index.md`

## 2. Frontmatter

```yaml
---
title: '글 제목'                 # 필수
description: '한 줄 요약'         # 목록·RSS·검색엔진에 표시. 꼭 채우세요.
pubDate: 2026-09-14              # 필수. YYYY-MM-DD
updatedDate: 2026-09-20          # 선택. 수정일
tags: ['astro', 'blog']          # 선택. 태그 페이지가 자동 생성됩니다
draft: false                     # true 면 배포 제외
heroImage: './cover.png'         # 선택. 글 폴더 안의 이미지
---
```

## 3. 본문

- 마크다운 그대로. `.mdx` 로 바꾸면 컴포넌트도 넣을 수 있습니다.
- 이미지: 글 폴더에 넣고 `![설명](./image.png)`. 빌드 시 자동 최적화됩니다.
- 코드: ` ```언어 ` 로 감싸면 하이라이팅됩니다.
- 읽기 시간은 본문 길이로 자동 계산됩니다.

## 4. 미리보기

```bash
npm run dev
```

http://localhost:4321 에서 확인. 저장하면 즉시 반영됩니다. 초안(`draft: true`)도 여기서는 보입니다.

## 5. 발행

```bash
git add .
git commit -m "post: 글 제목"
git push
```

`main` 브랜치에 push 하면 GitHub Actions 가 자동으로 빌드·배포합니다. 1~2분 뒤 사이트에 반영됩니다.

## 6. 자주 하는 작업

| 하고 싶은 것 | 방법 |
| --- | --- |
| 블로그 제목·설명·GitHub 링크 변경 | `site.config.mjs` |
| 댓글(giscus) 연결 | `site.config.mjs` 의 `GISCUS` 채우기 (`README.md` 참고) |
| 소개 페이지 수정 | `src/pages/about.astro` |
| 홈에 보이는 최근 글 개수 | `site.config.mjs` 의 `recentPostsCount` |
| 글 삭제 | 글 폴더 삭제 |
| 글 URL 변경 | 폴더 이름 변경 (기존 링크는 깨집니다) |
| 색상·글꼴 | `src/styles/global.css` |

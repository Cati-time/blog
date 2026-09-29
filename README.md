# Dev Blog

Astro + GitHub Pages 기술 블로그. 댓글은 giscus, 피드는 RSS.

- 글쓰기 방법 → [POSTING.md](./POSTING.md)
- 디자인 토큰 → [docs/design-tokens.md](./docs/design-tokens.md)

## 로컬 실행

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # 토큰 검사 + 타입 검사 (빌드 없이)
npm run build      # 토큰 검사 → 타입 검사 → dist/ 에 정적 파일 생성
npm run preview    # 빌드 결과 미리보기
npm run new "제목" slug --category ax --platform android --tags a,b   # 새 글
```

## 처음 한 번만 하는 설정

### 1. 사이트 정보

`site.config.mjs` 에서 `url`, `title`, `author`, `github` 를 바꾸세요.

- 저장소 이름이 `<아이디>.github.io` 이면 `base: '/'` 그대로.
- 다른 이름(예: `blog`)이면 `url: 'https://<아이디>.github.io'`, `base: '/blog'`.

### 2. GitHub 저장소 + Pages

1. GitHub 저장소: `Cati-time/blog` (**Public 필수** — Free 플랜 Organization 은 비공개 저장소에서 Pages 를 쓸 수 없음)
2. 이 폴더를 push
   ```bash
   git remote add origin https://github.com/Cati-time/blog.git
   git push -u origin main
   ```
3. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 변경
4. Actions 탭에서 배포가 끝나면 `https://cati-time.github.io/blog/` 접속

### 3. 댓글 (giscus)

1. 저장소 **Settings → General → Features → Discussions** 체크
2. https://github.com/apps/giscus 에서 **Install** → 이 저장소 선택
3. https://giscus.app 에 저장소 이름 입력 → Discussion 카테고리 `Announcements` 선택
4. 페이지 하단에 나오는 `data-repo-id`, `data-category-id` 값을 `site.config.mjs` 의 `GISCUS` 에 복사
5. push 하면 모든 글 하단에 댓글창이 생깁니다

## 구조

```
site.config.mjs          ← 블로그 설정 (여기만 고치면 됨)
src/content/blog/        ← 글 (폴더 하나 = 글 하나)
  hello-world/index.md
scripts/new-post.mjs     ← npm run new
src/pages/               ← 홈 / [category]/[...platform](메뉴) / posts(글) / 태그 / 소개 / rss.xml
src/layouts/BlogPost.astro
src/components/          ← Header, Footer, PostList, Tags, Giscus
.github/workflows/deploy.yml  ← main push 시 자동 배포
```

---
title: '블로그를 시작합니다'
description: 'Astro + GitHub Pages 로 만든 기술 블로그의 첫 글. 글쓰기 방법과 지원하는 문법을 정리했습니다.'
pubDate: 2026-09-14
category: architecture
platform: web
tags: ['blog', 'astro']
draft: false
---

Astro 와 GitHub Pages 로 만든 기술 블로그입니다. 이 글은 **글쓰기 예시**이자 문법 테스트용입니다. 지워도 됩니다.

## 새 글 쓰는 법

터미널에서 한 줄이면 됩니다.

```bash
npm run new "글 제목" my-post-slug --category architecture --platform web --tags astro,blog
```

그러면 `src/content/blog/my-post-slug/index.md` 가 생기고 그 안의 frontmatter 만 채운 뒤 본문을 쓰면 됩니다.

## 코드 하이라이팅

Shiki 기반으로 대부분의 언어를 지원합니다.

```ts
export async function getPosts() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
```

```kotlin
fun main() {
    println("Hello, Blog!")
}
```

## 표

| 기능 | 방법 |
| --- | --- |
| 댓글 | giscus (GitHub Discussions) |
| 피드 | `/rss.xml` 자동 생성 |
| 태그 | frontmatter `tags: [...]` |
| 초안 | frontmatter `draft: true` |

## 인용

> 기록하지 않으면 없던 일이 된다.

## 이미지

글 폴더에 이미지를 넣고 상대 경로로 넣으면 빌드 시 자동 최적화됩니다.

```md
![설명](./screenshot.png)
```

## 다음 할 일

1. `site.config.mjs` 에서 블로그 제목과 GitHub 아이디를 바꾼다.
2. GitHub 저장소를 만들고 push 한다.
3. giscus 를 연결한다.

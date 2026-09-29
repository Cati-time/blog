# Cati time Tech Blog

Cati time 팀의 기술 블로그입니다. AI 전환(AX)과 아키텍처 경험을 Android · iOS · Spring · Web · Back-office 별로 기록합니다.

**🔗 https://cati-time.github.io/blog/**

| 문서 | 내용 |
| --- | --- |
| 📝 **[블로그 작성 가이드](WRITING_GUIDE.md)** | 설치, 로컬 미리보기, 글쓰기, 발행까지 — **팀원은 여기부터** |
| 🤖 [Claude 와 함께 쓰기](WRITING_GUIDE.md#8-claude-와-함께-쓰기) | Claude Code 에서 `/blog-write` — 초안 작성, HTML·Markdown 문서 옮기기, 발행 준비 |
| 🎨 [디자인 토큰 정의서](docs/design-tokens.md) | 색·글꼴·간격 규칙 |
| ⚙️ [Claude Code 로 관리하기](docs/claude-management.md) | 저장소 설정, Claude 운영 규칙 |

## 3분 시작

Node.js 22.12 이상이 필요합니다 (`brew install node`).

```bash
git clone https://github.com/Cati-time/blog.git
cd blog && ./scripts/setup.sh
npm run dev
```

브라우저에서 **http://localhost:4321/blog/** 를 엽니다.

## 글 쓰는 흐름

```
브랜치 만들기 → npm run new … → 작성·로컬 확인 → PR → 리뷰·머지 → 1~2분 뒤 자동 배포
```

```bash
npm run new "Compose 상태 관리 정리" compose-state --category architecture --platform android --tags compose --draft
```

| 메뉴 | 하위 메뉴 |
| --- | --- |
| **AX** — AI 로 개발·업무 방식을 바꾼 기록 | Android · iOS · Spring · Web · Back-office |
| **Architecture** — 구조와 설계, 기술 의사결정 | Android · iOS · Spring · Web · Back-office |

자세한 내용은 **[블로그 작성 가이드](WRITING_GUIDE.md)** 를 보세요.

## 기술 구성

| 영역 | 사용 |
| --- | --- |
| 사이트 생성 | [Astro](https://astro.build) 7, 마크다운 |
| 호스팅 | GitHub Pages (`main` 에 머지되면 GitHub Actions 가 자동 배포) |
| PR 검사 | GitHub Actions — 디자인 토큰 검사 → 글 검사(비밀값·금지 HTML) → 타입 검사 → 빌드 |
| 댓글 | giscus (GitHub Discussions) — 설정 방법은 [관리 문서](docs/claude-management.md) |
| 피드 | `/blog/rss.xml`, 사이트맵 |

## 관리자용

- 블로그 제목, 메뉴(분류·플랫폼), 댓글 설정: `site.config.mjs`
- 저장소 설정(Pages, Discussions, giscus): [docs/claude-management.md](docs/claude-management.md)
- 라이선스: Apache-2.0 ([LICENSE](LICENSE))

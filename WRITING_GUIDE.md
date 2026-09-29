# 블로그 작성 가이드

Cati time Tech Blog 에 글을 쓰는 팀원을 위한 안내서입니다. 처음이라면 위에서부터 순서대로 따라 하세요.

- 블로그: https://cati-time.github.io/blog/
- 저장소: https://github.com/Cati-time/blog

---

## 목차

1. [한눈에 보기](#1-한눈에-보기)
2. [처음 한 번만: 준비](#2-처음-한-번만-준비)
3. [내 컴퓨터에서 블로그 띄워 보기](#3-내-컴퓨터에서-블로그-띄워-보기)
4. [새 글 만들기](#4-새-글-만들기)
5. [본문 쓰는 법](#5-본문-쓰는-법)
6. [좋은 글을 위한 약속](#6-좋은-글을-위한-약속)
7. [발행하기](#7-발행하기)
8. [자주 만나는 문제](#8-자주-만나는-문제)
9. [참고](#9-참고)

---

## 1. 한눈에 보기

```
① 준비(처음 한 번)  →  ② 브랜치 만들기  →  ③ 새 글 생성·작성  →  ④ 로컬에서 확인  →  ⑤ PR 올리기  →  ⑥ 머지되면 자동 배포
```

| 단계 | 명령 또는 행동 | 시간 |
| --- | --- | --- |
| 준비 | `./scripts/setup.sh` | 처음 한 번, 2~3분 |
| 새 글 | `npm run new "제목" slug --category … --platform …` | 몇 초 |
| 미리보기 | `npm run dev` → http://localhost:4321/blog/ | 저장하면 바로 반영 |
| 발행 | PR 올리기 → 리뷰 → 머지 | 머지 후 1~2분 뒤 사이트 반영 |

---

## 2. 처음 한 번만: 준비

### 2-1. 저장소 권한

`Cati-time/blog` 저장소에 **쓰기 권한**이 있어야 브랜치를 올리고 PR 을 만들 수 있습니다. 권한이 없으면 Cati-time 조직 관리자에게 요청하세요.

### 2-2. 필요한 도구

| 도구 | 용도 | 설치 |
| --- | --- | --- |
| **Node.js 22.12 이상** | 블로그 빌드·미리보기 | `brew install node` 또는 https://nodejs.org (LTS) |
| **Git** 또는 **GitHub Desktop** | 저장소 받기·올리기 | Git 은 macOS 에 기본 포함, GitHub Desktop 은 https://desktop.github.com |
| 편집기 (권장: VS Code) | 글 쓰기 | 저장소를 열면 Astro 확장 설치를 권유합니다 |

> nvm 을 쓴다면 저장소 폴더에서 `nvm install && nvm use` 한 번이면 맞는 Node 버전이 설치됩니다 (`.nvmrc`).

### 2-3. 저장소 받기

**GitHub Desktop**

1. **File → Clone Repository**
2. **GitHub.com** 탭에서 `Cati-time/blog` 선택
3. 저장할 위치를 고르고 **Clone**

**터미널**

```bash
git clone https://github.com/Cati-time/blog.git
```

### 2-4. 설치 스크립트 실행

저장소 폴더에서 한 줄이면 됩니다.

```bash
cd blog && ./scripts/setup.sh
```

스크립트가 하는 일은 셋입니다.

1. Node.js 버전 확인. 없거나 낮으면 설치 방법을 알려주고 멈춥니다.
2. 의존성 설치 (`npm ci`)
3. 빌드 검사. 여기까지 통과하면 준비 끝입니다.

스크립트 없이 직접 하려면 `npm ci` 만 실행해도 됩니다.

---

## 3. 내 컴퓨터에서 블로그 띄워 보기

```bash
npm run dev
```

브라우저에서 **http://localhost:4321/blog/** 를 엽니다. 주소 끝의 `/blog/` 까지 입력해야 합니다. 실제 사이트 주소가 `…github.io/blog/` 이라 로컬도 같은 경로를 씁니다.

- 글 파일을 저장하면 브라우저가 자동으로 새로고침됩니다.
- **초안(`draft: true`)도 로컬에서는 보입니다.** 목록에 노란 "초안" 표시가 붙습니다. 실제 사이트에는 나오지 않습니다.
- 끄려면 터미널에서 `Ctrl + C`

실제 배포될 결과물 그대로 확인하고 싶을 때:

```bash
npm run build && npm run preview
```

`npm run build` 는 배포 때와 같은 검사를 모두 돕니다. PR 을 올리기 전에 한 번 돌려 보면 좋습니다.

---

## 4. 새 글 만들기

### 4-1. 작업 브랜치 만들기

`main` 에 바로 올리면 즉시 공개 배포되므로 **글마다 브랜치를 만들어** PR 로 올립니다.

- GitHub Desktop: **Current Branch → New Branch** → 이름 `post/<slug>` (예: `post/compose-state`)
- 터미널:

```bash
git switch main && git pull && git switch -c post/compose-state
```

### 4-2. 글 파일 생성

```bash
npm run new "Compose 상태 관리 정리" compose-state --category architecture --platform android --tags compose,state --draft
```

| 인자 | 필수 | 설명 |
| --- | --- | --- |
| `"제목"` | ✅ | 글 제목. 나중에 파일에서 바꿔도 됩니다 |
| `slug` | 권장 | 주소가 됩니다 → `/blog/posts/compose-state/`. **영문 소문자·숫자·하이픈**만. 생략하면 날짜로 자동 생성 |
| `--category` | ✅ | 대메뉴: `ax` 또는 `architecture` (아래 표) |
| `--platform` | ✅ | 하위 메뉴: `android` · `ios` · `spring` · `web` · `back-office` |
| `--tags` | 선택 | 쉼표로 구분 |
| `--draft` | 권장 | 초안으로 생성. 다 쓰고 발행할 때 해제합니다 |

그러면 아래 파일이 생깁니다. **글 하나 = 폴더 하나**이고, 이미지도 이 폴더에 넣습니다.

```
src/content/blog/compose-state/
└── index.md
```

### 4-3. 어느 메뉴에 넣을까

| 대메뉴 | 이런 글 | 예시 |
| --- | --- | --- |
| **AX** (AI Transformation) | AI 로 개발·업무 방식을 바꾼 이야기. 도구, 자동화, 에이전트, 실험 | Claude Code 로 PR 리뷰 자동화 · Figma → 코드 파이프라인 · 사내 LLM 도입기 |
| **Architecture** | 구조와 설계. 아키텍처, 패턴, 기술 의사결정, 트러블슈팅 | 모듈 분리 전략 · 인증 흐름 설계 · 캐시 도입 결정기 |

| 하위 메뉴 | 대상 |
| --- | --- |
| **Android** | 안드로이드 앱 |
| **iOS** | iOS 앱 |
| **Spring** | Spring 기반 서버 |
| **Web** | 웹 프론트엔드 |
| **Back-office** | 사내 운영 도구, 어드민 |

여러 플랫폼에 걸친 글은 **가장 중심이 되는 플랫폼 하나**를 고르고, 나머지는 태그로 표시합니다.

### 4-4. Frontmatter (글 맨 위 설정)

```yaml
---
title: 'Compose 상태 관리 정리'      # 필수
description: 'remember, ViewModel, StateFlow 를 언제 쓰는지 정리합니다.'  # 목록·검색·공유 미리보기에 나옵니다. 꼭 채우세요
pubDate: 2026-09-29                  # 필수. YYYY-MM-DD
updatedDate: 2026-10-05              # 선택. 수정했을 때
category: architecture               # 필수. ax | architecture
platform: android                    # 필수. android | ios | spring | web | back-office
tags: ['compose', 'state']           # 선택
draft: true                          # true 면 사이트에 안 나옵니다
heroImage: './cover.png'             # 선택. 글 폴더 안의 대표 이미지
---
```

- `category`·`platform` 에 목록에 없는 값을 쓰면 **빌드가 실패**합니다. 오타 방지용입니다.
- 태그는 **영문 소문자, 여러 단어는 하이픈**으로 씁니다 (`jetpack-compose`). 기존 태그는 블로그의 **태그** 페이지에서 확인하고 같은 이름을 재사용하세요.

---

## 5. 본문 쓰는 법

본문은 마크다운입니다. 자주 쓰는 것만 정리했습니다.

### 제목

글 제목은 frontmatter 의 `title` 이 `#` 역할을 합니다. **본문은 `##` 부터** 씁니다.

```md
## 큰 단락
### 작은 단락
```

### 코드

언어 이름을 꼭 붙입니다. 색이 입혀집니다.

````md
```kotlin
val state by viewModel.uiState.collectAsStateWithLifecycle()
```
````

자주 쓰는 언어: `kotlin` `swift` `java` `ts` `tsx` `js` `json` `yaml` `bash` `sql` `diff`

인라인 코드는 백틱 하나: `` `StateFlow` ``

### 이미지

이미지를 **글 폴더에 넣고** 상대 경로로 넣습니다. 빌드할 때 자동으로 최적화됩니다.

```md
![로그인 화면 흐름도](./login-flow.png)
```

- 대괄호 안의 설명(alt)은 꼭 씁니다.
- 스크린샷은 가로 1600px 이하 PNG, 사진은 JPG 가 적당합니다.

### 표 · 인용 · 링크

```md
| 방식 | 장점 | 단점 |
| --- | --- | --- |
| A | 빠름 | 복잡 |

> 인용문이나 강조하고 싶은 한 줄

[Compose 공식 문서](https://developer.android.com/jetpack/compose)
[지난 글: 모듈 분리 전략](../module-strategy/)
```

같은 블로그의 다른 글은 `../다른-글-slug/` 처럼 **상대 경로**로 겁니다.

### 컴포넌트가 필요할 때

파일 이름을 `index.mdx` 로 바꾸면 본문 안에 컴포넌트를 넣을 수 있습니다. 대부분의 글은 `.md` 로 충분합니다.

---

## 6. 좋은 글을 위한 약속

### 🔴 공개 저장소입니다 — 이것만은 꼭

블로그와 저장소는 **누구나 볼 수 있습니다.** 글을 지워도 Git 기록에 남습니다.

| 넣지 않는 것 | 예 |
| --- | --- |
| 비밀값 | API 키, 토큰, 비밀번호, 인증서 |
| 내부 주소 | 사내 도메인, 내부 IP, 관리 콘솔 URL, 클러스터·인덱스 이름 |
| 고객·사용자 데이터 | 실명, 연락처, 계정, 실데이터가 보이는 스크린샷 |
| 공개 안 된 사내 코드·계획 | 비공개 저장소 코드 원문, 미발표 기능, 계약·매출 정보 |

스크린샷은 올리기 전에 **주소창, 계정, 데이터 부분을 가립니다.** 애매하면 올리지 말고 리뷰어에게 먼저 물어보세요.

### 글 구조 추천

처음이라면 이 틀로 시작하면 쓰기 쉽습니다.

```md
## 배경        — 어떤 상황이었나
## 문제        — 무엇이 불편하거나 깨졌나
## 시도와 해결 — 무엇을 해 봤고 무엇이 통했나 (코드·그림)
## 결과        — 무엇이 나아졌나 (가능하면 숫자로)
## 정리        — 다른 사람이 가져갈 교훈 한두 줄
```

### 작은 팁

- **제목**은 검색될 말로 구체적으로: "상태 관리 이야기" 보다 "Compose 에서 StateFlow 와 remember 구분하기"
- **description** 은 한 문장 요약. 목록과 링크 공유 미리보기에 그대로 나옵니다.
- 코드는 핵심만 짧게. 전체 파일은 링크로.
- 한 글에 주제 하나. 길어지면 나눠서 시리즈로.

---

## 7. 발행하기

### 7-1. 올리기 전 체크리스트

- [ ] `title`, `description`, `category`, `platform` 채움
- [ ] `draft: false` 로 바꿈 (또는 줄 삭제)
- [ ] 로컬에서 글 화면 확인 (`npm run dev`)
- [ ] `npm run build` 통과
- [ ] 비밀값·내부 주소·개인정보 없음 ([6장](#-공개-저장소입니다--이것만은-꼭))
- [ ] 이미지에 설명(alt) 있음

### 7-2. 커밋하고 PR 올리기

커밋 메시지는 `post: 글 제목` 형식으로 씁니다. 수정이면 `edit: 글 제목`.

**GitHub Desktop**

1. 왼쪽 **Changes** 에서 바뀐 파일 확인
2. 아래 Summary 에 `post: Compose 상태 관리 정리` 입력 → **Commit to post/compose-state**
3. 위쪽 **Publish branch**
4. **Create Pull Request** → 브라우저에서 PR 작성 → 리뷰어 지정

**터미널**

```bash
git add src/content/blog/compose-state && git commit -m "post: Compose 상태 관리 정리" && git push -u origin post/compose-state
```

푸시 후 터미널에 나오는 링크나 GitHub 저장소 페이지에서 PR 을 만듭니다.

### 7-3. 리뷰와 머지

- PR 을 올리면 **빌드 검사가 자동으로** 돕니다. PR 화면에 초록 체크가 떠야 머지할 수 있는 상태입니다.
- 리뷰어 한 명 이상이 확인한 뒤 **Merge** 합니다.
- 머지하면 **1~2분 뒤 사이트에 자동 반영**됩니다. 진행 상황은 저장소의 **Actions** 탭에서 볼 수 있습니다.

### 7-4. 발행한 글 고치기

같은 방식으로 브랜치 → 수정 → PR 입니다. 내용이 크게 바뀌었으면 `updatedDate` 를 넣어 주세요. 글 상단에 수정일이 표시됩니다.

⚠ **slug(폴더 이름)는 바꾸지 마세요.** 주소가 바뀌어 이미 공유된 링크가 깨집니다.

---

## 8. 자주 만나는 문제

| 증상 | 원인 | 해결 |
| --- | --- | --- |
| `localhost:4321` 에 404 | 주소에 `/blog/` 가 빠짐 | http://localhost:4321/blog/ 로 접속 |
| `npm: command not found` | Node.js 미설치 | [2-2](#2-2-필요한-도구) 참고 후 `./scripts/setup.sh` |
| `Unsupported engine` / Node 버전 오류 | Node 22.12 미만 | `brew upgrade node` 또는 `nvm install && nvm use` |
| 빌드 에러 `category: Invalid option` | 분류 오타 | `ax` / `architecture` 중 하나로 |
| 빌드 에러 `platform: Invalid option` | 플랫폼 오타 | `android` `ios` `spring` `web` `back-office` 중 하나로 |
| 빌드 에러 `check-tokens: … 위반` | 스타일 파일에 색상 값을 직접 씀 | 글 작성과는 무관합니다. 디자인 수정 시 [디자인 토큰 정의서](docs/design-tokens.md) 참고 |
| 글이 사이트에 안 보임 | `draft: true` 그대로 | `draft: false` 로 바꾸고 다시 PR |
| 이미지가 깨짐 | 경로 오류 | 이미지가 글 폴더 안에 있고 `./파일명` 으로 적었는지 확인 |
| 포트 4321 이 이미 사용 중 | dev 서버가 이미 떠 있음 | 떠 있는 창을 쓰거나 `Ctrl + C` 로 끈 뒤 다시 실행. Astro 가 자동으로 다른 포트를 쓰기도 하니 터미널에 찍힌 주소를 확인 |
| PR 의 빌드 검사가 빨간색 | 빌드 실패 | PR 의 **Details** 에서 로그 확인. 로컬 `npm run build` 로 같은 에러가 재현됩니다 |

---

## 9. 참고

### 폴더 구조

```
src/content/blog/<slug>/index.md   ← 글 (여기만 건드리면 됩니다)
site.config.mjs                    ← 블로그 제목, 메뉴(분류·플랫폼), 댓글 설정
src/styles/tokens.css              ← 디자인 토큰 (색·글꼴·간격)
src/pages/                         ← 페이지 (홈, 메뉴, 글, 태그, 소개, RSS)
scripts/new-post.mjs               ← npm run new
scripts/setup.sh                   ← 설치 스크립트
.github/workflows/                 ← PR 빌드 검사, main 자동 배포
```

### 명령 모음

| 명령 | 하는 일 |
| --- | --- |
| `./scripts/setup.sh` | 처음 설치 |
| `npm run dev` | 미리보기 서버 (http://localhost:4321/blog/) |
| `npm run new "제목" slug --category … --platform …` | 새 글 |
| `npm run build` | 배포와 같은 검사 + 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run check` | 검사만 (빌드 없이) |

### 관련 문서

- [README](README.md) — 저장소 소개
- [디자인 토큰 정의서](docs/design-tokens.md) — 디자인을 고칠 때
- [Claude Code 로 관리하기](docs/claude-management.md) — Claude 에게 초안 작성·점검을 맡길 때

메뉴 항목 추가, 디자인 변경처럼 글 이외의 수정은 먼저 블로그 관리자와 이야기해 주세요.

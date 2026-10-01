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
8. [문서 가져오기](#8-문서-가져오기--노션구글-문서markdown-을-그대로)
9. [Claude Code 로 포스팅하기](#9-claude-code-로-포스팅하기)
10. [자주 만나는 문제](#10-자주-만나는-문제)
11. [참고](#11-참고)

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
| (선택) 기존 문서 가져오기 | `npm run import …` | [8장](#8-문서-가져오기--노션구글-문서markdown-을-그대로) |
| (선택) Claude Code 로 포스팅 | "이 문서 블로그로 옮겨줘" | [9장](#9-claude-code-로-포스팅하기) |

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
- 그림 캡션은 이미지 바로 아래 줄에 문단으로 씁니다. 글 폴더 이미지를 HTML `<img>` 로 쓰면 블로그에 표시되지 않으니 **꼭 `![설명](./파일)` 로** 씁니다.

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

블로그는 쓴 문장부호를 **그대로** 보여 줍니다. `--force` 나 `"따옴표"` 가 다른 모양으로 바뀌지 않습니다.

### HTML 블록

마크다운으로 안 되는 것만 HTML 로 씁니다. 글 파일은 그대로 `index.md` 입니다.

```md
<details>
<summary>전체 로그 보기</summary>

접힌 안쪽에도 **마크다운**을 쓸 수 있습니다. 앞뒤 빈 줄이 필요합니다.

</details>

저장은 <kbd>Cmd</kbd> + <kbd>S</kbd>
```

| 구분 | 태그·속성 |
| --- | --- |
| ✅ 쓸 수 있음 | `details` `summary` `kbd` `sub` `sup` `mark` `abbr`, 병합 셀이 필요한 `table` |
| ✖ 빌드 실패 | 글 폴더 이미지를 `<img>` 로 쓰기, `style` 속성, `script` `iframe` `style` `form` `object` `embed` 태그, `on…=` 이벤트 속성, `javascript:` 링크 |

공개 블로그라 스크립트와 임베드는 막혀 있습니다. `style` 은 블로그 디자인을 깨뜨려서 막았습니다. `class` 는 효과가 없으니 쓰지 않아도 됩니다.

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
- [ ] `npm run check:posts -- <slug>` 오류 0 (비밀값·금지 HTML·이미지 설명을 검사합니다)
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

## 8. 문서 가져오기 — 노션·구글 문서·Markdown 을 그대로

이미 다른 곳에 써 둔 문서가 있다면 새로 옮겨 적을 필요가 없습니다. **스타일만 걷어내고 내용은 한 글자도 바꾸지 않고** 블로그 글로 옮겨 줍니다.

| 바뀌는 것 (모양) | 그대로인 것 (내용) |
| --- | --- |
| 글자 색·글꼴·크기·배경색, `style`·`class` 속성 | 모든 글자·문장부호·순서, 맞춤법과 어투 |
| HTML → Markdown 표기 | 굵게·기울임·취소선, 링크, 목록, 표, 코드 블록, 체크리스트 |
| 이미지를 글 폴더로 복사, 그림은 마크다운 이미지로 | 병합 셀 표·접기 (정리된 HTML 로 유지), 그림 캡션 글자 (이미지 아래 문단으로) |
| 스크립트·버튼·임베드 제거 (공개 블로그에서 쓸 수 없음) | |

변환이 끝나면 **원본과 결과의 글자 순서가 완전히 같은지 자동으로 대조**합니다. 한 글자라도 다르면 어디가 다른지 알려 주고 멈춥니다.

### 8-1. 준비할 문서

| 어디서 | 내보내는 방법 |
| --- | --- |
| 노션 | 페이지 **⋯ → 내보내기 → HTML** (또는 Markdown). 받은 zip 을 풀어 폴더째 둡니다 |
| 구글 문서 | **파일 → 다운로드 → 웹페이지(.html, 압축)**. zip 을 풉니다 |
| Confluence·위키 | 페이지를 HTML 로 내보내기 |
| 직접 쓴 Markdown | `.md` 파일 그대로 |

`.docx` 와 PDF 는 바로 읽지 못합니다. HTML 이나 Markdown 으로 내보내 주세요.

### 8-2. Claude 에게 맡기기 (권장)

Claude Code 에서 이렇게 말하면 변환·검사·미리보기·커밋까지 이어서 해 줍니다.

> `/blog-write` `~/Downloads/Export-123/회고.html` 을 블로그 글로 옮겨줘

설치부터 PR 까지 전체 과정은 **[9장 Claude Code 로 포스팅하기](#9-claude-code-로-포스팅하기)** 에 있습니다.

### 8-3. 직접 실행하기

Claude 없이 명령 한 줄로도 됩니다.

```bash
npm run import -- ~/Downloads/Export-123/회고.html --slug team-retro --category architecture --platform web --tags retro
```

결과 예시:

```
✔ 가져옴: src/content/blog/team-retro/index.md  (초안)
  걷어낸 것  속성: class 11 · style 6  |  껍데기 태그: <span> 15
  뺀 요소    script 1 · button 1
  이미지    복사 2 · 외부 링크 0 · 설명(alt) 없음 1
  본문 대조  ✔ 원본과 일치 — 단어 523개, 글자·문장부호 1,840자가 같은 순서
```

그다음 `npm run check:posts -- team-retro` 로 검사하고, 이미지 설명(alt)처럼 빠진 것을 채운 뒤 `npm run dev` 로 확인합니다.

---

## 9. Claude Code 로 포스팅하기

Claude Code 를 쓰면 명령어를 외우지 않고 **말로** 포스팅할 수 있습니다. 이 저장소에는 포스팅용 스킬(`blog-write`)과 규칙(`CLAUDE.md`)이 들어 있어서, 저장소를 열기만 하면 Claude 가 이 블로그의 절차를 알고 시작합니다.

```
처음 한 번: 계정 · 설치 · 저장소 열기
      ↓
① 문서 전달  →  ② 질문에 답하기  →  ③ 결과 확인  →  ④ 결정할 것 답하기  →  ⑤ 미리보기로 읽기  →  ⑥ 커밋  →  ⑦ PR (직접)
```

### 9-1. 처음 한 번: 준비

**계정** — Claude **Pro·Max** 구독, 또는 회사의 **Team·Enterprise** 초대 계정이 필요합니다. 무료 플랜으로는 쓸 수 없습니다.

**설치** — 편한 것 하나만 고르면 됩니다.

| 방식 | 설치 | 이런 분께 |
| --- | --- | --- |
| 데스크톱 앱 | https://claude.ai 에서 앱을 받고 **Code** 탭 사용 | 터미널이 낯선 분 |
| 터미널 | `curl -fsSL https://claude.ai/install.sh \| bash` 또는 `brew install --cask claude-code` | 터미널을 자주 쓰는 분 |
| VS Code | 확장 탭에서 **Claude Code** 검색 후 설치 | VS Code 로 글을 쓰는 분 |

처음 실행하면 브라우저가 열리고 로그인합니다.

**저장소 열기** — 반드시 **저장소 폴더(`blog`)** 를 열어야 스킬과 규칙이 불러와집니다.

| 방식 | 여는 법 |
| --- | --- |
| 데스크톱 앱 | **Code** 탭 → **New session** → `blog` 폴더 선택 |
| 터미널 | `cd blog && claude` |
| VS Code | `blog` 폴더를 열고 Claude Code 패널 열기 |

처음 여는 폴더면 이 폴더를 신뢰하는지 묻는 창이 뜰 수 있습니다. 허용하세요.

**준비 확인** — 채팅창에 `/blog` 까지 입력했을 때 자동완성에 **`/blog-write`** 가 보이면 끝입니다. 안 보이면 [9-8](#9-8-claude-code-문제-해결) 을 보세요.

> 블로그 설치(2장)를 아직 안 했다면 Claude 에게 "블로그 로컬 환경 준비해줘" 라고 하면 `./scripts/setup.sh` 를 실행해 줍니다. Node.js 설치만은 직접 해야 합니다.

### 9-2. 문서 전달하기

| 가진 것 | 이렇게 전달 |
| --- | --- |
| 파일 하나 (`.md` `.html`) | 경로를 적습니다: `/blog-write ~/Downloads/회고.html 블로그로 옮겨줘` |
| 노션·구글 문서 내보내기 폴더 | zip 을 풀고 안의 `.html` 경로를 적습니다. 이미지는 따라옵니다 |
| 데스크톱 앱 | 파일을 채팅창으로 **끌어다 놓아도** 됩니다 |
| 복사한 내용 | 채팅창에 **그대로 붙여넣고** "이거 블로그 글로 옮겨줘" |

**분류를 알면 처음부터 같이 말하면** 질문이 줄어듭니다.

> `/blog-write` `~/Downloads/회고.html` 을 **Architecture › Spring** 으로, 주소는 `order-service-retro`, 태그는 `spring,retro` 로 옮겨줘

`/blog-write` 를 빼고 "이 문서 블로그로 옮겨줘" 라고만 해도 Claude 가 스킬을 알아서 씁니다.

### 9-3. 따라 하기 — 한 번의 포스팅

**① 요청**

> `/blog-write` `~/Downloads/Export-7f3/Figma to Code.html` 블로그로 옮겨줘

**② Claude 의 질문** — 문서에서 알 수 없는 것만, 제안과 함께 묻습니다.

> 대메뉴는 **AX**(AI 로 일하는 방식), 하위 메뉴는 **Web** 을 제안합니다. 주소는 `figma-to-code-pipeline` 으로 할까요? 태그는 `figma, claude-code, mcp` 를 제안합니다.

"좋아" 라고 답하거나 바꿀 것만 말합니다.

**③ 결과 보고** — 변환이 끝나면 이런 보고를 받습니다.

```
📄 Figma to Code 파이프라인  (AX › Web, 초안)
- 원본: Figma to Code.html (HTML) → src/content/blog/figma-to-code-pipeline/index.md
- 본문 대조: ✔ 원본과 일치 (단어 44개)
- 걷어낸 스타일: style 6 · class 11 · 껍데기 태그 1    뺀 요소: script 1 · button 1
- 이미지: 복사 1 (설명 없음 1 — 제안: "그림 1. 전체 흐름")
- 검사: 오류 1 · 경고 1 — 결정이 필요한 것: 이미지 설명, 한 줄 요약, 노션 하위 페이지 링크 1개
- 미리보기: http://localhost:4321/blog/posts/figma-to-code-pipeline/
```

**가장 먼저 볼 줄은 `본문 대조`** 입니다. ✔ 면 내용이 원본과 한 글자도 다르지 않다는 뜻입니다.

**④ 결정할 것에 답하기** — Claude 가 대신 정하지 않는 것들입니다.

| Claude 가 묻는 것 | 답 예시 |
| --- | --- |
| 이미지 설명(alt) | "제안대로" / "'Figma 에서 코드까지 흐름도' 로" |
| 한 줄 요약(description) | "첫 문장으로" / 직접 불러 주기 |
| 원본의 다른 문서로 가는 링크 | "링크만 풀어줘" / "https://… 로 바꿔줘" |
| 사내 주소·사설 IP·이메일 | "그 줄 지워줘" / "공개해도 되는 주소야, 그대로 둬" |
| 비밀값으로 보이는 문자열 | 가려집니다(`****`). 진짜 키라면 **즉시 폐기·재발급** |

**⑤ 미리보기로 읽기** — 보고서의 주소를 브라우저로 열고 **원본과 나란히** 읽어 봅니다. 초안이라 내 컴퓨터에서만 보입니다.

**⑥ 커밋** — "커밋해줘" 라고 하면 `post: 제목` 으로 커밋합니다. 필요하면 글 브랜치(`post/<slug>`)도 Claude 가 만듭니다.

**⑦ PR 은 직접** — Claude 는 push 하지 않습니다. GitHub Desktop 에서 **Publish branch → Create Pull Request** ([7-2](#7-2-커밋하고-pr-올리기)). 리뷰 후 머지되면 1~2분 뒤 공개됩니다.

### 9-4. 이렇게 말하면 됩니다

| 하고 싶은 것 | 말하기 |
| --- | --- |
| 문서 옮기기 | "`~/Downloads/회고.md` 블로그로 옮겨줘" |
| 분류까지 한 번에 | "… Architecture › Android 로, 주소는 `compose-state` 로" |
| 빈 글 틀 만들기 (직접 쓸 때) | "AX › iOS 에 '제목' 으로 빈 초안 만들어줘" |
| 미리보기 | "미리보기 켜줘" / "미리보기 꺼줘" |
| 검사만 | "`compose-state` 검사해줘" |
| 콕 집어 고치기 | "`compose-state` 의 '원인' 절 두 번째 문단 '로걸' 을 '로컬' 로 고쳐줘" |
| 발행 준비 | "`compose-state` 발행 준비해줘" → 체크리스트를 표로 보여 줍니다 |
| 발행 | "발행해줘" → 초안을 해제하고 커밋합니다 (PR 은 직접) |
| 이미 발행한 글 수정 | "`compose-state` 에 이 문단 추가하고 수정일 넣어줘: …" |
| PR 방법 | "PR 어떻게 올려?" |

### 9-5. 권한 확인 창

Claude 는 명령을 실행하거나 파일을 바꾸기 전에 **허용할지** 묻습니다. 이 블로그에서 자주 보는 것들입니다.

| 명령 | 하는 일 | 권장 |
| --- | --- | --- |
| `npm run import …` | 문서를 글로 변환 | 허용 |
| `npm run check:posts …` · `npm run build` | 검사 · 빌드 | 허용 (자주 나오면 "항상 허용") |
| `astro dev --background` · `astro dev stop` | 미리보기 켜기·끄기 | 허용 |
| `git switch -c post/…` · `git add` · `git commit` | 글 브랜치 · 커밋 | 내용을 확인하고 허용 |
| `git push` | 공개 배포로 이어짐 | Claude 규칙상 요청하지 않습니다. 나오면 **거절** |
| 저장소 밖 파일 삭제·수정 | — | **거절** |

"한 번 허용" 은 이번만, "항상 허용" 은 같은 명령을 다시 묻지 않습니다. 팀 전체에 같은 허용 목록을 두고 싶으면 관리자가 [docs/claude-management.md](docs/claude-management.md) §2-3 으로 설정합니다.

### 9-6. Claude 가 하는 것과 하지 않는 것

| 한다 | 하지 않는다 |
| --- | --- |
| 문서를 스타일만 빼고 변환, 본문 대조 | **본문 내용 바꾸기** — 요약·교정·재구성·덧붙이기 |
| 분류·주소·태그 제안, 모르는 것 질문 | 사용자가 "발행" 이라고 하기 전에 초안 해제 |
| 검사, 빌드, 미리보기, 커밋 | push · PR |
| 콕 집어 요청한 곳만 수정하고 보고 | 디자인·메뉴 변경 |
| 비밀값 가리기 (알리고 한다) | 사내 정보를 묻지 않고 지우거나 남기기 |

**글의 내용과 최종 확인은 작성자의 몫입니다.** 미리보기로 원본과 대조해 읽은 뒤 PR 을 올리세요.

### 9-7. 직접 쓰는 글도 Claude 와 함께

옮길 문서 없이 처음부터 쓴다면:

1. "AX › Android 에 'Compose 성능 점검' 으로 빈 초안 만들어줘" — 글 파일과 브랜치를 만들어 줍니다.
2. 편집기에서 **직접** 씁니다 ([5장](#5-본문-쓰는-법)).
3. "검사하고 미리보기 켜줘" → 문제를 알려 줍니다.
4. "커밋해줘" → PR 은 직접.

### 9-8. Claude Code 문제 해결

| 증상 | 해결 |
| --- | --- |
| `/blog-write` 가 자동완성에 안 보임 | 저장소 **루트(`blog`)** 를 열었는지 확인. 하위 폴더나 다른 폴더면 안 보입니다. 최신 `main` 을 받았는지도 확인 (`git pull`) |
| Claude 가 블로그 규칙을 모르는 것 같음 | 위와 같습니다. 세션을 새로 열면 `CLAUDE.md` 를 다시 읽습니다 |
| `npm: command not found` | Node.js 가 없습니다 ([2-2](#2-2-필요한-도구)). 설치 후 "블로그 로컬 환경 준비해줘" |
| `본문 대조 ✖` | 결과를 손으로 맞추지 말고, 보고서의 "처음 다른 곳" 을 관리자에게 알려 주세요 |
| 미리보기가 404 | 주소 끝의 `/blog/` 까지 있는지 확인 |
| Claude 가 본문을 고치려 함 | "내용은 그대로 둬" 라고 말하면 됩니다. 스킬 규칙상 본문은 콕 집은 곳만 고칩니다 |
| 로그인이 안 됨 | 무료 플랜은 쓸 수 없습니다. 회사 계정이면 관리자에게 초대를 요청하세요 |

공식 문서: [설치](https://code.claude.com/docs/en/setup) · [데스크톱 앱](https://code.claude.com/docs/en/desktop) · [스킬](https://code.claude.com/docs/en/skills)

---

## 10. 자주 만나는 문제

| 증상 | 원인 | 해결 |
| --- | --- | --- |
| `localhost:4321` 에 404 | 주소에 `/blog/` 가 빠짐 | http://localhost:4321/blog/ 로 접속 |
| `npm: command not found` | Node.js 미설치 | [2-2](#2-2-필요한-도구) 참고 후 `./scripts/setup.sh` |
| `Unsupported engine` / Node 버전 오류 | Node 22.12 미만 | `brew upgrade node` 또는 `nvm install && nvm use` |
| 빌드 에러 `category: Invalid option` | 분류 오타 | `ax` / `architecture` 중 하나로 |
| 빌드 에러 `platform: Invalid option` | 플랫폼 오타 | `android` `ios` `spring` `web` `back-office` 중 하나로 |
| 빌드 에러 `check-tokens: … 위반` | 스타일 파일에 색상 값을 직접 씀 | 글 작성과는 무관합니다. 디자인 수정 시 [디자인 토큰 정의서](docs/design-tokens.md) 참고 |
| `check-posts: … 오류` · `P1` | 비밀값으로 보이는 문자열 | 지우거나 `****` 같은 가짜 값으로 바꾸기. 진짜 키였다면 **즉시 폐기·재발급** |
| `P2` · `P3` | 금지 HTML 이나 `style` 속성 | [HTML 블록](#html-블록) 표의 허용 태그로 바꾸기 |
| `P4` | 이미지 설명(alt) 없음 또는 파일 없음 | `![설명](./파일명)` 형식과 파일 위치 확인 |
| `P5` | 글 폴더 이미지를 HTML `<img>` 로 씀 | `![설명](./파일명)` 으로 바꾸기. 표·접기 안에 있다면 밖으로 빼기 |
| `본문 대조 ✖` (문서 가져오기) | 변환 중 글자가 달라짐 | 결과 파일을 손으로 맞추지 말고, 표시된 "처음 다른 곳" 을 관리자에게 알려 주세요. 변환기 한계입니다 |
| `W8` 경고 | `**"인용"**은` 처럼 강조가 풀림 | `<strong>"인용"</strong>은` 으로 쓰기 |
| `⚠ W…` 경고 | 권장 사항 (빌드는 됨) | 메시지를 읽고 판단. 사설 IP·이메일 경고는 실제 사내 정보라면 지우기 |
| 글이 사이트에 안 보임 | `draft: true` 그대로 | `draft: false` 로 바꾸고 다시 PR |
| 이미지가 깨짐 | 경로 오류 | 이미지가 글 폴더 안에 있고 `./파일명` 으로 적었는지 확인 |
| 포트 4321 이 이미 사용 중 | dev 서버가 이미 떠 있음 | 떠 있는 창을 쓰거나 `Ctrl + C` 로 끈 뒤 다시 실행. Astro 가 자동으로 다른 포트를 쓰기도 하니 터미널에 찍힌 주소를 확인 |
| PR 의 빌드 검사가 빨간색 | 빌드 실패 | PR 의 **Details** 에서 로그 확인. 로컬 `npm run build` 로 같은 에러가 재현됩니다 |

---

## 11. 참고

### 소개 페이지에 팀원·프로젝트 추가

소개 페이지(https://cati-time.github.io/blog/about/)의 **팀원**과 **프로젝트** 카드는 파일 하나가 카드 하나입니다. 글과 같은 방식으로 브랜치 → 파일 추가 → PR 로 올립니다.

**팀원** — `src/content/team/<GitHub아이디>.yaml`

```yaml
name: 홍길동                    # 필수. 공개되는 이름 (본명·닉네임 중 원하는 것)
role: Android 개발              # 필수. 한 줄 역할
platforms: [android, back-office]  # 선택. android · ios · spring · web · back-office
bio: 앱 아키텍처와 빌드 자동화를 맡고 있습니다.   # 선택. 한두 문장
github: octocat                 # 선택. 아이디만 (주소 아님)
linkedin: https://www.linkedin.com/in/your-id   # 선택. 프로필 주소 전체
avatar: ./hong.png              # 선택. 같은 폴더의 사진. 없으면 이름 첫 글자로 표시
order: 1                        # 선택. 작을수록 앞에
```

**프로젝트** — `src/content/projects/<영문-id>.yaml`

```yaml
name: 블로그 구축                         # 필수
summary: Astro 와 GitHub Pages 로 팀 기술 블로그를 만듭니다.   # 필수. 한두 문장
status: 진행 중                           # 필수. 진행 중 · 예정 · 완료
platforms: [web]                          # 선택
period: '2026.09 –'                       # 선택. 따옴표로 감싸기
tag: astro                                # 선택. 이 태그가 달린 글을 «관련 글 N편» 으로 연결
links:                                    # 선택. 공개된 주소만
  - label: GitHub
    url: https://github.com/Cati-time/blog
order: 1                                  # 선택. 같은 상태 안에서 작을수록 앞에
```

- 프로젝트는 **진행 중 → 예정 → 완료** 순으로 자동 정렬됩니다.
- 값이 형식에 안 맞으면 빌드가 이유를 알려 주며 멈춥니다 (예: `github` 에 주소를 넣으면 "아이디만 적습니다").
- **공개 페이지입니다.** 팀원 이름·사진은 본인 동의를 받고, 프로젝트는 **외부에 공개해도 되는 범위**로만 적습니다. 미발표 기능, 고객사 이름, 사내 주소는 넣지 않습니다 ([6장](#6-좋은-글을-위한-약속)).
- Claude Code 에서는 "소개 페이지에 팀원 추가해줘: 이름 …, 역할 …" 처럼 말하면 파일을 만들어 줍니다.

### 폴더 구조

```
src/content/blog/<slug>/index.md   ← 글 (여기만 건드리면 됩니다)
src/content/team/<id>.yaml         ← 소개 페이지 팀원
src/content/projects/<id>.yaml     ← 소개 페이지 프로젝트
site.config.mjs                    ← 블로그 제목, 메뉴(분류·플랫폼), 댓글 설정
src/styles/tokens.css              ← 디자인 토큰 (색·글꼴·간격)
src/pages/                         ← 페이지 (홈, 메뉴, 글, 태그, 소개, RSS)
scripts/new-post.mjs               ← npm run new
scripts/check-posts.mjs            ← 글 검사 (npm run check:posts)
scripts/import-doc.mjs             ← 문서 가져오기 (npm run import)
.claude/skills/blog-write/         ← Claude 문서 가져오기 스킬
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
| `npm run import -- <문서> --slug … --category … --platform …` | 노션·구글 문서·Markdown 문서 가져오기 |
| `npm run check:posts -- <slug>` | 글 하나 검사 (slug 없으면 전체) |
| `npm run check` | 검사만 (토큰·글·타입, 빌드 없이) |

### 관련 문서

- [README](README.md) — 저장소 소개
- [디자인 토큰 정의서](docs/design-tokens.md) — 디자인을 고칠 때
- [Claude Code 로 관리하기](docs/claude-management.md) — 저장소 설정, Claude 운영 규칙
- [문서 가져오기 스킬](.claude/skills/blog-write/SKILL.md) · [변환 규칙](.claude/skills/blog-write/references/conversion.md) — 무엇이 바뀌고 무엇이 그대로인지

메뉴 항목 추가, 디자인 변경처럼 글 이외의 수정은 먼저 블로그 관리자와 이야기해 주세요.

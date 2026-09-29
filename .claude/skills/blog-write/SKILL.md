---
name: blog-write
description: >-
  Cati time Tech Blog(이 저장소)에 올릴 글을 사용자와 함께 쓰는 스킬. 주제·메모에서 새 초안을 쓰거나,
  기존 Markdown·HTML 문서(파일·붙여넣기·사내 문서 내보내기)를 블로그 글로 옮기거나, 이미 있는 글을 다듬고,
  발행 준비(검사·체크리스트·PR 안내)까지 한다. "블로그 글 써줘", "포스트 초안", "이 문서 블로그로 옮겨줘",
  "HTML 을 블로그 글로", "마크다운으로 정리해서 올려줘", "글 다듬어줘", "발행 준비해줘", "/blog-write" 같은 말에 실행한다.
  이 저장소 안에서 글(src/content/blog/)을 만들거나 고칠 때는 이 스킬을 먼저 따른다.
---

# blog-write — 블로그 글을 Claude 와 함께 쓰기

이 스킬은 **절차**를 담는다. 글쓰기 **규칙의 정본**은 저장소의 다른 파일이다. 규칙이 궁금하면 그쪽을 읽고, 여기에 베껴 적지 않는다.

| 무엇 | 정본 |
| --- | --- |
| 분류 기준, frontmatter, 본문 문법, 공개 금지 정보, 발행 절차 | `WRITING_GUIDE.md` |
| 대메뉴·하위 메뉴 목록 | `site.config.mjs` 의 `CATEGORIES` · `PLATFORMS` |
| 글 기계 검사 | `npm run check:posts` (`scripts/check-posts.mjs`) |
| 글 유형별 틀 | `references/templates.md` (이 스킬 폴더) |
| HTML 허용·금지, HTML 문서 옮기는 법 | `references/html.md` (이 스킬 폴더) |

## 지켜야 할 것 — 다섯

1. **사실을 지어내지 않는다.** 글의 내용(겪은 일, 수치, 코드, 결정 이유)은 사용자에게서 나온다. 모르는 부분은 비워 두지 말고 `[확인 필요: …]` 로 표시해 사용자에게 묻는다. 일반 지식으로 채운 설명은 그렇다고 말한다.
2. **공개 블로그다.** 비밀값·사내 주소·개인정보·비공개 코드가 들어가지 않게 한다(`WRITING_GUIDE.md` §6). 사용자가 준 자료에 있어도 옮기지 않고, 뺐다고 알린다.
3. **새 글은 초안으로.** `draft: true` 로 만들고, 사용자가 **"발행"** 이라고 말할 때만 `draft: false` 로 바꾼다.
4. **디자인·메뉴는 건드리지 않는다.** 확정된 디자인이다. 글에 필요한 모양이 없으면 사용자에게 말하고 멈춘다. 분류가 애매하면 **묻는다.**
5. **push 하지 않는다.** 커밋까지 하고, 올리는 것(push·PR)은 사용자가 한다.

---

## 절차

### 0. 시작 점검 (한 번에)

```bash
git status -sb && git branch --show-current && ls node_modules >/dev/null 2>&1 && echo deps-ok || echo "deps-missing → ./scripts/setup.sh"
```

- **`main` 위라면 글 브랜치를 먼저 만든다**: `git switch -c post/<slug>` (slug 가 아직 없으면 4단계 직전에). 팀은 PR 로 발행한다.
- 커밋 안 된 남의 변경이 있으면 건드리지 말고 사용자에게 알린다.
- 의존성이 없으면 `./scripts/setup.sh` 를 실행한다.

### 1. 무엇을 하려는지 가른다

| 모드 | 신호 | 가는 곳 |
| --- | --- | --- |
| **A. 새 글** | 주제·메모·대화 내용만 있다 | 2 → 3 → 4 → 5 |
| **B. 문서 옮기기** | `.md` · `.html` 파일, 붙여넣은 문서, 노션·위키 내보내기 | 2 → `references/html.md` → 4 → 5 |
| **C. 다듬기** | 이미 있는 글(slug·경로) | 5 (고칠 점 목록 → 합의 → 수정) |
| **D. 발행 준비** | "발행", "올릴 준비" | 6 |

### 2. 필요한 것만 묻는다

이미 받은 정보는 다시 묻지 않는다. 빠진 것만, **제안과 함께** 한 번에 묻는다.

| 항목 | 기본 제안 |
| --- | --- |
| 대메뉴 `category` | 내용으로 추천 (AI 로 일하는 방식 → `ax`, 구조·설계·트러블슈팅 → `architecture`). **애매하면 반드시 묻는다** |
| 하위 메뉴 `platform` | 중심 플랫폼 하나 (`android` `ios` `spring` `web` `back-office`) |
| 독자 | 사내 개발자 / 외부 개발자 — 설명 깊이가 달라진다 |
| 글 유형 | `references/templates.md` 의 네 가지 중 하나 |
| slug | 제목을 영문 kebab-case 로 제안 (예: `compose-state-management`) |
| 형식 | Markdown (기본). HTML 이 꼭 필요할 때만 `references/html.md` |

### 3. 개요를 먼저 합의한다 (모드 A)

`references/templates.md` 에서 유형에 맞는 틀을 골라 **제목 후보 2~3개 + description 한 줄 + `##` 목차 + 각 절에 들어갈 사용자 자료**를 보여 주고 한 번 확인받는다. 사용자가 "바로 써줘" 라고 했으면 이 확인은 건너뛴다.

### 4. 글 파일을 만들고 쓴다

```bash
npm run new "<제목>" <slug> --category <ax|architecture> --platform <…> --tags <a,b> --draft
```

- 생성된 `src/content/blog/<slug>/index.md` 의 frontmatter 를 채운다. **description 은 꼭** 채운다.
- 본문은 `##` 부터. 코드 블록에는 언어를 단다. 이미지는 글 폴더에 두고 `![설명](./파일.png)`.
- 사용자가 준 이미지·스크린샷 파일은 글 폴더로 복사하고, 개인정보·사내 주소가 보이면 가려 달라고 말한다(직접 편집하지 않는다).
- 문체는 사용자의 기존 글이 있으면 그것을 따른다. 없으면 `~합니다` 체, 짧은 문장, 한 절에 한 주제.

### 5. 검사하고 보여 준다

```bash
npm run check:posts -- <slug>      # 오류(✖)는 반드시 고친다. 경고(⚠)는 사용자와 판단
npm run build                      # 토큰 → 글 → 타입 검사 → 빌드
astro dev --background             # 미리보기 (이미 떠 있으면 생략)
```

- 미리보기 주소: `http://localhost:4321/blog/posts/<slug>/` (초안도 로컬에서는 보인다)
- 사용자에게 **바뀐 파일, 검사 결과, 미리보기 주소, `[확인 필요]` 목록**을 준다.
- 모드 C 는 고칠 점을 **목록으로 먼저** 보여 주고, 사용자가 고른 것만 고친다.

### 6. 발행 준비 (모드 D)

`WRITING_GUIDE.md` §7-1 체크리스트를 하나씩 확인해 결과를 표로 보여 준다. 사용자가 **"발행"** 을 말했으면 `draft: false` 로 바꾸고, 이미 발행된 글을 크게 고쳤으면 `updatedDate` 를 넣는다. slug(폴더 이름)는 바꾸지 않는다.

### 7. 커밋

```bash
npm run build && git add src/content/blog/<slug> && git commit -m "post: <제목>"     # 수정이면 "edit: <제목>"
```

push 는 하지 않는다. 마지막에 사용자에게 올리는 방법을 알려 준다: GitHub Desktop **Publish branch → Create Pull Request**, 또는 `git push -u origin post/<slug>` 후 PR. 머지되면 1~2분 뒤 자동 배포된다.

---

## 보고 틀

```
📝 <제목>  (<대메뉴> › <플랫폼>, 초안)
- 파일: src/content/blog/<slug>/index.md
- 검사: 오류 0 · 경고 N  (남긴 경고와 이유)
- 미리보기: http://localhost:4321/blog/posts/<slug>/
- 확인 필요: [확인 필요] 로 표시한 곳 N개 — 무엇을 알려 주면 되는지
- 뺀 것: 공개하면 안 돼서 옮기지 않은 내용 (있으면)
- 다음: "발행" 이라고 하시면 draft 를 해제합니다 / 커밋 완료, PR 만 올리면 됩니다
```

---
name: blog-write
description: >-
  사용자가 준 Markdown·HTML 문서를 Cati time Tech Blog(이 저장소)의 글로 옮기는 스킬. 스타일(색·글꼴·크기·class·style 속성)만
  걷어내고 **내용은 한 글자도 바꾸지 않고** 그대로 옮긴 뒤, 원본과 본문이 일치하는지 기계로 대조하고, 검사·미리보기·발행 준비까지 한다.
  노션·구글 문서·Confluence 에서 내보낸 HTML, 직접 쓴 .md, 붙여넣은 문서 모두 된다. "이 문서 블로그로 옮겨줘",
  "HTML 을 블로그 글로", "마크다운 올려줘", "노션 내보내기 글로 만들어줘", "이 파일 포스트로", "발행 준비해줘", "/blog-write" 같은 말에 실행한다.
---

# blog-write — 문서를 스타일만 빼고 그대로 블로그 글로

**이 스킬의 약속: 내용은 원본 그대로.** 문장을 고치거나, 요약하거나, 순서를 바꾸거나, 덧붙이거나, 빼지 않는다. 맞춤법·어투도 그대로 둔다. 바꾸는 것은 **모양(스타일)** 뿐이다.

변환은 Claude 가 손으로 하지 않는다. `npm run import` 스크립트가 기계적으로 하고, **원본과 결과의 글자 순서가 완전히 같은지** 대조해 보고한다. Claude 는 스크립트를 돌리고, 결과를 판정하고, 사용자가 결정할 것을 묻는다.

| 무엇 | 정본 |
| --- | --- |
| 변환기가 하는 일·안 하는 일, 허용 HTML | `references/conversion.md` (이 스킬 폴더) |
| 대메뉴·하위 메뉴 목록 | `site.config.mjs` 의 `CATEGORIES` · `PLATFORMS` |
| frontmatter, 공개 금지 정보, 발행 절차 | `WRITING_GUIDE.md` |
| 변환 스크립트 · 글 검사 | `scripts/import-doc.mjs` (`npm run import`) · `scripts/check-posts.mjs` (`npm run check:posts`) |

---

## Claude 가 결과 본문에서 고쳐도 되는 것 — 이것뿐

| 고칠 수 있는 것 | 조건 |
| --- | --- |
| frontmatter (`description`, `tags`, `title`, `pubDate`) | 본문이 아니다. 원본에 없으면 사용자에게 받거나, 원문 문장을 그대로 제안해 확인받는다 |
| 이미지 설명(`alt`) | 원본에 없을 때만. 제안하고 **사용자 확인 후** 넣는다 |
| 강조 표기 방식 (`**"…"**은` → `<strong>"…"</strong>은`) | 글자는 같고 표기만 바뀐다 (검사 W8) |
| 비밀값 가리기 (`****`) | 검사 P1. 내용 변경이므로 **사용자에게 알리고** 한다 |
| 로컬 문서 링크 | 사용자가 정한 대로 — 공개 주소로 교체 또는 링크만 풀기(글자는 유지) |

그 밖의 본문 수정은 하지 않는다. 사용자가 "여기 고쳐줘" 라고 **콕 집어** 말하면 그 부분만 고치고, 고친 곳을 보고한다.

---

## 절차

### 0. 시작 점검 (한 번에)

```bash
git status -sb && git branch --show-current && ls node_modules >/dev/null 2>&1 && echo deps-ok || echo "deps-missing → ./scripts/setup.sh"
```

- `main` 위라면 글 브랜치를 만든다: `git switch -c post/<slug>` (팀은 PR 로 발행한다)
- 커밋 안 된 남의 변경이 있으면 건드리지 말고 알린다. 의존성이 없으면 `./scripts/setup.sh`.

### 1. 문서를 받는다

| 받은 것 | 할 일 |
| --- | --- |
| 파일 경로 (`.md` `.html`) | 그대로 쓴다 |
| 폴더 (노션 내보내기 등) | 안의 `.html`·`.md` 본문 파일을 쓴다. 이미지는 그 파일 기준 상대 경로로 따라온다 |
| 채팅에 붙여넣은 내용 | 스크래치 폴더(없으면 `/tmp`)에 **받은 그대로** 저장한다. 태그가 있으면 `.html`, 아니면 `.md` |
| `.docx` · PDF · 구글 문서 링크 | 변환기가 못 읽는다. HTML 이나 Markdown 으로 내보내 달라고 한다 (구글 문서: 파일 → 다운로드 → 웹페이지) |

### 2. 필요한 것만 묻는다

문서에서 알 수 있는 것은 묻지 않는다. 빠진 것만 **제안과 함께** 한 번에 묻는다.

| 항목 | 제안 방법 |
| --- | --- |
| 대메뉴 `--category` | 내용으로 추천 (AI 로 일하는 방식 → `ax`, 구조·설계·트러블슈팅 → `architecture`). **애매하면 반드시 묻는다** |
| 하위 메뉴 `--platform` | 중심 플랫폼 하나: `android` `ios` `spring` `web` `back-office` |
| `--slug` | 제목을 영문 kebab-case 로 제안 |
| `--tags` | 선택. 문서의 핵심 기술 이름 |
| 제목 | 문서 맨 앞 `#` 제목이나 HTML `<title>` 을 자동으로 쓴다. 없을 때만 `--title` |

### 3. 변환한다

```bash
npm run import -- "<문서 경로>" --slug <slug> --category <…> --platform <…> [--tags a,b] [--title "…"] [--date YYYY-MM-DD]
```

결과는 `src/content/blog/<slug>/index.md` (초안, `draft: true`) 와 같은 폴더의 이미지들이다.

### 4. 보고서를 판정한다

| 보고 줄 | 판정 |
| --- | --- |
| `본문 대조 ✔` | 통과. 내용이 원본과 같다 |
| `본문 대조 ✖` (종료 코드 3) | 🔴 **결과 파일을 손으로 맞추지 않는다.** 보고서의 "처음 다른 곳" 을 사용자에게 그대로 보여 주고, 변환기 한계인지 원본 문제인지 함께 본다 |
| `뺀 요소` | script·form·svg 등 옮길 수 없는 것. 사용자에게 무엇이 빠졌는지 알린다 (svg·video 는 이미지 파일로 넣을지 묻는다) |
| `이미지 … 설명(alt) 없음` · `파일 못 찾음` | 설명을 제안해 확인받는다 / 파일 위치를 묻는다 |
| `⚠ 링크` | 원본의 다른 문서를 가리키는 링크. 공개 주소로 바꿀지, 링크만 풀지 묻는다 |
| `강조 보존` · `제목 단계` | 참고 정보. 글자는 그대로다 |

### 5. 검사한다

```bash
npm run check:posts -- <slug>
```

| 결과 | 할 일 |
| --- | --- |
| ✖ P1 비밀값 | 사용자에게 위치를 알리고 `****` 로 가린다. 진짜 키라면 **폐기·재발급**을 권한다 |
| ✖ P2 · P3 | 변환기가 이미 걷어내므로 보통 안 나온다. 나오면 보고한다 |
| ✖ P4 이미지 | 4단계와 같다 |
| ✖ P5 HTML 이미지 | 표·접기 같은 HTML 블록 안의 이미지. 블록 밖으로 빼도 되는지 사용자에게 묻는다 (글자는 그대로) |
| ⚠ W1 description | 원문에서 한 문장을 제안하거나 사용자에게 받는다 |
| ⚠ W4 사설 IP · W5 이메일 | **지우지 않는다.** 원문 그대로 두고, 공개해도 되는지 사용자에게 묻는다 (`WRITING_GUIDE.md` §6) |
| ⚠ W8 강조 | 표기만 `<strong>`·`<em>` 태그로 바꾼다 |

### 6. 보여 준다

```bash
npm run build          # 토큰 → 글 → 타입 검사 → 빌드
astro dev --background # 미리보기 (이미 떠 있으면 생략)
```

미리보기: `http://localhost:4321/blog/posts/<slug>/` — 초안도 로컬에서는 보인다. 사용자에게 **원본과 나란히 열어 비교**해 보라고 권한다.

### 7. 커밋 · 발행

```bash
git add src/content/blog/<slug> && git commit -m "post: <제목>"
```

- push 하지 않는다. 올리는 법을 알려 준다: GitHub Desktop **Publish branch → Create Pull Request**, 또는 `git push -u origin post/<slug>` 후 PR.
- 사용자가 **"발행"** 이라고 하면 `WRITING_GUIDE.md` §7-1 체크리스트를 확인해 표로 보여 주고 `draft: false` 로 바꿔 커밋한다.

---

## 보고 틀

```
📄 <제목>  (<대메뉴> › <플랫폼>, 초안)
- 원본: <파일명> (HTML|Markdown) → src/content/blog/<slug>/index.md
- 본문 대조: ✔ 원본과 일치 (단어 N개)
- 걷어낸 스타일: style N · class N · 껍데기 태그 N    뺀 요소: script N …
- 이미지: 복사 N (설명 없음 N — 제안: "…")
- 검사: 오류 0 · 경고 N  — 결정이 필요한 것: (사설 IP·이메일·로컬 링크 …)
- 미리보기: http://localhost:4321/blog/posts/<slug>/
- 다음: 커밋 완료, PR 만 올리면 됩니다 / "발행" 이라고 하시면 초안을 해제합니다
```

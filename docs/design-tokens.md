# 디자인 토큰 정의서

블로그의 모든 시각 값(색·글꼴·크기·간격·모서리·그림자·움직임·레이아웃)은 **토큰**으로만 쓴다.
정본은 [`src/styles/tokens.css`](../src/styles/tokens.css) 하나이고, 이 문서는 그 파일의 설명서다.
**두 파일은 같은 커밋에서 함께 고친다.**

- 디자인 방향: 넉넉한 여백, 색은 브랜드 초록 하나만, 한글 본문 가독성 우선
- **라이트 단일 테마.** 다크 모드는 지원하지 않는다 (사용자 결정 2026-09-29). 다크 테마·토글을 다시 넣지 않는다.
- 참고한 테마: AstroPaper, Astro Theme Pure, Astro Cactus (2026-09 기준 Astro 인기 블로그 테마)
- 브랜드 색: Cati-time 조직 로고의 초록 계열

---

## 1. 구조 — 3단

| 층 | 접두어 | 역할 | 컴포넌트에서 사용 |
| --- | --- | --- | --- |
| Primitive | `--p-*` | 원시 팔레트. 색 이름 + 명도 | ❌ 금지 |
| Semantic | `--color-*` | 역할 이름. 컴포넌트가 쓰는 색은 전부 이 층 | ✅ |
| Scale | `--font-*` `--text-*` `--leading-*` `--weight-*` `--tracking-*` `--space-*` `--radius-*` `--shadow-*` `--duration-*` `--ease-*` `--size-*` `--z-*` | 테마와 무관한 치수 | ✅ |

```
--p-green-700  ──▶  --color-accent  ──▶  a { color: var(--color-accent) }
 (원시 값)          (역할)      (컴포넌트)
```


---

## 2. 색상

### 2-1. Primitive 팔레트

| 토큰 | 값 | | 토큰 | 값 |
| --- | --- | --- | --- | --- |
| `--p-gray-0` | `#ffffff` | | `--p-green-50` | `#ecfdf5` |
| `--p-gray-50` | `#f8f9fa` | | `--p-green-100` | `#d1fae5` |
| `--p-gray-100` | `#f1f3f5` | | `--p-green-300` | `#6ee7b7` |
| `--p-gray-200` | `#e5e7eb` | | `--p-green-400` | `#34d399` |
| `--p-gray-300` | `#d1d5db` | | `--p-green-500` | `#10b981` |
| `--p-gray-400` | `#9ca3af` | | `--p-green-600` | `#059669` |
| `--p-gray-500` | `#6b7280` | | `--p-green-700` | `#047857` |
| `--p-gray-600` | `#4b5563` | | `--p-green-800` | `#065f46` |
| `--p-gray-700` | `#374151` | | `--p-green-900` | `#064e3b` |
| `--p-gray-800` | `#1f2937` | | `--p-amber-100` | `#fef3c7` |
| `--p-gray-850` | `#171b22` | | `--p-amber-300` | `#fcd34d` |
| `--p-gray-900` | `#111318` | | `--p-amber-800` | `#92400e` |
| `--p-gray-950` | `#0b0d10` | | `--p-amber-950` | `#2b1d05` |

### 2-2. Semantic 색상

| 토큰 | 용도 | 값 |
| --- | --- | --- |
| `--color-bg` | 페이지 배경 | gray-0 |
| `--color-bg-subtle` | 인용·표 머리 등 옅은 면 | gray-50 |
| `--color-surface` | 카드 면 | gray-0 |
| `--color-surface-hover` | 목록·버튼 hover 면 | gray-50 |
| `--color-header-bg` | 반투명 헤더(블러) | white 80% |
| `--color-border` | 기본 구분선 | gray-200 |
| `--color-border-strong` | 강조 구분선 | gray-300 |
| `--color-text` | 본문·제목 | gray-900 |
| `--color-text-muted` | 설명·부제 | gray-600 |
| `--color-text-subtle` | 날짜·메타 **(본문 금지)** | gray-500 |
| `--color-accent` | 링크·활성·포인트 | green-700 |
| `--color-accent-hover` | 링크 hover | green-800 |
| `--color-accent-contrast` | accent 면 위 글자 | gray-0 |
| `--color-accent-soft` | 태그·활성 메뉴 면 | green-50 |
| `--color-accent-soft-text` | soft 면 위 글자 | green-800 |
| `--color-code-bg` | 코드 블록 면 | gray-50 |
| `--color-code-border` | 코드 블록 테두리 | gray-200 |
| `--color-inline-code-bg` | 인라인 코드 면 | gray-100 |
| `--color-inline-code-text` | 인라인 코드 글자 | gray-800 |
| `--color-draft-bg` | 초안 배지 면 | amber-100 |
| `--color-draft-text` | 초안 배지 글자 | amber-800 |
| `--color-selection` | 텍스트 선택 | green-100 |
| `--color-focus-ring` | 키보드 포커스 링 | green-600 |

### 2-3. 대비 기준 (WCAG)

| 조합 | 대비 | 기준 |
| --- | --- | --- |
| text / bg | 18.6:1 | AAA |
| text-muted / bg | 7.6:1 | AAA |
| text-subtle / bg | 4.8:1 | AA |
| accent / bg | 5.5:1 | AA |

`--color-text-subtle` 은 **날짜·개수·캡션 같은 보조 정보에만** 쓰고, 읽어야 하는 문장에는 `--color-text-muted` 를 쓴다.

---

## 3. 타이포그래피

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--font-sans` | Pretendard Variable → Apple SD Gothic Neo → Noto Sans KR → Malgun Gothic → system-ui | 전체 |
| `--font-mono` | JetBrains Mono → D2Coding → ui-monospace → Menlo | 코드, 홈 eyebrow |

Pretendard 는 jsDelivr 의 dynamic subset 으로 불러와 필요한 글자 범위만 내려받는다. 불러오지 못하면 OS 한글 글꼴로 넘어간다.

| 토큰 | 값 | px | 용도 |
| --- | --- | --- | --- |
| `--text-xs` | 0.75rem | 12 | 태그, 배지 |
| `--text-sm` | 0.875rem | 14 | 메타, 메뉴, 코드 블록 |
| `--text-base` | 1rem | 16 | UI 기본 |
| `--text-md` | 1.0625rem | 17 | **글 본문** |
| `--text-lg` | 1.25rem | 20 | 목록 제목, h4, 부제 |
| `--text-xl` | 1.5rem | 24 | h3 |
| `--text-2xl` | 1.875rem | 30 | h2, 모바일 글 제목 |
| `--text-3xl` | 2.25rem | 36 | 글 제목, 페이지 제목 |
| `--text-4xl` | 3rem | 48 | 홈 히어로 |

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--leading-tight` | 1.25 | 제목 |
| `--leading-snug` | 1.4 | 목록 제목, 부제 |
| `--leading-normal` | 1.6 | UI, 코드 |
| `--leading-relaxed` | 1.8 | **한글 본문** |
| `--weight-regular` / `medium` / `semibold` / `bold` | 400 / 500 / 600 / 700 | |
| `--tracking-tight` | -0.02em | 제목 |
| `--tracking-normal` | 0 | 기본 |

본문은 `word-break: keep-all` 로 한글 단어가 중간에서 끊기지 않게 한다.

---

## 4. 간격 · 모서리 · 그림자 · 움직임 · 레이아웃

### 간격 — 4px 그리드

| 토큰 | 값 | px |
| --- | --- | --- |
| `--space-0` | 0 | 0 |
| `--space-1` | 0.25rem | 4 |
| `--space-2` | 0.5rem | 8 |
| `--space-3` | 0.75rem | 12 |
| `--space-4` | 1rem | 16 |
| `--space-5` | 1.25rem | 20 |
| `--space-6` | 1.5rem | 24 |
| `--space-8` | 2rem | 32 |
| `--space-10` | 2.5rem | 40 |
| `--space-12` | 3rem | 48 |
| `--space-16` | 4rem | 64 |
| `--space-20` | 5rem | 80 |

### 모서리

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--radius-sm` | 0.25rem | 인라인 코드, 배지 |
| `--radius-md` | 0.5rem | 버튼, 메뉴 |
| `--radius-lg` | 0.75rem | 코드 블록, 이미지, 목록 hover 면 |
| `--radius-full` | 999px | 태그 알약 |

### 그림자

| 토큰 | 값 |
| --- | --- |
| `--shadow-sm` | 0 1px 2px / 6% |
| `--shadow-md` | 0 4px 16px / 8% |

### 움직임

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--duration-fast` | 120ms | hover |
| `--duration-base` | 200ms | 예비 (큰 전환) |
| `--ease-standard` | cubic-bezier(0.2, 0, 0, 1) | 전부 |

`prefers-reduced-motion: reduce` 이면 전환 시간을 0으로 만든다.

### 레이아웃

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--size-content` | 44rem (704px) | 본문 폭 (한글 한 줄 약 38~40자) |
| `--size-page` | 60rem (960px) | 헤더·푸터 폭 |
| `--size-header` | 3.75rem (60px) | 헤더 높이, 앵커 스크롤 여백 |
| `--z-header` | 10 | 고정 헤더 |

### 브레이크포인트

CSS 변수는 미디어쿼리 안에서 쓸 수 없어 **값으로 고정**한다.

| 이름 | 값 | 쓰는 법 |
| --- | --- | --- |
| sm | 40rem (640px) | `@media (max-width: 40rem)` — 모바일 |
| md | 48rem (768px) | `@media (max-width: 48rem)` — 태블릿 (필요할 때) |

---

## 5. 사용 규칙 — `npm run check:tokens` 가 기계로 검사

`npm run check` 와 `npm run build`(= GitHub Actions 배포)가 이 검사를 먼저 돌린다. 위반이 있으면 배포되지 않는다.

| 규칙 | 내용 | 예 |
| --- | --- | --- |
| **R1** | `tokens.css` 밖의 스타일에서 색상 값을 직접 쓰지 않는다 (`#hex`, `rgb()`, `hsl()`, `oklch()` …) | ❌ `color: #047857` → ✅ `color: var(--color-accent)` |
| **R2** | 원시 토큰 `--p-*` 를 컴포넌트에서 참조하지 않는다 | ❌ `var(--p-gray-200)` → ✅ `var(--color-border)` |
| **R3** | 정의되지 않은 토큰을 참조하지 않는다 (같은 파일에서 선언한 지역 변수는 예외) | ❌ `var(--space-7)` |

검사 대상은 `src/` 아래 `.css` 파일과 `.astro` 의 `<style>` 블록, `style=""` 속성이다.

검사가 잡지 않지만 지키는 것:

- 간격·글자 크기·모서리는 **스케일 토큰으로** 쓴다. 1px 테두리, 3px 점처럼 토큰보다 작은 장식 치수만 예외다.
- 새 색이 필요하면 **Semantic 토큰을 먼저 추가**하고 원시 팔레트에 매핑한다.
- 같은 역할이 두 번 이상 나오면 토큰으로 올린다. 한 번만 쓰는 값은 컴포넌트 안에 둔다.

---

## 6. 토큰 바꾸는 절차

1. `src/styles/tokens.css` 수정
2. 이 문서의 해당 표 수정 — 같은 커밋
3. `npm run build` 통과 확인 (토큰 검사 → 타입 검사 → 빌드)
4. `npm run dev` 로 화면 확인
5. 커밋 접두어 `style:`

브랜드 색을 바꾸려면 `--p-green-*` 대신 새 팔레트를 추가하고 `--color-accent*`, `--color-selection`, `--color-focus-ring` 의 매핑만 바꾸면 된다. 컴포넌트는 고치지 않는다.

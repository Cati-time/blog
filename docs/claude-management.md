# Claude Code로 블로그 관리하기 — 설정 가이드

이 문서는 `Cati-time/blog` 저장소를 Claude Code가 대신 관리할 수 있도록 **한 번만 해두면 되는 설정**과,
설정 후 **Claude에게 일을 맡기는 절차**를 정리합니다.

- 사이트: https://cati-time.github.io/blog/
- 저장소: https://github.com/Cati-time/blog (Public, Organization `Cati-time`)
- 로컬 경로: `~/Documents/0.dev/blog`

---

## 1. 역할 분담 (먼저 알아둘 것)

이 맥에는 전역 hook(`~/.claude/hooks/guard-workspace.py`)이 있어서 **Claude는 어떤 저장소에서도 `git push`를 할 수 없습니다.**
이 규칙을 유지하는 것을 전제로 역할을 나눕니다.

| 작업 | 누가 | 필요한 설정 |
| --- | --- | --- |
| 글 초안 작성·수정, 빌드 검증, 로컬 커밋 | Claude | 없음 (지금 가능) |
| `git push` (= 배포 트리거) | **사용자** | GitHub Desktop 또는 터미널 |
| GitHub Pages 활성화 | Claude | GitHub CLI 로그인 (§2-1) |
| Discussions 켜기 | Claude | GitHub CLI 로그인 (§2-1) |
| giscus 앱 설치 | **사용자** | 브라우저, 조직 Owner 권한 (§2-2) |
| giscus ID 조회 → 설정 파일 반영 | Claude | GitHub CLI 로그인 |
| 배포(Actions) 결과 확인, 실패 원인 분석 | Claude | GitHub CLI 로그인 |
| 댓글·Discussions 조회 | Claude | GitHub CLI 로그인 |

> Claude가 push까지 하게 하려면 §5 를 보세요. 권장하지는 않습니다 — main 으로 push 하는 순간 바로 공개 배포되기 때문에, 마지막 확인은 사람이 하는 편이 안전합니다.

---

## 2. 1회 설정 절차 (사용자가 할 일)

### 2-0. 지금 쌓여 있는 커밋 올리기

로컬에 원격보다 앞선 커밋이 있습니다. 먼저 push 하세요.

```bash
cd ~/Documents/0.dev/blog && git push -u origin main
```

GitHub Desktop 을 쓴다면 **File → Add Local Repository** 로 이 폴더를 추가한 뒤 **Push origin** 을 누르면 됩니다.

### 2-1. GitHub CLI 설치 + 로그인

Claude가 GitHub 설정·배포 상태를 다루는 통로입니다. push 권한과는 별개입니다.

```bash
brew install gh
```

```bash
gh auth login --hostname github.com --git-protocol https --web --scopes "repo,workflow,read:org"
```

- 브라우저가 열리면 **Cati-time 조직의 Owner 계정**(현재 `catius-io`)으로 승인합니다. Pages·Discussions 설정은 저장소 관리자 권한이 필요합니다.
- 승인 화면에 **Organization access** 항목이 보이면 `Cati-time` 옆의 **Grant**(또는 Request)를 누르세요. 새로 만든 조직은 외부 OAuth 앱 접근이 기본 차단이라, 이걸 빠뜨리면 조직 저장소 API 호출이 403 으로 실패합니다.
- 토큰을 채팅에 붙여넣지 마세요. 로그인 정보는 macOS 키체인에 저장됩니다.

확인:

```bash
gh auth status && gh api repos/Cati-time/blog --jq .permissions
```

`"admin": true` 가 보이면 완료입니다.

<details>
<summary>대안: Fine-grained 토큰으로 권한을 최소화하고 싶을 때</summary>

GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token

- Resource owner: `Cati-time` (조직이 fine-grained 토큰을 허용해야 함: 조직 Settings → Personal access tokens)
- Repository access: Only select repositories → `blog`
- Permissions (Repository):
  - Administration: Read and write — Discussions 켜기
  - Pages: Read and write — Pages 활성화
  - Discussions: Read and write — giscus 카테고리 조회, 댓글 조회
  - Actions: Read — 배포 결과 확인
  - Contents: Read — push 는 사용자가 하므로 읽기면 충분
  - Metadata: Read (자동)

발급한 토큰은 터미널에서 직접 입력합니다.

```bash
gh auth login --with-token
```

</details>

### 2-2. giscus 앱 설치 (브라우저, 사람만 가능)

1. https://github.com/apps/giscus 접속 → **Install**
2. 설치 대상으로 **Cati-time** 선택
3. **Only select repositories** → `blog` 선택 → Install

앱 설치는 API 로 할 수 없어서 이 단계만 직접 해야 합니다.

### 2-3. (선택) Claude Code 권한 프롬프트 줄이기

매번 승인 창이 뜨는 게 번거로우면 이 저장소의 `.claude/settings.json` 에 자주 쓰는 명령을 허용해 둘 수 있습니다.
원하면 Claude에게 **"docs/claude-management.md 2-3 권한 설정 적용해줘"** 라고 하세요.

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run import *)",
      "Bash(npm run check*)",
      "Bash(npm run build)",
      "Bash(npm run dev*)",
      "Bash(npm run new *)",
      "Bash(astro dev *)",
      "Bash(npx astro *)",
      "Bash(git status*)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git switch -c post/*)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(gh run list*)",
      "Bash(gh run view*)"
    ],
    "deny": [
      "Bash(git push*)",
      "Bash(gh repo delete*)"
    ]
  }
}
```

- 허용 목록은 **글 작업에 필요한 명령**만 담았다. `gh api` 는 저장소 설정을 바꿀 수 있어 넣지 않는다 (규칙상 실행 전에 확인받는다).
- `git push` 는 Claude 가 하지 않는 일이라 거부 목록에 둔다. 사람이 GitHub Desktop·터미널에서 push 하는 것에는 영향이 없다.
- 이 파일을 커밋하면 저장소를 받은 **팀원 모두에게** 적용된다.

---

## 3. 설정 후 Claude에게 맡기는 절차

§2 를 마친 뒤 Claude에게 **"docs/claude-management.md 3번 진행해줘"** 라고 하면 아래를 순서대로 실행합니다.
각 단계는 저장소 설정을 바꾸는 작업이라 Claude가 실행 전에 한 번 확인을 받습니다.

### 3-1. GitHub Pages 활성화 (배포 방식: GitHub Actions)

```bash
gh api -X POST repos/Cati-time/blog/pages -f build_type=workflow
```

이미 켜져 있으면 409 가 나오고, 그때는 방식만 바꿉니다.

```bash
gh api -X PUT repos/Cati-time/blog/pages -f build_type=workflow
```

### 3-2. Discussions 켜기

```bash
gh api -X PATCH repos/Cati-time/blog -F has_discussions=true
```

켜면 `Announcements`, `General`, `Q&A` 등 기본 카테고리가 생깁니다. giscus 는 **Announcements** 를 씁니다 — 관리자와 giscus 만 새 글타래를 만들 수 있어 스팸에 강합니다.

### 3-3. giscus ID 조회 → `site.config.mjs` 반영

```bash
gh api graphql -f query='{ repository(owner:"Cati-time", name:"blog") { id discussionCategories(first:20) { nodes { id name } } } }'
```

- `repository.id` → `GISCUS.repoId`
- `Announcements` 의 `id` → `GISCUS.categoryId`

Claude가 값을 채우고 빌드 검증 후 커밋합니다. **push 는 사용자가** 합니다.

### 3-4. 배포 확인

push 이후 Claude에게 **"배포 확인해줘"** 라고 하면:

```bash
gh run list -R Cati-time/blog --limit 5
```

```bash
gh run view -R Cati-time/blog --log-failed
```

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://cati-time.github.io/blog/
```

`200` 이면 배포 완료. 글 하단에 댓글창이 보이면 giscus 연결도 끝입니다.

---

## 4. 일상 운영 — 이렇게 말하면 됩니다

사용자가 준 Markdown·HTML 문서를 글로 옮기는 일은 저장소 스킬 `blog-write` 가 절차를 정한다 — 스타일만 빼고 내용은 그대로 (`/blog-write`, 사용법은 WRITING_GUIDE.md §8).

| 요청 예시 | Claude가 하는 일 | push |
| --- | --- | --- |
| "Kotlin 코루틴 예외 처리로 글 초안 써줘" | `npm run new ... --draft` → 본문 작성 → 빌드 검증 → 커밋 | 사용자 (초안이라 배포돼도 안 보임) |
| "이 글 발행해줘" | `draft: false` 로 변경, description·태그 점검 → 빌드 → 커밋 | 사용자 |
| "오타·링크 점검해줘" | 전체 글 검사 후 수정 커밋 | 사용자 |
| "배포 확인해줘" | Actions 결과·사이트 응답 확인, 실패 시 원인 분석·수정 커밋 | 사용자 |
| "새 댓글 있어?" | Discussions 조회해서 요약 | — |
| "의존성 업데이트해줘" | `npm outdated` → 업데이트 → 빌드 검증 → 커밋 | 사용자 |
| "디자인/기능 바꿔줘" | 컴포넌트 수정 → dev 서버로 화면 확인 → 커밋 | 사용자 |

커밋이 끝나면 Claude가 "push 하면 배포됩니다" 라고 알려줍니다. 그때 GitHub Desktop 에서 **Push origin** 또는 `git push` 를 하면 됩니다.

---

## 4-1. 검색엔진 등록 (SEO)

### 자동으로 되는 것 — 손댈 필요 없음

| 항목 | 어디서 |
| --- | --- |
| 페이지마다 제목 · 설명 · 대표 주소(canonical) | `src/components/BaseHead.astro` |
| 공유 미리보기 이미지 — 글의 `heroImage`, 없으면 `public/og-default.png` | 기본 이미지 다시 만들기: `node scripts/make-og.mjs` |
| 구조화 데이터 — 글: BlogPosting + 위치 경로(BreadcrumbList) · 홈: WebSite | `BlogPost.astro` · `index.astro` |
| 글의 발행일 · 수정일 · 분류 · 태그 (`article:*`) | `BaseHead.astro` |
| 사이트맵 — 글이 있는 분류 페이지만, 글마다 수정일(lastmod) | `astro.config.mjs` 의 `sitemap({ filter, serialize })` |
| 글이 0편인 분류 페이지 · 404 페이지는 «색인하지 말 것» | `noindex` |
| RSS | `/blog/rss.xml` |

### 사람이 한 번 할 일 — 검색엔진에 알리기

검색엔진 계정 소유 확인은 Claude 가 대신할 수 없습니다. 아래 순서로 하고, 나온 **확인 코드만** Claude 에게 주면 됩니다.

1. **Google Search Console** — https://search.google.com/search-console
   - 속성 추가 → **URL 접두어** → `https://cati-time.github.io/blog/`
   - 확인 방법 **HTML 태그** → `<meta name="google-site-verification" content="…">` 의 `content` 값을 복사
   - `site.config.mjs` 의 `SEO.googleSiteVerification` 에 넣고 push → 배포 후 Search Console 에서 **확인**
   - 왼쪽 **Sitemaps** 에 `sitemap-index.xml` 제출
2. **네이버 서치어드바이저** — https://searchadvisor.naver.com
   - 사이트 등록 → `https://cati-time.github.io/blog/`
   - **HTML 태그** 방식 → `content` 값을 `SEO.naverSiteVerification` 에 넣고 push → 소유 확인
   - **요청 → 사이트맵 제출**: `https://cati-time.github.io/blog/sitemap-index.xml` (받아 주지 않으면 `sitemap-0.xml`)
   - **요청 → RSS 제출**: `https://cati-time.github.io/blog/rss.xml`
3. **Bing** (선택) — Bing Webmaster Tools 에서 «Google Search Console 에서 가져오기»

등록 후 검색 결과에 나오기까지 며칠에서 몇 주 걸립니다. Claude 에게 «구글 확인 코드 이거야: …» 라고 주면 넣고 커밋합니다.

### 알아 둘 한계

- `robots.txt` 는 **도메인 맨 위**(`cati-time.github.io/robots.txt`)에 있어야 효력이 있습니다. 이 블로그는 `/blog/` 아래에 있는 프로젝트 사이트라 거기에 둘 수 없습니다. 없으면 검색엔진은 «모두 허용» 으로 보므로 지금은 문제가 없습니다. 꼭 필요해지면 조직에 `Cati-time.github.io` 저장소를 만들어 그곳에 둡니다.
- 커스텀 도메인(예: `blog.회사도메인`)을 쓰면 위 한계가 사라지고 주소도 기억하기 쉬워집니다. 나중에 결정해도 됩니다.

## 4-2. 방문 통계 (Google Analytics 4)

| 항목 | 내용 |
| --- | --- |
| 측정 ID | `site.config.mjs` 의 `ANALYTICS.gaMeasurementId` — 비우면 GA 가 꺼진다. 페이지 소스에 공개되는 값이라 비밀값 아님 |
| 들어가는 곳 | `BaseHead.astro` → 모든 페이지 `<head>` · `Footer.astro` → 푸터 안내 문구(«방문 통계를 위해 Google Analytics를 사용합니다»). 둘 다 측정 ID 가 있을 때만 |
| 언제 들어가나 | **배포 빌드(`npm run build`)에만.** dev 서버(`npm run dev`)에는 안 들어가서 로컬 확인 방문은 집계되지 않는다 |

- **확인**: push·배포 후 사이트에 들어가 GA → **보고서 → 실시간** 에 방문이 잡히는지 본다. 일반 보고서에는 24~48시간 뒤에 쌓인다.
- **검색어까지 보려면**: Search Console 소유 확인(§4-1) 후 GA → **관리 → 제품 링크 → Search Console 링크**.
- **(선택) 팀원 방문 빼기**: GA → 관리 → 데이터 스트림 → 태그 설정 → **내부 트래픽 정의**(IP) → 관리 → 데이터 필터에서 «내부 트래픽» 필터를 **활성**.
- GA 계정·속성 관리는 구글 로그인이 필요해서 사람이 한다. 측정 ID 를 바꾸려면 Claude 에게 새 `G-…` 값만 주면 된다.

## 5. (선택) Claude에게 push 까지 맡기려면

전역 hook 이 모든 저장소에서 push 를 막으므로, 이 저장소만 예외로 두려면 hook 을 고쳐야 합니다.
예: 저장소 루트에 `.claude/allow-push` 파일이 있으면 push 차단을 건너뛰도록 `guard-workspace.py` 의 push 검사에 조건 추가.

- 이 hook 은 다른 워크스페이스(android-catius 등)에도 적용되는 전역 규칙이라, 수정은 **사용자가 직접 결정**해야 합니다.
- Claude에게 부탁하면 수정안을 보여주고 승인 후에만 반영합니다.

---

## 6. 문제 해결

| 증상 | 원인 | 해결 |
| --- | --- | --- |
| Actions 의 deploy 단계 실패 "Pages site not found" | Pages 미활성화 | §3-1 |
| 사이트가 404 | 첫 배포 전이거나 `base` 불일치 | `site.config.mjs` 의 `base: '/blog'` 확인, Actions 성공 여부 확인 |
| CSS 가 깨지고 링크가 `/posts/...` 로 감 | `base` 누락 | 위와 동일 |
| 글 하단에 댓글창이 없음 | giscus ID 미입력 또는 앱 미설치 | §2-2, §3-3 |
| giscus 에 "not installed" 메시지 | 앱이 `blog` 저장소에 설치 안 됨 | §2-2 에서 저장소 선택 확인 |
| `gh api` 가 403 | 조직 OAuth 접근 미승인 | GitHub → Settings → Applications → Authorized OAuth Apps → GitHub CLI → Cati-time **Grant** |
| `git push` 가 403 | 로그인 계정에 쓰기 권한 없음 | 조직 멤버·저장소 권한 확인 |

---

## 7. 현재 상태 (2026-09-28 기준)

- [x] 저장소 `Cati-time/blog` 생성 (Public)
- [x] 원격 초기 커밋(LICENSE) 로컬에 병합
- [x] 사이트 설정을 `/blog` 하위 경로 기준으로 전환, 글 주소는 `/blog/posts/<slug>/`
- [ ] 로컬 커밋 push (§2-0) — 사용자
- [ ] GitHub CLI 설치·로그인 (§2-1) — 사용자
- [ ] giscus 앱 설치 (§2-2) — 사용자
- [ ] Pages 활성화, Discussions 켜기, giscus ID 반영 (§3) — Claude

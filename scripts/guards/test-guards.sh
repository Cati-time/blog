#!/usr/bin/env bash
# 가드 짝 시험 — 위반을 일부러 넣으면 실패(1), 대상 0 이면 판정 불가(2)여야 한다.
set -u
cd "$(dirname "$0")/../.."
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
fail=0
expect() { local want=$1; shift; "$@" >/dev/null 2>&1; local got=$?; if [ "$got" != "$want" ]; then echo "짝 시험 실패: $* → rc $got (기대 $want)"; fail=1; else echo "짝 시험 통과: $(basename "$2") rc $got"; fi; }
printf "import X from '../components/Header.astro';\n" > "$tmp/bad.ts"
printf '<a href="/posts/x/">x</a>\n' > "$tmp/bad.astro"
printf "export const ok = 1;\n" > "$tmp/good.ts"
printf "<a href='/posts/x/'>x</a>\n" > "$tmp/bad-single.astro"
printf '<a href={"/posts/x/"}>x</a>\n' > "$tmp/bad-brace.astro"
printf "<img src={'/og.png'} />\n" > "$tmp/bad-brace-single.astro"
printf '<a href={`/tags/${t}/`}>x</a>\n' > "$tmp/bad-tmpl.astro"
printf '<a href="/">home</a>\n' > "$tmp/bad-root.astro"
printf '<img srcset="/a.png 1x" />\n' > "$tmp/bad-srcset.astro"
printf "<a href={ '/x' }>x</a>\n" > "$tmp/bad-brace-space.astro"
printf '<script src="//cdn.example.com/x.js"></script>\n' > "$tmp/good-proto.astro"
printf '<a href={`${import.meta.env.BASE_URL}posts/x/`}>x</a>\n<a href={`${base}/tags/`}>t</a>\n<a href="https://example.com/x">e</a>\n' > "$tmp/good-base.astro"
expect 1 bash scripts/guards/layer.sh "$tmp/bad.ts"
expect 0 bash scripts/guards/layer.sh "$tmp/good.ts"
expect 1 bash scripts/guards/base-url.sh "$tmp/bad.astro"
expect 0 bash scripts/guards/base-url.sh "$tmp/good.ts"
expect 1 bash scripts/guards/base-url.sh "$tmp/bad-single.astro"
expect 1 bash scripts/guards/base-url.sh "$tmp/bad-brace.astro"
expect 1 bash scripts/guards/base-url.sh "$tmp/bad-brace-single.astro"
expect 1 bash scripts/guards/base-url.sh "$tmp/bad-tmpl.astro"
expect 0 bash scripts/guards/base-url.sh "$tmp/good-base.astro"
expect 1 bash scripts/guards/base-url.sh "$tmp/bad-root.astro"
expect 1 bash scripts/guards/base-url.sh "$tmp/bad-srcset.astro"
expect 1 bash scripts/guards/base-url.sh "$tmp/bad-brace-space.astro"
expect 0 bash scripts/guards/base-url.sh "$tmp/good-proto.astro"
expect 1 env DOCS_GLOB='*.md' bash scripts/guards/docs-glob.sh docs/a.md src/content/blog/x/index.md
expect 1 env DOCS_GLOB='*.md' bash scripts/guards/docs-glob.sh docs/a.md SRC/Content/blog/x/README.md
expect 0 bash scripts/guards/docs-glob.sh docs/a.md README.md src/content/blog/x/index.md
# 용어 결정 등록 가드 — 임시 저장소에 커밋을 지어 잰다(범위 = 바로 앞 커밋 하나)
wd() { local d="$tmp/wd-$1"; git init -q "$d"; git -C "$d" -c user.name=t -c user.email=t@t commit -q --allow-empty -m base; mkdir -p "$d/src/data" "$d/src/content"; shift; while [ $# -gt 1 ]; do echo x >> "$d/$1"; git -C "$d" add -A; git -C "$d" -c user.name=t -c user.email=t@t commit -q -m "$2"; shift 2; done; echo "$d"; }
d=$(wd bad src/content/a.md 'edit: a 사용자 짚음 — 말 바꿈'); expect 1 bash scripts/guards/wording-decision.sh HEAD~1..HEAD "$d"
d=$(wd bad-trailer src/content/a.md $'edit: a\n\nWording-Decision: user 2026-11-25'); expect 1 bash scripts/guards/wording-decision.sh HEAD~1..HEAD "$d"
d=$(wd good src/content/a.md 'edit: a 용어 결정 반영' src/data/glossary.json 'chore: 용어집 등록'); expect 0 bash scripts/guards/wording-decision.sh HEAD~2..HEAD "$d"
d=$(wd skip src/content/a.md $'edit: a 용어 결정 — 이 글만\n\nGlossary-Skip: 이 글 한 곳만 그대로 두는 결정'); expect 0 bash scripts/guards/wording-decision.sh HEAD~1..HEAD "$d"
d=$(wd plain src/content/a.md 'edit: a 오타'); expect 0 bash scripts/guards/wording-decision.sh HEAD~1..HEAD "$d"
expect 2 bash scripts/guards/wording-decision.sh HEAD..HEAD "$d"
# 사이트 핵심 키워드 건너뜀 표지(R-BLOG-SEO · 법제처 T-003385) — 까닭 있음 = 건너뜀(0) · 까닭 빈 표지 = 경고 → --strict 실패(1)
kw() { local d="$tmp/kw-$1"; mkdir -p "$d/src/content/blog/x"; printf -- "---\ntitle: '아키텍처 계층 이야기'\ndescription: '안드로이드 앱의 계층을 나눈 까닭과 그 결과를 실제 코드와 숫자로 정리한 글입니다.'\ntags: ['android']\n---\n%s\n\n## 한 줄로\n\n계층을 나눴다.\n" "$2" > "$d/src/content/blog/x/index.md"; echo "$d"; }
root=$PWD
seo_in() ( cd "$1" && node "$root/scripts/check-seo.mjs" x --strict )
d=$(kw skip '<!-- site-keyword-skip: 주제가 안드로이드 계층이라 무관 -->'); expect 0 seo_in "$d"
d=$(kw empty '<!-- site-keyword-skip: -->'); expect 1 seo_in "$d"
# 문장 검수 세 회차 가드(WORKFLOW 칸 2-1 · ADR-0007) — 임시 저장소에 글 x 와 커밋을 지어 잰다. 인자 = 커밋 제목들(시각은 하나씩 늘어남)
rr_c() { local t="2026-01-01T00:00:$(printf %02d "$n") +0000"; GIT_AUTHOR_DATE="$t" GIT_COMMITTER_DATE="$t" git -C "$d" -c user.name=t -c user.email=t@t commit -q --allow-empty -m "$1"; }
rr_r() { rr_c "$1"$'\n\n'"Review-Read: x ${3:-$(git -C "$d" rev-parse HEAD:src/content/blog/x/index.md)} $2"; }   # 표지 + 읽은 자취
rr_w() { mkdir -p "$d/src/content/blog/x"; printf -- "---\ntitle: 'x'\ndraft: %s\n---\n%b" "$1" "$2" > "$d/src/content/blog/x/index.md"; git -C "$d" add -A; }
rr() { d="$tmp/rr-$1"; shift; n=0; git init -q "$d"; rr_c base; rr_w true '첫 줄\n'; for m in "$@"; do n=$((n+1)); rr_c "$m"; done; b=$(git -C "$d" rev-list --max-parents=0 HEAD); }
r1a='edit: x 검수 1/3 용어 — 고친 문장 3'; r1b='edit: x 검수 1/3 사람답게 — 고친 문장 2'; r2a='edit: x 검수 2/3 용어 — 고친 문장 0'; r2b='edit: x 검수 2/3 사람답게 — 고친 문장 1'; r3a='edit: x 검수 3/3 용어 — 고친 문장 0'; r3b='edit: x 검수 3/3 사람답게 — 고친 문장 0'
g=scripts/guards/review-rounds.mjs
rr none 'post: x 초안'; expect 1 node $g "$b..HEAD" "$d"
rr_six() { local i=0 m; for m in "$@"; do i=$((i+1)); n=$((n+1)); rr_w true "첫 줄\n$i\n"; rr_r "$m" "${same:-a$i}" "${blob:-}"; done; }
rr empty-six 'post: x 초안' "$r1a" "$r1b" "$r2a" "$r2b" "$r3a" "$r3b"; expect 1 node $g "$b..HEAD" "$d"   # Review-Read 없는 빈 커밋 여섯
rr blob 'post: x 초안'; blob=0123456789 rr_six "$r1a" "$r1b" "$r2a" "$r2b" "$r3a" "$r3b"; expect 1 node $g "$b..HEAD" "$d"
rr same-id 'post: x 초안'; same=a1 rr_six "$r1a" "$r1b" "$r2a" "$r2b" "$r3a" "$r3b"; expect 1 node $g "$b..HEAD" "$d"
rr full 'post: x 초안'; rr_six "$r1a" "$r1b" "$r2a" "$r2b" "$r3a" "$r3b"; expect 0 node $g "$b..HEAD" "$d"
p=$(git -C "$d" rev-parse HEAD); n=20; rr_w false '첫 줄\n'; rr_c 'post: x 발행'; expect 0 node $g "$p..HEAD" "$d"   # 발행 — 앞 착지의 표지를 이력에서 찾는다
rr no-count 'post: x 초안'; rr_six "$r1a" 'edit: x 검수 1/3 사람답게' "$r2a" "$r2b" "$r3a" "$r3b"; expect 1 node $g "$b..HEAD" "$d"
rr five 'post: x 초안'; rr_six "$r1a" "$r1b" "$r2a" "$r2b" "$r3a"; expect 1 node $g "$b..HEAD" "$d"
rr swap 'post: x 초안'; rr_six "$r1a" "$r2a" "$r3a" "$r1b" "$r2b" "$r3b"; expect 1 node $g "$b..HEAD" "$d"
rr other 'post: x 초안' "${r1a/x /x-2 }" "${r1b/x /x-2 }" "${r2a/x /x-2 }" "${r2b/x /x-2 }" "${r3a/x /x-2 }" "${r3b/x /x-2 }"; expect 1 node $g "$b..HEAD" "$d"
rr skip $'post: x 작성 중\n\nReview-Skip: x 6 관문 전 작성 중'; expect 0 node $g "$b..HEAD" "$d"
p=$(git -C "$d" rev-parse HEAD); n=20; rr_w false '첫 줄\n'; rr_c 'post: x 발행'; expect 1 node $g "$p..HEAD" "$d"   # 작성 중 건너뜀은 발행을 면하지 않는다
rr_pub() { d="$tmp/rr-$1"; n=0; git init -q "$d"; rr_c base; b=$(git -C "$d" rev-parse HEAD); rr_w false '첫 줄\n'; n=1; rr_c $'post: x 발행\n\n'"Review-Skip: x $2"; }
rr_pub pub-wip '작성 중'; expect 1 node $g "$b..HEAD" "$d"   # 한 착지 발행 — 작성 중은 안 받음
rr_pub pub-doc '받은 문서 그대로 옮김'; expect 0 node $g "$b..HEAD" "$d"
rr skip-empty $'post: x\n\nReview-Skip: x '; expect 1 node $g "$b..HEAD" "$d"
rr drop "$r1a"; p=$(git -C "$d" rev-parse HEAD); n=20; rr_w true ''; rr_c 'edit: x 사실 뺌'; expect 0 node $g "$p..HEAD" "$d"
rr same-time 'post: x 초안'; i=0; for m in "$r1a" "$r1b" "$r2a" "$r2b" "$r3a" "$r3b"; do i=$((i+1)); rr_r "$m" "a$i"; done; expect 1 node $g "$b..HEAD" "$d"
expect 2 node $g HEAD..HEAD "$d"
exit $fail

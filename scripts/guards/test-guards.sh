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
exit $fail

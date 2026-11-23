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
exit $fail

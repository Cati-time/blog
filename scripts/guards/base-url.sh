#!/usr/bin/env bash
# R-BLOG-BASE-URL — 코드의 링크 · 자원 경로는 BASE_URL 기준(하드코딩 "/…" 금지)
# 인자로 파일을 주면 그 파일만 본다(짝 시험용).
# exit 0 = 위반 0 · 1 = 위반 있음 · 2 = 검사 대상 0
set -u
cd "$(dirname "$0")/../.."
if [ $# -gt 0 ]; then files="$*"; else files=$(git ls-files 'src/*.astro' 'src/**/*.astro' 'src/*.ts' 'src/**/*.ts' 'src/**/*.js' | grep -v '^src/content/' || true); fi
[ -z "$files" ] && { echo "base-url: 검사 대상 0"; exit 2; }
# 잡는 꼴: href="/x" · href='/x' · href={"/x"} · href={'/x'} · href={`/x`} (src 도 같다).
# 빼는 줄: BASE_URL · withBase · ${base} 를 쓰는 줄(기준을 붙인 경로) — 법제처 T-002712 🟡.
hits=$(grep -nE "(href|src)=(\\{)?[\"'\`]/[a-zA-Z]" $files | grep -vE 'BASE_URL|withBase|\$\{base\}' || true)
n=$(echo "$files" | wc -l | tr -d ' ')
if [ -n "$hits" ]; then echo "$hits"; echo "base-url: 대상 $n · 위반 $(echo "$hits" | wc -l | tr -d ' ')"; exit 1; fi
echo "base-url: 대상 $n · 위반 0"

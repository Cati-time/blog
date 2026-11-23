#!/usr/bin/env bash
# R-BLOG-LAYER — lib · style 은 component · route · layout 을 부르지 않는다.
# 인자로 파일을 주면 그 파일만 본다(짝 시험용).
# exit 0 = 위반 0 · 1 = 위반 있음 · 2 = 검사 대상 0(통과로 치지 않음)
set -u
cd "$(dirname "$0")/../.."
if [ $# -gt 0 ]; then files="$*"; else files=${*:-$(git ls-files "src/lib/*" "src/styles/*")}; fi
[ -z "$files" ] && { echo "layer: 검사 대상 0"; exit 2; }
hits=$(grep -nE "from ['\"][^'\"]*(components|pages|layouts)/|import ['\"][^'\"]*(components|pages|layouts)/|@import ['\"][^'\"]*(components|pages|layouts)/" $files || true)
n=$(echo "$files" | wc -l | tr -d ' ')
if [ -n "$hits" ]; then echo "$hits"; echo "layer: 대상 $n · 위반 $(echo "$hits" | wc -l | tr -d ' ')"; exit 1; fi
echo "layer: 대상 $n · 위반 0"

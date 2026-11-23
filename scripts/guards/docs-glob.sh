#!/usr/bin/env bash
# 문서만 회차 짝 가드(WORKFLOW 칸 13-1 · canon C170 «예외 목록 짝 가드») —
# scripts/localci.sh 의 LOCALCI_DOCS_GLOB 로 «문서» 로 판별되는 추적 파일 중 빌드 입력 자리에 든 것이 0 인지 잰다.
# 인자로 파일 목록을 주면 그 목록만 본다(짝 시험용). exit 0 = 0 · 1 = 빌드 입력이 문서로 판별됨 · 2 = 판별 패턴 못 읽음 / 대상 0
set -u
cd "$(dirname "$0")/../.."
# DOCS_GLOB 환경변수는 짝 시험이 «패턴을 넓힌 경우» 를 흉내 낼 때만 준다.
globs=${DOCS_GLOB:-$(sed -n "s/^LOCALCI_DOCS_GLOB='\(.*\)'$/\1/p" scripts/localci.sh)}
[ -z "$globs" ] && { echo "docs-glob: LOCALCI_DOCS_GLOB 못 읽음"; exit 2; }
if [ $# -gt 0 ]; then files=$(printf '%s\n' "$@"); else files=$(git ls-files); fi
[ -z "$files" ] && { echo "docs-glob: 대상 0"; exit 2; }
bad=""; n=0; set -f
while IFS= read -r f; do
  [ -n "$f" ] || continue; fl=$(printf '%s' "$f" | tr '[:upper:]' '[:lower:]'); hit=0
  for g in $globs; do case "$fl" in $g) hit=1 ;; esac; done
  [ "$hit" = 1 ] || continue; n=$((n + 1))
  case "$fl" in src/*|public/*|astro.config.*|site.config.*|package.json|tsconfig*.json) bad="$bad$f"$'\n' ;; esac
done <<< "$files"
set +f
if [ -n "$bad" ]; then printf '%s' "$bad"; echo "docs-glob: 문서 판별 $n · 빌드 입력 $(printf '%s' "$bad" | grep -c .)"; exit 1; fi
echo "docs-glob: 문서 판별 $n · 빌드 입력 0"

#!/usr/bin/env bash
# 용어 결정 등록 가드(R-BLOG-WORDING · ADR-0005) — 사용자 용어 결정을 반영한 커밋이 있는데
# 같은 묶음에서 용어집(src/data/glossary.json)도 잡는 줄(scripts/check-wording.mjs)도 안 바뀌었으면 막는다.
#   용어 결정을 반영한 커밋: 메시지에 «용어 결정» · «사용자 짚음» · «용어를 짚» · «Wording-Decision:» 이 있는 커밋(머지 커밋 빼고).
#   풀기: 묶음 안 커밋 메시지에 «Glossary-Skip: <까닭>» 한 줄(예: 이 글 한 곳만 그대로 두기로 한 결정).
# 쓰임: wording-decision.sh [<범위> [<저장소>]] — 범위 기본 HEAD^1..HEAD(localci 머지 직후 = 이 머지가 들인 커밋).
# exit 0 = 등록 있음 또는 용어 결정 커밋 0 · 1 = 등록 없음 · 2 = 범위를 못 읽음 / 커밋 0
set -u
range=${1:-HEAD^1..HEAD}
repo=${2:-$(cd "$(dirname "$0")/../.." && pwd)}
g() { git -C "$repo" -c core.quotepath=false "$@"; }
all=$(g rev-list --no-merges "$range" 2>/dev/null) || { echo "wording-decision: 범위 못 읽음 ($range)"; exit 2; }
[ -z "$all" ] && { echo "wording-decision: 범위 안 커밋 0 ($range)"; exit 2; }
n=$(printf '%s\n' "$all" | grep -c .)
hits=$(g log --no-merges --format='%h %s' -E --grep='용어 결정|사용자 짚음|용어를 짚|Wording-Decision:' "$range")
if [ -z "$hits" ]; then echo "wording-decision: 커밋 $n · 용어 결정 커밋 0"; exit 0; fi
if g log --no-merges --format=%B "$range" | grep -q '^Glossary-Skip: .'; then
  echo "wording-decision: 용어 결정 커밋 있음 · Glossary-Skip 로 풂"; g log --no-merges --format=%B "$range" | grep '^Glossary-Skip: '; exit 0
fi
reg=$(g log --no-merges --format= --name-only "$range" -- src/data/glossary.json scripts/check-wording.mjs | sort -u)
if [ -n "$reg" ]; then echo "wording-decision: 용어 결정 커밋 $(printf '%s\n' "$hits" | grep -c .) · 등록 $(echo $reg)"; exit 0; fi
printf '%s\n' "$hits"
echo "wording-decision: 용어 결정을 반영했는데 src/data/glossary.json · scripts/check-wording.mjs 변경 0 — 같은 묶음에서 등록한다(blog-wording «용어집 고치기») · 등록하지 않을 까닭이 있으면 커밋 메시지에 «Glossary-Skip: <까닭>»"
exit 1

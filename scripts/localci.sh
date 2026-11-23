# localci 레포 선언 — 이 레포를 «어떻게» 검증하나. 전역 러너(~/.claude/bin/localci)가 source 한다.
# 계약: LOCALCI_KIND · localci_ci <tree> <log> → rc(0 = 통과) · localci_guards <tree> <log> <머지 직전 sha> → rc.
# 게이트의 정본은 docs/constitution/RULES.md §9-1 · WORKFLOW.md 칸 5 다. 여기는 그것을 «실행» 할 뿐이다 —
# 목록이 바뀌면 같은 변경에서 여기를 맞춘다.

LOCALCI_KIND=web
# V2 포트 = 3300 · V1 대역 3310 ~ 3319(법제처 T-002697 판정 · WORKFLOW 칸 15). 판정자가 LOCALCI_WEB_PORT 를 주면 그 값이 이긴다.
LOCALCI_WEB_PORT="${LOCALCI_WEB_PORT:-3300}"

# localci_ci — PR check.yml 과 같은 명령(npm ci --no-audit --no-fund → npm run build).
#   npm run build = check(check-tokens → check-posts → astro check) → astro build.
#   글 레인 덧: 머지로 바뀐 글(src/content/blog/<slug>/)이 있으면 그 글마다 check:seo --strict · check:wording --strict.
localci_ci() {
  local t="$1" log="$2"
  (
    cd "$t" || exit 90
    echo "  [blog] node $(node -v) · npm $(npm -v)"
    npm ci --no-audit --no-fund || exit 10
    npm run build || exit 11
    local slugs
    slugs=$(git -c core.quotepath=false diff --name-only HEAD^1 HEAD 2>/dev/null \
      | sed -n 's#^src/content/blog/\([^/]*\)/.*#\1#p' | sort -u | while read -r s; do [ -f "src/content/blog/$s/index.md" ] && echo "$s"; done)
    if [ -n "$slugs" ]; then
      echo "  [blog] 글 레인 덧 · 바뀐 글: $(echo $slugs)"
      node scripts/check-seo.mjs $slugs --strict || exit 12
      node scripts/check-wording.mjs $slugs --strict || exit 13
      node scripts/check-seo.mjs || exit 14   # 발행 기준 — 빌드 뒤 전체 오류 0
    else
      echo "  [blog] 바뀐 글 없음 — 글 레인 덧 건너뜀"
    fi
  ) >>"$log" 2>&1
}

# localci_guards — 빌드 없이 빠르게. 대상 0 은 통과가 아니다(가드가 exit 2).
localci_guards() {
  local t="$1" log="$2"
  (
    cd "$t" || exit 90
    node scripts/check-tokens.mjs || exit 20
    node scripts/check-posts.mjs || exit 21
    bash scripts/guards/layer.sh || exit 22
    bash scripts/guards/base-url.sh || exit 23
    bash scripts/guards/test-guards.sh || exit 24
  ) >>"$log" 2>&1
}

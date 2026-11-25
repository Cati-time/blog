# localci 레포 선언 — 이 레포를 «어떻게» 검증하나. 전역 러너(~/.claude/bin/localci)가 source 한다.
# 계약: LOCALCI_KIND · localci_ci <tree> <log> → rc(0 = 통과) · localci_guards <tree> <log> <머지 직전 sha> → rc.
# 게이트의 정본은 docs/constitution/RULES.md §9-1 · WORKFLOW.md 칸 5 다. 여기는 그것을 «실행» 할 뿐이다 —
# 목록이 바뀌면 같은 변경에서 여기를 맞춘다.

LOCALCI_KIND=web
# V2 포트 = 3300 · V1 대역 3310 ~ 3319(법제처 T-002697 판정 · WORKFLOW 칸 15). 판정자가 LOCALCI_WEB_PORT 를 주면 그 값이 이긴다.
LOCALCI_WEB_PORT="${LOCALCI_WEB_PORT:-3300}"
# 문서만 회차 판별(WORKFLOW 칸 13-1 · canon C170) — 글(src/content/**/*.md)은 빌드 입력이라 «*.md» 기본값을 쓰지 않는다.
#   러너는 소문자로 바꾼 경로를 case 패턴으로 맞춘다(* 는 / 도 넘는다). 짝 가드 = scripts/guards/docs-glob.sh.
LOCALCI_DOCS_GLOB='docs/*.md readme.md writing_guide.md agents.md claude.md .claude/*.md'
# 이 머지가 바꾸면 dev 서버를 재사용하지 않고 다시 띄울 설정 파일(러너 기본값은 craco 레포용이라 이 레포 것을 적는다).
LOCALCI_RESTART_ON='astro.config.mjs site.config.mjs package.json package-lock.json tsconfig*.json'

# localci_start — CD: Astro dev 서버를 러너가 준 포트로 띄우고 돌아온다(선언이 없으면 러너가 `npx craco start` 로 넘어가 늘 실패했다 · 2026-11-23).
#   러너가 트리에서 PORT · LOCALCI_WEB_PORT 를 넣어 부른다. 서버는 백그라운드 · 로그는 러너 로그($2)로.
localci_start() {
  local t="$1" log="$2"
  ( cd "$t" && nohup npx astro dev --port "${PORT:-$LOCALCI_WEB_PORT}" --host 127.0.0.1 >>"$log" 2>&1 </dev/null & )
  return 0
}

# localci_ci — PR check.yml 과 같은 명령(npm ci --no-audit --no-fund → npm run build).
#   npm run build = check(check-tokens → check-posts → astro check) → astro build.
#   글 레인 덧: 머지로 바뀐 글(src/content/blog/<slug>/)이 있으면 그 글마다 check:seo --strict · check:wording --strict.
#   발행 기준 check:seo(전체 · 오류만)는 회차마다 돈다.
#   용어 결정 등록 가드(R-BLOG-WORDING · ADR-0005): 이 머지가 들인 커밋에 «용어 결정» 이 있는데 용어집 · TERMS 변경 0 이면 실패.
localci_ci() {
  local t="$1" log="$2"
  (
    cd "$t" || exit 90
    echo "  [blog] node $(node -v) · npm $(npm -v)"
    npm ci --no-audit --no-fund || exit 10
    npm run build || exit 11
    bash scripts/guards/wording-decision.sh HEAD^1..HEAD || exit 15
    local slugs
    slugs=$(git -c core.quotepath=false diff --name-only HEAD^1 HEAD 2>/dev/null \
      | sed -n 's#^src/content/blog/\([^/]*\)/.*#\1#p' | sort -u | while read -r s; do [ -f "src/content/blog/$s/index.md" ] && echo "$s"; done)
    if [ -n "$slugs" ]; then
      echo "  [blog] 글 레인 덧 · 바뀐 글: $(echo $slugs)"
      node scripts/check-seo.mjs $slugs --strict || exit 12
      node scripts/check-wording.mjs $slugs --strict || exit 13
    else
      echo "  [blog] 바뀐 글 없음 — 글 레인 덧 건너뜀"
    fi
    node scripts/check-seo.mjs || exit 14   # 발행 기준 — 빌드 뒤 전체 오류 0 · 사이트 핵심 키워드(머리 · JSON-LD · llms) 도 여기서 · 글이 안 바뀐 회차도 잰다(ADR-0006)
  ) >>"$log" 2>&1
}

# localci_guards — 빌드 없이 빠르게. 대상 0 은 통과가 아니다(가드가 exit 2).
localci_guards() {
  local t="$1" log="$2" pre="${3:-HEAD^1}"
  (
    cd "$t" || exit 90
    node scripts/check-tokens.mjs || exit 20
    node scripts/check-posts.mjs || exit 21
    bash scripts/guards/layer.sh || exit 22
    bash scripts/guards/base-url.sh || exit 23
    bash scripts/guards/test-guards.sh || exit 24
    bash scripts/guards/docs-glob.sh || exit 25
    bash scripts/guards/wording-decision.sh "$pre..HEAD" || exit 26
  ) >>"$log" 2>&1
}

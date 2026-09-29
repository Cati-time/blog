#!/usr/bin/env bash
# 블로그 로컬 환경 한 번에 준비하기
#   ./scripts/setup.sh
# 하는 일: Node.js 버전 확인 → 의존성 설치(npm ci) → 빌드 검사 → 다음 할 일 안내
set -euo pipefail
cd "$(dirname "$0")/.."

REQ="22.12.0"
bold() { printf '\033[1m%s\033[0m\n' "$1"; }
fail() { printf '\033[31m✖ %s\033[0m\n' "$1"; exit 1; }

bold "1/3  Node.js 확인"
if ! command -v node >/dev/null 2>&1; then
	echo "Node.js 가 설치되어 있지 않습니다. 아래 중 하나로 설치한 뒤 다시 실행하세요."
	echo "  • Homebrew:  brew install node"
	echo "  • nvm:       nvm install   (저장소의 .nvmrc 버전을 설치)"
	echo "  • 공식 설치: https://nodejs.org  (LTS)"
	fail "Node.js 없음"
fi
V="$(node -p 'process.versions.node')"
if ! node -e "const [a,b]=process.versions.node.split('.').map(Number);const [x,y]='$REQ'.split('.').map(Number);process.exit(a>x||(a===x&&b>=y)?0:1)"; then
	fail "Node $V 은(는) 너무 낮습니다. $REQ 이상이 필요합니다 (nvm 사용 시: nvm install && nvm use)"
fi
echo "✔ Node $V"

bold "2/3  의존성 설치 (npm ci)"
npm ci --no-audit --no-fund

bold "3/3  빌드 검사 (토큰 검사 → 타입 검사 → 빌드)"
npm run build >/tmp/blog-setup-build.log 2>&1 || { tail -30 /tmp/blog-setup-build.log; fail "빌드 실패 — 위 로그를 확인하세요"; }
echo "✔ 빌드 통과"

echo
bold "준비 완료 🎉"
echo "  미리보기 서버:  npm run dev"
echo "  브라우저 주소:  http://localhost:4321/blog/     ← 끝의 /blog/ 까지 입력"
echo "  새 글 만들기:   npm run new \"제목\" my-slug --category architecture --platform android --draft"
echo "  글쓰기 가이드:  WRITING_GUIDE.md"

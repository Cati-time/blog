/**
 * 블로그 전역 설정 — 이 파일만 고치면 됩니다.
 */
export const SITE = {
	// GitHub Pages 주소. 저장소 이름이 <아이디>.github.io 이면 그대로 두고 아이디만 바꾸세요.
	url: 'https://cati-time.github.io',
	// 저장소 이름이 <아이디>.github.io 가 아니면 '/저장소이름' 으로 바꾸세요. (예: '/blog')
	base: '/blog',

	title: 'Cati time Tech Blog',
	description: 'Cati time 개발팀이 AI 와 함께 일하는 방식(AX)과 안드로이드·iOS·웹·서버 아키텍처를 실제 코드와 숫자로 기록합니다.',
	author: 'Cati time',
	lang: 'ko',

	// 헤더/푸터 링크
	github: 'https://github.com/Cati-time',
	email: '',

	// 홈 화면에 보여줄 최근 글 개수
	recentPostsCount: 5,
};

/**
 * 검색엔진 등록 (SEO) — 값을 채우면 모든 페이지 <head> 에 소유 확인 태그가 들어간다.
 * Google Search Console · 네이버 서치어드바이저에서 «HTML 태그» 방식을 고르면 나오는
 * <meta name="..." content="여기 값"> 의 content 만 붙여 넣는다. 절차: docs/claude-management.md «검색엔진 등록».
 */
export const SEO = {
	googleSiteVerification: '',
	naverSiteVerification: '',
	// 공유 미리보기 기본 이미지 (public/ 기준). 다시 만들기: node scripts/make-og.mjs
	defaultImage: 'og-default.png',
	defaultImageAlt: 'Cati time Tech Blog',
};

/**
 * 방문 통계 — Google Analytics 4. 측정 ID(G-…)는 페이지 소스에 공개되는 값이라 비밀값이 아니다.
 * 배포 빌드에만 들어가고 dev 서버에는 안 들어간다(로컬 확인 방문은 집계 안 됨). 비우면 GA 를 끈다.
 * 절차: docs/claude-management.md «방문 통계».
 */
export const ANALYTICS = {
	gaMeasurementId: 'G-JSCX8M9WEJ',
};

/**
 * 메뉴 구조 — 대분류(카테고리) × 플랫폼
 * 글의 frontmatter 에 category·platform 을 이 id 로 적는다. 여기 없는 값은 빌드에서 막힌다.
 * 주소: /<category>/  ·  /<category>/<platform>/
 */
export const CATEGORIES = [
	{
		id: 'ax',
		label: 'AX',
		title: 'AX · AI Transformation',
		description: 'AI 로 개발과 업무 방식을 바꾼 기록 — 도구, 자동화, 에이전트, 실험.',
	},
	{
		id: 'architecture',
		label: 'Architecture',
		title: 'Architecture',
		description: '구조와 설계에 대한 기록 — 플랫폼별 아키텍처, 패턴, 의사결정.',
	},
];

export const PLATFORMS = [
	{ id: 'android', label: 'Android' },
	{ id: 'ios', label: 'iOS' },
	{ id: 'spring', label: 'Spring' },
	{ id: 'web', label: 'Web' },
	{ id: 'back-office', label: 'Back-office' },
];

/**
 * giscus 댓글 설정 (GitHub Discussions 기반)
 * 1) 저장소 Settings → General → Features → Discussions 체크
 * 2) https://github.com/apps/giscus 에서 저장소에 앱 설치
 * 3) https://giscus.app 에서 저장소 입력 후 나오는 repoId / categoryId 를 아래에 복사
 * repo 가 비어 있으면 댓글 영역이 렌더링되지 않습니다.
 */
export const GISCUS = {
	repo: 'Cati-time/blog',
	repoId: '',
	category: 'Announcements',
	categoryId: '',
	mapping: 'pathname',
	reactionsEnabled: '1',
	emitMetadata: '0',
	inputPosition: 'top',
	theme: 'light',
	lang: 'ko',
};

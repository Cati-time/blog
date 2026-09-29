/**
 * 블로그 전역 설정 — 이 파일만 고치면 됩니다.
 */
export const SITE = {
	// GitHub Pages 주소. 저장소 이름이 <아이디>.github.io 이면 그대로 두고 아이디만 바꾸세요.
	url: 'https://cati-time.github.io',
	// 저장소 이름이 <아이디>.github.io 가 아니면 '/저장소이름' 으로 바꾸세요. (예: '/blog')
	base: '/blog',

	title: 'Cati time Tech Blog',
	description: '개발하면서 배우고 삽질한 것들을 기록합니다.',
	author: 'Cati time',
	lang: 'ko',

	// 헤더/푸터 링크
	github: 'https://github.com/Cati-time',
	email: '',

	// 홈 화면에 보여줄 최근 글 개수
	recentPostsCount: 5,
};

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

import { SITE } from '../consts';
import { getCategory, getPlatform, type Post } from './posts';

// AI 가 읽기 좋은 글 본문 — 사람 화면용 HTML 대신 원문 마크다운을 그대로 준다.
// 이미지 상대 경로(./x.svg)는 원문 저장소 경로라 빌드 주소와 다르다 — 그림은 alt 문장으로 읽힌다.
export const siteRoot = () => `${SITE.url}${SITE.base.replace(/\/$/, '')}`;
export const postUrl = (p: Post) => `${siteRoot()}/posts/${p.id}/`;
export const postMdUrl = (p: Post) => `${siteRoot()}/posts/${p.id}.md`;

const menus = (p: Post) =>
	`${getCategory(p.data.category).label} › ${[p.data.platform, ...p.data.alsoIn].map((id) => getPlatform(id).label).join(' · ')}`;

export function postMarkdown(p: Post): string {
	const body = (p.body ?? '').replace(/<!--[\s\S]*?-->/g, '').trim();
	const head = [
		`# ${p.data.title}`,
		'',
		`> ${p.data.description}`,
		'',
		`- 주소: ${postUrl(p)}`,
		`- 메뉴: ${menus(p)}`,
		`- 발행: ${p.data.pubDate.toISOString().slice(0, 10)}${p.data.updatedDate ? ` · 수정: ${p.data.updatedDate.toISOString().slice(0, 10)}` : ''}`,
		...(p.data.tags.length ? [`- 태그: ${p.data.tags.join(', ')}`] : []),
		`- 출처: ${SITE.title} (${SITE.author})`,
		'',
	];
	return [...head, body, ''].join('\n');
}

export function llmsIndex(posts: Post[]): string {
	const lines = [
		`# ${SITE.title}`,
		'',
		`> ${SITE.description}`,
		'',
		'이 블로그의 글은 모두 필자가 실제 저장소의 코드 · 커밋 · 결정 기록을 다시 세어 확인한 뒤 씁니다. 숫자가 없는 효과는 «판단» 이라고 밝힙니다.',
		`용어집: ${siteRoot()}/glossary/ · 전체 본문(한 파일): ${siteRoot()}/llms-full.txt · RSS: ${siteRoot()}/rss.xml`,
		'',
		'## 글',
		'',
		...posts.map((p) => `- [${p.data.title}](${postMdUrl(p)}): ${p.data.description}`),
		'',
	];
	return lines.join('\n');
}

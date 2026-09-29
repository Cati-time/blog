import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, PLATFORMS } from '../../site.config.mjs';

export type Post = CollectionEntry<'blog'>;
export type Category = (typeof CATEGORIES)[number];
export type Platform = (typeof PLATFORMS)[number];
export { CATEGORIES, PLATFORMS };

const base = import.meta.env.BASE_URL;

/** 발행된 글을 최신순으로. 개발 서버에서는 draft 도 보입니다. */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 카테고리(＋플랫폼)로 거른 글 */
export function filterPosts(posts: Post[], category: string, platform?: string): Post[] {
	return posts.filter((p) => p.data.category === category && (!platform || p.data.platform === platform));
}

/** 태그별 글 개수 (많은 순) */
export async function getTagCounts(): Promise<[string, number][]> {
	const posts = await getPosts();
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id)!;
export const getPlatform = (id: string) => PLATFORMS.find((p) => p.id === id)!;

export function postUrl(post: Post): string {
	return `${base}posts/${post.id}/`;
}

export function categoryUrl(category: string, platform?: string): string {
	return platform ? `${base}${category}/${platform}/` : `${base}${category}/`;
}

export function tagUrl(tag: string): string {
	return `${base}tags/${encodeURIComponent(tag)}/`;
}

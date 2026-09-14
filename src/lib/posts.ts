import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** 발행된 글을 최신순으로. 개발 서버에서는 draft 도 보입니다. */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
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

export function postUrl(post: Post): string {
	return `${import.meta.env.BASE_URL}blog/${post.id}/`;
}

export function tagUrl(tag: string): string {
	return `${import.meta.env.BASE_URL}tags/${encodeURIComponent(tag)}/`;
}

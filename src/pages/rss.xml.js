import rss from '@astrojs/rss';
import { SITE } from '../consts';
import { getPosts } from '../lib/posts';

export async function GET(context) {
	const posts = await getPosts();
	return rss({
		title: SITE.title,
		description: SITE.description,
		site: new URL(SITE.base.replace(/\/?$/, '/'), context.site).href,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			categories: post.data.tags,
			link: `${SITE.base.replace(/\/$/, '')}/posts/${post.id}/`,
		})),
		customData: `<language>${SITE.lang}</language>`,
	});
}

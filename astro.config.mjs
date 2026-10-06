// @ts-check

import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { SITE, CATEGORIES } from './site.config.mjs';

// ── 사이트맵 정리용: 글 frontmatter 를 가볍게 읽는다 (빌드 설정 단계라 컬렉션 API 를 못 쓴다) ──
const BLOG_DIR = './src/content/blog';
/** @typedef {{ slug: string, category?: string, platform?: string, draft: boolean, date?: string }} PostMeta */
/** @type {PostMeta[]} */
const posts = [];
for (const d of readdirSync(BLOG_DIR, { withFileTypes: true })) {
	if (!d.isDirectory()) continue;
	const file = ['index.md', 'index.mdx'].map((f) => `${BLOG_DIR}/${d.name}/${f}`).find((f) => existsSync(f));
	if (!file) continue;
	const fm = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	/** @param {string} k */
	const get = (k) => fm.match(new RegExp(`^${k}:\\s*['"]?([^'"\\n]*)`, 'm'))?.[1]?.trim();
	const meta = { slug: d.name, category: get('category'), platform: get('platform'), draft: get('draft') === 'true', date: get('updatedDate') || get('pubDate') };
	if (!meta.draft) posts.push(meta);
}
const basePath = SITE.base.replace(/\/?$/, '/');
// 글이 있는 분류·플랫폼 페이지만 사이트맵에 넣는다 (빈 페이지는 noindex)
const filledListPages = new Set(posts.flatMap((p) => [`${p.category}/`, `${p.category}/${p.platform}/`]));
const categoryIds = new Set(CATEGORIES.map((c) => c.id));
// 글 페이지의 lastmod = 수정일 또는 발행일
const lastmod = new Map(posts.map((p) => [`/posts/${p.slug}/`, p.date]));
/** @param {string} page */
const sitePath = (page) => new URL(page).pathname.slice(basePath.length - 1).replace(/^\//, '');

// https://astro.build/config
export default defineConfig({
	site: SITE.url,
	base: SITE.base,
	trailingSlash: 'always',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				const path = sitePath(page);
				return !categoryIds.has(path.split('/')[0]) || filledListPages.has(path);
			},
			serialize: (item) => {
				const date = lastmod.get(`/${sitePath(item.url)}`);
				return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
			},
		}),
	],
	markdown: {
		// 문장부호 자동 변환 끄기: "--force" 가 "–force" 로, "따옴표" 가 “따옴표” 로 바뀌지 않게 (내용은 쓴 그대로)
		processor: satteri({ features: { smartPunctuation: false } }),
		shikiConfig: {
			theme: 'github-light',
			wrap: false,
		},
	},
});

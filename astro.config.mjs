// @ts-check

import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { SITE } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
	site: SITE.url,
	base: SITE.base,
	trailingSlash: 'always',
	integrations: [mdx(), sitemap()],
	markdown: {
		// 문장부호 자동 변환 끄기: "--force" 가 "–force" 로, "따옴표" 가 “따옴표” 로 바뀌지 않게 (내용은 쓴 그대로)
		processor: satteri({ features: { smartPunctuation: false } }),
		shikiConfig: {
			theme: 'github-light',
			wrap: false,
		},
	},
});

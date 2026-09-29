// @ts-check

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
		shikiConfig: {
			// 라이트는 인라인 색, 다크는 --shiki-dark 변수로 나온다 (global.css 에서 전환)
			themes: { light: 'github-light', dark: 'github-dark' },
			wrap: false,
		},
	},
});

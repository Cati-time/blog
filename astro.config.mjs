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
			theme: 'github-light',
			wrap: false,
		},
	},
});

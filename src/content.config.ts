import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, PLATFORMS } from '../site.config.mjs';

const categoryIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];
const platformIds = PLATFORMS.map((p) => p.id) as [string, ...string[]];

const blog = defineCollection({
	// src/content/blog/<slug>/index.md 또는 src/content/blog/<slug>.md
	loader: glob({
		base: './src/content/blog',
		pattern: '**/*.{md,mdx}',
		generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '').replace(/\/index$/, ''),
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().default(''),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// 메뉴 위치 (필수) — site.config.mjs 의 CATEGORIES · PLATFORMS id
			category: z.enum(categoryIds),
			platform: z.enum(platformIds),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			heroImage: z.optional(image()),
		}),
});

export const collections = { blog };

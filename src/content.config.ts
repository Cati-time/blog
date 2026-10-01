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

// 소개 페이지 — 팀원 (src/content/team/<id>.yaml, 한 명에 파일 하나)
const team = defineCollection({
	loader: glob({ base: './src/content/team', pattern: '*.{yaml,yml}' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			role: z.string(),
			platforms: z.array(z.enum(platformIds)).default([]),
			bio: z.string().default(''),
			github: z.string().regex(/^[A-Za-z0-9-]+$/, 'GitHub 아이디만 적습니다 (주소 말고)').optional(),
			linkedin: z
				.url()
				.regex(/^https:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?$/, 'LinkedIn 프로필 주소 전체를 적습니다 (https://www.linkedin.com/in/…)')
				.optional(),
			avatar: image().optional(),
			order: z.number().default(100),
		}),
});

// 소개 페이지 — 진행 프로젝트 (src/content/projects/<id>.yaml, 프로젝트 하나에 파일 하나)
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '*.{yaml,yml}' }),
	schema: z.object({
		name: z.string(),
		summary: z.string(),
		status: z.enum(['진행 중', '완료', '예정']),
		platforms: z.array(z.enum(platformIds)).default([]),
		period: z.string().default(''), // 예: '2026.07 –' · '2026.03 – 2026.06'
		tag: z.string().optional(), // 이 태그가 달린 블로그 글을 «관련 글» 로 연결
		links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
		order: z.number().default(100),
	}),
});

export const collections = { blog, team, projects };

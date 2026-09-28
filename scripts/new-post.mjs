#!/usr/bin/env node
/**
 * 새 글 생성: npm run new "제목" [slug] [--tags a,b] [--draft]
 * 예)  npm run new "Astro로 블로그 만들기" astro-blog --tags astro,blog
 *      npm run new "제목만"            → slug 는 오늘 날짜 기반으로 자동 생성
 */
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const flags = { tags: '', draft: false };
const positional = [];
for (let i = 0; i < args.length; i++) {
	const a = args[i];
	if (a === '--tags') flags.tags = args[++i] ?? '';
	else if (a.startsWith('--tags=')) flags.tags = a.slice(7);
	else if (a === '--draft') flags.draft = true;
	else positional.push(a);
}

const [title, slugArg] = positional;
if (!title) {
	console.error('사용법: npm run new "제목" [slug] [--tags a,b] [--draft]');
	process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

function slugify(s) {
	return s
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/-+/g, '-');
}

let slug = slugArg ? slugify(slugArg) : slugify(title);
if (!slug) slug = `${date}-${pad(now.getHours())}${pad(now.getMinutes())}`; // 한글 제목 + slug 미지정

const dir = join('src', 'content', 'blog', slug);
const file = join(dir, 'index.md');
if (existsSync(file)) {
	console.error(`이미 존재합니다: ${file}`);
	process.exit(1);
}

const tags = flags.tags
	.split(',')
	.map((t) => t.trim())
	.filter(Boolean);

const frontmatter = [
	'---',
	`title: '${title.replace(/'/g, "''")}'`,
	`description: ''`,
	`pubDate: ${date}`,
	`tags: [${tags.map((t) => `'${t}'`).join(', ')}]`,
	`draft: ${flags.draft}`,
	'---',
	'',
	'여기에 본문을 작성하세요.',
	'',
	'이미지는 이 폴더에 넣고 `![설명](./image.png)` 로 넣으면 됩니다.',
	'',
].join('\n');

mkdirSync(dir, { recursive: true });
writeFileSync(file, frontmatter, 'utf8');
console.log(`✔ 생성됨: ${file}`);
console.log(`  주소: /posts/${slug}/`);
if (flags.draft) console.log('  draft: true → 배포에서는 제외됩니다. 발행하려면 draft 를 지우거나 false 로.');

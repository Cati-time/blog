#!/usr/bin/env node
/**
 * 새 글 생성: npm run new "제목" [slug] --category <분류> --platform <플랫폼> [--tags a,b] [--draft]
 * 예)  npm run new "Compose 상태 관리" compose-state --category architecture --platform android --tags compose
 *      npm run new "Claude 로 PR 리뷰 자동화" --category ax --platform web --draft
 * 분류·플랫폼 목록은 site.config.mjs 의 CATEGORIES · PLATFORMS 에서 읽는다.
 */
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, PLATFORMS } from '../site.config.mjs';

const args = process.argv.slice(2);
const flags = { tags: '', draft: false, category: '', platform: '' };
const positional = [];
for (let i = 0; i < args.length; i++) {
	const a = args[i];
	if (a === '--tags') flags.tags = args[++i] ?? '';
	else if (a.startsWith('--tags=')) flags.tags = a.slice(7);
	else if (a === '--draft') flags.draft = true;
	else if (a === '--category') flags.category = args[++i] ?? '';
	else if (a.startsWith('--category=')) flags.category = a.slice(11);
	else if (a === '--platform') flags.platform = args[++i] ?? '';
	else if (a.startsWith('--platform=')) flags.platform = a.slice(11);
	else positional.push(a);
}

const [title, slugArg] = positional;
const catIds = CATEGORIES.map((c) => c.id);
const platIds = PLATFORMS.map((p) => p.id);
const usage = [
	'사용법: npm run new "제목" [slug] --category <분류> --platform <플랫폼> [--tags a,b] [--draft]',
	`  분류:   ${catIds.join(' | ')}`,
	`  플랫폼: ${platIds.join(' | ')}`,
].join('\n');
if (!title) {
	console.error(usage);
	process.exit(1);
}
if (!catIds.includes(flags.category) || !platIds.includes(flags.platform)) {
	console.error(`분류·플랫폼을 목록에서 골라 주세요. (받은 값: category='${flags.category}', platform='${flags.platform}')\n\n${usage}`);
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
	`category: ${flags.category}`,
	`platform: ${flags.platform}`,
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
console.log(`  주소: /posts/${slug}/  ·  메뉴: /${flags.category}/${flags.platform}/`);
if (flags.draft) console.log('  draft: true → 배포에서는 제외됩니다. 발행하려면 draft 를 지우거나 false 로.');

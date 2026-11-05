#!/usr/bin/env node
/**
 * 검색 · AI 전달 점검 — npm run check:seo (먼저 npm run build)
 * 발행된 글마다: 제목 · 설명 길이, 태그, 글 사이 링크, 빌드 결과(HTML 메타 · JSON-LD · 사이트맵 · 원문 .md · llms.txt)를 본다.
 * 오류는 exit 1, 권고는 경고만. 기준은 .claude/skills/blog-seo/SKILL.md.
 * 초안 점검: npm run check:seo -- <slug> — 빌드 없이 원문만 본다(제목 · 설명 · 태그 · 요약 절 · 글 링크 · 그림 alt).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const BLOG = join(ROOT, 'src/content/blog');
const DIST = join(ROOT, 'dist');
const errors = [];
const warns = [];
const err = (s, m) => errors.push(`${s}: ${m}`);
const warn = (s, m) => warns.push(`${s}: ${m}`);

const fm = (src) => {
	const m = src.match(/^---\n([\s\S]*?)\n---/);
	const get = (k) => (m?.[1].match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
	return { title: get('title'), description: get('description'), draft: get('draft') === 'true', tags: get('tags') };
};

// 원문만 보는 점검 — 발행 글과 초안이 같이 쓴다
const checkSource = (slug, src, f) => {
	// 1. 제목 · 설명 — 검색 결과에서 잘리지 않게
	if (f.title.length > 60) warn(slug, `제목 ${f.title.length}자 — 60자 넘으면 검색 결과에서 잘림`);
	if (f.description.length < 40) err(slug, `설명 ${f.description.length}자 — 40자 이상으로(검색 · AI 요약에 쓰임)`);
	else if (f.description.length > 160) warn(slug, `설명 ${f.description.length}자 — 160자 넘으면 검색 결과에서 잘림(앞 80자에 핵심)`);
	if (!/\[\s*'/.test(f.tags)) warn(slug, '태그 없음');
	// 2. 첫 문단 — AI 요약이 앞부분을 많이 쓴다
	if (!/^## 한 줄로/m.test(src)) warn(slug, '«## 한 줄로» 요약 절 없음(AI · 검색 요약이 앞부분을 씀)');
	// 3. 글 사이 링크 — 없는 글 · 초안으로 가는 링크는 발행하면 깨진다
	for (const m of src.matchAll(/\]\(\.\.\/([a-z0-9-]+)\/\)/g)) {
		const target = join(BLOG, m[1], 'index.md');
		if (!existsSync(target) || fm(readFileSync(target, 'utf8')).draft) err(slug, `깨진 글 링크 ../${m[1]}/ (초안이거나 없음)`);
	}
};

// 초안 점검 — 슬러그를 주면 그 글의 원문만 본다
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
if (only.length) {
	for (const slug of only) {
		const path = join(BLOG, slug, 'index.md');
		if (!existsSync(path)) { err(slug, '글이 없음'); continue; }
		const src = readFileSync(path, 'utf8');
		checkSource(slug, src, fm(src));
		for (const m of src.matchAll(/!\[([^\]]*)\]\(/g)) if (m[1].trim().length < 5) warn(slug, '짧거나 빈 이미지 alt');
	}
	for (const w of warns) console.log('  경고 ' + w);
	for (const e of errors) console.log('  오류 ' + e);
	console.log(`check-seo: 지정한 글 ${only.length}편 · 오류 ${errors.length} · 경고 ${warns.length}`);
	process.exit(errors.length ? 1 : 0);
}

if (!existsSync(DIST)) {
	console.error('check-seo: dist 가 없습니다 — npm run build 먼저');
	process.exit(2);
}

const slugs = readdirSync(BLOG).filter((d) => existsSync(join(BLOG, d, 'index.md')));
const published = [];
for (const slug of slugs) {
	const src = readFileSync(join(BLOG, slug, 'index.md'), 'utf8');
	const f = fm(src);
	if (f.draft) continue;
	published.push(slug);
	checkSource(slug, src, f);
	// 4. 빌드 결과
	const htmlPath = join(DIST, 'posts', slug, 'index.html');
	if (!existsSync(htmlPath)) { err(slug, '빌드 HTML 없음'); continue; }
	const html = readFileSync(htmlPath, 'utf8');
	if (!html.includes('rel="canonical"')) err(slug, 'canonical 없음');
	if (/name="robots" content="noindex/.test(html)) err(slug, 'noindex 가 붙음');
	if (!html.includes('"BlogPosting"')) err(slug, 'JSON-LD BlogPosting 없음');
	if (!html.includes('og:description')) err(slug, 'og:description 없음');
	if (!html.includes('type="text/markdown"')) err(slug, '원문 마크다운 링크(rel=alternate) 없음');
	if (!existsSync(join(DIST, 'posts', `${slug}.md`))) err(slug, '원문 .md 없음');
	for (const m of html.matchAll(/<img [^>]*>/g)) if (!m[0].includes('brand-icon') && !/alt="[^"]{5,}"/.test(m[0])) warn(slug, '짧거나 빈 이미지 alt');
}

// 5. 사이트 단위
const sitemap = readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f)).map((f) => readFileSync(join(DIST, f), 'utf8')).join('');
const llms = existsSync(join(DIST, 'llms.txt')) ? readFileSync(join(DIST, 'llms.txt'), 'utf8') : '';
if (!llms) err('site', 'llms.txt 없음');
if (!existsSync(join(DIST, 'llms-full.txt'))) err('site', 'llms-full.txt 없음');
for (const slug of published) {
	if (!sitemap.includes(`/posts/${slug}/`)) err(slug, '사이트맵에 없음');
	if (!llms.includes(`/posts/${slug}.md`)) err(slug, 'llms.txt 목차에 없음');
}
for (const d of readdirSync(join(DIST, 'posts'))) if (d.endsWith('.md') && !published.includes(d.slice(0, -3))) err(d, '초안이 원문 .md 로 나감');

for (const w of warns) console.log('  경고 ' + w);
for (const e of errors) console.log('  오류 ' + e);
console.log(`check-seo: 발행 글 ${published.length}편 · 오류 ${errors.length} · 경고 ${warns.length}`);
process.exit(errors.length ? 1 : 0);

#!/usr/bin/env node
/**
 * 검색 · AI 전달 점검 — npm run check:seo (먼저 npm run build)
 * 발행된 글마다: 제목 · 설명 길이, 태그, 글 사이 링크, 빌드 결과(HTML 메타 · JSON-LD · 사이트맵 · 원문 .md · llms.txt)를 본다.
 * 오류는 exit 1, 권고는 경고만. 기준은 .claude/skills/blog-seo/SKILL.md.
 * 초안 점검: npm run check:seo -- <slug> — 빌드 없이 원문만 본다(제목 · 설명 · 태그 · 요약 절 · 글 링크 · 그림 alt · 사이트 핵심 키워드).
 * 사이트 핵심 키워드의 정본은 site.config.mjs SITE_KEYWORDS(R-BLOG-SEO).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_KEYWORDS } from '../site.config.mjs';

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

// 사이트 핵심 키워드(R-BLOG-SEO) — 글에 드러난 키워드 · 한 덩이 글에서 몇 번 나오나
// 건너뜀 표지(R-BLOG-SEO · 법제처 T-003385) — 글 주제와 무관해 키워드를 넣으면 무관 삽입이 되는 글: <!-- site-keyword-skip: <까닭> -->
const skipped = [];
const skipMark = (src) => src.match(/<!--\s*site-keyword-skip:([^]*?)-->/)?.[1].trim();
const kwNames = SITE_KEYWORDS.map((k) => k.name).join(' · ');
const kwHits = (text) => SITE_KEYWORDS.filter((k) => k.match.some((m) => text.includes(m)));
const kwCount = (text) => SITE_KEYWORDS.reduce((n, k) => n + k.match.reduce((a, m) => a + text.split(m).length - 1, 0), 0);
const body = (src) => src.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^```[\s\S]*?^```/gm, '').replace(/<!--[\s\S]*?-->/g, '');
// «## 한 줄로» 절 본문 + 첫 단락(제목 · import · 그림 · 표 · 인용 줄이 아닌 첫 글 줄 묶음)
const lead = (src) => {
	const b = body(src);
	const sum = b.match(/^## 한 줄로\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1] ?? '';
	const first = b.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !/^(#|import |!\[|\||>|<)/.test(p)) ?? '';
	return `${sum}\n${first}`;
};

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
// 원문만 보는 점검 — 발행 글과 초안이 같이 쓴다
const checkSource = (slug, src, f) => {
	// 1. 제목 · 설명 — 검색 결과에서 잘리지 않게
	if (f.title.length > 60) warn(slug, `제목 ${f.title.length}자 — 60자 넘으면 검색 결과에서 잘림`);
	if (f.description.length < 40) err(slug, `설명 ${f.description.length}자 — 40자 이상으로(검색 · AI 요약에 쓰임)`);
	else if (f.description.length > 160) warn(slug, `설명 ${f.description.length}자 — 160자 넘으면 검색 결과에서 잘림(앞 80자에 핵심)`);
	if (!/\[\s*'/.test(f.tags)) warn(slug, '태그 없음');
	// 2. 첫 문단 — AI 요약이 앞부분을 많이 쓴다
	if (!/^## 한 줄로/m.test(src)) warn(slug, '«## 한 줄로» 요약 절 없음(AI · 검색 요약이 앞부분을 씀)');
	// 2-1. 사이트 핵심 키워드 — 제목 · 설명 하나 이상 + 요약 절 · 첫 단락 하나 이상(R-BLOG-SEO). 채우기는 경고
	const skip = skipMark(src);
	if (skip === '') warn(slug, '사이트 핵심 키워드 건너뜀 표지에 까닭 없음 — <!-- site-keyword-skip: <까닭> -->');
	if (skip) skipped.push(`${slug}: ${skip}`);
	else {
		if (!kwHits(`${f.title}\n${f.description}`).length) warn(slug, `사이트 핵심 키워드(${kwNames}) 가 제목 · 설명에 없음 — 글 주제에 맞는 말 하나를 자연스럽게(무관하면 건너뜀 표지 + 까닭)`);
		if (!kwHits(lead(src)).length) warn(slug, `사이트 핵심 키워드(${kwNames}) 가 «## 한 줄로» · 첫 단락에 없음`);
	}
	if (kwCount(f.description) > 3) warn(slug, `설명에 사이트 핵심 키워드 ${kwCount(f.description)}번 — 키워드 채우기(3번 넘음)`);
	for (const k of SITE_KEYWORDS) if (k.match.reduce((a, m) => a + f.title.split(m).length - 1, 0) > 1) warn(slug, `제목에 «${k.name}» 되풀이 — 키워드 채우기`);
	// 3. 글 사이 링크 — 없는 글 · 초안으로 가는 링크는 발행하면 깨진다
	for (const m of src.matchAll(/\]\(\.\.\/([a-z0-9-]+)\/\)/g)) {
		const target = join(BLOG, m[1], 'index.md');
		const together = only.includes(m[1]) && existsSync(target); // 함께 점검하는 초안끼리는 같이 발행된다
		if (!together && (!existsSync(target) || fm(readFileSync(target, 'utf8')).draft)) err(slug, `깨진 글 링크 ../${m[1]}/ (초안이거나 없음 — 함께 발행하면 슬러그를 같이 주기)`);
	}
};

// 초안 점검 — 슬러그를 주면 그 글의 원문만 본다 (시리즈는 슬러그를 함께 준다)
if (only.length) {
	for (const slug of only) {
		const path = join(BLOG, slug, 'index.md');
		if (!existsSync(path)) { err(slug, '글이 없음'); continue; }
		const src = readFileSync(path, 'utf8');
		checkSource(slug, src, fm(src));
		// 코드 블록 안의 ![..](..) 는 문법 예시라 그림이 아니다
		const prose = src.replace(/^```[\s\S]*?^```/gm, '');
		for (const m of prose.matchAll(/!\[([^\]]*)\]\(/g)) if (m[1].trim().length < 5) warn(slug, '짧거나 빈 이미지 alt');
	}
	for (const s of skipped) console.log('  건너뜀 ' + s);
	for (const w of warns) console.log('  경고 ' + w);
	for (const e of errors) console.log('  오류 ' + e);
	console.log(`check-seo: 지정한 글 ${only.length}편 · 오류 ${errors.length} · 경고 ${warns.length} · 키워드 건너뜀 ${skipped.length}`);
	// --strict: 초안 게이트(R-BLOG-SEO) — 경고도 실패
	const strict = process.argv.includes('--strict');
	process.exit(errors.length || (strict && warns.length) ? 1 : 0);
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
	if (kwHits(`${f.title}\n${f.description}\n${body(src)}`).length && !html.includes('"about":[')) err(slug, 'JSON-LD about(사이트 핵심 키워드) 없음');
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
// 사이트 핵심 키워드 — 홈 meta · JSON-LD · llms.txt 머리
const home = existsSync(join(DIST, 'index.html')) ? readFileSync(join(DIST, 'index.html'), 'utf8') : '';
for (const k of SITE_KEYWORDS) {
	if (!new RegExp(`<meta name="keywords" content="[^"]*${k.name}`).test(home)) err('site', `홈 meta keywords 에 «${k.name}» 없음`);
	if (!llms.includes(`${k.name}(${k.en})`)) err('site', `llms.txt 핵심 주제에 «${k.name}» 없음`);
}
if (!home.includes('"about":[')) err('site', '홈 JSON-LD about 없음');
for (const slug of published) {
	if (!sitemap.includes(`/posts/${slug}/`)) err(slug, '사이트맵에 없음');
	if (!llms.includes(`/posts/${slug}.md`)) err(slug, 'llms.txt 목차에 없음');
}
for (const d of readdirSync(join(DIST, 'posts'))) if (d.endsWith('.md') && !published.includes(d.slice(0, -3))) err(d, '초안이 원문 .md 로 나감');

for (const s of skipped) console.log('  건너뜀 ' + s);

for (const w of warns) console.log('  경고 ' + w);
for (const e of errors) console.log('  오류 ' + e);
console.log(`check-seo: 발행 글 ${published.length}편 · 오류 ${errors.length} · 경고 ${warns.length} · 키워드 건너뜀 ${skipped.length}`);
process.exit(errors.length ? 1 : 0);

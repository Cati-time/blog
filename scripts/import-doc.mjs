#!/usr/bin/env node
/**
 * 문서 가져오기 — Markdown·HTML 문서를 **내용은 그대로, 스타일만 걷어내** 블로그 글(초안)로 만든다.
 *
 *   npm run import -- <문서.md|.html> --slug <slug> --category <분류> --platform <플랫폼> [--title "…"] [--tags a,b] [--date YYYY-MM-DD] [--force]
 *
 * 하는 일
 *   1. 스타일 제거   style·class·id 등 속성, <font>·<span>·<center> 껍데기, <style>·<link>
 *   2. 위험 요소 제거 <script>·<iframe>·<form> 등 (공개 블로그에서 쓸 수 없고 내용도 아니다)
 *   3. 형식 변환     HTML → Markdown (마크다운으로 표현 못 하는 병합 표·접기 등은 정리된 HTML 로 유지)
 *   4. 이미지       원본 옆 로컬 이미지·data URI 를 글 폴더로 복사하고 경로를 ./파일명 으로
 *   5. 본문 대조     원본 본문과 결과의 **단어 순서가 전부 같은지** 확인해 보고한다
 *
 * 내용은 바꾸지 않는다. 문장을 고치거나, 요약하거나, 순서를 바꾸거나, 무언가를 지우지 않는다.
 * 예외 두 가지만 기계적으로 한다: 첫 # 제목은 frontmatter title 로 옮기고, 본문에 # 이 남으면 제목 단계를 한 칸씩 내린다.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import domino from '@mixmark-io/domino';
import TurndownService from 'turndown';
import gfmPlugin from 'turndown-plugin-gfm';
import { CATEGORIES, PLATFORMS } from '../site.config.mjs';

// ── 인자 ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const opt = { tags: '', force: false };
const pos = [];
for (let i = 0; i < args.length; i++) {
	const a = args[i];
	const m = a.match(/^--(slug|category|platform|title|tags|date)(?:=(.*))?$/);
	if (m) opt[m[1]] = m[2] ?? args[++i] ?? '';
	else if (a === '--force') opt.force = true;
	else pos.push(a);
}
const catIds = CATEGORIES.map((c) => c.id);
const platIds = PLATFORMS.map((p) => p.id);
const usage = [
	'사용법: npm run import -- <문서.md|.html> --slug <slug> --category <분류> --platform <플랫폼> [--title "…"] [--tags a,b] [--date YYYY-MM-DD] [--force]',
	`  분류:   ${catIds.join(' | ')}`,
	`  플랫폼: ${platIds.join(' | ')}`,
].join('\n');
const die = (msg, code = 1) => {
	console.error(msg);
	process.exit(code);
};

const src = pos[0] && resolve(pos[0]);
if (!src || !existsSync(src)) die(`문서를 찾을 수 없습니다: ${pos[0] ?? '(없음)'}\n\n${usage}`);
if (!opt.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(opt.slug)) die(`--slug 는 영문 소문자·숫자·하이픈만 됩니다 (받은 값: '${opt.slug ?? ''}')\n\n${usage}`);
if (!catIds.includes(opt.category) || !platIds.includes(opt.platform))
	die(`분류·플랫폼을 목록에서 골라 주세요 (받은 값: category='${opt.category ?? ''}', platform='${opt.platform ?? ''}')\n\n${usage}`);
if (opt.date && !/^\d{4}-\d{2}-\d{2}$/.test(opt.date)) die(`--date 는 YYYY-MM-DD 형식입니다 (받은 값: '${opt.date}')`);

const ext = extname(src).toLowerCase();
const isHtml = ext === '.html' || ext === '.htm';
if (!isHtml && !['.md', '.markdown', '.mdx', '.txt'].includes(ext)) die(`지원하는 형식은 .md · .html 입니다 (받은 파일: ${basename(src)})`);

const outDir = join('src/content/blog', opt.slug);
const outFile = join(outDir, 'index.md');
if (existsSync(outFile) && !opt.force) die(`이미 있는 글입니다: ${outFile}  (덮어쓰려면 --force)`);

const raw = readFileSync(src, 'utf8');
const report = { removedAttrs: {}, unwrapped: {}, removedTags: {}, images: { copied: 0, external: 0, noAlt: 0, missing: [] }, notes: [] };
const bump = (bag, key, n = 1) => (bag[key] = (bag[key] ?? 0) + n);

// ── 공통 규칙 ───────────────────────────────────────────────────────
const BANNED = ['script', 'style', 'noscript', 'template', 'iframe', 'object', 'embed', 'form', 'link', 'meta', 'base', 'button', 'select', 'textarea', 'canvas', 'svg', 'video', 'audio'];
const UNWRAP = ['font', 'span', 'center', 'o:p'];
const ALLOWED_ATTRS = {
	a: ['href', 'title'],
	img: ['src', 'alt', 'title'],
	td: ['colspan', 'rowspan'],
	th: ['colspan', 'rowspan'],
	ol: ['start'],
	details: ['open'],
	abbr: ['title'],
	input: ['type', 'checked', 'disabled'],
};
const IMG_EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp' };
const usedNames = new Set();
const adopted = new Set(); // 이미 글 폴더로 옮긴 경로 (./파일명) — 두 번 옮기지 않는다

function uniqueName(name) {
	let n = name.replace(/[^\w.\-가-힣]/g, '-');
	const e = extname(n);
	const stem = n.slice(0, n.length - e.length) || 'image';
	let i = 1;
	while (usedNames.has(n)) n = `${stem}-${++i}${e}`;
	usedNames.add(n);
	return n;
}

/** 이미지 경로를 글 폴더 기준으로 옮긴다. 반환값: 새 경로(또는 원래 값) */
function adoptImage(srcAttr) {
	if (!srcAttr || adopted.has(srcAttr)) return srcAttr;
	const data = srcAttr.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
	if (data) {
		const e = IMG_EXT[data[1].toLowerCase()];
		if (!e) {
			report.notes.push(`지원하지 않는 내장 이미지 형식(${data[1]})은 그대로 두었습니다`);
			return srcAttr;
		}
		const name = uniqueName(`image-${usedNames.size + 1}.${e}`);
		mkdirSync(outDir, { recursive: true });
		writeFileSync(join(outDir, name), Buffer.from(data[2], 'base64'));
		report.images.copied++;
		adopted.add(`./${name}`);
		return `./${name}`;
	}
	if (/^(https?:)?\/\//i.test(srcAttr)) {
		report.images.external++;
		return srcAttr;
	}
	let p;
	try {
		p = decodeURIComponent(srcAttr.split(/[?#]/)[0]);
	} catch {
		p = srcAttr;
	}
	const abs = resolve(dirname(src), p);
	if (!existsSync(abs)) {
		report.images.missing.push(srcAttr);
		return srcAttr;
	}
	const name = uniqueName(basename(abs));
	mkdirSync(outDir, { recursive: true });
	copyFileSync(abs, join(outDir, name));
	report.images.copied++;
	adopted.add(`./${name}`);
	return `./${name}`;
}

/** 마크다운에서 코드 블록 밖의 줄에만 fn 을 적용한다 */
function outsideFences(md, fn) {
	let inFence = false;
	return md
		.split('\n')
		.map((line) => {
			if (/^\s*(```|~~~)/.test(line)) {
				inFence = !inFence;
				return line;
			}
			return inFence ? line : fn(line);
		})
		.join('\n');
}

/** 코드 블록 밖에서 빈 줄이 여러 개 이어지면 하나로 (코드 안의 빈 줄은 그대로) */
function collapseBlankLines(md) {
	const out = [];
	let inFence = false;
	for (const line of md.split('\n')) {
		if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
		if (!inFence && !line.trim() && out.length && !out[out.length - 1].trim()) continue;
		out.push(line);
	}
	return out.join('\n');
}

/** 본문에 # 제목이 남아 있으면 모든 제목을 한 단계 내린다 (블로그 본문은 ## 부터) */
function demoteIfNeeded(md) {
	let hasH1 = false;
	outsideFences(md, (l) => {
		if (/^#\s/.test(l)) hasH1 = true;
		return l;
	});
	if (!hasH1) return md;
	report.notes.push('본문에 # 제목이 있어 모든 제목을 한 단계 내렸습니다 (# → ##, ## → ### …). 글자는 그대로입니다');
	return outsideFences(md, (l) => (/^#{1,5}\s/.test(l) ? '#' + l : l));
}

/** 비교용 텍스트 추출: 마크다운·HTML 표기를 걷어낸다 */
function textOfMarkdown(md) {
	let t = md
		.replace(/^\s*(```|~~~).*$/gm, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<\/?(p|div|li|ul|ol|td|th|tr|table|thead|tbody|h[1-6]|pre|blockquote|figure|figcaption|details|summary|br|hr)\b[^>]*>/gi, ' ')
		.replace(/<[^>]+>/g, '');
	t = t.replace(/^(\s*>)*\s*(?:[-*+]\s+(?:\[[ xX]\]\s+)?|\d+\.\s+)/gm, ' ');
	return decodeEntities(t.replace(/\\([\\`*_{}\[\]()#+\-.!|>~])/g, '$1'));
}
function decodeEntities(s) {
	const map = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
	return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
		if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
		return map[e.toLowerCase()] ?? m;
	});
}
// 비교 단위: 글자·숫자·문장부호. 공백은 형식이라 비교하지 않는다(블록 경계·줄바꿈 차이는 무시)
const chars = (s) => (s.match(/[\p{L}\p{N}.,?!:;%]/gu) ?? []).join('');
const words = (s) => s.match(/[\p{L}\p{N}]+/gu) ?? [];
const BLOCK_TAGS = new Set(['P', 'DIV', 'LI', 'UL', 'OL', 'TD', 'TH', 'TR', 'TABLE', 'THEAD', 'TBODY', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE', 'BLOCKQUOTE', 'FIGURE', 'FIGCAPTION', 'DETAILS', 'SUMMARY', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'BR', 'HR']);
/** DOM 의 보이는 글자 — 블록 경계에 공백을 넣는다 */
function domText(node) {
	if (node.nodeType === 3) return node.data;
	if (node.nodeType !== 1) return '';
	let t = '';
	for (let c = node.firstChild; c; c = c.nextSibling) t += domText(c);
	return BLOCK_TAGS.has(node.nodeName) ? ` ${t} ` : t;
}

// ── HTML ────────────────────────────────────────────────────────────
function fromHtml(html) {
	const doc = domino.createDocument(html);
	const body = doc.body;
	let title = doc.querySelector('title')?.textContent.trim() || '';

	// 위험·비내용 요소 제거
	for (const tag of BANNED) {
		for (const el of Array.from(body.querySelectorAll(tag))) {
			if (tag === 'svg' || tag === 'video' || tag === 'audio' || tag === 'canvas')
				report.notes.push(`<${tag}> 은(는) 옮길 수 없어 뺐습니다 — 필요하면 이미지 파일로 넣어 주세요`);
			bump(report.removedTags, tag);
			el.parentNode?.removeChild(el);
		}
	}
	for (const el of Array.from(body.querySelectorAll('input'))) {
		if ((el.getAttribute('type') || '').toLowerCase() !== 'checkbox') {
			bump(report.removedTags, 'input');
			el.parentNode?.removeChild(el);
		}
	}
	// 맨 앞의 h1 → 제목 (앞에 다른 글자가 없을 때만. --title 을 줬고 글자가 다르면 본문에 둔다)
	const h1 = body.querySelector('h1');
	if (h1) {
		const h1Text = h1.textContent.trim();
		const all = body.textContent;
		const before = all.slice(0, all.indexOf(h1.textContent)).trim();
		if (!before && (!opt.title || opt.title.trim() === h1Text)) {
			title = h1Text;
			h1.parentNode.removeChild(h1);
		}
	}
	// 스타일로만 표현된 강조는 태그로 살린다 (굵게·기울임·취소선). 색·글꼴·크기는 버린다
	for (const el of Array.from(body.querySelectorAll('[style]'))) {
		const st = (el.getAttribute('style') || '').toLowerCase();
		const tag = el.tagName.toLowerCase();
		if ((tag === 'b' || tag === 'strong') && /font-weight\s*:\s*(normal|[1-5]00)\b/.test(st)) {
			// 구글 문서의 <b style="font-weight:normal"> 전체 감싸기 — 굵게가 아니다
			while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
			el.parentNode.removeChild(el);
			bump(report.unwrapped, '<b 굵게 아님>');
			continue;
		}
		if (!['span', 'font', 'div', 'p', 'td', 'th', 'li'].includes(tag)) continue;
		const wraps = [];
		if (/font-weight\s*:\s*(bold|bolder|[6-9]00)\b/.test(st)) wraps.push('strong');
		if (/font-style\s*:\s*italic/.test(st)) wraps.push('em');
		if (/text-decoration[^;]*line-through/.test(st)) wraps.push('del');
		if (!wraps.length || !el.textContent.trim()) continue;
		let inner = doc.createElement(wraps[0]);
		const outer = inner;
		for (const w of wraps.slice(1)) {
			const x = doc.createElement(w);
			inner.appendChild(x);
			inner = x;
		}
		while (el.firstChild) inner.appendChild(el.firstChild);
		el.appendChild(outer);
		report.emphasis = (report.emphasis ?? 0) + 1;
	}
	// 껍데기 벗기기
	for (const tag of UNWRAP) {
		for (const el of Array.from(body.getElementsByTagName(tag))) {
			bump(report.unwrapped, `<${tag}>`);
			while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
			el.parentNode.removeChild(el);
		}
	}
	// 속성 정리
	for (const el of Array.from(body.querySelectorAll('*'))) {
		const tag = el.tagName.toLowerCase();
		const keep = ALLOWED_ATTRS[tag] ?? [];
		for (const { name, value } of Array.from(el.attributes)) {
			if (tag === 'code' && name === 'class' && /language-[\w+-]+/.test(value)) {
				el.setAttribute('class', value.match(/language-[\w+-]+/)[0].toLowerCase());
				continue;
			}
			if (tag === 'pre' && name === 'class' && /language-[\w+-]+/.test(value)) {
				const code = el.querySelector('code');
				if (code && !/language-/.test(code.getAttribute('class') || '')) code.setAttribute('class', value.match(/language-[\w+-]+/)[0].toLowerCase());
			}
			if (keep.includes(name) && !(name === 'href' && /^\s*javascript:/i.test(value))) continue;
			bump(report.removedAttrs, name === 'style' || name === 'class' ? name : '기타');
			el.removeAttribute(name);
		}
	}
	// 이미지
	for (const img of Array.from(body.querySelectorAll('img'))) {
		const before = img.getAttribute('src');
		const after = adoptImage(before);
		img.setAttribute('src', after);
		if (!(img.getAttribute('alt') || '').trim()) report.images.noAlt++;
	}
	for (const a of Array.from(body.querySelectorAll('a[href]'))) {
		const href = a.getAttribute('href');
		const onlyImg = a.children.length === 1 && a.children[0].nodeName === 'IMG' && !a.textContent.trim();
		const localHref = !/^(https?:|mailto:|#|\/\/)/i.test(href);
		if (onlyImg && localHref) {
			// 이미지를 감싼 원본 파일 링크 — 블로그에서는 열리지 않는다. 링크만 풀고 이미지는 둔다
			a.parentNode.insertBefore(a.firstChild, a);
			a.parentNode.removeChild(a);
			report.unwrappedImgLinks = (report.unwrappedImgLinks ?? 0) + 1;
			continue;
		}
		if (!/^(https?:|mailto:|#|\/\/)/i.test(href)) report.localLinks = (report.localLinks ?? 0) + 1;
	}

	const sourceText = domText(body);

	const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', emDelimiter: '*', hr: '---' });
	td.use(gfmPlugin.gfm);
	td.keep(['details', 'summary', 'kbd', 'sub', 'sup', 'mark', 'abbr', 'u']);
	// <figure>: 이미지는 마크다운 이미지로(그래야 이미지 파일이 함께 배포된다), 캡션은 바로 아래 문단으로
	td.addRule('figureToMarkdown', {
		filter: 'figure',
		replacement: (content) => `\n\n${content.trim()}\n\n`,
	});
	td.addRule('figcaptionToParagraph', {
		filter: 'figcaption',
		replacement: (content) => `\n\n${content.trim()}\n\n`,
	});
	// 병합 셀이 있는 표는 마크다운 표로 바꾸면 정보가 사라지므로 정리된 HTML 로 유지
	td.addRule('mergedTable', {
		filter: (n) => n.nodeName === 'TABLE' && !!n.querySelector('[colspan],[rowspan]'),
		replacement: (_c, n) => `\n\n${n.outerHTML}\n\n`,
	});
	// 한글 조사와 붙은 강조: 마크다운 규칙상 **"…"**은 처럼 문장부호로 끝나고 글자가 이어지면 강조가 풀린다.
	// 그런 위치에서만 <strong>/<em> 태그로 쓴다.
	const PUNCT = /[\p{P}\p{S}]/u;
	const WORDCH = /[\p{L}\p{N}]/u;
	const flankSafe = (node, c) => {
		const t = c.trim();
		const prev = (node.previousSibling?.textContent ?? '').slice(-1);
		const next = (node.nextSibling?.textContent ?? '').slice(0, 1);
		return !((PUNCT.test(t[0]) && WORDCH.test(prev)) || (PUNCT.test(t.at(-1)) && WORDCH.test(next)));
	};
	td.addRule('strongSafe', {
		filter: ['strong', 'b'],
		replacement: (c, node) => (!c.trim() ? c : flankSafe(node, c) ? `**${c}**` : `<strong>${c}</strong>`),
	});
	td.addRule('emSafe', {
		filter: ['em', 'i'],
		replacement: (c, node) => (!c.trim() ? c : flankSafe(node, c) ? `*${c}*` : `<em>${c}</em>`),
	});
	td.addRule('listItemTight', {
		filter: 'li',
		replacement: (content, node, options) => {
			const parent = node.parentNode;
			let prefix = `${options.bulletListMarker} `;
			if (parent.nodeName === 'OL') {
				const start = parent.getAttribute('start');
				prefix = `${(start ? Number(start) : 1) + Array.prototype.indexOf.call(parent.children, node)}. `;
			}
			const body = content.replace(/^\n+/, '').replace(/\n+$/, '\n').replace(/\n/gm, `\n${' '.repeat(prefix.length)}`);
			return prefix + body + (node.nextSibling && !/\n$/.test(body) ? '\n' : '');
		},
	});
	let md = td.turndown(body).trim();
	const htmlLocalImgs = (md.match(/<img\b[^>]*\ssrc="\.\/[^"]+"/g) ?? []).length;
	if (htmlLocalImgs)
		report.notes.push(`표·접기 같은 HTML 블록 안에 이미지 ${htmlLocalImgs}개가 있어 블로그에 표시되지 않습니다 — 블록 밖으로 빼야 합니다 (검사 P5)`);
	md = demoteIfNeeded(md);
	return { title, md, sourceText, meta: {} };
}

// ── Markdown ────────────────────────────────────────────────────────
function fromMarkdown(text) {
	let meta = {};
	let body = text.replace(/^﻿/, '');
	const fm = body.match(/^---\n([\s\S]*?)\n---\n?/);
	if (fm) {
		for (const line of fm[1].split('\n')) {
			const m = line.match(/^(\w+):\s*(.*)$/);
			if (m) meta[m[1]] = m[2].trim().replace(/^(['"])(.*)\1$/, '$2');
		}
		body = body.slice(fm[0].length);
		report.notes.push('원본 frontmatter 는 블로그 형식으로 바꿨습니다 (title·description·date·tags 만 가져옴)');
	}

	// 코드 블록 밖에서만: 위험 태그 제거 → 스타일 속성 제거 → 껍데기 태그 벗기기
	const bannedBlock = new RegExp(`<(${BANNED.join('|')})\\b[\\s\\S]*?<\\/\\1\\s*>|<(${BANNED.join('|')})\\b[^>]*\\/?>`, 'gi');
	let inFence = false;
	const segments = [];
	let buf = [];
	for (const line of body.split('\n')) {
		if (/^\s*(```|~~~)/.test(line)) {
			if (!inFence) {
				segments.push({ code: false, text: buf.join('\n') });
				buf = [line];
			} else {
				buf.push(line);
				segments.push({ code: true, text: buf.join('\n') });
				buf = [];
			}
			inFence = !inFence;
			continue;
		}
		buf.push(line);
	}
	segments.push({ code: inFence, text: buf.join('\n') });

	const cleaned = segments.map((s) => {
		if (s.code) return s.text;
		let t = s.text.replace(bannedBlock, (_m, a, b) => {
			bump(report.removedTags, (a || b).toLowerCase());
			return '';
		});
		t = t.replace(/<(\/?)([a-z][\w:-]*)(\s[^<>]*?)?(\/?)>/gi, (m, close, tag, attrs = '', self) => {
			const name = tag.toLowerCase();
			if (UNWRAP.includes(name)) {
				if (!close) bump(report.unwrapped, `<${name}>`);
				return '';
			}
			if (close || !attrs.trim()) return m;
			const keep = ALLOWED_ATTRS[name] ?? [];
			const kept = [];
			for (const am of attrs.matchAll(/([\w:-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g)) {
				const an = am[1].toLowerCase();
				const av = am[2] ?? '';
				if (keep.includes(an) && !(an === 'href' && /javascript:/i.test(av))) {
					if (name === 'img' && an === 'src') {
						const v = av.replace(/^["']|["']$/g, '');
						kept.push(`src="${adoptImage(v)}"`);
						continue;
					}
					kept.push(am[0]);
				} else bump(report.removedAttrs, an === 'style' || an === 'class' ? an : '기타');
			}
			return `<${tag}${kept.length ? ' ' + kept.join(' ') : ''}${self}>`;
		});
		// 로컬 이미지를 가리키는 <img> → 마크다운 이미지 (HTML 이미지는 파일이 배포되지 않는다)
		t = t.replace(/<img\b([^>]*)>/gi, (m, attrs) => {
			const srcM = attrs.match(/\ssrc="(\.\/[^"]+)"/);
			if (!srcM) return m;
			const altM = attrs.match(/\salt\s*=\s*("([^"]*)"|'([^']*)')/);
			const alt = altM ? (altM[2] ?? altM[3] ?? '') : '';
			if (!alt.trim()) report.images.noAlt++;
			report.htmlImgToMd = (report.htmlImgToMd ?? 0) + 1;
			return `![${alt}](${srcM[1]})`;
		});
		// 속성이 없는 <p>·<div> 는 껍데기일 뿐이다 — 벗겨서 일반 문단으로 (안의 마크다운이 살아난다)
		t = t.replace(/<(p|div)>/gi, () => (bump(report.unwrapped, '<p/div>'), '\n\n')).replace(/<\/(p|div)>/gi, '\n\n');
		t = t.replace(/\n{3,}/g, '\n\n');
		// 마크다운 이미지
		t = t.replace(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?((?:\s+["'][^)]*["'])?)\s*\)/g, (_m, alt, p, titlePart) => {
			if (!alt.trim()) report.images.noAlt++;
			return `![${alt}](${adoptImage(p)}${titlePart})`;
		});
		return t;
	});
	let md = cleaned.join('\n');

	// 제목: frontmatter title 이 없고, 맨 앞 줄이 # 제목이면 그것을 제목으로 옮긴다
	let title = meta.title || '';
	const lead = md.match(/^\s*#\s+(.+?)\s*#*\s*(\n|$)/);
	let leadRemoved = false;
	if (!title && lead && (!opt.title || opt.title.trim() === lead[1].trim())) {
		title = lead[1].trim();
		md = md.slice(lead[0].length);
		leadRemoved = true;
	}
	// 비교 기준: 원본 본문에서 위험 태그 블록과 (옮긴) 제목 줄만 뺀 것
	let originalForCompare = segments.map((s) => (s.code ? s.text : s.text.replace(bannedBlock, ''))).join('\n');
	if (leadRemoved) originalForCompare = originalForCompare.replace(/^\s*#\s+.+?(\n|$)/, '');
	md = demoteIfNeeded(md.trim());
	return { title, md, sourceText: textOfMarkdown(originalForCompare), meta };
}

// ── 실행 ────────────────────────────────────────────────────────────
const { title: detectedTitle, md, sourceText, meta } = isHtml ? fromHtml(raw) : fromMarkdown(raw);
const title = opt.title || detectedTitle;
if (!title) die('제목을 찾지 못했습니다. --title "제목" 으로 알려 주세요.');

const today = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = opt.date || (meta.date || meta.pubDate || '').slice(0, 10) || `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
const tags = (opt.tags || (meta.tags || '').replace(/^\[|\]$/g, ''))
	.split(',')
	.map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
	.filter(Boolean);
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const frontmatter = [
	'---',
	`title: ${q(title)}`,
	`description: ${q(meta.description || '')}`,
	`pubDate: ${date}`,
	`category: ${opt.category}`,
	`platform: ${opt.platform}`,
	`tags: [${tags.map(q).join(', ')}]`,
	'draft: true',
	'---',
	'',
].join('\n');

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, `${frontmatter}\n${collapseBlankLines(md).trim()}\n`, 'utf8');

// 본문 대조 — 공백을 뺀 글자·숫자·문장부호 순서가 완전히 같아야 한다
const outText = textOfMarkdown(md);
const a = chars(sourceText);
const b = chars(outText);
const same = a === b;
let diffMsg = '';
if (!same) {
	let i = 0;
	while (i < a.length && a[i] === b[i]) i++;
	diffMsg = `처음 다른 곳 (${i + 1}번째 글자)\n      원본: …${a.slice(Math.max(0, i - 15), i + 15)}…\n      결과: …${b.slice(Math.max(0, i - 15), i + 15)}…`;
}
const wordCount = words(sourceText).length;

const fmt = (bag) =>
	Object.entries(bag)
		.map(([k, v]) => `${k} ${v}`)
		.join(' · ') || '없음';
console.log(`\n✔ 가져옴: ${outFile}  (초안)`);
console.log(`  원본      ${basename(src)} (${isHtml ? 'HTML' : 'Markdown'})`);
console.log(`  제목      ${title}`);
console.log(`  걷어낸 것  속성: ${fmt(report.removedAttrs)}  |  껍데기 태그: ${fmt(report.unwrapped)}`);
console.log(`  뺀 요소    ${fmt(report.removedTags)}`);
console.log(
	`  이미지    복사 ${report.images.copied} · 외부 링크 ${report.images.external} · 설명(alt) 없음 ${report.images.noAlt}` +
		(report.images.missing.length ? ` · 파일 못 찾음 ${report.images.missing.length} (${report.images.missing.join(', ')})` : ''),
);
if (report.unwrappedImgLinks) console.log(`  이미지 링크 이미지를 감싼 원본 파일 링크 ${report.unwrappedImgLinks}개를 풀었습니다 (이미지는 그대로)`);
if (report.htmlImgToMd) console.log(`  이미지 표기 HTML <img> ${report.htmlImgToMd}개를 마크다운 이미지로 바꿨습니다 (그래야 블로그에 표시됩니다)`);
if (report.emphasis) console.log(`  강조 보존  스타일로만 표현된 굵게·기울임·취소선 ${report.emphasis}곳을 표준 표기로 바꿨습니다`);
if (report.localLinks) console.log(`  ⚠ 링크    원본 폴더의 다른 문서를 가리키는 링크 ${report.localLinks}개 — 블로그에서는 열리지 않습니다. 공개 주소로 바꾸거나 링크를 풀지 결정이 필요합니다`);
for (const n of report.notes) console.log(`  참고      ${n}`);
console.log(
	same
		? `  본문 대조  ✔ 원본과 일치 — 단어 ${wordCount}개, 글자·문장부호 ${a.length}자가 같은 순서 (공백만 다를 수 있음)`
		: `  본문 대조  ✖ 원본 ${a.length}자 / 결과 ${b.length}자 — ${diffMsg}`,
);
console.log(`\n다음: npm run check:posts -- ${opt.slug}   ·   미리보기 http://localhost:4321/blog/posts/${opt.slug}/`);
process.exit(same ? 0 : 3);

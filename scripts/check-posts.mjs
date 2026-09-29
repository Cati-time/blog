#!/usr/bin/env node
/**
 * 글 검사 — npm run check:posts [slug …]   (npm run check / build 에서도 돈다)
 *
 * 공개 블로그라서 막아야 할 것은 오류(빌드 실패), 고치면 좋은 것은 경고로 낸다.
 * 규칙 설명: WRITING_GUIDE.md §5(HTML) · §6(공개 금지 정보)
 *
 *  오류
 *   P1 비밀값 (API 키·토큰·개인키)            — 코드 블록 안도 검사한다
 *   P2 금지 HTML (script·iframe·style·form·object·embed, on* 이벤트, javascript: 링크)
 *   P3 인라인 style 속성 (디자인 토큰을 우회한다)
 *   P4 이미지 설명(alt) 없음, 글 폴더에 없는 로컬 이미지
 *   P5 HTML <img> 로 쓴 글 폴더 이미지 — 빌드가 파일을 배포하지 않아 깨진다. ![설명](./파일) 로 써야 한다
 *  경고
 *   W1 description 비어 있음      W2 코드 블록에 언어 없음      W3 본문에 # (h1) 사용
 *   W4 사설 IP·내부 호스트명      W5 이메일 주소                W6 class 속성
 *   W7 base 없는 절대 링크(/posts/…) — 사이트는 /blog/ 아래에 있다
 *   W8 문장부호로 끝나는 강조 뒤에 글자가 붙음 (**"인용"**은) — 강조가 풀려 별표가 보인다
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const ROOT = process.cwd();
const BLOG = join(ROOT, 'src/content/blog');
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));

function walk(dir) {
	return readdirSync(dir).flatMap((n) => {
		const p = join(dir, n);
		return statSync(p).isDirectory() ? walk(p) : [p];
	});
}
const slugOf = (f) => relative(BLOG, f).replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
let files = walk(BLOG).filter((f) => /\.(md|mdx)$/.test(f));
if (only.length) {
	files = files.filter((f) => only.includes(slugOf(f)));
	const missing = only.filter((s) => !files.some((f) => slugOf(f) === s));
	if (missing.length) {
		console.error(`check-posts: 글을 찾을 수 없습니다 → ${missing.join(', ')}`);
		process.exit(2);
	}
}
if (files.length === 0) {
	console.error('check-posts: 검사한 글이 0개입니다. 경로가 잘못됐습니다.');
	process.exit(2);
}

const SECRETS = [
	[/AKIA[0-9A-Z]{16}/, 'AWS 액세스 키'],
	[/\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}/, 'GitHub 토큰'],
	[/github_pat_[A-Za-z0-9_]{40,}/, 'GitHub 토큰'],
	[/\bsk-(ant-)?[A-Za-z0-9_-]{20,}/, 'API 키(sk-…)'],
	[/\bxox[abposr]-[A-Za-z0-9-]{10,}/, 'Slack 토큰'],
	[/AIza[0-9A-Za-z_-]{35}/, 'Google API 키'],
	[/-----BEGIN [A-Z ]*PRIVATE KEY-----/, '개인키'],
	[/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, 'JWT 토큰'],
];
const BANNED_TAG = /<\s*(script|iframe|style|form|object|embed|link|meta|base)\b/i;
const EVENT_ATTR = /<[a-z][^>]*\son[a-z]+\s*=/i;
const JS_URL = /(href|src)\s*=\s*["']?\s*javascript:/i;
const STYLE_ATTR = /<[a-z][^>]*\sstyle\s*=/i;
const CLASS_ATTR = /<[a-z][^>]*\sclass(Name)?\s*=/i;
const PRIVATE_IP = /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/;
const INTERNAL_HOST = /\b[a-z0-9-]+(\.[a-z0-9-]+)*\.(internal|corp|lan|intra)\b/i;
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

let errors = 0;
let warnings = 0;
for (const file of files) {
	const text = readFileSync(file, 'utf8');
	const rel = relative(ROOT, file);
	const out = [];
	const add = (level, line, code, msg) => {
		out.push({ level, line, code, msg });
		level === 'error' ? errors++ : warnings++;
	};

	// frontmatter
	const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
	const bodyStart = fm ? fm[0].split('\n').length - 1 : 0;
	const desc = fm?.[1].match(/^description:\s*(.*)$/m)?.[1].trim().replace(/^(['"])(.*)\1$/, '$2').trim();
	if (fm && !desc) add('warn', 1, 'W1', 'description 이 비어 있습니다 — 목록·검색·공유 미리보기에 나오는 한 줄 요약');

	const lines = text.split('\n');
	let inFence = false;
	lines.forEach((raw, i) => {
		const n = i + 1;
		// P1: 코드 블록 안까지 전부
		for (const [re, name] of SECRETS) if (re.test(raw)) add('error', n, 'P1', `비밀값으로 보이는 문자열 (${name}) — 지우거나 가짜 값(****)으로 바꾸세요`);
		if (i < bodyStart) return;

		const fence = raw.match(/^\s*(```|~~~)(.*)$/);
		if (fence) {
			if (!inFence && !fence[2].trim()) add('warn', n, 'W2', '코드 블록에 언어가 없습니다 (예: ```kotlin)');
			inFence = !inFence;
			return;
		}
		if (inFence) return;
		const line = raw.replace(/`[^`]*`/g, ''); // 인라인 코드는 예시이므로 제외

		if (BANNED_TAG.test(line)) add('error', n, 'P2', `금지된 HTML 태그 '${line.match(BANNED_TAG)[1]}' — 공개 블로그에서는 쓸 수 없습니다`);
		if (EVENT_ATTR.test(line)) add('error', n, 'P2', 'HTML 이벤트 속성(on…=) 은 쓸 수 없습니다');
		if (JS_URL.test(line)) add('error', n, 'P2', 'javascript: 링크는 쓸 수 없습니다');
		if (STYLE_ATTR.test(line)) add('error', n, 'P3', 'style 속성은 쓸 수 없습니다 — 모양은 블로그 기본 스타일을 따릅니다');
		if (CLASS_ATTR.test(line)) add('warn', n, 'W6', 'class 속성은 효과가 없습니다 (본문용 스타일이 없음) — 지워도 됩니다');

		for (const m of line.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)) {
			if (!m[1].trim()) add('error', n, 'P4', `이미지 설명(alt)이 비어 있습니다: ${m[2]}`);
			if (m[2].startsWith('.') && !existsSync(join(dirname(file), m[2]))) add('error', n, 'P4', `이미지 파일이 없습니다: ${m[2]}`);
		}
		for (const m of line.matchAll(/<img\b[^>]*>/gi)) {
			const alt = m[0].match(/\salt\s*=\s*["']([^"']*)["']/i);
			if (!alt || !alt[1].trim()) add('error', n, 'P4', 'HTML <img> 에 alt 설명이 없습니다');
			if (/\ssrc\s*=\s*["']?\.{0,2}\/?(?!https?:|\/\/|data:)[^"'\s>]+/i.test(m[0]) && !/\ssrc\s*=\s*["']?(https?:|\/\/|data:)/i.test(m[0]))
				add('error', n, 'P5', 'HTML <img> 로 쓴 글 폴더 이미지는 블로그에 표시되지 않습니다 — ![설명](./파일) 로 쓰세요');
		}

		if (/^#\s/.test(line)) add('warn', n, 'W3', '본문 제목은 ## 부터 씁니다 (# 은 글 제목 자리)');
		if (PRIVATE_IP.test(line)) add('warn', n, 'W4', `사설 IP '${line.match(PRIVATE_IP)[0]}' — 실제 사내 주소라면 지우세요`);
		if (INTERNAL_HOST.test(line)) add('warn', n, 'W4', `내부 호스트명 '${line.match(INTERNAL_HOST)[0]}' — 실제 사내 주소라면 지우세요`);
		if (EMAIL.test(line)) add('warn', n, 'W5', `이메일 주소 '${line.match(EMAIL)[0]}' — 개인정보라면 지우세요`);
		if (/(\*\*|__)(?=\S)[^*_]*?[\p{P}\p{S}]\1(?=[\p{L}\p{N}])/u.test(line) || /(?<![*\w])\*(?=\S)[^*]*?[\p{P}\p{S}]\*(?=[\p{L}\p{N}])/u.test(line))
			add('warn', n, 'W8', '문장부호로 끝나는 강조 뒤에 글자가 붙어 강조가 풀립니다 — <strong>…</strong> 로 쓰거나 띄어 쓰세요');
		if (/\]\(\/(posts|tags|ax|architecture)\//.test(line) || /href=["']\/(posts|tags)\//.test(line))
			add('warn', n, 'W7', '절대 링크에 /blog 가 빠졌습니다 — 다른 글은 ../slug/ 처럼 상대 경로로');
	});

	if (out.length) {
		console.log(`\n${rel}`);
		for (const o of out) console.log(`  ${o.level === 'error' ? '✖' : '⚠'} ${String(o.line).padStart(4)}  ${o.code}  ${o.msg}`);
	}
}

const summary = `check-posts: 글 ${files.length}개 — 오류 ${errors} · 경고 ${warnings}`;
if (errors) {
	console.error(`\n${summary}\n오류는 고쳐야 빌드됩니다. 규칙: WRITING_GUIDE.md §5 · §6`);
	process.exit(1);
}
console.log(warnings ? `\n${summary} (경고는 빌드를 막지 않습니다)` : summary);

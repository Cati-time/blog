#!/usr/bin/env node
/**
 * 디자인 토큰 검사 — npm run check / build 에서 먼저 돈다.
 *
 * 규칙 (docs/design-tokens.md §5)
 *  R1  색상 값 직접 사용 금지: tokens.css 밖의 스타일에서 #hex · rgb() · hsl() · oklch() 를 쓰지 않는다.
 *  R2  원시 토큰(--p-*) 직접 참조 금지: 컴포넌트는 의미(semantic) 토큰만 쓴다.
 *  R3  정의되지 않은 토큰 참조 금지: var(--x) 의 --x 는 tokens.css 에 있거나, 같은 파일에서 선언된 지역 변수여야 한다.
 *
 * 검사 대상: src/**\/*.css 와 .astro 의 <style> 블록 · style="" 속성. (tokens.css 는 정의 파일이라 제외)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const TOKENS = join(ROOT, 'src/styles/tokens.css');
const EXTERNAL_PREFIXES = ['--shiki-']; // 외부 도구가 주입하는 변수

const defined = new Set([...readFileSync(TOKENS, 'utf8').matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const p = join(dir, name);
		return statSync(p).isDirectory() ? walk(p) : [p];
	});
}

function styleChunks(file, text) {
	if (file.endsWith('.css')) return [{ css: text, offset: 0 }];
	const chunks = [];
	for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) chunks.push({ css: m[1], offset: m.index + m[0].indexOf(m[1]) });
	for (const m of text.matchAll(/\sstyle="([^"]*)"/g)) chunks.push({ css: m[1], offset: m.index + m[0].indexOf(m[1]) });
	return chunks;
}

const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => ' '.repeat(c.length));

const files = walk(join(ROOT, 'src')).filter((f) => /\.(css|astro)$/.test(f) && f !== TOKENS);
const errors = [];
let scanned = 0;

for (const file of files) {
	const text = readFileSync(file, 'utf8');
	const chunks = styleChunks(file, text);
	if (chunks.length) scanned++;
	for (const { css: raw, offset } of chunks) {
		const css = stripComments(raw);
		const local = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
		const report = (idx, rule, msg) => errors.push(`${relative(ROOT, file)}:${lineOf(text, offset + idx)}  ${rule}  ${msg}`);

		for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) report(m.index, 'R1', `색상 값 직접 사용 '${m[0]}' → --color-* 토큰을 쓰세요`);
		for (const m of css.matchAll(/\b(rgba?|hsla?|oklch|oklab|lab|lch)\(/g)) report(m.index, 'R1', `색상 함수 직접 사용 '${m[0]}' → --color-* 토큰을 쓰세요`);
		for (const m of css.matchAll(/var\(\s*(--[\w-]+)/g)) {
			const name = m[1];
			if (name.startsWith('--p-')) report(m.index, 'R2', `원시 토큰 '${name}' 직접 참조 → 의미 토큰(--color-*)을 쓰세요`);
			else if (!defined.has(name) && !local.has(name) && !EXTERNAL_PREFIXES.some((p) => name.startsWith(p)))
				report(m.index, 'R3', `정의되지 않은 토큰 '${name}' (src/styles/tokens.css 에 없음)`);
		}
	}
}

if (scanned === 0) {
	console.error('check-tokens: 스캔한 스타일이 0건입니다. 검사 대상 경로가 잘못됐습니다.');
	process.exit(2);
}
if (errors.length) {
	console.error(`check-tokens: ${errors.length}건 위반 (스타일 ${scanned}개 파일 검사)\n`);
	for (const e of errors) console.error('  ' + e);
	console.error('\n규칙: docs/design-tokens.md §5');
	process.exit(1);
}
console.log(`check-tokens: 통과 — 스타일 ${scanned}개 파일, 정의된 토큰 ${defined.size}개`);

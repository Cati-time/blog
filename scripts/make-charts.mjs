#!/usr/bin/env node
/**
 * 글에 들어가는 그래프(SVG)를 만든다 — node scripts/make-charts.mjs
 * 데이터는 글 본문에 적힌 숫자와 같다. 숫자를 고치면 여기도 같이 고치고 다시 실행한다.
 * 색: 블로그 강조 초록 + 데이터 시각화 기본 팔레트(파랑·주황) — 색약 대비 검사 통과 조합.
 * 상태색(일치·불일치)은 아이콘과 글자를 함께 쓴다.
 */
import { writeFileSync } from 'node:fs';

const C = {
	surface: '#ffffff',
	text: '#111318',
	muted: '#4b5563',
	subtle: '#6b7280',
	grid: '#e5e7eb',
	s1: '#047857', // 블로그 강조 초록
	s2: '#2a78d6',
	s3: '#eb6834',
	good: '#0ca30c',
	critical: '#d03b3b',
};
const FONT = `font-family="Pretendard, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif"`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const svg = (w, h, title, desc, body) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title><desc id="d">${esc(desc)}</desc>
<rect width="${w}" height="${h}" fill="${C.surface}"/>
<g ${FONT}>${body}</g>
</svg>`;
const text = (x, y, s, o = {}) =>
	`<text x="${x}" y="${y}" font-size="${o.size ?? 13}" fill="${o.fill ?? C.muted}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.weight ? ` font-weight="${o.weight}"` : ''}>${esc(s)}</text>`;
/** 위쪽만 4px 둥근 막대 (바닥은 기준선에 붙는다) */
const bar = (x, y, w, h, fill) => {
	const r = Math.min(4, h / 2, w / 2);
	return `<path d="M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z" fill="${fill}"/>`;
};
const out = (path, s) => {
	writeFileSync(path, s);
	console.log('✔', path);
};

// 글 본문 폭(약 520px)에 거의 1:1 로 들어가도록 폭은 600, 가장 작은 글자는 12.
const W = 600;

// ── 1. 월별 커밋 수 (셋이 남았을 때) ─────────────────────────────
{
	const data = [
		['25.11', 13, ['시작']],
		['12', 92, ['프롬프트', '페르소나']],
		['26.1', 29],
		['2', 127],
		['3', 231, ['하네스']],
		['4', 65],
		['5', 175, ['백엔드', '퇴사']],
		['6', 918, ['헌법 정비']],
		['7', 1082],
		['8', 941, ['비즈니스', '플로우']],
		['9', 2083, ['감독·티켓', 'CI/CD']],
	];
	const H = 400, L = 48, R = 8, T = 92, B = 44;
	const pw = W - L - R, ph = H - T - B, max = 2100;
	const y = (v) => T + ph - (v / max) * ph;
	const step = pw / data.length, bw = step - 8;
	let b = text(16, 28, '안드로이드 저장소 월별 커밋 수', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '모든 브랜치 · 머지와 AI 세션 커밋 포함', { size: 12, fill: C.subtle });
	for (const g of [0, 500, 1000, 1500, 2000]) {
		b += `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" stroke="${C.grid}" stroke-width="1"/>`;
		b += text(L - 6, y(g) + 4, g.toLocaleString('en-US'), { size: 12, anchor: 'end', fill: C.subtle });
	}
	data.forEach(([m, v, ev], i) => {
		const x = L + i * step + 4, cx = x + bw / 2;
		b += bar(x, y(v), bw, y(0) - y(v), ev ? C.s1 : '#86c9ad');
		b += text(cx, H - B + 18, m, { size: 12, anchor: 'middle', fill: C.subtle });
		if (ev) {
			const top = Math.min(y(v), y(0) - 4) - 8 - ev.length * 14;
			const anchor = i === data.length - 1 ? 'end' : 'middle', ax = i === data.length - 1 ? x + bw : cx;
			b += text(ax, top - 4, v.toLocaleString('en-US'), { size: 13, anchor, fill: C.text, weight: 700 });
			ev.forEach((line, k) => (b += text(ax, top + 12 + k * 14, line, { size: 12, anchor, fill: C.muted })));
		}
	});
	b += text(16, H - 8, '연.월 · 짙은 막대 = 글의 표에 나온 달', { size: 12, fill: C.subtle });
	out(
		'src/content/blog/business-flow-story/commits-by-month.svg',
		svg(W, H, '안드로이드 저장소 월별 커밋 수', '2025년 11월 13개에서 2026년 9월 2,083개까지 월별 커밋 수 막대그래프. 12월 프롬프트·페르소나, 3월 하네스, 5월 백엔드 퇴사, 6월 헌법 정비, 8월 비즈니스 플로우, 9월 감독·티켓·CI/CD.', b),
	);
}

// ── 2. rework — 닫히지 않던 검수 (subflow ②) ───────────────────
{
	const H = 300;
	const panel = (x0, title, sub, vals, label) => {
		const L = x0 + 26, pw = 246, T = 84, ph = 150, max = 12, pad = 12;
		const y = (v) => T + ph - (v / max) * ph;
		const xs = vals.map((_, i) => L + pad + (i * (pw - 2 * pad)) / (vals.length - 1));
		let s = text(x0, 28, title, { size: 15, fill: C.text, weight: 700 });
		s += text(x0, 48, sub, { size: 12, fill: C.subtle });
		for (const g of [0, 4, 8, 12]) {
			s += `<line x1="${L}" x2="${L + pw}" y1="${y(g)}" y2="${y(g)}" stroke="${C.grid}"/>`;
			s += text(L - 6, y(g) + 4, g, { size: 12, anchor: 'end', fill: C.subtle });
		}
		s += `<polyline points="${xs.map((x, i) => `${x},${y(vals[i])}`).join(' ')}" fill="none" stroke="${C.s1}" stroke-width="2" stroke-linejoin="round"/>`;
		vals.forEach((v, i) => {
			s += `<circle cx="${xs[i]}" cy="${y(v)}" r="4.5" fill="${C.s1}" stroke="${C.surface}" stroke-width="2"/>`;
			s += text(xs[i], y(v) - 10, v, { size: 13, anchor: 'middle', fill: C.text, weight: 600 });
			s += text(xs[i], T + ph + 18, `${i + 1}`, { size: 12, anchor: 'middle', fill: C.subtle });
		});
		s += text(L + pw / 2, T + ph + 38, label, { size: 12, anchor: 'middle', fill: C.subtle });
		return s;
	};
	let b = panel(12, '게이트 5회 — 미충족 항목 수', '줄지 않았다 · 닫는 조건이 없었다', [3, 7, 8, 8, 7], '게이트 회차');
	b += panel(312, '4주 뒤 7라운드 — 새 발견 수', '«새 발견 0» 이 한 번도 없었다 → 상한 3', [4, 11, 10, 7, 7, 6, 6], '라운드');
	out(
		'src/content/blog/subflow-2-incident-to-contract/rework-rounds.svg',
		svg(W, H, '닫히지 않던 검수', '왼쪽: 게이트 5회 동안 미충족 항목 수 3, 7, 8, 8, 7. 오른쪽: 4주 뒤 7라운드 동안 새 발견 수 4, 11, 10, 7, 7, 6, 6. 둘 다 0으로 내려가지 않았다.', b),
	);
}

// ── 3. verify/screen 이 세는 것 — N · M · K (예시) ─────────────
{
	const H = 250, N = 10, M = 8;
	let b = text(16, 28, 'verify/screen 이 세는 것', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '배정 N 중 일치 M · 불일치 K — 예시 숫자(N = 10), 실제는 작업마다 다르다', { size: 12, fill: C.subtle });
	const size = 44, gap = 12, x0 = 16, y0 = 72;
	for (let i = 0; i < N; i++) {
		const x = x0 + i * (size + gap), ok = i < M;
		b += `<rect x="${x}" y="${y0}" width="${size}" height="${size}" rx="6" fill="${ok ? '#e7f6e7' : '#fbeaea'}" stroke="${ok ? C.good : C.critical}" stroke-width="2"/>`;
		b += text(x + size / 2, y0 + 30, ok ? '✓' : '✗', { size: 20, anchor: 'middle', fill: ok ? '#0a7a0a' : C.critical, weight: 700 });
		b += text(x + size / 2, y0 + size + 17, `${i + 1}`, { size: 12, anchor: 'middle', fill: C.subtle });
	}
	const brace = (xa, xb, yy, label, color) =>
		`<path d="M${xa},${yy} v8 H${xb} v-8" fill="none" stroke="${color}" stroke-width="1.5"/>` + text((xa + xb) / 2, yy + 27, label, { size: 14, anchor: 'middle', fill: C.text, weight: 600 });
	b += brace(x0, x0 + M * (size + gap) - gap, y0 + size + 28, `✓ 일치 M = ${M}`, C.good);
	b += brace(x0 + M * (size + gap), x0 + N * (size + gap) - gap, y0 + size + 28, `✗ 불일치 K = ${N - M}`, C.critical);
	b += text(16, H - 28, '배정된 화면 N 개를 전부 찍어 기획과 그림으로 대조한다.', { size: 12, fill: C.muted });
	b += text(16, H - 10, '안 본 화면을 «같다» 로 적지 않는다.', { size: 12, fill: C.muted });
	out(
		'src/content/blog/subflow-2-incident-to-contract/verify-screen-nmk.svg',
		svg(W, H, 'verify/screen 이 세는 것', '예시: 테스트 계획에서 화면 축으로 배정된 화면 10개(N)를 모두 촬영해 기획과 대조하면 일치 8개(M), 불일치 2개(K).', b),
	);
}

// ── 4. subflow 개수와 뒤처진 표 (subflow ③) ────────────────────
{
	const cols = ['8월 초', '중순①', '②', '③', '④', '⑤', '8월 말', '9월 초', '9월 중순', '10월 초']; // 글의 표와 같은 이름
	const decl = [10, 12, 16, 17, 18, 20, 20, 21, 24, 25];
	const contract = [10, 10, 16, 17, 18, 18, 20, 21, 24, 25];
	const keyword = [10, 12, 16, 16, 16, 18, 20, 21, 24, 25];
	// 글의 표에서 굵게 표시한 칸 = 뒤처진 표 (네 번)
	const lag = [[1, contract, C.s2, '계약 표'], [3, keyword, C.s3, '키워드 표'], [4, keyword, C.s3, '키워드 표'], [5, contract, C.s2, '계약 표']];
	const H = 400, L = 40, R = 30, T = 96, B = 44;
	const pw = W - L - R, ph = H - T - B, min = 8, max = 26;
	const x = (i) => L + (i * pw) / (cols.length - 1);
	const y = (v) => T + ph - ((v - min) / (max - min)) * ph;
	const stepLine = (vals, color, w, dash = '') => {
		let d = `M${x(0)},${y(vals[0])}`;
		for (let i = 1; i < vals.length; i++) d += ` H${x(i)} V${y(vals[i])}`;
		return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-linejoin="round"/>`;
	};
	let b = text(16, 28, 'subflow 개수 — 선언 · 계약 표 · 키워드 표', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '커밋마다 센 값 · ○ = 선언보다 뒤처진 표 (네 번)', { size: 12, fill: C.subtle });
	// 범례 (제목 아래 한 줄)
	let lx = 16;
	[[C.s1, '선언', ''], [C.s2, '계약 표', '2 3'], [C.s3, '키워드 표', '6 4']].forEach(([color, name, dash]) => {
		b += `<line x1="${lx}" x2="${lx + 24}" y1="68" y2="68" stroke="${color}" stroke-width="2.5"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
		b += text(lx + 30, 72, name, { size: 12, fill: C.text });
		lx += 30 + name.length * 13 + 24;
	});
	for (const g of [10, 15, 20, 25]) {
		b += `<line x1="${L}" x2="${L + pw}" y1="${y(g)}" y2="${y(g)}" stroke="${C.grid}"/>`;
		b += text(L - 6, y(g) + 4, g, { size: 12, anchor: 'end', fill: C.subtle });
	}
	cols.forEach((c, i) => (b += text(x(i), H - B + 18, c, { size: 12, anchor: 'middle', fill: C.subtle })));
	b += stepLine(keyword, C.s3, 2, '6 4');
	b += stepLine(contract, C.s2, 2, '2 3');
	b += stepLine(decl, C.s1, 2.5);
	decl.forEach((v, i) => (b += `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="${C.s1}" stroke="${C.surface}" stroke-width="2"/>`));
	lag.forEach(([i, vals, color, name]) => {
		const v = vals[i];
		b += `<circle cx="${x(i)}" cy="${y(v)}" r="5.5" fill="${C.surface}" stroke="${color}" stroke-width="2.5"/>`;
	});
	// 라벨: ③·④ 는 같은 값이라 가운데 한 번만
	b += text(x(1), y(10) + 22, '계약 표 10', { size: 12, anchor: 'middle', fill: C.text });
	b += text((x(3) + x(4)) / 2, y(16) + 22, '키워드 표 16 (두 번)', { size: 12, anchor: 'middle', fill: C.text });
	b += text(x(5) + 10, y(18) + 20, '계약 표 18', { size: 12, fill: C.text });
	b += text(x(9), y(25) - 12, '25', { size: 13, fill: C.text, weight: 700, anchor: 'middle' });
	b += text(x(0), y(10) - 12, '10', { size: 13, fill: C.text, weight: 700, anchor: 'middle' });
	out(
		'src/content/blog/subflow-3-grow-and-assemble/subflow-count.svg',
		svg(W, H, 'subflow 개수 — 선언 · 계약 표 · 키워드 표', '8월 초 10개에서 10월 초 25개까지. 계약 표는 8월 중순 ①(10)과 ⑤(18)에, 키워드 표는 ③·④(16)에 선언보다 뒤처졌고 8월 말에 모두 맞춰졌다.', b),
	);
}

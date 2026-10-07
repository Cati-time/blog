#!/usr/bin/env node
/**
 * 글에 들어가는 그래프(SVG)를 만든다 — node scripts/make-charts.mjs
 * 데이터는 글 본문에 적힌 숫자와 같다. 숫자를 고치면 여기도 같이 고치고 다시 실행한다.
 * 색: 블로그 강조 초록 + 데이터 시각화 기본 팔레트(파랑·주황) — 색약 대비 검사 통과 조합.
 * 상태색(일치·불일치)은 아이콘과 글자를 함께 쓴다.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

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
	mkdirSync(dirname(path), { recursive: true });
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

// ── 5. 화면(ViewModel)이 기대는 것 — 전/후 (안드로이드 아키텍처 ③) ─────
// 휴대폰 앱 @HiltViewModel 의 생성자 주입 타입을 꼬리 이름으로 센 값(태블릿 앱·별도 앱·템플릿 제외).
// 전 = module 분리 직전(2026-01-19) · 후 = 2026-10-06, 둘 다 ViewModel 58개.
// 블로그 세션과 안드로이드 세션이 따로 센 값이 3 이내로 갈리는 칸은 라벨에 «약» 을 붙인다.
{
	const rows = [
		['UseCase', 185, 9],
		['Repository', 30, 10, '약 30'],
		['BT 상태 홀더', 19, 0],
		['StateReader', 0, 110, null, '약 110'],
		['ActionDispatcher', 0, 100, null, '약 100'],
		['SideEffectReader', 0, 37],
		['Selector', 0, 5],
	];
	const H = 430, L = 128, R = 44, T = 92, rowH = 44, bh = 14, max = 200;
	const x = (v) => L + (v / max) * (W - L - R);
	let b = text(16, 28, '화면이 기대는 것 — module 분리 전과 지금', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '휴대폰 앱 ViewModel 58개의 생성자 주입 타입 수 · «약» = 세는 방법에 따라 ±3', { size: 12, fill: C.subtle });
	// 범례
	[[C.s2, '2026년 1월 (분리 직전)'], [C.s1, '2026년 10월 (지금)']].forEach(([color, name], i) => {
		const lx = 16 + i * 190;
		b += `<rect x="${lx}" y="61" width="12" height="12" rx="3" fill="${color}"/>`;
		b += text(lx + 18, 72, name, { size: 12, fill: C.text });
	});
	for (const g of [0, 50, 100, 150, 200]) {
		b += `<line x1="${x(g)}" x2="${x(g)}" y1="${T - 6}" y2="${T + rows.length * rowH - 8}" stroke="${C.grid}"/>`;
		b += text(x(g), T + rows.length * rowH + 8, g, { size: 12, anchor: 'middle', fill: C.subtle });
	}
	// 위 셋 = 직접 부르기 / 아래 넷 = 알리기·구독하기 — 구분선
	const sepY = T + 3 * rowH - 10;
	b += `<line x1="16" x2="${W - 16}" y1="${sepY}" y2="${sepY}" stroke="${C.grid}" stroke-dasharray="4 4"/>`;
	b += text(W - 16, T - 10, '직접 부르기', { size: 12, anchor: 'end', fill: C.muted });
	b += text(W - 16, sepY + 16, '알리기 · 구독하기', { size: 12, anchor: 'end', fill: C.muted });
	rows.forEach(([name, before, after, beforeLabel, afterLabel], i) => {
		const y0 = T + i * rowH;
		b += text(L - 10, y0 + bh + 4, name, { size: 12, anchor: 'end', fill: C.text });
		[[before, C.s2, 0, beforeLabel], [after, C.s1, bh + 2, afterLabel]].forEach(([v, color, dy, label]) => {
			const w = Math.max(x(v) - L, v > 0 ? 2 : 0);
			if (w > 0) b += `<rect x="${L}" y="${y0 + dy}" width="${w}" height="${bh}" rx="3" fill="${color}"/>`;
			b += text(L + w + 6, y0 + dy + 11, label ?? v, { size: 11, fill: C.text });
		});
	});
	out(
		'src/content/blog/android-architecture-3-how-we-moved/vm-dependencies.svg',
		svg(W, H, '화면이 기대는 것 — module 분리 전과 지금', '휴대폰 앱 ViewModel 58개의 생성자 주입 타입 수. 2026년 1월: UseCase 185, Repository 약 30, BT 상태 홀더 19, StateReader 0, ActionDispatcher 0, SideEffectReader 0, Selector 0. 2026년 10월: UseCase 9, Repository 10, BT 상태 홀더 0, StateReader 약 110, ActionDispatcher 약 100, SideEffectReader 37, Selector 5.', b),
	);
}

// ── 6. 지금 있는 module 24개가 생긴 때 (안드로이드 아키텍처 ③) ─────────
// 각 module 의 빌드 파일이 처음 추가된 커밋 날짜로 센 누적값.
{
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'];
	const vals = [8, 13, 14, 14, 16, 21, 21, 23, 24, 24];
	const notes = { 0: '로그인·사용자·아이·기기 …', 1: '홈·미디어·플레이어·미션', 4: 'BT', 5: '테마·딥링크 …' };
	const H = 360, L = 40, R = 24, T = 76, B = 44;
	const pw = W - L - R, ph = H - T - B, max = 26;
	const step = pw / months.length;
	const y = (v) => T + ph - (v / max) * ph;
	let b = text(16, 28, '지금 있는 module 24개가 생긴 때', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '2026년 · 누적 · 각 module 이 처음 만들어진 달 기준', { size: 12, fill: C.subtle });
	for (const g of [0, 8, 16, 24]) {
		b += `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" stroke="${C.grid}"/>`;
		b += text(L - 6, y(g) + 4, g, { size: 12, anchor: 'end', fill: C.subtle });
	}
	vals.forEach((v, i) => {
		const bx = L + i * step + 6, bw = step - 12;
		b += bar(bx, y(v), bw, y(0) - y(v), notes[i] !== undefined ? C.s1 : '#86c9ad');
		b += text(bx + bw / 2, y(v) - 8, v, { size: 13, anchor: 'middle', fill: C.text, weight: 600 });
		b += text(bx + bw / 2, H - B + 18, months[i], { size: 12, anchor: 'middle', fill: C.subtle });
	});
	b += text(16, H - 8, '짙은 막대: 1월 로그인·사용자·아이·기기 · 2월 홈·미디어·플레이어·미션 · 5월 BT · 6월 테마·딥링크 등', { size: 11, fill: C.subtle });
	out(
		'src/content/blog/android-architecture-3-how-we-moved/modules-born.svg',
		svg(W, H, '지금 있는 module 24개가 생긴 때', '2026년 누적 module 수: 1월 8, 2월 13, 3월 14, 4월 14, 5월 16, 6월 21, 7월 21, 8월 23, 9월 24, 10월 24.', b),
	);
}

// ── 7. 지금 화면이 기대는 것 (안드로이드 아키텍처 ①) ──────────────────────
// 5번과 같은 측정의 «지금» 쪽만. 위 넷 = 구독·알리기, 아래 둘 = 이전 구조의 흔적.
{
	const rows = [
		['StateReader', 110, '약 110'],
		['ActionDispatcher', 100, '약 100'],
		['SideEffectReader', 37],
		['Selector', 5],
		['Repository', 10],
		['UseCase', 9],
	];
	const H = 340, L = 128, R = 60, T = 84, rowH = 36, bh = 18, max = 120;
	const x = (v) => L + (v / max) * (W - L - R);
	let b = text(16, 28, '지금 화면이 기대는 것', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '휴대폰 앱 ViewModel 58개의 생성자 주입 타입 수 · «약» = 세는 방법에 따라 ±3', { size: 12, fill: C.subtle });
	const sepY = T + 4 * rowH - 9;
	for (const g of [0, 40, 80, 120]) {
		b += `<line x1="${x(g)}" x2="${x(g)}" y1="${T - 8}" y2="${T + rows.length * rowH - 8}" stroke="${C.grid}"/>`;
		b += text(x(g), T + rows.length * rowH + 10, g, { size: 12, anchor: 'middle', fill: C.subtle });
	}
	b += `<line x1="16" x2="${W - 16}" y1="${sepY}" y2="${sepY}" stroke="${C.grid}" stroke-dasharray="4 4"/>`;
	b += text(W - 16, T - 14, '구독하기 · 알리기', { size: 12, anchor: 'end', fill: C.muted });
	b += text(W - 16, sepY + 16, '직접 부르기 — 이전 구조의 흔적', { size: 12, anchor: 'end', fill: C.muted });
	rows.forEach(([name, v, label], i) => {
		const y0 = T + i * rowH;
		const legacy = i >= 4;
		b += text(L - 10, y0 + bh - 4, name, { size: 12, anchor: 'end', fill: C.text });
		const w = Math.max(x(v) - L, 2);
		b += `<rect x="${L}" y="${y0}" width="${w}" height="${bh}" rx="4" fill="${legacy ? '#86c9ad' : C.s1}"/>`;
		b += text(L + w + 6, y0 + bh - 5, label ?? v, { size: 12, fill: C.text });
	});
	out(
		'src/content/blog/android-architecture-1-one-truth/vm-dependencies-now.svg',
		svg(W, H, '지금 화면이 기대는 것', '휴대폰 앱 ViewModel 58개의 생성자 주입 타입 수. StateReader 약 110, ActionDispatcher 약 100, SideEffectReader 37, Selector 5, Repository 10, UseCase 9.', b),
	);
}

// ── 8. 새 module 하나 — 설계와 코딩 (안드로이드 아키텍처 ②) ───────────────
// «다음 연결 안내를 언제 다시 띄우나» module. 설계 = BT UI 기능의 설계 문서 커밋(조사·계획·시나리오),
// 코딩 = module 기능 커밋 4 + 실행 검수 반려 처분 커밋 2. 날짜는 2026년 8월.
{
	const days = ['8/3', '8/4', '8/5', '8/6', '8/7'];
	const design = [3, 7, 30, 16, 0];
	const code = [0, 0, 0, 2, 4];
	const H = 340, L = 44, R = 20, T = 84, B = 44, max = 32;
	const pw = W - L - R, ph = H - T - B, step = pw / days.length, bw = step - 26;
	const y = (v) => T + ph - (v / max) * ph;
	let b = text(16, 28, '새 module 하나 — 설계 약 10시간, 코딩 약 2시간 반', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '하루 커밋 수 · 작업 시간은 커밋 시각으로 추정(1시간 넘게 비면 쉰 것으로)', { size: 12, fill: C.subtle });
	[[C.s2, '설계 문서'], [C.s1, '코드']].forEach(([color, name], i) => {
		const lx = 16 + i * 110;
		b += `<rect x="${lx}" y="58" width="12" height="12" rx="3" fill="${color}"/>`;
		b += text(lx + 18, 69, name, { size: 12, fill: C.text });
	});
	for (const g of [0, 10, 20, 30]) {
		b += `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" stroke="${C.grid}"/>`;
		b += text(L - 6, y(g) + 4, g, { size: 12, anchor: 'end', fill: C.subtle });
	}
	days.forEach((d, i) => {
		const x = L + i * step + 13;
		let top = y(0);
		[[design[i], C.s2], [code[i], C.s1]].forEach(([v, color]) => {
			if (!v) return;
			const h = y(0) - y(v);
			b += bar(x, top - h, bw, h - (top < y(0) ? 2 : 0), color);
			top -= h;
		});
		const total = design[i] + code[i];
		const label = design[i] && code[i] ? `${design[i]} + ${code[i]}` : `${total}`;
		b += text(x + bw / 2, top - 8, label, { size: 12, anchor: 'middle', fill: C.text, weight: 600 });
		b += text(x + bw / 2, H - B + 18, d, { size: 12, anchor: 'middle', fill: C.subtle });
	});
	out(
		'src/content/blog/android-architecture-2-build-and-fix/design-vs-code.svg',
		svg(W, H, '새 module 하나 — 설계 약 10시간, 코딩 약 2시간 반', '2026년 8월 하루 커밋 수. 설계 문서 8/3 3개, 8/4 7개, 8/5 30개, 8/6 16개. 코드 8/6 2개, 8/7 4개. 커밋 시각으로 추정한 실제 작업 시간은 설계 약 10시간, 코딩 약 2시간 반.', b),
	);
}

// ── 9. 테스트 — module 분리 전과 지금 (안드로이드 아키텍처 ②) ───────────────
// @Test 줄 수 · 태블릿 앱·별도 앱·템플릿 제외 · 단위 = src/test, 기기 = src/androidTest.
{
	const rows = [
		['단위 테스트 전체', 281, 4463],
		['그중 module', 0, 1772],
		['ViewModel 테스트', 21, 423],
		['기기 테스트', 31, 33],
	];
	const H = 330, L = 128, R = 64, T = 92, rowH = 52, bh = 16, max = 5000;
	const x = (v) => L + (v / max) * (W - L - R);
	let b = text(16, 28, '테스트 — module 분리 전과 지금', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '@Test 수 · 늘어난 것은 화면 없이 도는 단위 테스트, 기기 테스트는 그대로', { size: 12, fill: C.subtle });
	[[C.s2, '2026년 1월 (분리 직전)'], [C.s1, '2026년 10월 (지금)']].forEach(([color, name], i) => {
		const lx = 16 + i * 190;
		b += `<rect x="${lx}" y="61" width="12" height="12" rx="3" fill="${color}"/>`;
		b += text(lx + 18, 72, name, { size: 12, fill: C.text });
	});
	for (const g of [0, 1000, 2000, 3000, 4000, 5000]) {
		b += `<line x1="${x(g)}" x2="${x(g)}" y1="${T - 6}" y2="${T + rows.length * rowH - 10}" stroke="${C.grid}"/>`;
		b += text(x(g), T + rows.length * rowH + 6, g.toLocaleString('en-US'), { size: 12, anchor: 'middle', fill: C.subtle });
	}
	rows.forEach(([name, before, after], i) => {
		const y0 = T + i * rowH;
		b += text(L - 10, y0 + bh + 4, name, { size: 12, anchor: 'end', fill: C.text });
		[[before, C.s2, 0], [after, C.s1, bh + 2]].forEach(([v, color, dy]) => {
			const w = Math.max(x(v) - L, v > 0 ? 2 : 0);
			if (w > 0) b += `<rect x="${L}" y="${y0 + dy}" width="${w}" height="${bh}" rx="3" fill="${color}"/>`;
			b += text(L + w + 6, y0 + dy + 12, v.toLocaleString('en-US'), { size: 11, fill: C.text });
		});
	});
	out(
		'src/content/blog/android-architecture-2-build-and-fix/tests-before-after.svg',
		svg(W, H, '테스트 — module 분리 전과 지금', '@Test 수. 단위 테스트 전체 281에서 4,463, 그중 module 0에서 1,772, ViewModel 테스트 21에서 423, 기기 테스트 31에서 33.', b),
	);
}

// ── 10. 우리 안드로이드 구조 (안드로이드 아키텍처 ①) ────────────────────────
// 층(app → feature → module → data·bridge) + 화면과 module 사이의 세 통로 + module 안의 흐름
// (Middleware = 요청이 오면 바깥 일 · Runtime Observer = 바깥 변화를 듣고 Action 으로) + 가로지르는 core.
{
	const H = 636;
	const BLUE = C.s2, GREEN = C.s1, ORANGE = C.s3, GRAY = '#9ca3af';
	const tint = { app: '#f3f4f6', feature: '#eaf2fc', module: '#e8f5ef', io: '#fdf0e8', core: '#fafafa' };
	const marker = (id, color) =>
		`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker>`;
	const box = (x, y, w, h, fill, stroke, o = {}) =>
		`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${fill}" stroke="${stroke}" stroke-width="${o.sw ?? 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
	const arrow = (x1, y1, x2, y2, color, id, dash = '') =>
		`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.8"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#${id})"/>`;
	const path = (d, color, id, dash = '') =>
		`<path d="${d}" fill="none" stroke="${color}" stroke-width="1.8"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#${id})"/>`;
	const chip = (x, y, w, label, stroke) =>
		box(x, y, w, 32, C.surface, stroke, { rx: 7, sw: 1.2 }) + text(x + w / 2, y + 21, label, { size: 12, anchor: 'middle', fill: C.text, weight: 600 });
	const chip2 = (x, y, w, h, label, sub, stroke, dash = '') =>
		box(x, y, w, h, C.surface, stroke, { rx: 7, sw: 1.2, dash }) +
		text(x + w / 2, y + 19, label, { size: 12, anchor: 'middle', fill: C.text, weight: 600 }) +
		text(x + w / 2, y + 35, sub, { size: 11, anchor: 'middle', fill: C.muted });

	let b = `<defs>${marker('a-blue', BLUE)}${marker('a-green', GREEN)}${marker('a-gray', GRAY)}${marker('a-orange', ORANGE)}</defs>`;
	b += text(16, 30, '우리 안드로이드 구조', { size: 18, fill: C.text, weight: 700 });
	b += text(16, 50, '의존은 위에서 아래로 한 방향 · 층을 건너뛰지 않는다', { size: 12, fill: C.subtle });

	// app
	b += box(16, 70, 432, 46, tint.app, GRAY);
	b += text(32, 99, 'app', { size: 14, fill: C.text, weight: 700 });
	b += text(78, 99, '앱 진입 · 조립 · 화면 이동', { size: 12, fill: C.muted });
	b += arrow(232, 116, 232, 134, GRAY, 'a-gray');

	// feature
	b += box(16, 136, 432, 88, tint.feature, BLUE);
	b += text(32, 159, 'feature', { size: 14, fill: C.text, weight: 700 });
	b += text(98, 159, '화면', { size: 12, fill: C.muted });
	b += chip(32, 172, 150, 'View · 그리기', BLUE);
	b += chip(282, 172, 150, 'ViewModel · 화면 상태', BLUE);
	b += arrow(184, 183, 278, 183, BLUE, 'a-blue');
	b += arrow(280, 197, 186, 197, BLUE, 'a-blue');
	b += text(232, 178, 'onEvent', { size: 11, anchor: 'middle', fill: C.muted });
	b += text(232, 214, 'uiState', { size: 11, anchor: 'middle', fill: C.muted });

	// 화면 ↔ module 세 통로
	const lane = (x, dir, color, id, dash, title, l1, l2) => {
		let s = dir === 'down' ? arrow(x, 228, x, 300, color, id, dash) : arrow(x, 300, x, 228, color, id, dash);
		s += text(x + 10, 252, title, { size: 12, fill: C.text, weight: 700 });
		s += text(x + 10, 268, l1, { size: 11, fill: C.muted });
		if (l2) s += text(x + 10, 283, l2, { size: 11, fill: C.muted });
		return s;
	};
	b += lane(40, 'down', BLUE, 'a-blue', '', '알리기', 'dispatch(Action)', '반환값 없음');
	b += lane(184, 'up', GREEN, 'a-green', '', '구독하기', 'StateReader', 'Selector · 파생된 답');
	b += lane(328, 'up', GREEN, 'a-green', '5 4', '받기', 'SideEffectReader', '한 번만 일어나는 사건');

	// module
	b += box(16, 304, 432, 184, tint.module, GREEN, { sw: 2 });
	b += text(32, 328, 'module', { size: 14, fill: C.text, weight: 700 });
	b += text(96, 328, '도메인 상태의 주인', { size: 12, fill: C.muted });
	b += box(350, 313, 84, 22, GREEN, GREEN, { rx: 11, sw: 1 }) + text(392, 328, '정본 (SSOT)', { size: 11, anchor: 'middle', fill: '#ffffff', weight: 700 });
	b += chip2(32, 342, 100, 44, 'Action', '일어난 일', GREEN);
	b += chip2(176, 342, 122, 44, 'Reducer', '상태는 여기서만 바뀐다', GREEN);
	b += chip2(340, 342, 92, 44, 'State', 'Store 가 든다', GREEN);
	b += arrow(134, 364, 172, 364, GREEN, 'a-green');
	b += arrow(300, 364, 336, 364, GREEN, 'a-green');
	// 아래 줄: 요청이 오면 움직이는 Middleware / 바깥 변화를 듣는 Runtime Observer
	b += chip2(32, 418, 118, 44, 'Middleware', '요청 · 변화를 받는다', GREEN);
	b += chip2(282, 418, 150, 44, 'Runtime Observer', '신호를 Flow 로 바꾼다', GREEN, '4 3');
	b += arrow(62, 388, 62, 414, GREEN, 'a-green');
	b += arrow(104, 416, 104, 390, GREEN, 'a-green');
	b += text(112, 405, '결과는 Action 으로', { size: 11, fill: C.muted });
	b += arrow(280, 442, 154, 442, GREEN, 'a-green', '4 3');
	b += text(217, 435, '변화를 넘긴다', { size: 11, anchor: 'middle', fill: C.muted });
	b += text(390, 480, '플랫폼 신호를 받는 module 에만', { size: 11, anchor: 'end', fill: C.muted });

	// data · bridge
	b += arrow(80, 464, 80, 526, ORANGE, 'a-orange');
	b += text(88, 508, '부른다', { size: 11, fill: C.muted });
	b += arrow(262, 490, 262, 526, ORANGE, 'a-orange');
	b += text(270, 512, '부른다', { size: 11, fill: C.muted });
	b += arrow(400, 526, 400, 466, ORANGE, 'a-orange', '5 4');
	b += text(392, 512, '신호', { size: 11, anchor: 'end', fill: C.muted });
	b += box(16, 530, 208, 62, tint.io, ORANGE);
	b += text(32, 554, 'data', { size: 14, fill: C.text, weight: 700 });
	b += text(76, 554, '서버 · DB', { size: 12, fill: C.muted });
	b += text(32, 575, '요청 → 응답, 상태는 없다', { size: 11, fill: C.muted });
	b += box(240, 530, 208, 62, tint.io, ORANGE);
	b += text(256, 554, 'bridge', { size: 14, fill: C.text, weight: 700 });
	b += text(312, 554, '안드로이드 프레임워크', { size: 12, fill: C.muted });
	b += text(256, 575, '오디오 · BT · 생명주기 신호', { size: 11, fill: C.muted });

	// core (가로지른다)
	b += box(464, 136, 120, 456, tint.core, GRAY, { dash: '6 4' });
	b += text(478, 160, 'core', { size: 14, fill: C.text, weight: 700 });
	b += text(478, 178, '층 순서 밖에서', { size: 11, fill: C.muted });
	b += text(478, 193, '가로지른다', { size: 11, fill: C.muted });
	b += chip(474, 210, 100, '디자인 시스템', GRAY);
	b += text(478, 258, '화면이 바로 쓴다', { size: 11, fill: C.muted });
	b += chip(474, 272, 100, '로거', GRAY);
	b += chip(474, 314, 100, '유틸', GRAY);
	b += text(478, 372, '도메인 상태가', { size: 11, fill: C.muted });
	b += text(478, 387, '없는 것만 둔다', { size: 11, fill: C.muted });
	b += `<line x1="474" x2="574" y1="508" y2="508" stroke="${GRAY}" stroke-dasharray="3 3"/>`;
	b += text(478, 531, '데이터를 다루면', { size: 11, fill: C.muted });
	b += text(478, 546, 'core 여도 data 와', { size: 11, fill: C.muted });
	b += text(478, 561, '같다 — 화면은', { size: 11, fill: C.muted });
	b += text(478, 576, 'module 을 거친다', { size: 11, fill: C.muted });
	b += `<path d="M448,206 H458 V226 H470" fill="none" stroke="${GRAY}" stroke-width="1.6" marker-end="url(#a-gray)"/>`;

	// 금지: 건너뛰기
	b += `<circle cx="25" cy="617" r="8" fill="#fbeaea" stroke="${C.critical}" stroke-width="1.5"/>`;
	b += text(25, 621, '✕', { size: 11, anchor: 'middle', fill: C.critical, weight: 700 });
	b += text(40, 621, 'feature 는 data · bridge 를 직접 부르지 않는다 — 읽기만 해도 module 을 거친다', { size: 12, fill: C.text });

	out(
		'src/content/blog/android-architecture-1-one-truth/architecture.svg',
		svg(W, H, '우리 안드로이드 구조', 'app 아래 feature(View·ViewModel), 그 아래 module(정본의 주인 — Action 은 Middleware 를 거쳐 결과 Action 이 되어 Reducer 로 가고 State 가 바뀐다. 일부 module 에는 bridge 신호를 Flow 로 바꿔 Middleware 에 넘기는 Runtime Observer 가 있다), 맨 아래 data(서버·DB)와 bridge(안드로이드 프레임워크). feature 와 module 은 알리기(dispatch), 구독하기(StateReader·Selector), 받기(SideEffectReader) 세 통로로만 대화한다. bridge 의 신호는 Runtime Observer 가 받는다. core(디자인 시스템·로거·유틸)는 층 순서 밖에서 가로지르며 화면이 디자인 시스템을 바로 쓴다. feature 는 data·bridge 를 직접 부르지 않는다.', b),
	);
}

// ── 11. 앱 정보 화면이 지난 길 (안드로이드 아키텍처 ③) ───────────────────────
// 설정 화면 전체를 옮긴 비즈니스 플로우 안에서 «앱 정보» 몫. 날짜는 단계가 돈 날(2026년).
{
	const H = 360;
	const steps = [
		['조사', '9/23', '위반 5개를 찾음'],
		['아키텍처', '9/24', '주인과 표면 셋을 정함'],
		['BDD', '9/28 – 29', '시나리오 15개'],
		['SDD', '9/29', '이벤트 9 · 일회성 6'],
		['계획', '9/29 – 30', '스텝 6개'],
		['실행', '9/30 – 10/1', '커밋 4 · 반려 2'],
		['검증', '10/1', '렌더 · 도달성 · 수명 검사'],
		['정리', '10/3', '옛 값 반환 계약 삭제'],
	];
	const w = 130, h = 78, gap = 16, x0 = 16;
	const marker = `<marker id="t-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.s1}"/></marker>`;
	let b = `<defs>${marker}</defs>`;
	b += text(16, 28, '앱 정보 화면이 지난 길', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '설정 화면을 옮긴 비즈니스 플로우 안에서 앱 정보 몫 · 2026년 9월 23일 ~ 10월 3일', { size: 12, fill: C.subtle });
	const pos = (i) => (i < 4 ? [x0 + i * (w + gap), 76] : [x0 + (7 - i) * (w + gap), 226]);
	steps.forEach(([name, date, out], i) => {
		const [x, y] = pos(i);
		const exec = i === 5;
		b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${exec ? '#e8f5ef' : C.surface}" stroke="${C.s1}" stroke-width="${exec ? 2 : 1.3}"/>`;
		b += text(x + 12, y + 24, `${i + 1}. ${name}`, { size: 13, fill: C.text, weight: 700 });
		b += text(x + 12, y + 42, date, { size: 11, fill: C.subtle });
		b += text(x + 12, y + 62, out, { size: 11.5, fill: C.text });
	});
	for (let i = 0; i < 3; i++) {
		const [x, y] = pos(i);
		b += `<line x1="${x + w + 2}" y1="${y + h / 2}" x2="${x + w + gap - 2}" y2="${y + h / 2}" stroke="${C.s1}" stroke-width="1.8" marker-end="url(#t-ah)"/>`;
	}
	const [sx, sy] = pos(3);
	b += `<path d="M${sx + w / 2},${sy + h + 2} V${226 - 4}" fill="none" stroke="${C.s1}" stroke-width="1.8" marker-end="url(#t-ah)"/>`;
	for (let i = 4; i < 7; i++) {
		const [x, y] = pos(i);
		b += `<line x1="${x - 2}" y1="${y + h / 2}" x2="${x - gap + 2}" y2="${y + h / 2}" stroke="${C.s1}" stroke-width="1.8" marker-end="url(#t-ah)"/>`;
	}
	b += text(16, 336, '실행은 상태 명세부터 화면 정리까지 약 2시간(커밋 시각으로 추정) · 단계마다 독립 검수 · 반려는 두 번', { size: 12, fill: C.muted });
	out(
		'src/content/blog/android-architecture-3-how-we-moved/app-info-flow.svg',
		svg(W, H, '앱 정보 화면이 지난 길', '조사(9/23, 위반 5개) → 아키텍처(9/24, 주인과 표면 셋) → BDD(9/28–29, 시나리오 15개) → SDD(9/29, 이벤트 9·일회성 6) → 계획(9/29–30, 스텝 6) → 실행(9/30–10/1, 커밋 4·반려 2) → 검증(10/1, 렌더·도달성·수명 검사) → 정리(10/3, 옛 값 반환 계약 삭제).', b),
	);
}

// ── 12. 지금 자리에 있는 검사 72종이 생긴 때 (안드로이드 아키텍처 ③) ──────────
// 하드 가드 파일이 지금 자리(규칙 폴더의 검사 자리)에 처음 추가된 달로 센 누적값.
{
	const months = ['7월 말', '8월 말', '9월 말'];
	const vals = [26, 47, 72];
	const H = 320, L = 44, R = 24, T = 78, B = 44, max = 80;
	const pw = W - L - R, ph = H - T - B, step = pw / months.length, bw = step - 70;
	const y = (v) => T + ph - (v / max) * ph;
	let b = text(16, 28, '지금 자리에 있는 검사 72종이 생긴 때', { size: 17, fill: C.text, weight: 700 });
	b += text(16, 48, '하드 가드 · 누적 · 7월 30일, 문서 정리에 쓸려 나간 26종을 지금 자리로 되살린 뒤', { size: 12, fill: C.subtle });
	for (const g of [0, 20, 40, 60, 80]) {
		b += `<line x1="${L}" x2="${W - R}" y1="${y(g)}" y2="${y(g)}" stroke="${C.grid}"/>`;
		b += text(L - 6, y(g) + 4, g, { size: 12, anchor: 'end', fill: C.subtle });
	}
	vals.forEach((v, i) => {
		const x = L + i * step + 35;
		b += bar(x, y(v), bw, y(0) - y(v), i === 0 ? '#86c9ad' : C.s1);
		b += text(x + bw / 2, y(v) - 8, `${v}`, { size: 13, anchor: 'middle', fill: C.text, weight: 700 });
		const note = i === 0 ? '되살린 26종' : `새로 +${v - vals[i - 1]}`;
		b += text(x + bw / 2, y(v) + 20, note, { size: 11, anchor: 'middle', fill: i === 0 ? C.text : '#ffffff', weight: 600 });
		b += text(x + bw / 2, H - B + 18, months[i], { size: 12, anchor: 'middle', fill: C.subtle });
	});
	out(
		'src/content/blog/android-architecture-3-how-we-moved/guards-growth.svg',
		svg(W, H, '지금 자리에 있는 검사 72종이 생긴 때', '하드 가드 누적: 7월 말 26종(되살린 것), 8월 말 47종(새로 21), 9월 말 72종(새로 25).', b),
	);
}

// ── 13. 분석 이벤트와 로그가 나오는 자리 (안드로이드 아키텍처 ②) ─────────────
// 10번 구조 그림을 그대로 쓰고, 오른쪽 core 띠 자리에 «관찰 · 기록» 띠를 그린다(로거는 core, GA 싱크는 firebase module).
// 관찰은 흐름을 바꾸지 않으므로 점선 · 한 방향.
// 층(app → feature → module → data·bridge) + 화면과 module 사이의 세 통로 + module 안의 흐름
// (Middleware = 요청이 오면 바깥 일 · Runtime Observer = 바깥 변화를 듣고 Action 으로) + 가로지르는 core.
{
	const H = 636;
	const BLUE = C.s2, GREEN = C.s1, ORANGE = C.s3, GRAY = '#9ca3af';
	const tint = { app: '#f3f4f6', feature: '#eaf2fc', module: '#e8f5ef', io: '#fdf0e8', core: '#fafafa' };
	const marker = (id, color) =>
		`<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker>`;
	const box = (x, y, w, h, fill, stroke, o = {}) =>
		`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${fill}" stroke="${stroke}" stroke-width="${o.sw ?? 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
	const arrow = (x1, y1, x2, y2, color, id, dash = '') =>
		`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.8"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#${id})"/>`;
	const path = (d, color, id, dash = '') =>
		`<path d="${d}" fill="none" stroke="${color}" stroke-width="1.8"${dash ? ` stroke-dasharray="${dash}"` : ''} marker-end="url(#${id})"/>`;
	const chip = (x, y, w, label, stroke) =>
		box(x, y, w, 32, C.surface, stroke, { rx: 7, sw: 1.2 }) + text(x + w / 2, y + 21, label, { size: 12, anchor: 'middle', fill: C.text, weight: 600 });
	const chip2 = (x, y, w, h, label, sub, stroke, dash = '') =>
		box(x, y, w, h, C.surface, stroke, { rx: 7, sw: 1.2, dash }) +
		text(x + w / 2, y + 19, label, { size: 12, anchor: 'middle', fill: C.text, weight: 600 }) +
		text(x + w / 2, y + 35, sub, { size: 11, anchor: 'middle', fill: C.muted });

	const VIOLET = '#7c3aed';
	let b = `<defs>${marker('a-blue', BLUE)}${marker('a-green', GREEN)}${marker('a-gray', GRAY)}${marker('a-orange', ORANGE)}${marker('a-violet', VIOLET)}</defs>`;
	b += text(16, 30, '분석 이벤트와 로그가 나오는 자리', { size: 18, fill: C.text, weight: 700 });
	b += text(16, 50, '1편의 구조 그림 위에 · 관찰은 흐름을 바꾸지 않는다(보라 점선)', { size: 12, fill: C.subtle });

	// app
	b += box(16, 70, 432, 46, tint.app, GRAY);
	b += text(32, 99, 'app', { size: 14, fill: C.text, weight: 700 });
	b += text(78, 99, '앱 진입 · 조립 · 화면 이동', { size: 12, fill: C.muted });
	b += arrow(232, 116, 232, 134, GRAY, 'a-gray');

	// feature
	b += box(16, 136, 432, 88, tint.feature, BLUE);
	b += text(32, 159, 'feature', { size: 14, fill: C.text, weight: 700 });
	b += text(98, 159, '화면', { size: 12, fill: C.muted });
	b += chip(32, 172, 150, 'View · 그리기', BLUE);
	b += chip(282, 172, 150, 'ViewModel · 화면 상태', BLUE);
	b += arrow(184, 183, 278, 183, BLUE, 'a-blue');
	b += arrow(280, 197, 186, 197, BLUE, 'a-blue');
	b += text(232, 178, 'onEvent', { size: 11, anchor: 'middle', fill: C.muted });
	b += text(232, 214, 'uiState', { size: 11, anchor: 'middle', fill: C.muted });

	// 화면 ↔ module 세 통로
	const lane = (x, dir, color, id, dash, title, l1, l2) => {
		let s = dir === 'down' ? arrow(x, 228, x, 300, color, id, dash) : arrow(x, 300, x, 228, color, id, dash);
		s += text(x + 10, 252, title, { size: 12, fill: C.text, weight: 700 });
		s += text(x + 10, 268, l1, { size: 11, fill: C.muted });
		if (l2) s += text(x + 10, 283, l2, { size: 11, fill: C.muted });
		return s;
	};
	b += lane(40, 'down', BLUE, 'a-blue', '', '알리기', 'dispatch(Action)', '반환값 없음');
	b += lane(184, 'up', GREEN, 'a-green', '', '구독하기', 'StateReader', 'Selector · 파생된 답');
	b += lane(328, 'up', GREEN, 'a-green', '5 4', '받기', 'SideEffectReader', '한 번만 일어나는 사건');

	// module
	b += box(16, 304, 432, 184, tint.module, GREEN, { sw: 2 });
	b += text(32, 328, 'module', { size: 14, fill: C.text, weight: 700 });
	b += text(96, 328, '도메인 상태의 주인', { size: 12, fill: C.muted });
	b += box(350, 313, 84, 22, GREEN, GREEN, { rx: 11, sw: 1 }) + text(392, 328, '정본 (SSOT)', { size: 11, anchor: 'middle', fill: '#ffffff', weight: 700 });
	b += chip2(32, 342, 100, 44, 'Action', '일어난 일', GREEN);
	b += chip2(176, 342, 122, 44, 'Reducer', '상태는 여기서만 바뀐다', GREEN);
	b += chip2(340, 342, 92, 44, 'State', 'Store 가 든다', GREEN);
	b += arrow(134, 364, 172, 364, GREEN, 'a-green');
	b += arrow(300, 364, 336, 364, GREEN, 'a-green');
	// 아래 줄: 요청이 오면 움직이는 Middleware / 바깥 변화를 듣는 Runtime Observer
	b += chip2(32, 418, 118, 44, 'Middleware', '요청 · 변화를 받는다', GREEN);
	b += chip2(282, 418, 150, 44, 'Runtime Observer', '신호를 Flow 로 바꾼다', GREEN, '4 3');
	b += arrow(62, 388, 62, 414, GREEN, 'a-green');
	b += arrow(104, 416, 104, 390, GREEN, 'a-green');
	b += text(112, 405, '결과는 Action 으로', { size: 11, fill: C.muted });
	b += arrow(280, 442, 154, 442, GREEN, 'a-green', '4 3');
	b += text(217, 435, '변화를 넘긴다', { size: 11, anchor: 'middle', fill: C.muted });
	b += text(390, 480, '플랫폼 신호를 받는 module 에만', { size: 11, anchor: 'end', fill: C.muted });

	// data · bridge
	b += arrow(80, 464, 80, 526, ORANGE, 'a-orange');
	b += text(88, 508, '부른다', { size: 11, fill: C.muted });
	b += arrow(262, 490, 262, 526, ORANGE, 'a-orange');
	b += text(270, 512, '부른다', { size: 11, fill: C.muted });
	b += arrow(400, 526, 400, 466, ORANGE, 'a-orange', '5 4');
	b += text(392, 512, '신호', { size: 11, anchor: 'end', fill: C.muted });
	b += box(16, 530, 208, 62, tint.io, ORANGE);
	b += text(32, 554, 'data', { size: 14, fill: C.text, weight: 700 });
	b += text(76, 554, '서버 · DB', { size: 12, fill: C.muted });
	b += text(32, 575, '요청 → 응답, 상태는 없다', { size: 11, fill: C.muted });
	b += box(240, 530, 208, 62, tint.io, ORANGE);
	b += text(256, 554, 'bridge', { size: 14, fill: C.text, weight: 700 });
	b += text(312, 554, '안드로이드 프레임워크', { size: 12, fill: C.muted });
	b += text(256, 575, '오디오 · BT · 생명주기 신호', { size: 11, fill: C.muted });

	// 관찰 · 기록 띠 (core 띠 자리)
	b += box(464, 136, 120, 456, '#f5f3ff', VIOLET, { dash: '6 4' });
	b += text(478, 160, '관찰 · 기록', { size: 14, fill: C.text, weight: 700 });
	b += text(478, 178, '흐름을 바꾸지', { size: 11, fill: C.muted });
	b += text(478, 193, '않는다', { size: 11, fill: C.muted });
	// 분석 이벤트 (GA)
	b += box(474, 212, 100, 116, C.surface, VIOLET, { rx: 7, sw: 1.4 });
	b += text(482, 231, '분석 이벤트', { size: 12, fill: C.text, weight: 700 });
	b += text(482, 249, '← 탭 (화면)', { size: 11, fill: C.text });
	b += text(482, 265, '← 전이 (module)', { size: 11, fill: C.text });
	b += text(482, 284, '이름은 이음새를', { size: 11, fill: C.muted });
	b += text(482, 299, '가진 층이 짓는다', { size: 11, fill: C.muted });
	b += text(482, 318, '→ GA (firebase)', { size: 10.5, fill: C.subtle });
	// 화면의 입력(탭) → GA
	b += path('M432,196 H466 V245 H472', VIOLET, 'a-violet', '5 4');
	// module 의 전이(State) → GA
	b += path('M432,370 H466 V261 H472', VIOLET, 'a-violet', '5 4');
	// 디버그 로그 — 모든 층에서 로거의 문 하나로
	b += `<line x1="456" x2="456" y1="160" y2="578" stroke="${GRAY}" stroke-width="1.4" stroke-dasharray="3 3"/>`;
	for (const yy of [168, 470, 578]) b += `<line x1="448" x2="456" y1="${yy}" y2="${yy}" stroke="${GRAY}" stroke-width="1.4" stroke-dasharray="3 3"/>`;
	b += arrow(456, 452, 472, 452, GRAY, 'a-gray', '3 3');
	b += box(474, 402, 100, 100, C.surface, GRAY, { rx: 7, sw: 1.4 });
	b += text(482, 421, '디버그 로그', { size: 12, fill: C.text, weight: 700 });
	b += text(482, 438, '로거의 문 하나', { size: 11, fill: C.muted });
	b += text(482, 457, '수준 거르기', { size: 11, fill: C.muted });
	b += text(482, 472, '+ 개인정보', { size: 11, fill: C.muted });
	b += text(482, 487, '가리기 (core)', { size: 11, fill: C.muted });
	// 가르는 질문
	b += `<line x1="474" x2="574" y1="524" y2="524" stroke="${VIOLET}" stroke-dasharray="3 3"/>`;
	b += text(478, 545, '의도와 전후가', { size: 11, fill: C.text });
	b += text(478, 560, '있으면 이벤트,', { size: 11, fill: C.text });
	b += text(478, 575, '없으면 로그', { size: 11, fill: C.text });

	// 금지: 건너뛰기
	b += `<circle cx="25" cy="617" r="8" fill="#fbeaea" stroke="${C.critical}" stroke-width="1.5"/>`;
	b += text(25, 621, '✕', { size: 11, anchor: 'middle', fill: C.critical, weight: 700 });
	b += text(40, 621, 'feature 는 data · bridge 를 직접 부르지 않는다 — 읽기만 해도 module 을 거친다', { size: 12, fill: C.text });

	out(
		'src/content/blog/android-architecture-2-build-and-fix/architecture-telemetry.svg',
		svg(W, H, '분석 이벤트와 로그가 나오는 자리', '1편의 구조 그림 위에 관찰과 기록을 덧그린 그림. 화면의 입력(탭)과 module 의 상태 전이에서 분석 이벤트를 관찰해 GA 로 보내고(이름은 이음새를 가진 층이 짓고, 싱크는 firebase module), 모든 층의 디버그 로그는 core 로거의 문 하나에서 수준 거르기와 개인정보 가리기를 거친다. 관찰은 흐름을 바꾸지 않는다. 의도와 전후가 있으면 이벤트, 없으면 로그.', b),
	);
}

#!/usr/bin/env node
/**
 * 용어 · 말투 검사 — npm run check:wording [slug …] [--list]
 *
 * 한국 개발자가 실제로 쓰지 않는 말(영어 직역 · 은유)과 설명 문장에 섞인 규칙형 «~한다» 를 찾아 알린다.
 * 경고만 낸다(빌드를 막지 않는다). 고칠지는 사람이 문맥을 보고 정한다 — .claude/skills/blog-wording/
 *
 * 근거: 한국어 기술 블로그 7곳 457편(회사 5곳 · 개인 2곳, 2026-10 수집)에서 센 등장 횟수.
 *   «원천 0 · 대체어 N» 은 그 말이 원천에 0번, 대체어가 N번 나왔다는 뜻이다.
 *   decided: 'user' = 사용자 결정(근거보다 우선) · 'evidence' = 원천 실측 · 'ask' = 사용자 결정 필요(후보만 제시)
 *
 * --list : 용어집을 표로 출력한다.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const TERMS = [
	// ── 사용자 결정
	{ id: 'grow', avoid: /(?<![가-힣])(자라|자랐|자란|자랄)|키우|키워(?!드)|키운|키울/g, use: '확장한다 · 발전시킨다', decided: 'user',
	  evidence: '코드·구조·기능이 목적어인 «키우다» 1(«규모를 키우다») · «~가 자라다» 0 / 같은 목적어 «확장» 16 · «발전시키다» 7',
	  note: '코드 · 구조 · 기능 · 시스템에 쓴 경우만 고친다(사람 · 역량 · 조직은 그대로)' },
	{ id: 'owner', avoid: /주인/g, use: '소유자 · 담당(사람 · 팀) / «상태를 관리하는»(코드)', decided: 'user',
	  evidence: '주인 32(대부분 일상 뜻) / 소유자 13 · 소유권 10 · 담당자 213 · «상태를 관리» 17 · «상태를 소유» 0',
	  note: 'own → 소유(사용자 결정). 원천의 «소유» 는 주어가 사람 · 팀 · 조직일 때만 쓰였다' },
	{ id: 'own-code', avoid: /(진실|상태|데이터|대상)[을를] ?소유|[이가] 소유한다/g, use: '상태를 관리한다', decided: 'user',
	  evidence: '코드가 주어인 «상태 · 데이터를 소유» 0 / «상태를 관리» 17 · «데이터를 관리» 9',
	  note: '사람 · 팀이 주어인 «소유(소유자 · 소유권)» 는 그대로' },
	{ id: 'canonical', avoid: /정본/g, use: '단일 진실 원천(SSOT) — 글에서 처음 한 번 풀어 쓰고 그 뒤로는 SSOT', decided: 'user', evidence: '정본 2 / 원본 103 · SSOT 3 · «단일 진실 공급원» 0' },
	{ id: 'return', avoid: /반송/g, use: '반려', decided: 'user', evidence: '반송 1 / 거절 28 · 반려 17' },
	{ id: 'constitution', avoid: /헌법|조문/g, use: '규칙 · 규칙 문서', decided: 'user', evidence: '헌법 0 · 조문 1 / 규칙 639 · 컨벤션 73 · 가이드라인 54' },
	// ── 원천 실측
	{ id: 'version', avoid: /(첫|새|낡은|옛|이전|최신|도구|출시했던|다음)\s?판(?![가-힣])/g, use: '버전', decided: 'evidence', evidence: '«~ 판»(version) 0 / 버전 1,071' },
	{ id: 'actual', avoid: /실물/g, use: '실제 구현 · 실제 작업 · 실체', decided: 'evidence', evidence: '실물 3 / 실제 구현 17 · 실체 17 · 실제 작업 7' },
	{ id: 'split', avoid: /갈라|갈랐|갈린/g, use: '나누다 · 분리', decided: 'evidence', evidence: '갈라지다 4 / 나누다 507 · 분리 437' },
	{ id: 'extract', avoid: /떼어 ?내|떼어 ?냈|떼어냈|(?<![가-힣])뗀|(?<![가-힣])뗐/g, use: '분리 · 추출', decided: 'evidence', evidence: '떼어 내다 6 / 분리 437 · 추출 249' },
	{ id: 'absorb', avoid: /흡수/g, use: '통합 · 합치다', decided: 'evidence', evidence: '흡수 18 / 통합 409 · 합치다 50' },
	{ id: 'lock', avoid: /잠그|잠갔|잠근|잠가/g, use: '고정', decided: 'evidence', evidence: '잠그다 5 / 고정 152' },
	{ id: 'leak', avoid: /샜|새어 ?나|새어나/g, use: '재발(문제가 다시 생김) · 누수(자원) · 유출(정보)', decided: 'evidence', evidence: '새다 4 / 재발 18 · 누수 7 · 유출 60' },
	{ id: 'level-filter', avoid: /수준 ?거르|수준 ?가리/g, use: '로그 레벨 필터링', decided: 'evidence', evidence: '수준 거르기 0 / 로그 레벨 6 · 필터링 145' },
	{ id: 'false-alarm', avoid: /거짓 ?(음성|양성|경보|초록)/g, use: '오탐(거짓 경보) · 미탐(거짓 음성 · 거짓 초록)', decided: 'evidence', evidence: '거짓 음성·양성·경보 11(2곳) / 미탐·오탐 58(4곳)' },
	{ id: 'depend', avoid: /기대[고는어]|기댄|기댔|기대면/g, use: '의존', decided: 'evidence', evidence: '기대다 7 / 의존 504', note: '«기대하다»(expect) 는 해당 없음' },
	{ id: 'run', avoid: /주행/g, use: '실행 · 돌리다', decided: 'evidence', evidence: '주행 14(자율주행 뜻) / 실행 1,775 · 돌리다 169' },
	{ id: 'repair', avoid: /수리(?!하겠)/g, use: '버그 수정 · 고치다', decided: 'evidence', evidence: '수리 2 / 버그 수정 20 · 고치다 155' },
	{ id: 'ledger', avoid: /원장|계보/g, use: '이력 · 히스토리', decided: 'evidence', evidence: '원장 6 · 계보 3 / 이력 135 · 히스토리 60' },
	{ id: 'slot', avoid: /(로거|관찰|로그|정해진|끼울) ?자리/g, use: '로거 · 옵저버 · 훅 · 슬롯 (정해진 자리 → 정해진 곳)', decided: 'evidence', evidence: '«로거 · 관찰 자리» 0 / 옵저버 45 · 훅 102 · 슬롯 50 · 확장 지점 13', note: '장소 뜻의 «자리» 는 그대로' },
	{ id: 'one-door', avoid: /(?<![가-힣])문 하나|하나의 문(?![가-힣])/g, use: '진입점 · 래퍼', decided: 'evidence', evidence: '«문 하나»(진입점 뜻) 0 / 진입점 15 · 래퍼 20' },
	{ id: 'land', avoid: /착지/g, use: '머지 · 병합', decided: 'evidence', evidence: '착지 5 / 머지 167 · 병합 41' },
	// ── 사용자 결정 필요 (원천 차이가 작거나 팀 용어)
	{ id: 'helper', avoid: /도우미/g, use: '(사용자 결정) 헬퍼 · 유틸', decided: 'ask', evidence: '도우미 10(모두 «AI 도우미» 같은 제품 이름, 코드 helper 뜻 0) / 헬퍼 9 · helper 9 · 유틸 32 · 공통 함수 1' },
];

// 설명 문장(합니다체) 사이에 박힌 규칙형 «~한다.» — 인용 · 표 · 목록 · 제목은 빼고 본다
const PLAIN_END = /(?<![니]|습니)(한다|된다|는다|ㄴ다|간다|온다|둔다|본다|준다|친다|진다)[.)]?(\s|$)/;
const FORCED_PASSIVE = /고쳐진|고쳐지|고쳐졌|세워져|세워진|되어진|되어지|에 의해(?!서)/g;

const ROOT = process.cwd();
const BLOG = join(ROOT, 'src/content/blog');
const args = process.argv.slice(2);

if (args.includes('--list')) {
	const label = { user: '사용자 결정', evidence: '원천 실측', ask: '사용자 결정 필요' };
	console.log('| 안 쓰는 말(정규식) | 쓰는 말 | 근거(원천 횟수) | 결정 |\n|---|---|---|---|');
	for (const t of TERMS) console.log(`| \`${t.avoid.source}\` | ${t.use} | ${t.evidence} | ${label[t.decided]} |`);
	process.exit(0);
}

function walk(dir) {
	return readdirSync(dir).flatMap((n) => {
		const p = join(dir, n);
		return statSync(p).isDirectory() ? walk(p) : [p];
	});
}
const slugOf = (f) => relative(BLOG, f).replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
const only = args.filter((a) => !a.startsWith('-'));
let files = walk(BLOG).filter((f) => /\.(md|mdx)$/.test(f));
if (only.length) files = files.filter((f) => only.includes(slugOf(f)));
if (files.length === 0) {
	console.error('check-wording: 검사할 글이 없습니다.');
	process.exit(2);
}

let total = 0;
for (const file of files) {
	const lines = readFileSync(file, 'utf8').split('\n');
	const out = [];
	let inCode = false;
	let inFm = lines[0] === '---';
	lines.forEach((raw, i) => {
		const n = i + 1;
		if (inFm) {
			if (i > 0 && raw === '---') inFm = false;
			return;
		}
		if (/^\s*```/.test(raw)) {
			inCode = !inCode;
			return;
		}
		if (inCode) return;
		const line = raw.replace(/`[^`]*`/g, '').replace(/\]\([^)]*\)/g, ']');
		for (const t of TERMS) {
			for (const m of line.matchAll(t.avoid)) {
				out.push(`  ${n}  [${t.id}] «${m[0]}» → ${t.use}${t.decided === 'ask' ? '  (사용자 확인)' : ''}`);
			}
		}
		for (const m of line.matchAll(FORCED_PASSIVE)) out.push(`  ${n}  [passive] «${m[0]}» — 능동으로 쓸 수 있는지 본다`);
		// 규칙형 «~한다»: 같은 줄에 «~니다» 문장이 있는데 «~한다.» 로 끝나는 문장이 섞인 경우
		const prose = !/^\s*(>|\||#|[-*] |\d+\. )/.test(raw);
		if (prose && /니다[.!?]/.test(line)) {
			for (const s of line.split(/(?<=[.!?])\s+/)) {
				if (PLAIN_END.test(s.trim()) && !/니다/.test(s)) out.push(`  ${n}  [plain-rule] «${s.trim().slice(-30)}» — 설명 문장 속 규칙형 «~한다»`);
			}
		}
	});
	if (out.length) {
		console.log(`${relative(ROOT, file)} — ${out.length}건`);
		console.log(out.join('\n'));
		total += out.length;
	}
}
console.log(`\ncheck-wording: 글 ${files.length}편 · 경고 ${total}건 (고칠지는 문맥을 보고 정한다 — blog-wording 스킬)`);

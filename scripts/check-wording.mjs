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
 * 용어의 정본은 src/data/glossary.json(블로그 /glossary/ 페이지와 같은 파일). 글에 쓸 말(대표 이름)은 거기서 가져오고,
 * 이 파일에는 찾는 정규식 · 원천 근거만 둔다. 용어를 바꾸거나 더할 때는 glossary.json 을 고친다.
 *   - TERMS 의 glossary: '<대표 이름>' 줄은 그 이름을 그대로 제안한다.
 *   - glossary.json 의 avoid 가운데 TERMS 가 맡지 않은 말은 글자 그대로 찾는 규칙을 자동으로 만든다.
 *   - «대표 이름(다른 이름)» 꼴의 괄호 안(예: Supervisor(감독))은 걸지 않는다.
 *
 * --list : 용어집을 표로 출력한다(glossary.json 의 avoid 를 정규식이 못 잡으면 함께 알린다).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const GLOSSARY = JSON.parse(readFileSync(new URL('../src/data/glossary.json', import.meta.url), 'utf8')).terms;

export const TERMS = [
	// ── 사용자 결정
	{ id: 'grow', avoid: /(?<![가-힣])(자라|자랐|자란|자랄)|키우|키워(?!드)|키운|키울/g, glossary: '확장하다 · 발전시키다', decided: 'user',
	  evidence: '코드·구조·기능이 목적어인 «키우다» 1(«규모를 키우다») · «~가 자라다» 0 / 같은 목적어 «확장» 16 · «발전시키다» 7',
	  note: '코드 · 구조 · 기능 · 시스템에 쓴 경우만 고친다(사람 · 역량 · 조직은 그대로)' },
	{ id: 'owner', avoid: /주인/g, use: '소유자 · 담당(사람 · 팀) / «상태를 관리하는»(코드)', decided: 'user',
	  evidence: '주인 32(대부분 일상 뜻) / 소유자 13 · 소유권 10 · 담당자 213 · «상태를 관리» 17 · «상태를 소유» 0',
	  note: 'own → 소유(사용자 결정). 원천의 «소유» 는 주어가 사람 · 팀 · 조직일 때만 쓰였다' },
	{ id: 'own-code', avoid: /(진실|상태|데이터|대상)[을를] ?소유|[이가] 소유한다/g, glossary: '상태를 관리한다', decided: 'user',
	  evidence: '코드가 주어인 «상태 · 데이터를 소유» 0 / «상태를 관리» 17 · «데이터를 관리» 9',
	  note: '사람 · 팀이 주어인 «소유(소유자 · 소유권)» 는 그대로' },
	{ id: 'canonical', avoid: /정본/g, glossary: '단일 진실 원천(SSOT)', decided: 'user', evidence: '정본 2 / 원본 103 · SSOT 3 · «단일 진실 공급원» 0' ,
	  note: '제목은 풀어 쓰지 않는다 — 사용자 결정(2026-10-30): «정본은 한 곳에» → «SSOT 는 한 곳에». 본문의 첫 등장에서 풀어 쓴다' },
	{ id: 'return', avoid: /반송(?!지)/g, glossary: '반려', decided: 'user', evidence: '반송 1 / 거절 28 · 반려 17' },
	{ id: 'constitution', avoid: /헌법|조문/g, glossary: '규칙 문서', decided: 'user', evidence: '헌법 0 · 조문 1 / 규칙 639 · 컨벤션 73 · 가이드라인 54' },
	{ id: 'incident', avoid: /(?<![가-힣])사고(?!방식|력|하|실험| ?싶|의 ?(틀|단위|과정|전환))/g, glossary: '문제 · 이슈 · 버그 · 장애', decided: 'user',
	  evidence: '«사고 한 건» 0 · «사고가 나다» 4(보안 사고 · 데이터 삭제 같은 큰일) / 문제가 생기다 196 · 이슈 466 · 버그 197 · 장애 653',
	  note: '사용자 결정(2026-10-30). 생각 뜻(사고방식 · 사고 과정)은 해당 없음' },
	// ── 원천 실측
	{ id: 'version', avoid: /(첫|새|낡은|옛|이전|최신|도구|출시했던|다음)\s?판(?=[은는이을를에의과와도으]|[\s.,)]|$)/g, use: '버전', decided: 'evidence', evidence: '«~ 판»(version) 0 / 버전 1,071' },
	{ id: 'actual', avoid: /실물/g, use: '실제 구현 · 실제 작업 · 실체', decided: 'evidence', evidence: '실물 3 / 실제 구현 17 · 실체 17 · 실제 작업 7' },
	{ id: 'split', avoid: /갈라|갈랐|갈린/g, use: '나누다 · 분리', decided: 'evidence', evidence: '갈라지다 4 / 나누다 507 · 분리 437' ,
	  note: '제목 결정(2026-10-30): «갈라지고, 틀리고, 흐름이 되기까지» → «나뉘고, 틀리고, 흐름이 되기까지»' },
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
	{ id: 'helper', avoid: /도우미/g, glossary: '헬퍼', decided: 'user', evidence: '도우미 10(모두 «AI 도우미» 같은 제품 이름, 코드 helper 뜻 0) / 헬퍼 9 · helper 9 · 유틸 32 · 공통 함수 1' },
	// ── 원천 실측 (2026-10-30 추가 — 블로그 세션 집계와 따로 세어 맞춤, 차이는 evidence 에 적음)
	{ id: 'adopt', avoid: /[을를] ?들이(며|고|면|는|기|려)|[을를] ?들였/g, use: '도입하다', decided: 'evidence', evidence: '«~를 들이다» 11(블로그 세션 9) / 도입 756', note: '«시간을 들이다» 는 해당 없음' },
	{ id: 'layer', avoid: /(?<![가-힣])겹(?![치쳐친칠쳤])/g, use: '계층 · 레이어', decided: 'evidence', evidence: '겹 7(블로그 세션 8) / 계층 · 레이어 376(153 · 223)' },
	{ id: 'granularity', avoid: /입자/g, use: '단위', decided: 'evidence', evidence: '입자 6 / 단위 603' },
	{ id: 'field', avoid: /(입력|산출|반출|통과 ?체크|계약)[의 ]* ?칸/g, use: '항목 · 필드', decided: 'evidence', evidence: '«계약 · 입력 · 산출 칸» 1 · 칸 전체 34 / 항목 238 · 필드 271', note: '표의 칸 · «한 칸씩» 같은 쓰임은 해당 없음' },
	{ id: 'hand-down', avoid: /넘김/g, use: '위임', decided: 'evidence', evidence: '넘김 0 / 위임 50' },
	{ id: 'tally', avoid: /셈의|셈 ?축|셈[을를]/g, use: '집계 기준 · 집계 축', decided: 'evidence', evidence: '«셈의 · 셈을» 3(«~인 셈» 관용구 빼고, 두 세션 맞춤) / 집계 138 · 집계 기준 3' },
	{ id: 'blind', avoid: /못 ?보는/g, use: '검증할 수 없는 · 사각지대 · (축이면) 영역', decided: 'evidence', evidence: '못 보는 0 / 사각지대 · 검증할 수 없는 7 · 영역 467' },
	{ id: 'checkpoint', avoid: /멈춤 ?지점/g, use: '체크포인트', decided: 'evidence', evidence: '멈춤 지점 0(블로그 세션 1) / 체크포인트 39(37)' },
	{ id: 'version-up', avoid: /버전 ?올림|버전을 올림/g, use: '버전 업', decided: 'evidence', evidence: '버전 올림 0 / 버전 업 94' },
	{ id: 'misread', avoid: /오독/g, use: '잘못 읽음 · 오해 · (문맥에 따라) 같은 잘못', decided: 'evidence', evidence: '오독 0 / 오해 44 · 잘못 해석 2 · 잘못 읽 2 (두 세션 맞춤)' },
	// ── 사용자 결정 필요
	{ id: 'branch', avoid: /갈래/g, glossary: '하위 작업', decided: 'user', evidence: '갈래 7 / 분기 87 · 하위 작업 3' },
	{ id: 'artifact', avoid: /산출물/g, glossary: '결과물', decided: 'user', evidence: '산출물 28 / 결과물 208' },
	{ id: 'export', avoid: /결정 반출/g, glossary: '결정 기록', decided: 'user', evidence: '반출 5 / 대체어 실측 없음' },
];

// glossary.json 과 잇기 — 대표 이름을 가져오고, TERMS 가 맡지 않은 avoid 는 글자 그대로 찾는다
const byName = new Map(GLOSSARY.map((g) => [g.name, g]));
const escapeRx = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const t of TERMS) {
	if (!t.glossary) continue;
	const g = byName.get(t.glossary);
	if (!g) throw new Error(`check-wording: glossary.json 에 «${t.glossary}» 가 없습니다`);
	t.use = g.name;
	t.names = [g.name, ...g.aliases];
}
for (const g of GLOSSARY) {
	if (TERMS.some((t) => t.glossary === g.name)) continue;
	const words = g.avoid.filter((w) => !/[()]/.test(w));
	if (!words.length) continue;
	TERMS.push({ id: 'glossary', avoid: new RegExp(words.map(escapeRx).join('|'), 'g'), glossary: g.name, use: g.name, names: [g.name, ...g.aliases],
		decided: g.decided === 'ask' ? 'ask' : 'user', evidence: 'glossary.json' + (g.status === 'pending' ? ' (이름 통일 대기)' : '') });
}
// «대표 이름(다른 이름)» — 괄호 바로 앞이 그 용어의 이름이면(굵게 · 따옴표 표시는 무시) 건너뛴다
const inAliasParen = (t, line, at) => {
	const before = line.slice(0, at);
	return before.endsWith('(') && (t.names ?? []).some((nm) => before.slice(0, -1).replace(/[\s*_»`]+$/, '').endsWith(nm));
};

// 설명 문장(합니다체) 사이에 박힌 규칙형 «~한다.» — 인용 · 표 · 목록 · 제목 · «…» 안은 빼고 본다
// 일부러 둔 줄(사람이 한 말을 그대로 옮긴 인용 등)은 줄 끝이나 바로 윗줄에 <!-- wording-ok --> 를 단다
const PLAIN_END = /(?<![니]|습니)(한다|된다|는다|ㄴ다|간다|온다|둔다|본다|준다|친다|진다)[.)]?(\s|$)/;
const FORCED_PASSIVE = /고쳐진|고쳐지|고쳐졌|세워져|세워진|되어진|되어지|에 의해(?!서)/g;

const ROOT = process.cwd();
const BLOG = join(ROOT, 'src/content/blog');
const args = process.argv.slice(2);

if (args.includes('--list')) {
	const label = { user: '사용자 결정', evidence: '원천 실측', ask: '사용자 결정 필요' };
	console.log('| 안 쓰는 말(정규식) | 쓰는 말 | 근거(원천 횟수) | 결정 |\n|---|---|---|---|');
	for (const t of TERMS) console.log(`| \`${t.avoid.source}\` | ${t.use}${t.glossary ? ' ⟵ glossary.json' : ''} | ${t.evidence} | ${label[t.decided]} |`);
	// glossary.json 의 avoid 를 정규식이 실제로 잡는지 — 두 곳이 어긋나면 알린다
	for (const t of TERMS.filter((x) => x.glossary)) {
		for (const w of byName.get(t.glossary).avoid.filter((x) => !/[()]/.test(x))) {
			if (!new RegExp(t.avoid.source).test(w)) console.log(`\n주의: glossary «${t.glossary}» 의 avoid «${w}» 를 [${t.id}] 정규식이 잡지 못합니다`);
		}
	}
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
		if (/<!-- ?wording-ok ?-->/.test(raw) || /^\s*<!-- ?wording-ok ?-->\s*$/.test(lines[i - 1] ?? '')) return;
		const line = raw.replace(/`[^`]*`/g, '').replace(/\]\([^)]*\)/g, ']');
		for (const t of TERMS) {
			for (const m of line.matchAll(t.avoid)) {
				if (inAliasParen(t, line, m.index)) continue;
				out.push(`  ${n}  [${t.id}] «${m[0]}» → ${t.use}${t.decided === 'ask' ? '  (사용자 확인)' : ''}`);
			}
		}
		for (const m of line.matchAll(FORCED_PASSIVE)) out.push(`  ${n}  [passive] «${m[0]}» — 능동으로 쓸 수 있는지 본다`);
		// 규칙형 «~한다»: 같은 줄에 «~니다» 문장이 있는데 «~한다.» 로 끝나는 문장이 섞인 경우
		const prose = !/^\s*(>|\||#|[-*] |\d+\. )/.test(raw);
		if (prose && /니다[.!?]/.test(line)) {
			for (const s of line.replace(/«[^»]*»/g, '«»').split(/(?<=[.!?])\s+/)) {
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

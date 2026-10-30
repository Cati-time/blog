#!/usr/bin/env node
/**
 * 용어 · 말투 검사 — npm run check:wording [slug …] [--list]
 *
 * 한국 개발자가 실제로 쓰지 않는 말(영어 직역 · 은유)과 설명 문장에 섞인 규칙형 «~한다» 를 찾아 알린다.
 * 경고만 낸다(빌드를 막지 않는다). 고칠지는 사람이 문맥을 보고 정한다 — .claude/skills/blog-wording/
 *
 * 근거: 한국어 기술 블로그 7곳 457편(회사 5곳 · 개인 2곳, 2026-10 수집)에서 센 등장 횟수.
 *   «원천 0 · 대체어 N» 은 그 말이 원천에 0번, 대체어가 N번 나왔다는 뜻이다.
 *   decided(glossary.json): 'user' = 사용자 결정(근거보다 우선) · 'evidence' = 원천 실측 · 'ask' = 사용자 결정 필요(후보만 제시)
 *
 * 용어의 정본은 src/data/glossary.json(블로그 /glossary/ 페이지와 같은 파일). 글에 쓸 말(대표 이름)은 거기서 가져오고,
 * 이 파일에는 찾는 정규식 · 원천 근거만 둔다. 용어를 바꾸거나 더할 때는 glossary.json 을 고친다.
 *   - TERMS 는 정규식만 갖고 glossary: '<대표 이름>' 으로 잇는다. 제안하는 말 · 결정 · 원천 근거는 모두 glossary 에서 온다.
 *   - glossary.json 의 avoid 가운데 TERMS 가 맡지 않은 말은 글자 그대로 찾는 규칙을 자동으로 만든다.
 *   - «대표 이름(다른 이름)» 꼴의 괄호 안(예: Supervisor(감독))은 걸지 않는다.
 *
 * --list : 용어집을 표로 출력한다(glossary.json 의 avoid 를 정규식이 못 잡으면 함께 알린다).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const GLOSSARY = JSON.parse(readFileSync(new URL('../src/data/glossary.json', import.meta.url), 'utf8')).terms;

export const TERMS = [
	// 찾는 정규식만. 대표 이름 · 정의 · 원천 근거(evidence) · 결정은 src/data/glossary.json
	{ id: 'grow', avoid: /(?<![가-힣])(자라|자랐|자란|자랄)|키우|키워(?!드)|키운|키울/g, glossary: '확장하다 · 발전시키다' },
	{ id: 'owner', avoid: /주인/g, glossary: '소유자 · 담당' },
	{ id: 'own-code', avoid: /(진실|상태|데이터|대상)[을를] ?소유|[이가] 소유한다/g, glossary: '상태를 관리한다' },
	{ id: 'canonical', avoid: /정본/g, glossary: '단일 진실 원천(SSOT)' },
	{ id: 'return', avoid: /반송(?!지)/g, glossary: '반려' },
	{ id: 'return-place', avoid: /반송지/g, glossary: '반려되는 곳' },
	{ id: 'constitution', avoid: /헌법|조문/g, glossary: '규칙 문서' },
	{ id: 'incident', avoid: /(?<![가-힣])사고(?!방식|력|하|실험| ?싶|의 ?(틀|단위|과정|전환))/g, glossary: '문제 · 이슈 · 버그 · 장애' },
	{ id: 'version', avoid: /(첫|새|낡은|옛|이전|최신|도구|출시했던|다음)\s?판(?=[은는이을를에의과와도으]|[\s.,)]|$)/g, glossary: '버전' },
	{ id: 'actual', avoid: /실물/g, glossary: '실제 구현 · 실제 작업' },
	{ id: 'split', avoid: /갈라|갈랐|갈린/g, glossary: '나누다 · 분리' },
	{ id: 'extract', avoid: /떼어 ?내|떼어 ?냈|떼어냈|(?<![가-힣])뗀|(?<![가-힣])뗐/g, glossary: '분리하다 · 추출하다' },
	{ id: 'absorb', avoid: /흡수/g, glossary: '통합 · 합치다' },
	{ id: 'lock', avoid: /잠그|잠갔|잠근|잠가/g, glossary: '고정' },
	{ id: 'leak', avoid: /샜|새어 ?나|새어나/g, glossary: '재발 · 누수 · 유출' },
	{ id: 'level-filter', avoid: /수준 ?거르|수준 ?가리/g, glossary: '로그 레벨 필터링' },
	{ id: 'false-alarm', avoid: /거짓 ?(음성|양성|경보|초록)/g, glossary: '오탐 · 미탐' },
	{ id: 'depend', avoid: /기대[고는어]|기댄|기댔|기대면/g, glossary: '의존하다' },
	{ id: 'run', avoid: /주행/g, glossary: '실행 · 돌리다' },
	{ id: 'repair', avoid: /수리(?!하겠)/g, glossary: '버그 수정 · 고치다' },
	{ id: 'ledger', avoid: /원장|계보/g, glossary: '이력 · 변경 이력' },
	{ id: 'slot', avoid: /(로거|관찰|로그|정해진|끼울) ?자리/g, glossary: '로거 · 옵저버 · 훅 · 슬롯' },
	{ id: 'one-door', avoid: /(?<![가-힣])문 하나|하나의 문(?![가-힣])/g, glossary: '진입점 · 래퍼' },
	{ id: 'land', avoid: /착지/g, glossary: '머지 · 병합' },
	{ id: 'helper', avoid: /도우미/g, glossary: '헬퍼' },
	{ id: 'adopt', avoid: /[을를] ?들이(며|고|면|는|기|려)|[을를] ?들였/g, glossary: '도입하다' },
	{ id: 'layer', avoid: /(?<![가-힣])겹(?![치쳐친칠쳤])/g, glossary: '계층 · 레이어' },
	{ id: 'granularity', avoid: /입자/g, glossary: '단위' },
	{ id: 'field', avoid: /(입력|산출|반출|통과 ?체크|계약)[의 ]* ?칸/g, glossary: '항목 · 필드' },
	{ id: 'hand-down', avoid: /넘김/g, glossary: '위임' },
	{ id: 'tally', avoid: /셈의|셈 ?축|셈[을를]/g, glossary: '집계 기준 · 집계 축' },
	{ id: 'blind', avoid: /못 ?보는/g, glossary: '검증할 수 없는 · 사각지대' },
	{ id: 'checkpoint', avoid: /멈춤 ?지점/g, glossary: '체크포인트' },
	{ id: 'version-up', avoid: /버전 ?올림|버전을 올림/g, glossary: '버전 업' },
	{ id: 'misread', avoid: /오독/g, glossary: '잘못 읽음 · 오해' },
	{ id: 'branch', avoid: /갈래/g, glossary: '하위 작업' },
	{ id: 'artifact', avoid: /산출물/g, glossary: '결과물' },
	{ id: 'export', avoid: /결정 반출/g, glossary: '결정 기록' },
	{ id: 'integration-test', avoid: /(배선|연결) ?시험/g, glossary: '연동 테스트' },
	{ id: 'test', avoid: /(?<!(배선|연결) ?)(?<![가-힣])시험(?!적)/g, glossary: '테스트' },
	{ id: 'mask', avoid: /개인 ?정보 ?(가리|가린|가렸|가려|가림)/g, glossary: '마스킹' },
	{ id: 'hide', avoid: /(?<!개인 ?정보 )(?<!우열을 )(?<![가-힣])(가리(?![킵킨킬키켰켜]|지 않|지 말)|가린|가렸|가려(?![내낸냈낼냅고면는서야던])|가림)/g, glossary: '숨기다' },
	{ id: 'remove', avoid: /걷어 ?(내|낸|냈)|걷었/g, glossary: '제거하다' },
	{ id: 'list', avoid: /(?<![가-힣])대장(?!간|균|암|장)/g, glossary: '목록' },
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
	t.decided = g.decided;
	t.evidence = g.evidence ?? '';
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

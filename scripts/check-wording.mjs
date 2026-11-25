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
	{ id: 'field', avoid: /(입력|산출|반출|통과 ?체크|계약)[의 ]* ?칸|(?<![가-힣]|한 )칸(?! ?\d| ?=)(?=[이은을의도에]|마다|\s|$|[)»,.])|빈칸/g, glossary: '항목 · 필드' },
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
	// 사용자 결정 2026-11-24(T-002932) — 내부 말. 관용구(한 걸음 더 · 첫걸음 · 발걸음 · 걸음마 / 사람 손 없이 · 손을 타다 · 손이 가다 · 손으로)는 걸지 않는다 · 원천 말뭉치 오탐 0
	{ id: 'step', avoid: /(?<!(한|첫|발|큰|작은|뒷|잰|빠른|느린|두|세) ?)걸음(?!마|걸이)/g, glossary: '단계' },
	{ id: 'human-hand', avoid: /사람 ?손(?= ?\d|입니|이었|인지|인(?![가-힣])|은(?![가-힣])| 가운데)/g, glossary: '사람이 맡음' },
	// 사용자 결정 2026-11-25(adoption-guide 3e48b88 · 5a3229e · 369915f · T-003251 · T-003291) — 글 한 편에만 들어가고 검사에 없어 다음 글이 같은 말을 다시 썼다(T-003314). 뜻이 갈리는 말(길 · 틀 · 값 · 신호 · 자리 · 계기 · 한 장)은 그 뜻의 꼴만 잡는다
	{ id: 'measure', avoid: /(?<![가-힣])(재(고|서|기|면|려|야|어|는|지)(?![가-힣])|잰다|잰(?![가-힣])|잴(?= 수)|쟀|잽니)/g, glossary: '파악 · 분석' },
	{ id: 'frame', avoid: /(?<![가-힣])틀(?! 수)(?= ?[과와은는이을를의로에만도]|\s|$|[)·,.])|틀과 값|(팀|원본|자기|저장소)의? 값(?=[으이을은만]|\s|$)|채운 값|값으로 채|값을 (거르|걸러|걷|빼)|새는 값|값이 (유출|새[어었]|샌)/g, glossary: '구조 · 규칙 문서' },
	{ id: 'done-signal', avoid: /됐다는 신호/g, glossary: '완료 기준' },
	{ id: 'loop', avoid: /(?<!연결 ?)(?<![가-힣])고리/g, glossary: '새 버전을 받는 절차' },
	{ id: 'path', avoid: /(되는|오는|가는|퍼지는|받는|있는|지난|두|새|같은|다른|그|한|틀린) 길(?![가-힣])|길이 (하나|여러|둘)|(?<![가-힣])길(마다|은|을|로|에서|도)(?![가-힣])|첫 일이 다릅니다/g, glossary: '도입 유형 · 머지 경로' },
	{ id: 'sheet', avoid: /문면|(?<!(문서|구조) )(?<![가-힣])한 장(?![가-힣])/g, glossary: '정리 문서' },
	{ id: 'cheap', avoid: /(?<!비)쌉니다|(?<![가-힣])싸(다|고|게|서)(?![가-힣])/g, glossary: '비용이 적다' },
	{ id: 'wiring', avoid: /배선(?! ?시험)/g, glossary: '구성' },
	{ id: 'occasion', avoid: /계기가 (있을|있으면|생기|생길|생겼)/g, glossary: '필요가 생길 때' },
	{ id: 'hardened', avoid: /(?<![가-힣])굳(은|어|었)/g, glossary: '안정된' },
	{ id: 'patch-up', avoid: /메우|메웠|메운/g, glossary: '보완하다' },
	{ id: 'others', avoid: /(?<![가-힣])남의/g, glossary: '다른 팀의 · 다른' },
	{ id: 'enforce', avoid: /집행 ?수단|집행할 수단/g, glossary: '자동 검사' },
	{ id: 'pair-test', avoid: /짝 ?테스트/g, glossary: '위반 검출 테스트' },
	{ id: 'finish', avoid: /완주|첫 ?바퀴/g, glossary: '완료' },
	{ id: 'promulgate', avoid: /공포(하|했|한|된|합)|\d ?공포|수령|\d ?위임/g, glossary: '배포 · 수신 · 요청' },
	{ id: 'seat', avoid: /(\d+|열|한|두|세|네|다섯) 자리(?=[(\s])|(어느|들어갈|반영할|담당|관리 쪽|세션) 자리/g, glossary: '위치 · 담당 세션 · 개' },
	// 사용자 결정 2026-11-25(team-harness-propagation 바꿀 말 표 · T-003314)
	{ id: 'copy', avoid: /팀용 사본|원본[^.]{0,30}사본|사본[^.]{0,30}원본/g, glossary: '팀용 템플릿' }, // 상태 복사 뜻의 «사본»(아키텍처 글)은 잡지 않는다 — 원본과 짝일 때만
	{ id: 'ladder', avoid: /사다리|관리 쪽 단|(?<![가-힣])단(?=을|이 |마다| 하나)|한 단(?![가-힣])/g, glossary: '도입 단계 · 구축 단계' },
	{ id: 'filter-out', avoid: /(값|내용|원본)[을를에서 ]{0,4}걸러 ?(내|낸|냈|낼)|걸러 ?낸 (사본|템플릿)|거르기|(?<![가-힣])거른/g, glossary: '빼다 · 필터링' },
	{ id: 'build-up', avoid: /(?<!줄 ?)(?<![가-힣])(세우|세운|세웠|세워(?!진|져)|세울)/g, glossary: '만들다 · 구성하다' },
	{ id: 'sit-role', avoid: /역할을 앉/g, glossary: '맡다' },
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

// AI 티 — humanize-korean 분류(ai-tell-taxonomy · 85 패턴)를 이 저장소 글 22 편에 돌려 오탐 30 % 이하만 들였다(2026-11-23 · 서브에이전트 실측).
// 실측 결론: 이 글들은 상투구(결산어 · 과장 · 은유)에는 거의 0 건이고, AI 같은 느낌은 «반복 · 세기 · 종결 구조» 에서 온다.
// 0 건 줄은 새 초안에 상투구가 들어올 때 잡는 안전망이다. 문맥이 필요한 것(재진술 · 대비 대구 · 은유 관통 · 리듬)은 blog-wording 스킬의 사람 점검 목록.
// 넣지 않은 것(오탐 > 30 %): A-3 · A-6 · G-1 · I-1 · C-11 연결어미 쉼표 · 낱말 반복 · 문두 반복 · 제목 되풀이 · 재진술.
const AI_TELL = [
	// 사용자 결정(2026-11-23) — «경계의 형태는 둘입니다» 처럼 세어서 끝나는 문장 → «~는 아래와 같습니다». «다음과 · 아래와 같습니다» 는 이 저장소에서 잡지 않는다.
	{ id: 'ai-count', avoid: /[가-힣]+(은|는|이|가) ?((두|세|네|다섯|여섯) ?(가지|단계|축|종류|형태)|둘|셋|넷|하나)(입니다|이다|이며)[.:]?(?=\s|$)/g, use: '«~는 아래와 같습니다» + 목록 · 또는 세는 말 삭제(사용자 결정)' },
	{ id: 'ai-D8', avoid: /(필요한|중요한|가장 중요한|더 중요한|핵심적인) 것은/g, use: '주어 · 서술 직결(«X 가 중요합니다»)' },
	{ id: 'ai-A22', avoid: /(은|는|이|가) ?(명확|분명)(하다|합니다|하며|하고|해졌|하지만)/g, use: '평가 술어를 빼고 명제를 단언' },
	{ id: 'ai-A21', avoid: /단순(한|히)[^.]{0,20}(을|를) 넘어/g, use: '«X만이 아니라 Y»' },
	// 안전망(지금 0 건)
	{ id: 'ai-D1', avoid: /결론적으로|요약하면|종합하면|정리하자면|라고 (할|볼) 수 있/g, use: '결산어 빼기' },
	{ id: 'ai-D2', avoid: /시사하는 바|주목할 만|간과할 수 없|무시할 수 없|의미심장|매우 중요/g, use: '삭제 또는 구체 결론' },
	{ id: 'ai-D3', avoid: /크게 (두|세|네) ?가지로/g, use: '도입구를 빼고 바로 본론' },
	{ id: 'ai-D4', avoid: /혁신적|획기적|전례 없|압도적|막강|폭발적|파격적|대대적/g, use: '과장어 빼고 수치 · 사실로' },
	{ id: 'ai-D5', avoid: /(기술|시대|데이터|현실|AI|시스템|숫자)(이|가) (묻|부르|말해|속삭|증명|가르쳐)/g, use: '사람 · 기관 주어로' },
	{ id: 'ai-D6', avoid: /(할|갈|해야 할) (때|시점|순간)(입니다|이다)/g, use: '구체 동사로 단언' },
	{ id: 'ai-D7', avoid: /에서 [^.,]{1,14}(으)?로 ?(의 )?(진화|전환|도약)/g, use: '직접 단언' },
	{ id: 'ai-D9', avoid: /(으)?로 이어집니다|에 직결/g, use: '인과 경로를 구체로' },
	{ id: 'ai-D10', avoid: /(하는|인|된|한) 이유입니다/g, use: '순방향(«그래서 ~다»)' },
	{ id: 'ai-D11', avoid: /^(향후|앞으로|중장기적으로) /g, use: '시간어 빼거나 실제 시점으로' },
	{ id: 'ai-D12', avoid: /(과제|한계|아쉬운 점)(도|가) (남아|분명|있)/g, use: '문패 빼고 실제 과제부터' },
	{ id: 'ai-D14', avoid: /(진단|경고|분석|통계|현실|숫자)(은|는|이|가) (서늘|아프|차갑|뜨겁|묵직|섬뜩)|잠식|청사진|적신호|경고등|신호탄|움켜쥐|뿌리내리|짓누르/g, use: '명제로(«잠식한다» → «점유율을 뺏는다»)' },
	{ id: 'ai-A8', avoid: /되어진|지게 된/g, use: '단일 피동 · 능동' },
	{ id: 'ai-A19', avoid: /(에서|에로|으로|에의|으로부터|로부터)의\s/g, use: '절로 풀기' },
	{ id: 'ai-A23', avoid: /(발판|토대|초석|주춧돌)(을|를) ?(마련|놓|다지)|(지평|활로)(을|를) 열/g, use: '구체 행위로' },
	{ id: 'ai-A24', avoid: /더 ?이상[^.!?]{0,25}(않|아니|없|못하|불가)/g, use: '«이제» 또는 변화 동사' },
	{ id: 'ai-B4', avoid: /(라고|로) 알려진|일컬어지는/g, use: '출처를 대거나 빼기' },
	{ id: 'ai-F1', avoid: /(매우|정말|대단히|극히|굉장히)\s/g, use: '강조 부사 빼기' },
	{ id: 'ai-G2', avoid: /가능성이 있을 수 있|보여질 수/g, use: '완곡 하나만' },
	{ id: 'ai-H4', avoid: /(^|[.!?]\s)(즉|다시 말해|바꿔 말하면)[,\s]/g, use: '앞 문장을 고쳐 재진술 없애기' },
	{ id: 'ai-I7', avoid: /(다는|라는) (분석|평가|관측)(입니다|이다)/g, use: '출처를 대거나 직접 서술' },
	{ id: 'ai-C6', avoid: /^(이 (절|섹션|장)에서는|아래에서는)/g, use: '도입 빼고 바로 본론' },
	{ id: 'ai-B2', avoid: /\b(seamless|seamlessly|robust|leverage)\b/gi, use: '한국어로 풀기(표준 기술 용어는 그대로)' },
];
// 글에 몰렸을 때만 — 한 글에서 max 를 넘으면 한 번 알린다
const AI_DENSE = [
	// 사용자 결정(2026-11-23) — «두 가지 · 둘 · 세 단계 · 첫째» 같은 세는 말이 겹치면 같은 뜻이 되풀이돼 피로하다. 개수는 표 · 목록이 보여 주게.
	{ id: 'ai-count-dense', avoid: /(두|세|네|다섯|여섯|일곱|여덟) ?(가지|단계|축|종류|유형|층|개의)|(?<![가-힣])(둘|셋|넷|하나)(입니다|이다|이며|이고|뿐)|첫째|둘째|셋째/g, max: 5, use: '세는 말 글당 5 회 이하(사용자 결정)' },
	{ id: 'ai-cat-word', avoid: /형태|종류|유형/g, max: 3, use: '분류어 글당 3 회 이하 — «꼴 · 방식 · 이름» 으로 바꾸거나 문장째 빼기(사용자 결정)' },
	{ id: 'ai-I23', avoid: /(다는|라는) (점|것|뜻)(입니다|이다)\./g, max: 3, use: '«~다» 로 직접 맺기(글당 3 회 이하)' },
];
// 문장 단위 — 종결 부류 5 연속(문단 안) · «N입니다. N 은…» 연쇄
const endClass = (sn) => /했습니다$|였습니다$|었습니다$|았습니다$/.test(sn) ? 'past' : /있습니다$/.test(sn) ? 'has' : /입니다$/.test(sn) ? 'is' : /니다$/.test(sn) ? 'pres' : 'other';

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
	const dense = {};
	const para = [];
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
		const inQuote = (at) => /«[^»]*$/.test(line.slice(0, at)) || /^\s*>/.test(raw);
		for (const t of AI_TELL) for (const m of line.matchAll(t.avoid)) if (!inQuote(m.index)) out.push(`  ${n}  [${t.id}] «${m[0].trim()}» → ${t.use}`);
		for (const t of AI_DENSE) for (const m of line.matchAll(t.avoid)) if (!inQuote(m.index)) (dense[t.id] ??= []).push(n);
		// 문단 문장 흐름(본문 줄만) — 종결 부류 5 연속 · «N입니다. N 은…» 연쇄
		if (/^\s*(>|\||#|[-*] |\d+\. |!\[|<)/.test(raw) || !raw.trim()) { para.length = 0; } else {
			for (const sn0 of line.replace(/«[^»]*»/g, '«»').split(/(?<=[.!?])\s+/)) {
				const sn = sn0.trim().replace(/[.!?]$/, ''); if (!sn) continue;
				const prev = para[para.length - 1];
				const m = prev && prev.text.match(/([가-힣A-Za-z]+)입니다$/);
				if (m && m[1].length >= 2 && sn.startsWith(m[1])) out.push(`  ${n}  [ai-chain] «…${m[1]}입니다. ${m[1]}…» → 앞 문장에 합치기`);
				para.push({ text: sn, cls: endClass(sn) });
				const last5 = para.slice(-5);
				if (last5.length === 5 && last5.every((x) => x.cls === last5[0].cls && x.cls !== 'other') && !para.flagged) { out.push(`  ${n}  [ai-E2] 같은 종결(${last5[0].cls}) 5 문장 연속 → 한 문장을 합치거나 종결 바꾸기`); para.flagged = true; }
			}
		}
		// 규칙형 «~한다»: 같은 줄에 «~니다» 문장이 있는데 «~한다.» 로 끝나는 문장이 섞인 경우
		const prose = !/^\s*(>|\||#|[-*] |\d+\. )/.test(raw);
		if (prose && /니다[.!?]/.test(line)) {
			for (const s of line.replace(/«[^»]*»/g, '«»').split(/(?<=[.!?])\s+/)) {
				if (PLAIN_END.test(s.trim()) && !/니다/.test(s)) out.push(`  ${n}  [plain-rule] «${s.trim().slice(-30)}» — 설명 문장 속 규칙형 «~한다»`);
			}
		}
	});
	for (const t of AI_DENSE) { const at = dense[t.id] ?? []; if (at.length > t.max) out.push(`  ${at[0]}  [${t.id}] 글에 ${at.length}회(줄 ${at.slice(0, 6).join(' · ')}${at.length > 6 ? ' …' : ''}) → ${t.use}`); }
	if (out.length) {
		console.log(`${relative(ROOT, file)} — ${out.length}건`);
		console.log(out.join('\n'));
		total += out.length;
	}
}

// 그림 글자 — 글 폴더의 svg(title · desc · text)와, 그 폴더로 그림을 쓰는 scripts/make-charts.mjs 구간의 문자열도 용어(TERMS)로 본다.
// 까닭(T-003332 · 2026-11-25): svg 만 손으로 고치고 생성 코드에 옛 말이 남아, 다시 그리면 옛 말이 돌아올 뻔했다. 그림 글은 평서체라 말투 · AI 티 검사는 하지 않는다.
const slugs = new Set(files.map(slugOf));
const termHits = (s) => TERMS.flatMap((t) => [...s.matchAll(t.avoid)].filter((m) => !inAliasParen(t, s, m.index)).map((m) => `[${t.id}] «${m[0]}» → ${t.use}`));
const figOut = new Map();
const pushFig = (slug, line) => { if (!slugs.has(slug)) return; (figOut.get(slug) ?? figOut.set(slug, []).get(slug)).push(line); };
for (const f of walk(BLOG).filter((p) => p.endsWith('.svg'))) {
	const slug = relative(BLOG, f).split('/')[0];
	const txt = [...readFileSync(f, 'utf8').matchAll(/<(title|desc|text)\b[^>]*>([^<]*)</g)].map((m) => m[2]).join(' \n ');
	for (const h of termHits(txt)) pushFig(slug, `  ${relative(join(BLOG, slug), f)}  ${h}`);
}
{
	// 줄마다 글 폴더를 정한다: 구간(«// ── » 머리)마다 `const dir = '…/<slug>/'` 가 있으면 그 글, 없으면 그 줄 뒤에 처음 나오는 out('…/<slug>/…') 의 글
	const CHARTS = join(ROOT, 'scripts/make-charts.mjs');
	const lines = readFileSync(CHARTS, 'utf8').split('\n');
	const pathAt = lines.map((l) => l.match(/src\/content\/blog\/([^/'"]+)\//)?.[1] ?? null);
	const nextPath = [];
	for (let i = lines.length - 1, nxt = null; i >= 0; i--) { if (pathAt[i]) nxt = pathAt[i]; if (/^\/\/ ── /.test(lines[i])) nxt = null; nextPath[i] = nxt; }
	let dirSlug = null;
	lines.forEach((raw, i) => {
		if (/^\/\/ ── /.test(raw)) dirSlug = null;
		const d = raw.match(/const dir = 'src\/content\/blog\/([^/']+)\//);
		if (d) dirSlug = d[1];
		const cur = dirSlug ?? nextPath[i];
		if (!cur || /^\s*\/\//.test(raw)) return;
		const lits = [...raw.matchAll(/'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`]*)`/g)].map((m) => m[1] ?? m[2]).filter((x) => /[가-힣]/.test(x)).join(' \n ');
		for (const h of termHits(lits)) pushFig(cur, `  scripts/make-charts.mjs:${i + 1}  ${h}`);
	});
}
for (const [slug, lines] of figOut) {
	console.log(`${slug} 그림 — ${lines.length}건`);
	console.log(lines.join('\n'));
	total += lines.length;
}
console.log(`\ncheck-wording: 글 ${files.length}편 · 경고 ${total}건 (고칠지는 문맥을 보고 정한다 — blog-wording 스킬)`);
// --strict: 글 레인 게이트(R-BLOG-WORDING) — 경고가 하나라도 있으면 실패
if (args.includes('--strict') && total > 0) process.exit(1);

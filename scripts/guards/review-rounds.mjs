#!/usr/bin/env node
// 문장 검수 세 회차 가드(WORKFLOW 칸 2-1 «문장 검수 세 회차» · ADR-0007) — 글 본문에 줄을 더하거나 바꾼 착지에 검수 표지 여섯이 차례로 있는지 본다.
//   표지: 커밋 제목 «… 검수 <1|2|3>/3 <용어|사람답게> — 고친 문장 <n>» · 메시지에 그 글 slug(여러 글이면 본문 줄에 나열).
//         «문장» 은 «사람답게» 로 친다(이 가드 앞에 돌던 레인의 꼴). 고친 문장 수는 감독 대조 칸이 본다.
//   차례: 1 용어 → 1 사람답게 → 2 용어 → 2 사람답게 → 3 용어 → 3 사람답게 · 작성 시각이 늘어난다.
//         잇따른 같은 표지는 하나로 본다(한 회차를 커밋 둘로 나눔).
//   대상 아님: 본문에 더한 줄 0(frontmatter 만 · 줄 빼기만) · slug 마다 꼬리 줄 «Review-Skip: <slug> <까닭>».
//   발행(새로 공개): 그 글의 전체 이력에 여섯 표지가 있거나, 발행 착지 안에 Review-Skip 이 있어야 한다.
// 쓰임: review-rounds.mjs [<범위 A..B> [<저장소>]] — 기본 HEAD^1..HEAD(localci 머지 직후).
// exit 0 = 갖춤 또는 해당 없음 · 1 = 표지 없음 · 차례 어긋남 · 2 = 범위를 못 읽음 / 커밋 0
import { execFileSync } from 'node:child_process';

const range = process.argv[2] ?? 'HEAD^1..HEAD';
const repo = process.argv[3] ?? new URL('../..', import.meta.url).pathname;
const git = (...a) => execFileSync('git', ['-C', decodeURI(repo), '-c', 'core.quotepath=false', ...a], { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] });
const stop = (rc, msg) => { console.log(`review-rounds: ${msg}`); process.exit(rc); };
const [from, to] = range.split('..');

const WANT = [1, 2, 3].flatMap((n) => [`${n} 용어`, `${n} 사람답게`]);
const log = (rev) => git('log', '--no-merges', '--reverse', '--topo-order', '--format=%at%x1f%B%x1e', rev)
  .split('\x1e').map((s) => s.trim()).filter(Boolean)
  .map((s) => { const [at, msg] = s.split('\x1f'); return { at: Number(at), msg }; });
const names = (msg, slug) => new RegExp(`(^|[^a-z0-9-])${slug}($|[^a-z0-9-])`, 'm').test(msg);
const skipOf = (commits, slug) => commits.flatMap((c) => c.msg.split('\n')).find((l) => new RegExp(`^Review-Skip: ${slug}\\s+\\S`).test(l));

/** 그 글의 표지를 차례대로 — 마지막 여섯이 WANT 이고 시각이 늘면 '' · 아니면 어긋난 까닭 */
function check(commits, slug) {
  const marks = [];
  for (const c of commits) {
    const m = c.msg.split('\n')[0].match(/검수 ([123])\/3 (용어|사람답게|문장)/);
    if (!m || !names(c.msg, slug)) continue;
    const key = `${m[1]} ${m[2] === '용어' ? '용어' : '사람답게'}`;
    if (marks.at(-1)?.key === key) marks.at(-1).at = c.at;
    else marks.push({ key, at: c.at });
  }
  const last = marks.slice(-6);
  if (last.map((m) => m.key).join('|') !== WANT.join('|')) return `표지 ${marks.length} — ${marks.map((m) => m.key).join(' → ') || '없음'}`;
  if (last.some((m, i) => i && m.at <= last[i - 1].at)) return '표지 시각이 늘어나지 않음';
  return '';
}

let commits, changed;
try {
  if (!from || !to) throw new Error();
  commits = log(range);
  changed = git('diff', '--name-only', '--diff-filter=d', from, to, '--', 'src/content/blog').split('\n');
} catch { stop(2, `범위 못 읽음 (${range})`); }
if (!commits.length) stop(2, `범위 안 커밋 0 (${range})`);

const read = (rev, f) => { try { return git('show', `${rev}:${f}`); } catch { return null; } };
const split = (s) => { const m = (s ?? '').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); return m ? { fm: m[1], body: m[2] } : { fm: '', body: s ?? '' }; };
const draft = (fm) => /^draft:\s*true/m.test(fm);

const slugs = changed.map((f) => f.match(/^src\/content\/blog\/([^/]+)\/index\.md$/)?.[1]).filter(Boolean);
let bad = 0, seen = 0;
for (const slug of slugs) {
  const f = `src/content/blog/${slug}/index.md`;
  const beforeRaw = read(from, f);
  const before = split(beforeRaw), after = split(read(to, f));
  const left = new Map();
  for (const l of before.body.split('\n')) left.set(l, (left.get(l) ?? 0) + 1);
  const added = after.body.split('\n').filter((l) => { const k = left.get(l) ?? 0; if (k) left.set(l, k - 1); return !k && l.trim(); }).length;
  const publishing = !draft(after.fm) && (beforeRaw === null || draft(before.fm));
  if (!added && !publishing) { console.log(`review-rounds: ${slug} 해당 없음(본문에 더한 줄 0)`); continue; }
  seen++;
  const skip = skipOf(commits, slug);
  if (skip) { console.log(`review-rounds: ${slug} 건너뜀 — ${skip}`); continue; }
  const why = publishing ? check(log(to), slug) : check(commits, slug);
  if (!why) { console.log(`review-rounds: ${slug} 세 회차 여섯 표지 갖춤`); continue; }
  bad++;
  console.log(`review-rounds: ${slug} ${publishing ? '발행' : `본문 더한 줄 ${added}`} · ${why}`);
}
if (bad) stop(1, `${bad} 편이 문장 검수 세 회차를 갖추지 못함 — 용어 → 사람답게를 차례로 세 번 돌고 커밋 제목에 «검수 n/3 용어 — 고친 문장 n» · «검수 n/3 사람답게 — 고친 문장 n» (0 이면 --allow-empty). 정정 · 사실 빼기 · 받은 문서라면 커밋 꼬리 줄 «Review-Skip: <slug> <까닭>»`);
stop(0, seen ? `글 ${seen} 편 통과` : '본문을 더한 글 0');

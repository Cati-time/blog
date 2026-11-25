---
name: blog-humanize
description: >-
  Cati time Tech Blog(이 저장소)의 글에서 **AI 같은 느낌**을 걷어내는 스킬 — 서브에이전트에게 글을 나눠 맡겨 고치고, 본체가
  판정해 착지한다. 두 갈래: ① 고치기 — `check:wording` 의 `[ai-…]` 와 사용자 결정(세어서 끝나는 문장 · 세는 말 · 분류어 되풀이)에
  걸린 문장만 꼴을 바꾼다(숫자 · 사실 · 인용 · 서법은 그대로) ② 배우기 — `humanize-korean` 같은 다른 스킬 · 분류에서 새 패턴을
  뽑아 이 저장소 글 전체에 돌려 오탐 30 % 이하만 검사에 들인다. "AI 같아", "AI 티 빼줘", "글이 기계 같아", "발행한 글도 고쳐줘",
  "다른 스킬에서 배워 와", "/blog-humanize" 같은 말이나 초안 마무리(WORKFLOW 칸 2 · 6 관문)에서 실행한다. 용어 바꾸기는 `blog-wording`,
  문맥 윤문 전체는 `humanize-korean`.
---

# blog-humanize — AI 같은 느낌 걷어내기 (서브에이전트로)

> **규범은 헌법이 갖는다** — `docs/constitution/RULES.md` R-BLOG-WORDING(AI 티 · 사용자 결정) · R-BLOG-FACTS · R-BLOG-QUOTES · WORKFLOW 칸 4(역할 — 글을 바꾸는 손은 실행 등급 = 서브에이전트 · 판정은 본체). 이 스킬은 절차다 — 어긋나면 헌법이 이긴다.

| 무엇 | 정본 |
| --- | --- |
| 잡는 목록 | `scripts/check-wording.mjs` 의 `AI_TELL` · `AI_DENSE` · 문장 흐름 검사(`[ai-E2]` · `[ai-chain]`) |
| 사람 점검 목록 · 사용자 결정 | `.claude/skills/blog-wording/SKILL.md` §AI 티 |
| 배울 원천 | `im-not-ai/skills/humanize-korean/references/`(ai-tell-taxonomy · diagnosis-rules · rewriting-playbook) · `im-not-ai/skills/humanize-scan/` |

## 약속

1. **꼴만 바꾼다.** 숫자 · 사실 · 이름 · 링크 · 코드 · 표 데이터 · frontmatter · 인용(«…» · `>` 줄 · `<!-- wording-ok -->`)은 그대로. «~할 수 있다» · «봅니다» 같은 유보의 강도도 그대로. 새 주장 · 새 내용을 넣지 않는다.
2. **글을 바꾸는 손은 서브에이전트, 판정은 본체.** 본체는 바뀐 줄을 읽고 검사를 다시 돌려 받아들이거나 돌려보낸다.
3. **사용자 결정이 먼저다.** 지금 둘(2026-11-23): ① 세어서 끝나는 문장(«경계의 형태는 둘입니다») → «~는 아래와 같습니다» ② 세는 말 · 분류어(두 가지 · 둘 · 형태 · 종류)가 겹치면 피로하다 → 개수는 표 · 목록이 보여 주게. «다음과 · 아래와 같습니다» 는 이 저장소에서 AI 티가 아니다. ③(2026-11-24 · T-002932) 겪은 일을 말하는 절의 처방형 종결(«~재기 어려우면 ~세면 됩니다») → **까닭 → 결과**(«~재기 어려워, ~세게 되었습니다»). 읽는 사람에게 시키는 말이 아니라 우리가 겪은 차례로 쓴다. 방법 · 쓰는 법 절의 «~하면 됩니다» 는 그대로 둘 수 있다 — 정규식으로 잡지 않고 사람이 읽어 본다(`blog-wording` §사람이 읽어 보는 것).

## ① 고치기

1. **가지** — 레인 가지 하나(`edit/<slug>` · 여러 글이면 `edit/ai-tell-<날짜>`)를 통합선 착지분에서 딴다. 서브에이전트는 이 가지에서 일하고 가지를 바꾸지 않는다.
2. **대상 고르기** — 글마다 `node scripts/check-wording.mjs <slug>` 를 돌려 걸린 글 · 건수를 표로 만든다. 발행한 글을 고칠지는 사용자에게 한 번 묻는다(사용자가 이미 말했으면 그대로).
3. **묶기** — 글 2 ~ 5 편씩 묶음 하나 = 서브에이전트 하나. 시리즈는 한 묶음에(같은 낱말을 맞추게). 묶음은 서로 다른 파일만 만지므로 나란히 돌린다(동시 넷 안팎). **한 글 안에서는 차례로** — 문장 검수 세 회차(WORKFLOW 칸 2-1)에서는 그 회차의 용어 커밋 뒤에 시작하고, 회차마다 앞 회차 지적을 모르는 새 서브에이전트에 맡긴다(앞 회차에 SendMessage 로 잇지 않는다 · 같은 회차 안에서 돌려보낼 때만 잇는다). 새 눈은 걸린 줄만이 아니라 글 전체를 처음부터 읽고 §사람이 읽어 보는 것까지 본다.
4. **맡기기** — 아래 «지시서» 를 묶음마다 보낸다(백그라운드).
5. **판정(본체)** — 회신이 오면:
   - `git diff --stat` 으로 맡긴 파일만 바뀌었나.
   - 글마다 `node scripts/check-wording.mjs <slug> --strict` rc 0 · `node scripts/check-seo.mjs <slug>`(초안은 `--strict`) 새 오류 0.
   - 숫자 · 인용 보존 대조: `git diff -U0 -- <파일> | grep -E '^[-+]' | grep -oE '[0-9][0-9,.]*' | sort | uniq -c` 로 지운 줄 · 넣은 줄의 숫자 수가 같은지 · «…» 안이 같은지.
   - 바뀐 줄을 읽고 뜻이 바뀐 줄 · 새 내용 · 유보가 단정이 된 줄은 그 묶음에 돌려보낸다(SendMessage).
6. **착지** — `npm run build` → 커밋(`edit:` · 메시지에 «글 n 편 · 바뀐 문장 n · 검사 전 → 후» 집계 · 문장 검수 회차면 제목에 «<slug> 검수 <n>/3 사람답게 — 고친 문장 <수>» · 0 이면 `--allow-empty`) → 로컬 CI → 통합선. 사용자에게는 글마다 «전 → 후» 표본 몇 줄을 보여 준다. 발행한 글은 push 하면 바로 바뀌므로 사용자가 본 뒤 main 머지 · push.

### 지시서 (묶음마다 · 빈칸만 바꿔 쓴다)

```
Reply in Korean. You are an execution-tier editor for a Korean tech blog.
Repo: /Users/catius_macbook_air/Documents/0.dev/2.blog, branch <가지> (already checked out — do NOT switch branches, do NOT commit, do NOT touch any file except the posts assigned to you).
Your posts: <파일 목록> (<초안 · 발행 표시>)
Why: the owner says the posts feel AI-written. His decisions: (1) sentences that end by counting («경계의 형태는 둘입니다») → «~는 아래와 같습니다» + list, or drop the count word; «다음과/아래와 같습니다» is fine. (2) repeating counting/category words in one post («두 가지 · 둘 · 세 단계 · 첫째 · 형태 · 종류 · 유형») causes fatigue — let tables/lists show counts; use count words once or twice per post; replace «형태» with the real name, «꼴», «방식», or drop it. (3) in sections that tell what we went through, a prescriptive ending («~하면 됩니다») becomes reason → result («~어려워, ~하게 되었습니다»); how-to sections may keep it. <새 사용자 결정이 있으면 여기에> <문장 검수 회차면: read the whole post from the top with fresh eyes and also fix what «사람이 읽어 보는 것» lists, within the same rules — 앞 회차 지적은 넣지 않는다>
Read first: .claude/skills/blog-wording/SKILL.md (§AI 티 · 사람이 읽어 보는 것) and docs/constitution/RULES.md R-BLOG-WORDING · R-BLOG-FACTS · R-BLOG-QUOTES.
Steps per post: 1) run `node scripts/check-wording.mjs <slug>`, note every flagged line. 2) rewrite only those sentences (plus nearby sentences repeating the same count/category word); keep 합니다체; change form only — never change numbers, facts, names, links, code, frontmatter, table data, text inside «…», lines with <!-- wording-ok -->, lines starting with '>'; keep hedging exactly as strong; no new claims or content; don't delete facts. 3) re-run `node scripts/check-wording.mjs <slug> --strict` until rc 0; check-seo must not get new errors. 4) don't run npm run build.
Report (under 60 lines): per post flagged count before → after, and «줄 | 전 | 후» for every changed sentence. Mention what you chose not to change and why.
```

## ② 배우기 — 다른 스킬에서 새 패턴 들이기

1. **맡기기(서브에이전트 하나 · 읽기만)** — 원천(위 표)을 전부 읽고, 지금 `AI_TELL` · `AI_DENSE` 에 없는 패턴마다 «(a) 글자 그대로 · (b) 글에 몰렸을 때 · (c) 문맥이 필요함» 으로 가르고 (a) · (b) 는 정규식 · 기준 · 바꿀 꼴을 낸다. 사용자 결정(예: «같은 뜻 되풀이 = 피로»)을 더 넓은 검출기로 일반화해 본다.
2. **실측** — 후보마다 이 저장소 글 전체(`src/content/blog/*/index.md` · frontmatter · 코드 · `>` 줄 · «…» 제외)에 돌려 «적중 · 걸린 글 수 · 표본 3 개의 참 · 거짓» 을 낸다. 스크립트는 스크래치에.
3. **고르기(본체)** — **오탐 30 % 이하만** 들인다. 0 건 줄은 «안전망» 으로 들여도 된다(새 초안에 들어올 때 잡음). 30 % 넘는 것 · 문맥이 필요한 것은 `blog-wording` 의 «사람이 읽어 보는 것» 목록으로.
4. **반영** — `scripts/check-wording.mjs` 에 줄마다 출처(taxonomy id · 사용자 결정 날짜)를 주석으로 · `blog-wording` 스킬 §AI 티 표 · 넣지 않은 것과 까닭 · 필요하면 `RULES.md` R-BLOG-WORDING 뜻(헌법이면 `AMENDMENT.md` 절차).
5. **확인** — 전 글에 다시 돌려 걸린 글 · 건수를 사용자에게 보이고 ① 고치기로 간다.

- 지난 회차(2026-11-23): 85 패턴 중 상투구는 이 저장소에 거의 0 건 · AI 같은 느낌은 «반복 · 세기 · 종결 구조» 에서 왔다. 낱말 반복 · 문두 반복 · 제목 되풀이 · 재진술 · 연결어미 쉼표는 오탐이 커서 뺐다(개발 글은 용어 반복이 정상).

## 하지 않는 일

- 본체가 글을 직접 대량으로 고치기(판정만 한다)
- 사용자 확인 없이 발행한 글을 main 에 올리기
- 검사를 통과시키려고 뜻을 바꾸거나 `<!-- wording-ok -->` 를 새로 붙이기(사람이 한 말 인용일 때만)

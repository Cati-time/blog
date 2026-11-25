# 헌법 변경 색인 — blog

| 날짜 | 변경 | ADR |
| --- | --- | --- |
| 2026-11-23 | 헌법 도입 — canon 0.44.0 · web-kind 0.1.0 첫 설치(분모 전수 69 행) · RULES · WORKFLOW · AMENDMENT · CHANGELOG · ADR 틀 · 글 규칙 12 · 루트 플로우 «글 한 편» · 로컬 CI | [ADR-0001](../adr/constitution/ADR-0001-constitution-install.md) |
| 2026-11-23 | 설치 감수 ① 막음 닫기 — WORKFLOW 칸 2 · 11 · 13(13-1 CI 회차 · 문서 판별 좁힘 + 짝 가드) · 15 · RULES 간극 행 둘 · `scripts/` 수 14 | [ADR-0002](../adr/workflow/ADR-0002-install-audit-fixes.md) |
| 2026-11-24 | 설치 감수 ② 막지 않는 정정 — RULES §1-2 폴더 목록 셈 명령 · §3 시험 줄 · R-BLOG-BASE-URL 뿌리 `/` · WORKFLOW 칸 6 가지 처분 · 칸 18 설치 끝 · 감독 §9 · §10 · 분모 표 §3 기록 표지 · ADR-0001 상태 | [ADR-0003](../adr/constitution/ADR-0003-install-audit2-corrections.md) |
| 2026-11-24 | 둘째 회차 — 분모 표 B4 원장 줄 «있다» · R-BLOG-BASE-URL `srcset` · 중괄호 빈칸(법제처 T-002761 ⚪ 둘) | [ADR-0003](../adr/constitution/ADR-0003-install-audit2-corrections.md) |
| 2026-11-24 | 발행 때 새 글로 들어오는 링크 잇기 — WORKFLOW 칸 2-1 단계 6 · 7(정지점 하나) · 칸 5 글 발행 · RULES R-BLOG-SEO 뜻 · 집행(리뷰 · 셈 명령) · 스킬 blog-seo · blog-compose 가리킴 | [ADR-0004](../adr/workflow/ADR-0004-inbound-links-on-publish.md) |
| 2026-11-24 | 정정 — ADR-0003 · 0004 상태 «채택»(법제처 T-002849 · T-002888) · R-BLOG-SEO 들어오는 링크 셈 명령이 출처 초안을 빼게(T-002888 정정) · 감독 §10 점호 주기 · 깨우는 수단 값(canon 기본 · 감독 원장과 같게 · T-002911) | [ADR-0003](../adr/constitution/ADR-0003-install-audit2-corrections.md) · [ADR-0004](../adr/workflow/ADR-0004-inbound-links-on-publish.md) |
| 2026-11-25 | 사용자 용어 결정 등록 집행 — R-BLOG-WORDING 등록 한 줄(스킬을 가리킴 · 미루기 금지 · `Glossary-Skip`) · 가드 `wording-decision.sh`(localci 두 길 · 짝 시험 6) · WORKFLOW 칸 5 · 16 · 감독 §4-2 ③ 대조 칸(용어 등록 커밋 · 스킬 호출) · 스킬 blog-wording 절차 4 · 5 · `scripts/` 수 15 | [ADR-0005](../adr/workflow/ADR-0005-wording-decision-registration.md) |
| 2026-11-25 | 사이트 핵심 키워드(하네스 · AI 에이전트 · 자동화) — R-BLOG-SEO 조항 · 정본 `site.config.mjs` `SITE_KEYWORDS` · 사이트 머리 meta · JSON-LD keywords · about · llms 핵심 주제 · `check:seo` 글 기준(경고 · strict 실패) · 사이트 오류 · localci 발행 점검 회차마다 · 스킬 blog-seo · 용어집 «공통 규칙 쪽(하네스 · harness)» · 기준선 실패 발행 17 · 초안 3 | [ADR-0006](../adr/constitution/ADR-0006-site-keywords.md) |

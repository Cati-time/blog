import { SITE, GISCUS, SEO, ANALYTICS, SITE_KEYWORDS } from '../site.config.mjs';

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.description;
export { SITE, GISCUS, SEO, ANALYTICS, SITE_KEYWORDS };

/** 글에 드러난 사이트 핵심 키워드(R-BLOG-SEO) — 제목 · 설명 · 본문 어디든 한글 꼴이 있으면 든다 */
export const keywordsIn = (text: string) => SITE_KEYWORDS.filter((k) => k.match.some((m) => text.includes(m)));

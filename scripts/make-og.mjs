#!/usr/bin/env node
/**
 * 공유 미리보기 기본 이미지(public/og-default.png, 1200×630)를 만든다.
 *   node scripts/make-og.mjs
 * 색은 디자인 토큰 tokens.css 의 값과 같다 (--p-green-700 · --p-gray-900 · --p-gray-50 · --p-gray-500).
 * 생성물(PNG)을 커밋하므로 배포 때 다시 만들 필요는 없다.
 * 브랜드 아이콘은 탭 아이콘과 같은 public/brand-icon.png(회사 사이트 아이콘, 32×32)를 «Tech Blog» 표지 앞에 얹는다.
 */
import sharp from 'sharp';
import { SITE, CATEGORIES, PLATFORMS } from '../site.config.mjs';

const C = { accent: '#047857', text: '#111318', bg: '#ffffff', subtle: '#f8f9fa', muted: '#4b5563', soft: '#ecfdf5' };
const cats = CATEGORIES.map((c) => c.label).join('  ·  ');
const plats = PLATFORMS.map((p) => p.label).join('  ·  ');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect x="0" y="0" width="1200" height="12" fill="${C.accent}"/>
  <rect x="132" y="96" width="220" height="44" rx="22" fill="${C.soft}"/>
  <text x="242" y="126" text-anchor="middle" font-family="Menlo, monospace" font-size="22" fill="${C.accent}">Tech Blog</text>
  <text x="72" y="270" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="88" font-weight="700" fill="${C.text}">${esc(SITE.title)}</text>
  <text x="72" y="350" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="38" font-weight="600" fill="${C.accent}">${esc(cats)}</text>
  <text x="72" y="410" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" fill="${C.muted}">${esc(plats)}</text>
  <rect x="0" y="520" width="1200" height="110" fill="${C.subtle}"/>
  <text x="72" y="585" font-family="Menlo, monospace" font-size="26" fill="${C.muted}">${esc(SITE.url.replace(/^https?:\/\//, '') + SITE.base)}</text>
</svg>`;

const icon = await sharp('public/brand-icon.png').resize(48, 48, { kernel: 'lanczos3' }).png().toBuffer();
await sharp(Buffer.from(svg))
	.composite([{ input: icon, left: 72, top: 94 }])
	.png()
	.toFile('public/og-default.png');
console.log('✔ public/og-default.png (1200×630)');

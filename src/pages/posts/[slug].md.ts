import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, type Post } from '../../lib/posts';
import { postMarkdown } from '../../lib/llms';

// 글 원문 마크다운 — /posts/<slug>.md (사람 화면은 /posts/<slug>/)
export const getStaticPaths: GetStaticPaths = async () =>
	(await getPosts()).filter((p) => !p.data.draft).map((post) => ({ params: { slug: post.id }, props: { post } }));

export const GET: APIRoute = ({ props }) =>
	new Response(postMarkdown((props as { post: Post }).post), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });

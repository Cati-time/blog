import { getPosts } from '../lib/posts';
import { llmsIndex } from '../lib/llms';

// AI 에이전트용 목차(llms.txt 관례) — 글마다 원문 마크다운 주소를 건다
export async function GET() {
	const posts = (await getPosts()).filter((p) => !p.data.draft);
	return new Response(llmsIndex(posts), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

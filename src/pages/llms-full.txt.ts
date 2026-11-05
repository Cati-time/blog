import { getPosts } from '../lib/posts';
import { llmsIndex, postMarkdown } from '../lib/llms';

// 목차 + 모든 글 본문을 한 파일로
export async function GET() {
	const posts = (await getPosts()).filter((p) => !p.data.draft);
	const text = [llmsIndex(posts), ...posts.map((p) => `\n---\n\n${postMarkdown(p)}`)].join('\n');
	return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

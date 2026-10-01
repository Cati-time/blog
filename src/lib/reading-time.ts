import getReadingTime from 'reading-time';

/** 마크다운 본문으로 예상 읽기 시간을 "N분" 으로 반환. 한글은 글자 수 기준으로 보정합니다. */
export function readingTime(body: string | undefined): string {
	if (!body) return '1분';
	const text = body
		.replace(/```[\s\S]*?```/g, ' ') // 코드 블록 제외
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
		.replace(/[#>*_`~\-|]/g, ' ');
	// 한글은 글자 수(분당 500자), 나머지(영문·숫자)는 단어 수(분당 200단어)로 센다 — 한글을 두 번 세지 않는다
	const hangul = (text.match(/[가-힣]/g) || []).length;
	const rest = getReadingTime(text.replace(/[가-힣]+/g, ' '), { wordsPerMinute: 200 });
	const minutes = Math.max(1, Math.round(rest.minutes + hangul / 500));
	return `${minutes}분`;
}

import getReadingTime from 'reading-time';

/** 마크다운 본문으로 예상 읽기 시간을 "N분" 으로 반환. 한글은 글자 수 기준으로 보정합니다. */
export function readingTime(body: string | undefined): string {
	if (!body) return '1분';
	const text = body
		.replace(/```[\s\S]*?```/g, ' ') // 코드 블록 제외
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
		.replace(/[#>*_`~\-|]/g, ' ');
	const hangul = (text.match(/[가-힣]/g) || []).length;
	const rt = getReadingTime(text, { wordsPerMinute: 200 });
	const minutes = Math.max(1, Math.round(rt.minutes + hangul / 500));
	return `${minutes}분`;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

export function getWordCount(content: string): number {
  return content.trim().split(/\s+/).length;
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "< 1 min read";
  return `${minutes} min read`;
}
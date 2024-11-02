import dayjs from "dayjs";

export function formatPublishedAt(publishedAt: string, format?: string): string {
  const published = dayjs(publishedAt);
  if (format) return replaceWeekdaysToKorean(published.format(format));

  const now = dayjs();
  const diffMinutes = now.diff(published, "minute");
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = now.diff(published, "hour");
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = now.diff(published, "day");
  if (diffDays < 30) return `${diffDays}일 전`;

  const diffMonths = now.diff(published, "month");
  if (diffMonths < 12) return `${diffMonths}개월 전`;

  const diffYears = now.diff(published, "year");
  return `${diffYears}년 전`;
}

export function formatRelativeDate(publishedAt: string, format?: string): string {
  const published = dayjs(publishedAt);
  if (format) return replaceWeekdaysToKorean(published.format(format));

  const now = dayjs();
  const diffDays = now.diff(published, "day");

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";

  const formattedDate = published.format("MM/DD(ddd)");
  const koreanWeekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekdayIndex = published.day();

  return formattedDate.replace(/\([a-zA-Z]+\)/, `(${koreanWeekdays[weekdayIndex]})`);
}

export function formatViewCount(viewCount: string, milestone: boolean = false): string {
  const count = parseInt(viewCount, 10);
  if (milestone) {
    if (count >= 500000000) return "5억 돌파";
    if (count >= 100000000) return "1억 돌파";
    if (count >= 50000000) return "5천만 돌파";
    if (count >= 10000000) return "1천만 돌파";
    if (count >= 5000000) return "500만 돌파";
    if (count >= 4000000) return "400만 돌파";
    if (count >= 3000000) return "300만 돌파";
    if (count >= 2000000) return "200만 돌파";
    if (count >= 1000000) return "100만 돌파";
    if (count >= 500000) return "50만 돌파";
    if (count >= 100000) return "10만 돌파";
    if (count >= 50000) return "5만 돌파";
    if (count >= 10000) return "1만 돌파";
    if (count >= 5000) return "5천 돌파";
    if (count >= 1000) return "1천 돌파";
  }

  if (count >= 100000000) return `${Math.floor(count / 100000000).toLocaleString()}억회`;
  if (count >= 10000) return `${Math.floor(count / 10000).toLocaleString()}만회`;
  if (count >= 1000) return `${Math.floor(count / 1000).toLocaleString()}천회`;
  return `${count.toLocaleString()}회`;
}

export function formatDuration(duration: string): string {
  const { hours, minutes, seconds } = formatDurationJson(duration);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

export function formatDurationJson(duration: string): any {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match?.[1] ?? "0") || 0;
  const minutes = parseInt(match?.[2] ?? "0") || 0;
  const seconds = parseInt(match?.[3] ?? "0") || 0;
  return { hours, minutes, seconds };
}

export function formatDuration2sec(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match?.[1] ?? "0") || 0;
  const minutes = parseInt(match?.[2] ?? "0") || 0;
  const seconds = parseInt(match?.[3] ?? "0") || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

export function formatSeconds(seconds: number) {
  seconds = Math.round(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (num: number) => String(num).padStart(2, "0");
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  } else {
    return `${pad(minutes)}:${pad(secs)}`;
  }
}

export function formatCount(num: number): string {
  return num.toLocaleString();
}

export function truncateString(str: string, maxLength: number = 20): string {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}

function replaceWeekdaysToKorean(text: string): string {
  const weekdayMap: { [key: string]: string } = {
    sun: "일",
    mon: "월",
    tue: "화",
    wed: "수",
    thu: "목",
    fri: "금",
    sat: "토",
  };
  return text.replace(/\b(sun|mon|tue|wed|thu|fri|sat)(?:day)?\b/gi, (match) => {
    const key = match.slice(0, 3).toLowerCase();
    return weekdayMap[key] || match;
  });
}

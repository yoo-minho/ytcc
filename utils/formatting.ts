import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export function formatPublishedAt(publishedAt: string): string {
  const now = dayjs();
  const published = dayjs(publishedAt);

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

export function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount, 10);
  if (count >= 10000) {
    return `${Math.floor(count / 10000)}만회`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}천회`;
  }
  return `${count}회`;
}

export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match?.[1] ?? "0") || 0;
  const minutes = parseInt(match?.[2] ?? "0") || 0;
  const seconds = parseInt(match?.[3] ?? "0") || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

export function formatSeconds(seconds: number) {
  seconds = Math.round(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (num: number) => String(num).padStart(2, "0");
  // 시간 값이 0인 경우 생략하고 분:초만 반환
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  } else {
    return `${pad(minutes)}:${pad(secs)}`;
  }
}

export function formatCount(num: number): string {
  return num.toLocaleString();
}

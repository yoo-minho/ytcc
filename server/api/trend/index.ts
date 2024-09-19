import { youtube } from "@/server/lib/youtubeDataApi";
import { TrendingVideoType } from "@/types/comm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export default defineEventHandler(async (event) => {
  return await getTrendingVideos();
});

async function getTrendingVideos(regionCode = "KR", maxResults = 20) {
  try {
    const response = await youtube.videos.list({
      part: ["snippet", "statistics", "contentDetails"],
      chart: "mostPopular",
      regionCode: regionCode,
      maxResults: maxResults,
    });
    const videos = response.data.items;
    if (!videos) {
      throw new Error("동영상 데이터를 가져오는데 실패했습니다.");
    }
    const channelIds = videos
      .map((video) => video.snippet?.channelId)
      .filter((id): id is string => !!id);
    const channelResponse = await youtube.channels.list({
      part: ["snippet"],
      id: channelIds,
    });

    const channelMap = new Map(
      channelResponse.data.items?.map((channel) => [
        channel.id,
        channel.snippet,
      ]) || []
    );

    return videos.map(
      (video): TrendingVideoType => ({
        id: video.id || "",
        title: video.snippet?.title || "",
        channelTitle: video.snippet?.channelTitle || "",
        channelThumbnail:
          channelMap.get(video.snippet?.channelId || "")?.thumbnails?.default
            ?.url || "",
        thumbnail:
          video.snippet?.thumbnails?.maxres?.url ||
          video.snippet?.thumbnails?.medium?.url ||
          "",
        viewCount: formatViewCount(video.statistics?.viewCount || ""),
        commentCount: formatViewCount(video.statistics?.commentCount || ""),
        publishedAt: formatPublishedAt(video.snippet?.publishedAt || ""),
        duration: formatDuration(video.contentDetails?.duration || ""),
        video: video,
      })
    );
  } catch (error) {
    console.error("인기 급상승 동영상을 가져오는 중 오류 발생:", error);
    throw error;
  }
}

function formatPublishedAt(publishedAt: string): string {
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

function formatViewCount(viewCount: string): string {
  const count = parseInt(viewCount, 10);
  if (count >= 10000) {
    return `${Math.floor(count / 10000)}만회`;
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}천회`;
  }
  return `${count}회`;
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match?.[1] ?? "0") || 0;
  const minutes = parseInt(match?.[2] ?? "0") || 0;
  const seconds = parseInt(match?.[3] ?? "0") || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

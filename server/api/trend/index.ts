import { youtube } from "@/server/utils/youtube";
import { TrendingVideoType } from "@/types/comm";
import { formatDuration, formatPublishedAt, formatViewCount } from "@/utils/formatting";

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
    const channelIds = videos.map((video) => video.snippet?.channelId).filter((id): id is string => !!id);
    const channelResponse = await youtube.channels.list({
      part: ["snippet"],
      id: channelIds,
    });

    const channelMap = new Map(channelResponse.data.items?.map((channel) => [channel.id, channel.snippet]) || []);

    return videos.map(
      (video): TrendingVideoType => ({
        id: video.id || "",
        title: video.snippet?.title || "",
        channelTitle: video.snippet?.channelTitle || "",
        channelThumbnail: channelMap.get(video.snippet?.channelId || "")?.thumbnails?.default?.url || "",
        thumbnail: video.snippet?.thumbnails?.maxres?.url || video.snippet?.thumbnails?.medium?.url || "",
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

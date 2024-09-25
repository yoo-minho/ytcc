import { youtube } from "@/server/utils/youtube";
import { YOUTUBE_CATEGORY_MAP, YouTubeCategory } from "~/constants/youtube";
import { formatDuration, formatPublishedAt, formatViewCount } from "~/utils/formatting";

export default defineEventHandler(async (event) => {
  const { categoryId, maxResults = "4" } = getQuery(event);
  const maxResultsNum = parseInt(maxResults as string);
  return await fetchVideos(categoryId as string, maxResultsNum);
});

async function fetchVideos(categoryId: string, maxResults: number) {
  let videos = [];
  let nextPageToken = "";

  let i = 0;
  while (videos.length < maxResults) {
    i++;
    const response = await youtube.search.list({
      part: ["id"],
      type: ["video"],
      videoCategoryId: categoryId,
      order: "date",
      maxResults: 50,
      regionCode: "KR",
      relevanceLanguage: "ko",
      safeSearch: "none",
      pageToken: nextPageToken,
    });
    const videoIds = response.data.items?.map((item) => item.id?.videoId || "").filter(Boolean) || [];
    const videoDetails = await youtube.videos.list({ part: ["contentDetails", "statistics"], id: videoIds });
    const filteredVideos =
      videoDetails.data.items?.filter((video) => {
        const duration = parseDuration(video.contentDetails?.duration || "");
        const commentCount = parseInt(video.statistics?.commentCount || "0");
        return duration >= 60 && commentCount >= 1000;
      }) || [];

    const filteredVideoIds = filteredVideos.map((v: any) => v.id);

    if (filteredVideoIds.length > 0) {
      const videoDetails2 = await youtube.videos.list({
        part: ["snippet"],
        id: filteredVideoIds,
      });
      const videoDetailItems = videoDetails2.data.items || [];
      const channelIds = videoDetailItems.map(({ snippet }) => snippet?.channelId || "").filter(Boolean);
      const channels = await getChannelDetails(channelIds);
      if (!channels) {
        throw new Error("채널 데이터를 가져오는데 실패했습니다.");
      }

      const channelMap = new Map(channels.map(({ id, snippet }) => [id, snippet]));
      const _videos = videoDetailItems.map((video) => {
        const { id, snippet } = video;

        const { title, channelTitle, channelId, thumbnails, publishedAt, categoryId } = snippet || {};

        const { statistics, contentDetails } = filteredVideos.find((v) => v.id === id) || {};
        const { viewCount, commentCount } = statistics || {};
        const { duration } = contentDetails || {};

        const v = {
          id: id || "",
          title: title || "",
          channelTitle: channelTitle || "",
          channelId: channelId || "",
          thumbnail: thumbnails?.maxres?.url || thumbnails?.medium?.url || "",
          viewCount: viewCount || "",
          commentCount: commentCount || "",
          publishedAt: publishedAt || "",
          duration: duration || "",
          categoryId: categoryId || "",
        };

        return {
          id: v.id,
          title: v.title,
          channelTitle: v.channelTitle,
          channelThumbnail: channelMap.get(v.channelId)?.thumbnails?.default?.url || "",
          channelCountry: channelMap.get(v.channelId)?.country || "",
          thumbnail: v.thumbnail,
          viewCount: formatViewCount(v.viewCount),
          commentCount: formatViewCount(v.commentCount),
          publishedAt: formatPublishedAt(v.publishedAt),
          duration: formatDuration(v.duration),
          categoryId: v.categoryId,
          categoryName: YOUTUBE_CATEGORY_MAP[v.categoryId as YouTubeCategory] || "알 수 없음",
        };
      });

      videos.push(..._videos);
    }

    nextPageToken = response.data.nextPageToken || "";
    if (!nextPageToken) break;
  }

  console.log(`cycle ${i}`);

  return videos.slice(0, maxResults);
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match?.[1] ?? "0") || 0;
  const minutes = parseInt(match?.[2] ?? "0") || 0;
  const seconds = parseInt(match?.[3] ?? "0") || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

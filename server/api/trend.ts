import { formatYoutubeVideo } from "@/server/utils/youtube-formatting";

export default defineEventHandler(async (event) => {
  const { regionCode = "KR", maxResults = "50" } = getQuery(event);

  const videos = await getTrendingVideos(String(regionCode), Number(maxResults));
  if (!videos) throw new Error("동영상 데이터를 가져오는데 실패했습니다.");

  const channelIds = [...new Set(videos.map(({ snippet }) => snippet?.channelId || ""))];
  const channels = await getChannelDetails(channelIds);
  if (!channels) throw new Error("채널 데이터를 가져오는데 실패했습니다.");

  return videos.map((video) => formatYoutubeVideo(video, channels)).filter((video) => video.channelCountry === "KR");
});

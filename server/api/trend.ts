import { formatYoutubeVideo } from "@/server/utils/youtube-formatting";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const maxVideos = parseInt(query.max as string) || 100;
  const allVideos = await getAllVideos(maxVideos);
  return allVideos;
});

async function getAllVideos(maxVideos: number) {
  let allVideos = [] as any[];
  let nextPageToken;

  while (allVideos.length < maxVideos) {
    const { videos, pageToken } = await getVideos(nextPageToken);
    allVideos = [...allVideos, ...videos];
    nextPageToken = pageToken;

    if (!nextPageToken) break;
  }

  return allVideos.slice(0, maxVideos);
}

async function getVideos(nextPageToken?: string) {
  const { videos, pageToken } = await getTrendingVideos(nextPageToken);
  if (!videos) throw new Error("동영상 데이터를 가져오는데 실패했습니다.");

  const channelIds = [...new Set(videos.map(({ snippet }) => snippet?.channelId || ""))];
  const channels = await getChannelDetails(channelIds);
  if (!channels) throw new Error("채널 데이터를 가져오는데 실패했습니다.");

  return {
    pageToken,
    videos: videos.map((video) => formatYoutubeVideo(video, channels)).filter((video) => video.channelCountry === "KR"),
  };
}

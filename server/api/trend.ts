import { formatYoutubeVideo } from "@/server/utils/youtube-formatting";
import { RegionCode } from "~/types/comm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const max = parseInt(query.max as string) || 100;
  const region = (query.region as RegionCode) || "KR";
  const allVideos = await getAllVideos(region, max);
  return allVideos;
});

async function getAllVideos(regionCode: RegionCode, max: number) {
  let allVideos = [] as any[];
  let nextPageToken;

  while (allVideos.length < max) {
    const { videos, pageToken } = await getVideos(regionCode, nextPageToken);
    allVideos = [...allVideos, ...videos];
    nextPageToken = pageToken;

    if (!nextPageToken) break;
  }

  return allVideos.slice(0, max);
}

async function getVideos(regionCode: RegionCode, nextPageToken?: string) {
  const { videos, pageToken } = await getTrendingVideos(regionCode, nextPageToken);
  if (!videos) throw new Error("동영상 데이터를 가져오는데 실패했습니다.");

  const channelIds = [...new Set(videos.map(({ snippet }) => snippet?.channelId || ""))];
  const channels = await getChannelDetails(channelIds);
  if (!channels) throw new Error("채널 데이터를 가져오는데 실패했습니다.");

  const _videos = videos.map((video) => formatYoutubeVideo(video, channels));
  // .filter((video) => video.channelCountry === "KR");

  return {
    pageToken,
    videos: _videos,
  };
}

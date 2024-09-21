import { youtube } from "@/server/utils/youtube";
import { TrendingVideoType } from "@/types/comm";
import { formatDuration, formatPublishedAt, formatViewCount } from "@/utils/formatting";

// 카테고리 ID와 이름을 매핑하는 객체
const categoryMap: { [key: string]: string } = {
  "1": "영화 및 애니메이션",
  "2": "자동차 및 차량",
  "10": "음악",
  "15": "애완동물 및 동물",
  "17": "스포츠",
  "19": "여행 및 이벤트",
  "20": "게임",
  "22": "블로그",
  "23": "코미디",
  "24": "엔터테인먼트",
  "25": "뉴스 및 정치",
  "26": "노하우 및 스타일",
  "27": "교육",
  "28": "과학 및 기술",
  "29": "비영리 및 사회운동",
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const categoryId = query.categoryId as string | undefined;
  const regionCode = (query.regionCode as string) || "KR";
  const maxResults = parseInt(query.maxResults as string) || 50;

  return await getTrendingVideos(regionCode, maxResults, categoryId);
});

async function getTrendingVideos(regionCode = "KR", maxResults = 50, categoryId?: string) {
  try {
    const params: any = {
      part: ["snippet", "statistics", "contentDetails"],
      chart: "mostPopular",
      regionCode: regionCode,
      maxResults: maxResults,
    };

    if (categoryId) {
      params.videoCategoryId = categoryId;
    }

    const response = await youtube.videos.list(params);

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
        categoryId: video.snippet?.categoryId || "",
        categoryName: categoryMap[video.snippet?.categoryId || ""] || "알 수 없음",
      })
    );
  } catch (error) {
    console.error("인기 급상승 동영상을 가져오는 중 오류 발생:", error);
    throw error;
  }
}

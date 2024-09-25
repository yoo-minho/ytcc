import { youtube2, oauth2Client } from "@/server/utils/youtube";

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, "youtube_access_token");

  if (!accessToken) {
    return sendError(event, createError({ statusCode: 401, statusMessage: "인증되지 않음" }));
  }

  try {
    oauth2Client.setCredentials({ access_token: accessToken });

    // 구독 채널 목록 가져오기
    const subscriptionsResponse = await youtube2.subscriptions.list({
      part: ["snippet"],
      mine: true,
      maxResults: 50,
    });

    const channelIds = subscriptionsResponse.data.items?.map((item) => item.snippet?.resourceId?.channelId) || [];

    // 각 채널의 인기 동영상 가져오기
    const popularVideosPromises = channelIds.map((channelId) =>
      youtube2.search.list({
        part: ["snippet"],
        channelId: channelId,
        order: "viewCount",
        type: "video",
        maxResults: 5, // 각 채널당 상위 5개 동영상
      })
    );

    const popularVideosResponses = await Promise.all(popularVideosPromises);

    // 모든 인기 동영상을 하나의 배열로 합치기
    const allPopularVideos = popularVideosResponses.flatMap((response) => response.data.items || []);

    // 조회수 순으로 정렬 (선택사항)
    allPopularVideos.sort((a, b) => {
      const viewsA = parseInt(a.statistics?.viewCount || "0");
      const viewsB = parseInt(b.statistics?.viewCount || "0");
      return viewsB - viewsA;
    });

    // 상위 50개만 반환 (선택사항)
    return allPopularVideos.slice(0, 50);
  } catch (error) {
    console.error("인기 동영상 가져오기 실패:", error);
    if (error instanceof Error) {
      console.error("에러 메시지:", error.message);
    }
    return sendError(event, createError({ statusCode: 500, statusMessage: "인기 동영상을 가져오는데 실패했습니다" }));
  }
});

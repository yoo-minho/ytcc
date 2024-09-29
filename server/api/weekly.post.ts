import { getPlaylistsInfo } from "@/server/utils/youtube";
import { formatYoutubePlayList } from "@/server/utils/youtube-formatting";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const playlistIds = body.playlistIds as string[];

  if (!playlistIds || playlistIds.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "재생목록 ID가 제공되지 않았습니다.",
    });
  }

  try {
    const playlistsInfo = await getPlaylistsInfo(playlistIds);
    return playlistsInfo?.map(formatYoutubePlayList);
  } catch (error) {
    console.error("재생목록 정보 조회 중 오류 발생:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "재생목록 정보를 가져오는데 실패했습니다.",
    });
  }
});

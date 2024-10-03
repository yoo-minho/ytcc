import { formatYoutubePlayListItem } from "@/server/utils/youtube-formatting";
import { getVideosByIds } from "@/server/utils/youtube";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { listId } = body;

  const playlistItems = await getPlayListItemsById(listId);
  if (!playlistItems) throw new Error("동영상 데이터를 가져오는데 실패했습니다. (1)");

  const formattedPlaylistItems = playlistItems
    .filter((item) => item.snippet?.title !== "Private video")
    .map((item) => formatYoutubePlayListItem(item));

  const videos = await getVideosByIds(formattedPlaylistItems.map((v) => v.id));
  if (!videos) throw new Error("동영상 데이터를 가져오는데 실패했습니다. (2)");

  const formattedVideos = videos.map((v) => formatYoutubeVideo(v));

  const mergedItems = formattedPlaylistItems
    .map((fv) => ({
      ...formattedVideos.find((v) => v.id === fv.id),
      ...fv,
    }))
    .filter((v) => v.durationSec > 60)
    .toSorted((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return mergedItems;
});

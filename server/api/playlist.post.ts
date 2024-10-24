import { formatYoutubePlayListItem } from "@/server/utils/youtube-formatting";
import { getVideosByIds } from "@/server/utils/youtube";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { listId } = body;

  let allItems: any[] = [];
  let nextToken = "";

  while (allItems.length < 100) {
    const { items, nextPageToken } = await fetchPlaylistDataById(listId, nextToken);

    if (!items) break;

    const formattedPlaylistItems = items
      .filter((item) => item.snippet?.title !== "Private video")
      .map((item) => formatYoutubePlayListItem(item));

    const videos = await getVideosByIds(formattedPlaylistItems.map((v) => v.id));

    if (!videos) break;

    const formattedVideos = videos.map((v) => formatYoutubeVideo(v));

    const mergedItems = formattedPlaylistItems
      .map((fv) => ({
        ...formattedVideos.find((v) => v.id === fv.id),
        ...fv,
      }))
      .filter((v) => v.durationSec > 60);

    allItems = [...allItems, ...mergedItems];

    if (!nextPageToken) break;

    nextToken = nextPageToken;
  }

  return allItems.toSorted((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
});

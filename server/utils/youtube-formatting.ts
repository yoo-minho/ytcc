import { TrendingVideoType } from "@/types/comm";
import { YOUTUBE_CATEGORY_MAP, YouTubeCategory } from "@/constants/youtube";
import { formatDuration, formatDuration2sec, formatPublishedAt } from "@/utils/formatting";
import { youtube_v3 } from "googleapis";

export const getChannelDetailByChannels = (channels: youtube_v3.Schema$Channel[], channelId: string) => {
  return channels.find((channel) => channel.id === channelId)?.snippet || {};
  // return channels.find((channel) => channel.id === channelId)?.snippet?.thumbnails?.default?.url || "";
};

export const formatYoutubeVideo = (
  video: youtube_v3.Schema$Video,
  channels?: youtube_v3.Schema$Channel[]
): TrendingVideoType => {
  const { id, snippet, statistics, contentDetails } = video;
  const { title, channelTitle, channelId, thumbnails, publishedAt, categoryId } = snippet || {};
  const { viewCount, commentCount } = statistics || {};
  const { duration } = contentDetails || {};
  const v = {
    id: id || "",
    title: title || "",
    channelTitle: channelTitle || "",
    channelId: channelId || "",
    thumbnail: thumbnails?.medium?.url || "",
    publishedAt: publishedAt || "",
    viewCount: viewCount || "",
    commentCount: commentCount || "",
    duration: duration || "",
    categoryId: categoryId || "",
  };

  let channel = {} as youtube_v3.Schema$ChannelSnippet;
  if (channels && channelId) {
    channel = getChannelDetailByChannels(channels, channelId);
  }

  return {
    id: v.id,
    title: v.title,
    channelTitle: v.channelTitle,
    channelThumbnail: channel.thumbnails?.default?.url || "",
    channelCountry: channel.country || "",
    thumbnail: v.thumbnail,
    categoryId: v.categoryId,
    viewCount: v.viewCount,
    commentCount: v.commentCount,
    publishedAt: formatPublishedAt(v.publishedAt),
    duration: formatDuration(v.duration),
    durationSec: formatDuration2sec(v.duration),
    categoryName: YOUTUBE_CATEGORY_MAP[v.categoryId as YouTubeCategory] || "알 수 없음",
  };
};

export const formatYoutubePlayListItem = (playlistItem: youtube_v3.Schema$PlaylistItem): any => {
  const { id, snippet, contentDetails } = playlistItem;
  const { title, thumbnails, publishedAt } = snippet || {};

  const v = {
    videoId: contentDetails?.videoId,
    title: title || "",
    thumbnail: thumbnails?.maxres?.url || thumbnails?.medium?.url || "",
    publishedAt: publishedAt || "",
  };
  return {
    id: v.videoId,
    title: v.title,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt ? formatPublishedAt(v.publishedAt, "YYYY-MM-DD (ddd)") : "",
    snippet,
  };
};

export const formatYoutubePlayList = (playlistItem: youtube_v3.Schema$Playlist): any => {
  const { id, snippet } = playlistItem;
  const { title, description, thumbnails, channelTitle, publishedAt } = snippet || {};

  const v = {
    playlistId: id,
    title: title || "",
    description: description || "",
    channelTitle: channelTitle,
    thumbnail: thumbnails?.medium?.url || "",
    publishedAt: publishedAt || "",
    snippet,
  };
  return {
    ...v,
    publishedAt: v.publishedAt ? formatPublishedAt(v.publishedAt, "YYYY-MM-DD (ddd) HH:mm") : "",
  };
};

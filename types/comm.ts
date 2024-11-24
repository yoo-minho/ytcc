export type RegionCode = "KR" | "US" | "JP" | "GB" | "FR" | "DE" | "IN" | "BR" | "CA" | "AU";
export type CommentType = {
  sec: number;
  comment: string;
  likeCount: number;
};
export type VideoInfoType = {
  videoTitle: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
};
export type TimelineCommentWrapType = {
  videoInfo?: VideoInfoType | null;
  method: string;
  totalFetchedCount: number;
  commentCount: number;
  comments: TimelineCommentType[];
};
export type TimelineCommentType = {
  time: string;
  sec: number;
  totalLikeCount: number;
  comments: { comment: string; likeCount: number }[];
  videoId?: string;
  videoTitle?: string;
};
export type TrendingVideoType = {
  id: string;
  title: string;
  channelTitle: string;
  channelThumbnail: string;
  channelCountry: string;
  thumbnail: string;
  viewCount: string;
  commentCount: string;
  publishedAt: string;
  duration: string;
  durationSec: number;
  categoryId: string;
  categoryName: string;
};
export type PlaylistType = {
  channelTitle: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  playlistId: string;
  cycle?: string;
  actor?: string;
};

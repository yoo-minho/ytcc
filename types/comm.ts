export type CommentType = {
  sec: number;
  comment: string;
  likeCount: number;
};
export type TimelineCommentWrapType = {
  channelTitle: string;
  videoTitle: string;
  thumbnail: string;
  channelThumbnail: string;
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

export type CommentType = {
  sec: number;
  comment: string;
  likeCount: number;
};
export type TimelineCommentWrapType = {
  comments: TimelineCommentType[];
  channelTitle: string;
  thumbnail: string;
  title: string;
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

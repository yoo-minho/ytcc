export type CommentType = { sec: number; comment: string; likeCount: number };
export type TimelineCommentType = {
  sec: number;
  totalLikeCount: number;
  comments: { comment: string; likeCount: number }[];
};
export type TrendingVideoType = {
  id: string;
  title: string;
  channelTitle: string;
  channelThumbnail: string;
  thumbnail: string;
  viewCount: string;
  commentCount: string;
  publishedAt: string;
  duration: string;
  categoryId: string;
  categoryName: string;
};

export type CommentType = { sec: number; comment: string; likeCount: number };
export type TimelineCommentType = {
  sec: number;
  totalLikeCount: number;
  comments: { comment: string; likeCount: number }[];
};

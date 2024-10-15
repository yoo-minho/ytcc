import { youtube } from "@/server/utils/youtube";
import { formatDuration, formatDuration2sec } from "@/utils/formatting";
import { CommentType, TimelineCommentType } from "@/types/comm";

export default defineEventHandler(async (event) => {
  const videoId = getRouterParam(event, "videoId");
  if (videoId === undefined) {
    throw "터져라!";
  }

  const response = await youtube.videos.list({
    part: ["snippet", "contentDetails"],
    id: [videoId],
  });

  const videoDuration = response.data?.items?.[0]?.contentDetails?.duration;
  if (!videoDuration) {
    throw new Error("비디오 길이를 가져오는데 실패했습니다.");
  }

  console.log("formatDuration(videoDuration)", formatDuration(videoDuration));

  const maxHour = +formatDuration(videoDuration).split(":")[0];
  const timeStrings = generateTimeStrings(maxHour);
  const commentPromises = timeStrings.map((timeString) => fetchCommentsForTimeString(videoId, timeString));
  const results = await Promise.all(commentPromises);
  const items = removeDuplicateComments(results.flatMap((result) => result.items))
    .map((item) => parseComments(item))
    .flat();
  const _items = comments2TimelineComments(items)
    .filter((c) => c.sec < formatDuration2sec(videoDuration) - 5) //최대 재생시간 이하로 뽑히는
    .map((c) => ({ ...c, totalLikeCount: c.totalLikeCount }));

  return {
    channelTitle: response.data?.items?.[0]?.snippet?.channelTitle,
    comments: _items.splice(0, 20),
  };
});

async function fetchCommentsForTimeString(videoId: string, timeString: string) {
  let items: any[] = [];
  let totalCount = 0;
  let nextPageToken = "";

  while (true) {
    const res = await commentThreads(videoId, nextPageToken, timeString);
    items = [...items, ...res.items];
    totalCount += res.pageInfo.totalResults;
    if (res.nextPageToken === undefined) break;
    nextPageToken = res.nextPageToken;
  }
  return { items, totalCount };
}

async function commentThreads(videoId: string, pageToken = "", searchTerms: string): Promise<any> {
  const response = await youtube.commentThreads.list({
    part: "snippet",
    videoId,
    maxResults: 100, //max 100
    pageToken,
    searchTerms,
    textFormat: "plainText",
  } as any);

  const { items, ...rest } = response.data;

  let comments = (items as any[]).map((item) => ({
    id: item.id,
    author: item.snippet.topLevelComment.snippet.authorDisplayName,
    comment: item.snippet.topLevelComment.snippet.textDisplay,
    publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    likeCount: item.snippet.topLevelComment.snippet.likeCount,
  }));

  comments = comments.filter((item) => item.comment.includes(`:`));

  return {
    ...rest,
    items: comments,
  };
}

function removeDuplicateComments(items: any[]): CommentType[] {
  return [...new Map(items.map((item) => [item.comment, item])).values()];
}

function generateTimeStrings(hour = 60): string[] {
  return Array.from({ length: hour + 1 }, (_, i) => i.toString());
}

function parseComments(item: any): CommentType[] {
  const { comment, likeCount } = item;
  const comments = [];
  // 시간 형식 (00:00 또는 00:00:00)과 내용을 매칭하는 정규식
  const regex = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(.*?)(?=\d{1,2}:\d{2}(?::\d{2})?|$)/g;
  const matchCount = (comment.match(regex) || []).length;

  // 모든 시간 표시와 내용을 추출
  let match;
  while ((match = regex.exec(comment)) !== null) {
    const [, hours, minutes, seconds, content] = match;
    // 초 단위로 시간 변환
    const sec = seconds ? +hours * 3600 + +minutes * 60 + +seconds : +hours * 60 + +minutes;
    if ((content.trim() || "") === "") continue;
    comments.push({
      sec,
      comment: content.trim() || "",
      likeCount: Math.floor(likeCount / matchCount),
    });
  }

  // 시간 역순으로 정렬
  comments.reverse();

  // 빈 댓글 내용을 이전 댓글로 채우기
  let prevComment = "";
  return comments.map((c) => {
    if (!c.comment) c.comment = prevComment;
    else prevComment = c.comment;
    return c;
  });
}

function comments2TimelineComments(comments: CommentType[]) {
  let arr = [] as TimelineCommentType[];
  comments.forEach((comment) => {
    if (arr.find((v) => v.sec === comment.sec)) {
      arr = arr.map((v) => {
        if (v.sec === comment.sec) {
          return {
            sec: comment.sec,
            totalLikeCount: v.totalLikeCount + comment.likeCount,
            comments: [...v.comments, comment].sort((a, b) => b.likeCount - a.likeCount),
          };
        } else {
          return v;
        }
      });
    } else {
      arr.push({
        sec: comment.sec,
        totalLikeCount: comment.likeCount,
        comments: [comment],
      });
    }
  });
  arr = [...arr].sort((a, b) => b.totalLikeCount - a.totalLikeCount);
  return arr;
}

import { youtube } from "@/server/utils/youtube";
import { formatDuration } from "@/utils/formatting";
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

  const maxHour = +formatDuration(videoDuration).split(":")[0];
  const timeStrings = generateTimeStrings(maxHour);
  const commentPromises = timeStrings.map((timeString) => fetchCommentsForTimeString(videoId, timeString));
  const results = await Promise.all(commentPromises);
  const items = removeDuplicateComments(results.flatMap((result) => result.items))
    .map((item) => parseComments(item))
    .flat();
  const _items = comments2TimelineComments(items).map((c) => ({ ...c, totalLikeCount: c.totalLikeCount }));

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
  const comments = (items as any[])
    .map((item) => ({
      id: item.id,
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      comment: item.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
    }))
    .filter((item) => item.comment.includes(`:`))
    .filter((item) => {
      return item.likeCount > 0;
    });

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
  const regex = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(.*?)(?=\d{1,2}:\d{2}(?::\d{2})?|$)/g;

  let matches = comment.match(regex);
  let matchCount = matches ? matches.length : 0;

  let match;
  while ((match = regex.exec(comment)) !== null) {
    const [, hours, minutes, seconds, content] = match;
    let sec;

    if (seconds) {
      // 00:00:00 형태
      sec = +hours * 3600 + +minutes * 60 + +seconds;
    } else {
      // 00:00 형태
      sec = +hours * 60 + +minutes;
    }

    comments.push({
      sec,
      comment: content.trim() || "",
      likeCount: Math.floor(likeCount / matchCount),
    });
  }

  comments.reverse();

  let prevComment = "";
  for (let i = 0; i < comments.length; i++) {
    if (!comments[i].comment) {
      comments[i].comment = prevComment;
    } else {
      prevComment = comments[i].comment;
    }
  }

  return comments;
}

function comments2TimelineComments(comments: CommentType[]) {
  let arr = [] as TimelineCommentType[];
  comments.forEach((comment) => {
    if (comment.likeCount === 0) return;
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

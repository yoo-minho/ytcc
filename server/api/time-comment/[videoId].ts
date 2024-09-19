import { youtube } from "@/server/lib/youtubeDataApi";
import { CommentType, TimelineCommentType } from "~/types/comm";

export default defineEventHandler(async (event) => {
  const videoId = getRouterParam(event, "videoId");
  if (videoId === undefined) {
    throw "터져라!";
  }

  let items: any[] = [];
  let res = { nextPageToken: "", items: [] };
  let totalCount = 0;
  while (true) {
    const _res = await commentThreads(videoId, res.nextPageToken);
    items = [...items, ..._res.items];
    totalCount += _res.pageInfo.totalResults;
    if (_res.nextPageToken === undefined) break;
    // if (totalCount > 100 * 50) break;
    res = _res;
  }

  items = comments2TimelineComments(items);

  return {
    totalCount,
    searchCount: items.length,
    items: items.splice(0, 10),
  };
});

async function commentThreads(videoId: string, pageToken = ""): Promise<any> {
  const response = await youtube.commentThreads.list({
    part: "snippet",
    videoId,
    maxResults: 100, //max 100
    pageToken,
  } as any);

  const { items, ...rest } = response.data;
  const comments = (items as any[])
    .map((item) => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
    }))
    .filter((item) => {
      return item.text.includes(`&amp;t=`);
    })
    .map((item) => {
      return parseComments(item.text, item.likeCount);
    })
    .flat();

  return {
    ...rest,
    items: comments,
  };
}

function parseComments(
  commentString: string,
  likeCount: number
): CommentType[] {
  const regex =
    /<a href="[^"]*t=(\d+)">((\d+):(\d+))<\/a>\s*(.*?)(?=<a href="|$)/g;
  const comments = [];

  let match;
  while ((match = regex.exec(commentString)) !== null) {
    const [x, y, z, minutes, seconds, comment] = match;
    const sec = +minutes * 60 + +seconds;
    const _comment = comment.trim().split("<br>")[0];

    if (_comment) {
      comments.push({
        sec,
        comment: _comment,
        likeCount: likeCount,
      });
    }
  }

  return comments;
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
            comments: [...v.comments, comment].sort(
              (a, b) => b.likeCount - a.likeCount
            ),
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

import { google } from "googleapis";
import { CommentType } from "~/types/comm";

const apiKey = "AIzaSyCbFbmMsVTKyAp6SZ_xtM3yK9y6AazMM1o";
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

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
    res = _res;
  }
  return {
    totalCount,
    searchCount: items.length,
    items: items.sort((a, b) => a.sec - b.sec),
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

import { google } from "googleapis";

const apiKey = "AIzaSyCbFbmMsVTKyAp6SZ_xtM3yK9y6AazMM1o";
const videoId = "https://www.youtube.com/watch?v=sUERlBS2MTU";

const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

export default defineEventHandler(async (event) => {
  // return await commentThreadsOne(videoId);
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
    items: items.sort((a, b) => a.time.localeCompare(b.time)),
  };
});

async function commentThreadsOne(videoId: string): Promise<any> {
  const response = await youtube.commentThreads.list({
    part: "snippet",
    videoId: extractVideoId(videoId),
    maxResults: 1,
  } as any);

  const { items } = response.data;
  return items[0];
}

async function commentThreads(videoId: string, pageToken = ""): Promise<any> {
  const response = await youtube.commentThreads.list({
    part: "snippet",
    videoId: extractVideoId(videoId),
    maxResults: 100,
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

function extractVideoId(url: string) {
  const urlObj = new URL(url);
  if (urlObj.hostname === "youtu.be") {
    return urlObj.pathname.slice(1);
  } else if (urlObj.hostname === "www.youtube.com") {
    return urlObj.searchParams.get("v");
  } else {
    throw new Error("Invalid YouTube URL");
  }
}

function parseComments(commentString: string, likeCount: number) {
  const regex =
    /<a href="[^"]*t=(\d+)">((\d+):(\d+))<\/a>\s*(.*?)(?=<a href="|$)/g;
  const comments = [];

  let match;
  while ((match = regex.exec(commentString)) !== null) {
    const [x, y, z, minutes, seconds, comment] = match;
    const time = `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    const _comment = comment.trim().split("<br>")[0];

    if (_comment) {
      comments.push({
        time: time,
        comment: _comment,
        likeCount: likeCount,
      });
    }
  }

  return comments;
}

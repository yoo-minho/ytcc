import { google } from "googleapis";

const apiKey = "AIzaSyCbFbmMsVTKyAp6SZ_xtM3yK9y6AazMM1o";
const videoId = "https://www.youtube.com/watch?v=sUERlBS2MTU";

export default defineEventHandler(async (event) => {
  const comments = await getComments(videoId);
  return comments;
});

async function getComments(videoId: string) {
  const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
  });

  try {
    const response = await youtube.commentThreads.list({
      part: "snippet",
      videoId: extractVideoId(videoId),
      maxResults: 100,
    });

    const { items, ...rest } = response.data;

    const comments = (items as any[])
      .map((item) => ({
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      }))
      .filter((item) => {
        return item.text.includes(`&amp;t=`);
      })
      .map((item) => {
        return parseComments(item.text);
      })
      .flat()
      .sort((a, b) => a.time.localeCompare(b.time));

    return {
      rest,
      items: comments,
    };
  } catch (error) {
    console.error("Error fetching comments: ", error);
    throw error;
  }
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

function parseComments(commentString: string) {
  // 정규표현식을 사용하여 시간과 댓글 내용을 추출
  const regex =
    /<a href="[^"]*t=(\d+)">((\d+):(\d+))<\/a>\s*(.*?)(?=<a href="|$)/g;
  const comments = [];

  let match;
  while ((match = regex.exec(commentString)) !== null) {
    const [x, y, z, minutes, seconds, comment] = match;
    const time = `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;

    comments.push({
      time: time,
      comment: comment.trim(),
    });
  }

  return comments;
}

import { youtube } from "@/server/utils/youtube";
import { formatDurationJson, formatDuration2sec, formatSeconds } from "@/utils/formatting";
import { CommentType, TimelineCommentType } from "@/types/comm";

// 결과를 실제 파일로 저장
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export default defineEventHandler(async (event) => {
  const videoId = getRouterParam(event, "videoId");
  if (!videoId) throw "비디오 ID가 필요합니다";

  const response = await youtube.videos.list({ part: ["snippet", "contentDetails", "statistics"], id: [videoId] });
  const videoDuration = response.data?.items?.[0]?.contentDetails?.duration || "";
  const commentCount = +(response.data?.items?.[0]?.statistics?.commentCount || 0); //댓글 + 대댓글
  const minCycles = Math.ceil(commentCount / 100);
  const { hours, minutes } = formatDurationJson(videoDuration);
  const maxMin = Math.min(hours * 60 + minutes, 9); //0~9로 search 접근
  const timeStrings = generateTimeStrings(maxMin); //timeStrings.length는 max 10
  const isTimeSearching = timeStrings.length < minCycles;

  const { channelTitle, title, thumbnails, channelId } = response.data?.items?.[0]?.snippet || {};

  // 채널 정보 가져오기
  const channelResponse = await youtube.channels.list({
    part: ["snippet"],
    id: [channelId || ""],
  });
  const channelThumbnail = channelResponse.data?.items?.[0]?.snippet?.thumbnails?.default?.url;

  const videoInfo = {
    channelId,
    channelTitle: channelTitle,
    videoTitle: title,
    thumbnail: thumbnails?.maxres?.url,
    channelThumbnail,
  };

  let _items;
  let totalFetchedCount = 0;

  if (isTimeSearching) {
    const commentPromises = timeStrings.map((timeString) => fetchComments(videoId, timeString));
    const results = await Promise.all(commentPromises);
    totalFetchedCount = results.reduce((acc, result) => acc + result.fetchedCount, 0);
    _items = removeDuplicateComments(results.flatMap((result) => result.items));
  } else {
    const result = await fetchComments(videoId || "");
    _items = result.items;
    totalFetchedCount = result.fetchedCount;
  }

  _items = _items.flatMap(extractTimeStampedComments).filter((comment) => {
    const filter1 = comment.sec < formatDuration2sec(videoDuration) - 5; // 최대 재생시간 이하로 뽑히는
    const filter2 = comment.comment.length > 2; // 커멘트가 3자 이상인 것만
    return filter1 && filter2;
  });
  _items = convertCommentsToTimeline(_items);

  const result = {
    videoInfo,
    method: isTimeSearching ? "TIME_SEARCH" : "SEQUENCE",
    totalFetchedCount,
    commentCount: _items.length,
    comments: _items,
  };

  if (false) {
    const resultForJson = {
      videoId,
      videoInfo,
      comments: _items
        .filter((item: any) => item.totalLikeCount > 0)
        .map((item: any) => ({ ...item, videoId, videoTitle: videoInfo.videoTitle })),
      createdAt: new Date().toISOString().replace(/[:.]/g, "-"),
    };

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const saveDir = join(__dirname, "..", "..", "data", "comments");

    try {
      await mkdir(saveDir, { recursive: true });

      const filename = `turnover.json`;
      const filePath = join(saveDir, filename);

      let dataArr = [];
      try {
        const fileContent = await readFile(filePath, "utf-8");
        dataArr = JSON.parse(fileContent);
      } catch (err) {
        dataArr = [];
      }

      if (dataArr.find((data: any) => data.videoId === videoId)) {
        dataArr = dataArr.map((data: any) => {
          if (data.videoId === videoId) return resultForJson;
          return data;
        });
      } else {
        dataArr = [...dataArr, resultForJson];
      }

      // 파일 저장
      await writeFile(filePath, JSON.stringify(dataArr, null, 2));
    } catch (error) {
      console.error("파일 저장 중 에러 발생:", error);
    }
  }

  return result;
});

async function fetchComments(videoId: string, searchTerms?: string) {
  let items: any[] = [];
  let totalCount = 0;
  let fetchedCount = 0;
  let nextPageToken = "";

  while (true) {
    const res = await commentThreads(videoId, nextPageToken, searchTerms);
    items = [...items, ...res.items];
    totalCount += res.pageInfo.totalResults;
    fetchedCount++;
    if (searchTerms && fetchedCount > 1) break; //최대 2페이징까지만
    if (!res.nextPageToken) break;
    nextPageToken = res.nextPageToken;
  }

  return { items, totalCount, fetchedCount };
}

async function commentThreads(videoId: string, pageToken = "", searchTerms?: string): Promise<any> {
  const props = {
    part: "snippet",
    videoId,
    maxResults: 100,
    pageToken,
    textFormat: "plainText",
    searchTerms: searchTerms,
  };

  const response = await youtube.commentThreads.list({ ...props, part: [props.part] });

  const { items = [], ...rest } = response.data || {};

  const comments = (items as any[]).map((item) => ({
    id: item.id,
    author: item.snippet.topLevelComment.snippet.authorDisplayName,
    comment: item.snippet.topLevelComment.snippet.textDisplay,
    publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    likeCount: item.snippet.topLevelComment.snippet.likeCount,
  }));

  return { ...rest, items: comments };
}

function removeDuplicateComments(items: any[]): CommentType[] {
  return [...new Map(items.map((item) => [item.comment, item])).values()];
}

function generateTimeStrings(hour = 60): string[] {
  return Array.from({ length: hour + 1 }, (_, i) => i.toString());
}

function extractTimeStampedComments(item: any): CommentType[] {
  const { comment, likeCount } = item;

  const comments = [];
  const regex = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([\s\S]*?)(?=(?:\d{1,2}:\d{2}(?::\d{2})?)|$)/g;
  const matchCount = (comment.match(regex) || []).length;

  let match;
  while ((match = regex.exec(comment)) !== null) {
    const [, hours, minutes, seconds, content] = match;
    const sec = seconds ? +hours * 3600 + +minutes * 60 + +seconds : +hours * 60 + +minutes;
    if (sec === 19) continue; // 19초 제외

    if ((content.trim() || "") === "") continue;

    comments.push({
      sec,
      comment: content.trim().replace(/\*/g, ""),
      likeCount: Math.floor(likeCount / matchCount),
    });
  }

  return comments;
}

function convertCommentsToTimeline(comments: CommentType[]): TimelineCommentType[] {
  const timelineMap = new Map<number, TimelineCommentType>();

  comments.forEach((comment) => {
    const existingTimeline = timelineMap.get(comment.sec);
    if (existingTimeline) {
      const isDuplicate = existingTimeline.comments.some((existing) => existing.comment === comment.comment);

      if (!isDuplicate) {
        timelineMap.set(comment.sec, {
          time: formatSeconds(comment.sec),
          sec: comment.sec,
          totalLikeCount: existingTimeline.totalLikeCount + comment.likeCount,
          comments: [...existingTimeline.comments, comment].sort((a, b) => b.likeCount - a.likeCount),
        });
      }
    } else {
      timelineMap.set(comment.sec, {
        time: formatSeconds(comment.sec),
        sec: comment.sec,
        totalLikeCount: comment.likeCount,
        comments: [comment],
      });
    }
  });

  return Array.from(timelineMap.values()).sort((a, b) => b.totalLikeCount - a.totalLikeCount);
}

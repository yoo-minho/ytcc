import { youtube } from "@/server/utils/youtube";
import { formatDurationJson, formatDuration2sec, formatSeconds } from "@/utils/formatting";
import { CommentType, TimelineCommentType } from "@/types/comm";
export default defineEventHandler(async (event) => {
  const videoId = getRouterParam(event, "videoId");
  if (!videoId) throw "비디오 ID가 필요합니다";

  const response = await youtube.videos.list({ part: ["snippet", "contentDetails", "statistics"], id: [videoId] });
  const videoDuration = response.data?.items?.[0]?.contentDetails?.duration || "";
  const commentCount = +(response.data?.items?.[0]?.statistics?.commentCount || 0); //댓글 + 대댓글
  const minCycles = Math.ceil(commentCount / 100);
  const { hours, minutes } = formatDurationJson(videoDuration);
  const maxHour = Math.min(hours * 60 + minutes, 60); //1시간 넘는 것들
  const timeStrings = generateTimeStrings(maxHour);
  const isTimeSearching = timeStrings.length < minCycles;

  const { channelTitle, title, thumbnails, channelId } = response.data?.items?.[0]?.snippet || {};

  // 채널 정보 가져오기
  const channelResponse = await youtube.channels.list({
    part: ["snippet"],
    id: [channelId || ""],
  });
  const channelThumbnail = channelResponse.data?.items?.[0]?.snippet?.thumbnails?.default?.url;

  const videoInfo = {
    channelTitle: channelTitle,
    videoTitle: title,
    thumbnail: thumbnails?.maxres?.url,
    channelThumbnail,
  };

  let _items;
  let totalFetchedCount = 0;

  if (timeStrings.length > 20 && minCycles > 20) {
    throw createError({
      statusCode: 429, // Too Many Requests
      message: "댓글이 너무 많아 처리하기 어렵습니다!",
    });
  }

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

  return {
    ...videoInfo,
    method: isTimeSearching ? "TIME_SEARCH" : "SEQUENCE",
    totalFetchedCount,
    commentCount: _items.length,
    comments: _items,
  };
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
    if (searchTerms) break;
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

  const regex = /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(.*?)(?=\d{1,2}:\d{2}(?::\d{2})?|$)/g;
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

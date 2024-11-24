const FILTER = {
  정희현: { search: ["희현", "말왕"] },
  서문세찬: { search: ["세찬", "지성", "모잉"] },
  이승구: { search: ["승구"] },
  정연우: { search: ["연우"] },
  전정민: { search: ["정민", "카더가든"] },
  하승윤: { search: ["승윤"] },
  하승진: { search: ["승진"] },
  전태풍: { search: ["태풍"] },
  최성현: { search: ["성현"] },
  이상현: { search: ["상현"] },
  정현석: { search: ["현석"] },
  정성훈: { search: ["성훈"] },
  최윤아: { search: ["윤아"] },
};

export default defineEventHandler(async (event) => {
  const { q } = getQuery(event) as { q: keyof typeof FILTER };
  const { search } = FILTER[q];

  const turnoverComments = await import("~/data/comments/turnover.json");

  let arr = turnoverComments.default as any[];

  arr = arr
    .map((v) => v.comments)
    .flat()
    .filter((v) =>
      v.comments
        .map((v1: any) => v1.comment)
        .join("")
        .match(new RegExp(search.join("|")))
    )
    .sort((b: any, a: any) => a.totalLikeCount - b.totalLikeCount);

  return {
    videoInfo: {
      channelId: "UCINRJxfiq8pXfQm1EucWFfw",
      channelTitle: "하승진 HASEUNGJIN",
      videoTitle: `Special Thanks to ${q}`,
      thumbnail: "https://i.ytimg.com/vi/eY07DR3Zr5g/maxresdefault.jpg",
      channelThumbnail:
        "https://yt3.ggpht.com/ytc/AIdro_mUlzGIFixAiP5jQTbMQtAVTOH3NvShksKxWFMP7OkGUmU=s88-c-k-c0x00ffffff-no-rj",
    },
    commentCount: arr.length,
    comments: arr,
  };
});

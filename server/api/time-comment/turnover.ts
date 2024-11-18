const FILTER = {
  정희현: { search: ["희현", "말왕"], label: "턴오버 정희현 🏀 사랑 받았던 순간 ❤️" },
  서문세찬: { search: ["세찬", "지성", "모잉"], label: "턴오버 서문세찬 🏀 사랑 받았던 순간 ❤️" },
  이승구: { search: ["승구"], label: "턴오버 이승구 🏀 사랑 받았던 순간 ❤️" },
  정연우: { search: ["연우"], label: "턴오버 정연우 🏀 사랑 받았던 순간 ❤️" },
  전정민: { search: ["정민", "카더가든"], label: "턴오버 전정민 🏀 사랑 받았던 순간 ❤️" },
  하승윤: { search: ["승윤"], label: "턴오버 하승윤 🏀 사랑 받았던 순간 ❤️" },
  하승진: { search: ["승진"], label: "턴오버 하승진 🏀 사랑 받았던 순간 ❤️" },
  전태풍: { search: ["태풍"], label: "턴오버 전태풍 🏀 사랑 받았던 순간 ❤️" },
  최성현: { search: ["성현"], label: "턴오버 최성현 🏀 사랑 받았던 순간 ❤️" },
  이상현: { search: ["상현"], label: "턴오버 이상현 🏀 사랑 받았던 순간 ❤️" },
  정현석: { search: ["현석"], label: "턴오버 정현석 🏀 사랑 받았던 순간 ❤️" },
  정성훈: { search: ["성훈"], label: "턴오버 정성훈 🏀 사랑 받았던 순간 ❤️" },
  최윤아: { search: ["윤아"], label: "턴오버 최윤아 🏀 사랑 받았던 순간 ❤️" },
};

export default defineEventHandler(async (event) => {
  const { thanks } = getQuery(event) as { thanks: keyof typeof FILTER };

  console.log({ thanks });

  const { search, label } = FILTER[thanks];

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
      videoTitle: label,
      thumbnail: "https://i.ytimg.com/vi/eY07DR3Zr5g/maxresdefault.jpg",
      channelThumbnail:
        "https://yt3.ggpht.com/ytc/AIdro_mUlzGIFixAiP5jQTbMQtAVTOH3NvShksKxWFMP7OkGUmU=s88-c-k-c0x00ffffff-no-rj",
    },
    commentCount: arr.length,
    comments: arr,
  };
});

const FILTER = {
  정희현: ["희현", "말왕"],
  서문세찬: ["세찬", "지성", "모잉"],
  이승구: ["승구"],
  정연우: ["연우"],
  전정민: ["정민", "카더가든"],
  하승윤: ["승윤"],
  하승진: ["승진"],
  전태풍: ["태풍"],
  최성현: ["성현"],
  이상현: ["상현"],
  정현석: ["현석"],
  정성훈: ["성훈"],
  최윤아: ["윤아"],
};

export default defineEventHandler(async (event) => {
  const turnoverComments = await import("~/data/comments/turnover.json");

  let arr = turnoverComments.default as any[];

  arr = arr
    .map((v) => v.comments)
    .flat()
    .filter((v) =>
      v.comments
        .map((v1: any) => v1.comment)
        .join("")
        .includes("세찬")
    );

  return arr;
});

export const useVideoDataState = () =>
  useState("video-data", () => {
    return {
      trendVideoData: [] as any[],
      weeklyVideoData: [] as any[],
    };
  });

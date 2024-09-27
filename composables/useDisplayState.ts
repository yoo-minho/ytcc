export const useDisplayState = () =>
  useState("display", () => ({
    isShowTrendVideo: false,
  }));

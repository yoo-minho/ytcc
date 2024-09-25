export const usePlayerState = () =>
  useState("video", () => ({
    currentTime: 0,
  }));

import type { TrendingVideoType } from "~/types/comm";

export const useVideoDataState = () =>
  useState("video-data", async () => {
    const trendVideoResponse = await useAsyncData<TrendingVideoType[]>(
      "trendingVideos",
      () => $fetch<TrendingVideoType[]>("/api/trend"),
      { lazy: true }
    );
    return {
      trendVideoResponse,
    };
  });

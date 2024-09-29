import type { TrendingVideoType } from "~/types/comm";
import { WEEKLY_PLAYLIST_ARR } from "@/constants/youtube";

export const useVideoDataState = () =>
  useState("video-data", async () => {
    const trendVideoResponse = await useAsyncData<TrendingVideoType[]>(
      "trendingVideos",
      () => $fetch<TrendingVideoType[]>("/api/trend"),
      { lazy: true }
    );

    const weeklyVideoResponse = await useAsyncData<any[]>(
      "weeklyVideos",
      () =>
        $fetch<any[]>("/api/weekly", {
          method: "POST",
          body: { playlistIds: WEEKLY_PLAYLIST_ARR.map((v) => v.id) },
        }),
      { lazy: true }
    );

    return {
      trendVideoResponse,
      weeklyVideoResponse,
    };
  });

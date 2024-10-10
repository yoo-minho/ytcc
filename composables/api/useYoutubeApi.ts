import type { TrendingVideoType } from "~/types/comm";
import { WEEKLY_PLAYLIST_ARR } from "@/constants/youtube";

export const useYoutubeApi = () => {
  const fetchTrendingVideos = (count: number = 50) =>
    useAsyncData<TrendingVideoType[]>(
      "trendingVideos",
      async () => {
        const videoDataState = useVideoDataState();
        if (videoDataState.value.trendVideoData.length > 0) {
          return videoDataState.value.trendVideoData;
        }
        return await $fetch<TrendingVideoType[]>("/api/trend", {
          params: { max: count },
        });
      },
      { lazy: true }
    );

  const fetchWeeklyVideos = () =>
    useAsyncData<any[]>(
      "weeklyVideos",
      () =>
        $fetch<any[]>("/api/weekly", {
          method: "POST",
          body: { playlistIds: WEEKLY_PLAYLIST_ARR.map((v) => v.id) },
        }),
      {
        lazy: true,
        getCachedData: () => {
          const videoDataState = useVideoDataState();
          if (videoDataState.value.weeklyVideoData.length > 0) {
            return videoDataState.value.weeklyVideoData;
          }
        },
        transform: (data) => {
          return data?.map((p) => {
            const matchingData = WEEKLY_PLAYLIST_ARR.find((v) => v.id === p.playlistId);
            return {
              playlistId: matchingData?.id || p.playlistId,
              thumbnail: p.thumbnail,
              title: matchingData?.title || p.title,
              description: matchingData?.description || p.description,
              channelTitle: p.channelTitle,
              actor: matchingData?.actor,
              cycle: matchingData?.cycle,
              day: matchingData?.day,
            };
          });
        },
      }
    );

  return {
    fetchTrendingVideos,
    fetchWeeklyVideos,
  };
};

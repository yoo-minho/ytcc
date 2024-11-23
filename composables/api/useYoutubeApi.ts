import type { TrendingVideoType } from "~/types/comm";
import { WEEKLY_PLAYLIST_ARR } from "@/constants/youtube";

export const useYoutubeApi = () => {
  const fetchTimeComments = async () => {
    const route = useRoute();
    const id = computed(() => {
      if (route.query.f) return String(route.query.f);
      return route.query.v ? String(route.query.v) : "";
    });
    return await useAsyncData(
      `time-comment-${id.value}`,
      async () => {
        if (!id.value) return { comments: [], commentCount: 0, videoInfo: undefined };

        const query = {} as { q?: string };
        if (route.query.q) {
          query.q = String(route.query.q);
        }
        return await $fetch<TimelineCommentWrapType>(`/api/time-comment/${id.value}`, {
          query,
        });
      },
      { watch: [id] }
    );
  };

  const fetchTrendingVideos = (max: number = 50) =>
    useAsyncData<TrendingVideoType[]>(
      "trendingVideos",
      async () => {
        const videoDataState = useVideoDataState();
        if (videoDataState.value.trendVideoData.length > 0) {
          return videoDataState.value.trendVideoData;
        }
        return await $fetch<TrendingVideoType[]>("/api/trend", {
          params: { max, region: "KR" },
        });
      },
      { lazy: true, server: false }
    );

  const fetchPlayListInfo = (playlistId: string) =>
    useAsyncData<any[]>("fetchPlayListInfo", async () => {
      return await $fetch<any[]>("/api/weekly", {
        method: "POST",
        body: { playlistIds: [playlistId] },
      });
    });

  const fetchWeeklyVideos = () =>
    useAsyncData<any[]>(
      "weeklyVideos",
      async () => {
        const videoDataState = useVideoDataState();
        if (videoDataState.value.weeklyVideoData.length > 0) {
          return videoDataState.value.weeklyVideoData;
        }
        return await $fetch<any[]>("/api/weekly", {
          method: "POST",
          body: { playlistIds: WEEKLY_PLAYLIST_ARR.map((v) => v.id) },
        });
      },
      {
        lazy: true,
        server: false,
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
    fetchTimeComments,
    fetchTrendingVideos,
    fetchWeeklyVideos,
    fetchPlayListInfo,
  };
};

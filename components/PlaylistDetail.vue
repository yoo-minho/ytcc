<script setup lang="ts">
import type { TrendingVideoType } from "@/types/comm";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";
import YoutubeAppBtn from "./ui/YoutubeAppBtn.vue";
import { WEEKLY_PLAYLIST_ARR } from "~/constants/youtube";

const videoDataState = useVideoDataState();
const youtubeApi = useYoutubeApi();

const { data: playlists, status: playlistsStatus } = youtubeApi.fetchWeeklyVideos();
watch(playlists, () => {
    videoDataState.value.weeklyVideoData = playlists.value || [];
})

const route = useRoute();
const { list: listId } = route.query;

const { data: videos, status } = useAsyncData("playlist", () =>
    $fetch<TrendingVideoType[]>("/api/playlist", {
        method: "POST",
        body: { listId: listId },
    }),
    {
        transform: (videos) => {
            return videos?.map((v) => {
                const matchingData = WEEKLY_PLAYLIST_ARR.find((v) => v.id === listId);
                let title = v.title;
                if (typeof matchingData?.prettyTitle === 'function') {
                    title = matchingData.prettyTitle(v.title);
                }
                return { ...v, title };
            });
        },
    }
);

const playlist = computed(() => playlists.value?.find(p => p.playlistId === listId));
</script>
<template>
    <div class="w-full absolute">
        <SharedPlaylistList :playlists="[playlist]" :status="playlistsStatus" :thumbnail="false" class="m-4" />
        <YoutubeAppBtn :playlist-id="String(listId)" text="앱에서 재생목록 열기" class="mx-4 mb-2" />
        <SharedVideoList :videos="videos || []" :status="status" class="px-4" />
    </div>
</template>

<style lang="scss" scoped></style>

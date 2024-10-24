<script setup lang="ts">
import type { TrendingVideoType } from "@/types/comm";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";
import YoutubeAppBtn from "./ui/YoutubeAppBtn.vue";
import { WEEKLY_PLAYLIST_ARR } from "~/constants/youtube";

const videoDataState = useVideoDataState();
const youtubeApi = useYoutubeApi();

const { data: playlists } = youtubeApi.fetchWeeklyVideos();
videoDataState.value.weeklyVideoData = playlists.value || [];

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
        <div class="p-4">
            <PlaylistItem v-if="playlist" :playlist="playlist" :thumbnail="false" />
        </div>
        <div class="px-4 pb-2">
            <YoutubeAppBtn :playlist-id="String(listId)" text="앱에서 재생목록 열기" />
        </div>
        <template v-if="status === 'pending'">
            <div class="p-4">로딩중...</div>
        </template>
        <template v-else>
            <template v-if="videos">
                <div class="px-4">
                    <PlaylistPlayListItem v-for="video in videos" :video="video" @click="moveVideoDetail(video.id)" />
                </div>
            </template>
        </template>
    </div>
</template>

<style lang="scss" scoped></style>

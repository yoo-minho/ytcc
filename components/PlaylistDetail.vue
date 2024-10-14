<script setup lang="ts">
import type { TrendingVideoType } from "@/types/comm";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

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
    })
);

const playlist = computed(() => playlists.value?.find(p => p.playlistId === listId));
</script>
<template>
    <div class="w-full absolute">
        <div class="p-4">
            <PlaylistItem v-if="playlist" :playlist="playlist" :thumbnail="false" />
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

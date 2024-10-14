<script setup lang="ts">
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const youtubeApi = useYoutubeApi();
const videoDataState = useVideoDataState();

const { data: videos, error, status } = youtubeApi.fetchTrendingVideos(MAX_TREND_VIDEO_COUNT);
videoDataState.value.trendVideoData = videos.value || [];

const errorMessage = computed(() => (error.value?.data as any)?.statusMessage);
</script>
<template>
    <div class="w-full pt-2">
        <template v-if="status === 'pending'">
            <div class="p-4 w-full">loading...</div>
        </template>
        <template v-else-if="error">
            <div class="p-4 w-full">
                {{ errorMessage }}
            </div>
        </template>
        <template v-if="videos">
            <div v-for="(video, idx) in videoDataState.trendVideoData">
                <PlaylistPlayListItem :video="video" :idx="idx" class="px-4" />
            </div>
        </template>
    </div>
</template>
<style lang="scss" scoped></style>

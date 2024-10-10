<script setup lang="ts">
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const youtubeApi = useYoutubeApi();
const videoDataState = useVideoDataState();

const { data: videos, error, status } = youtubeApi.fetchTrendingVideos(MAX_TREND_VIDEO_COUNT);
videoDataState.value.trendVideoData = videos.value || [];

const selectedCategoryId = ref("");
const formattedVideos = computed(() => {
    if (selectedCategoryId.value === "") return videos.value;
    return videos.value?.filter((video) => video.categoryId === selectedCategoryId.value) || [];
});
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
            <div v-for="(video, idx) in formattedVideos">
                <PlaylistPlayListItem :video="video" :idx="idx" />
            </div>
        </template>
    </div>
</template>
<style lang="scss" scoped></style>

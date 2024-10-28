<script setup lang="ts">
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const youtubeApi = useYoutubeApi();
const videoDataState = useVideoDataState();

const { data: videos, error, status } = youtubeApi.fetchTrendingVideos(MAX_TREND_VIDEO_COUNT);
watch(videos, () => {
    videoDataState.value.trendVideoData = videos.value || [];
})
</script>
<template>
    <div class="w-full px-4 pt-3">
        <SharedVideoList :videos="videos || []" :status="status" :error="error" :rank="true" />
    </div>
</template>
<style lang="scss" scoped></style>

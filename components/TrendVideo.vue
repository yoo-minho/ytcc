<script setup lang="ts">
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";
import type { TrendingVideoType } from "~/types/comm";
import dayjs from "dayjs";

const youtubeApi = useYoutubeApi();
const videoDataState = useVideoDataState();

const { data: videos, error, status } = youtubeApi.fetchTrendingVideos(MAX_TREND_VIDEO_COUNT);
watch(videos, () => {
    videoDataState.value.trendVideoData = videos.value as TrendingVideoType[];
})

const errorMessage = computed(() => (error.value?.data as any)?.statusMessage);
const trendVideoByDay = computed(() => {
    return videoDataState.value.trendVideoData;
})


</script>
<template>
    <div class="w-full">
        <template v-if="status === 'pending'">
            <div class="p-4 w-full">loading...</div>
        </template>
        <template v-else-if="error">
            <div class="p-4 w-full">
                {{ errorMessage }}
            </div>
        </template>
        <template v-else>
            <template v-if="trendVideoByDay.length === 0">
                <div class="p-4">인기 동영상이 없네요!</div>
            </template>
            <template v-else>
                <div v-for="(video, idx) in trendVideoByDay">
                    <PlaylistPlayListItem :video="video" :idx="idx" class="px-4" />
                </div>
            </template>
        </template>
    </div>
</template>
<style lang="scss" scoped></style>

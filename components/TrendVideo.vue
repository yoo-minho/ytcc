<script setup lang="ts">
import { YOUTUBE_CATEGORY_MAP, MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
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
const categoryList = computed(() =>
    Object.entries(YOUTUBE_CATEGORY_MAP)
        .map(([k, v]) => ({
            id: k,
            value: v,
            count: videos.value?.filter((video) => video.categoryId === k).length || 0,
        }))
        .filter((v) => v.count > 0)
        .toSorted((a, b) => b.count - a.count)
);
</script>
<template>
    <div>
        <template v-if="status === 'pending'">
            <div class="p-4">loading...</div>
        </template>
        <template v-else-if="error">
            <div class="p-4">
                {{ errorMessage }}
            </div>
        </template>
        <template v-else>
            <div class="flex flex-wrap px-4 pb-2 gap-1">
                <UButton variant="outline" :color="selectedCategoryId === '' ? 'primary' : 'white'"
                    @click="selectedCategoryId = ''">
                    <UIcon name="i-ph-compass" size="16px" />
                </UButton>
                <template v-for="category in categoryList">
                    <UButton class="px-2 text-xs" variant="outline"
                        :color="selectedCategoryId === category.id ? 'primary' : 'white'"
                        @click="selectedCategoryId = category.id">
                        {{ category.value }}
                    </UButton>
                </template>
            </div>
            <template v-if="videos">
                <div v-for="video in formattedVideos">
                    <PlaylistPlayListItem :video="video"></PlaylistPlayListItem>
                </div>
            </template>
        </template>
    </div>
</template>
<style lang="scss" scoped></style>

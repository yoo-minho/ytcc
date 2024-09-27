<script setup lang="ts">
import { YOUTUBE_CATEGORY_MAP } from '@/constants/youtube';

const selectedCategoryId = ref('');
const videoDataState = useVideoDataState();
const { data: videos, error, status } = toRef(await videoDataState.value, 'trendVideoResponse').value;

const formattedVideos = computed(() => {
    if (selectedCategoryId.value === '') return videos.value;
    return videos.value?.filter(video => video.categoryId === selectedCategoryId.value) || [];
})

const errorMessage = computed(() => {
    return (error.value?.data as any).statusMessage
})

const categoryList = computed(() => Object.entries(YOUTUBE_CATEGORY_MAP).map(([k, v]) => ({
    id: k,
    value: v,
    count: videos.value?.filter(video => video.categoryId === k).length || 0
})).filter(v => v.count > 0).toSorted((a, b) => b.count - a.count));
</script>
<template>
    <div>
        <template v-if="status === 'pending'">
            <div class="p-4">
                loading...
            </div>
        </template>
        <template v-else-if="error">
            <div class="p-4">
                {{ errorMessage }}
            </div>
        </template>
        <template v-else>
            <div class="flex flex-wrap gap-1 p-4 pb-2">
                <UButton variant="outline" @click="selectedCategoryId = ''" color="white">
                    <UIcon name="i-ph-compass" size="24px" />
                    <UIcon v-if="selectedCategoryId === ''" name="i-heroicons-check-solid" />
                </UButton>
                <template v-for="(category) in categoryList">
                    <UButton variant="outline" @click="selectedCategoryId = category.id" color="white">
                        {{ category.value }}
                        <UIcon v-if="selectedCategoryId === category.id" name="i-heroicons-check-solid" />
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
<style lang='scss' scoped></style>

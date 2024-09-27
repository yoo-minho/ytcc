<script setup lang="ts">
import type { TrendingVideoType } from '@/types/comm';

const displayState = useDisplayState();

const { data: videos, error, status } = await useAsyncData<TrendingVideoType[]>('trendingVideos', () =>
    $fetch<TrendingVideoType[]>('/api/trend'),
    { lazy: true }
);
</script>
<template>
    <div class="flex flex-wrap justify-center h-full">
        <LandingHero v-if="!displayState.isShowTrendVideo" />
        <TrendVideo v-if="displayState.isShowTrendVideo" :videos="videos" />
    </div>
</template>
<style lang='scss' scoped></style>
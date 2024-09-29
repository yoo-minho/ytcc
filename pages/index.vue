<script setup lang="ts">
import type { TrendingVideoType } from '@/types/comm';
import { WEEKLY_PLAYLIST_ARR } from "@/constants/youtube";

const displayState = useDisplayState();

const { data: videos } = await useAsyncData<TrendingVideoType[]>('trendingVideos', () =>
    $fetch<TrendingVideoType[]>('/api/trend'),
    { lazy: true }
);

const { data: playlists } = await useAsyncData<any[]>(
    "weeklyVideos",
    () => $fetch<any[]>("/api/weekly", {
        method: "POST",
        body: { playlistIds: WEEKLY_PLAYLIST_ARR.map(v => v.id) }
    }), { lazy: true }
);

</script>
<template>
    <div class="flex flex-wrap justify-center h-full">
        <LandingHero v-if="displayState.currentPage === ''" />
        <TrendVideo v-if="displayState.currentPage === 'TREND'" />
        <WeeklyVideo v-if="displayState.currentPage === 'WEEKLY'" />
    </div>
</template>
<style lang='scss' scoped></style>
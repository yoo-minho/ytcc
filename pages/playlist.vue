<script setup lang="ts">
import type { TrendingVideoType } from '@/types/comm';

const route = useRoute();
const { v: listId } = route.query;

const moveWatchPage = (videoId: string) => {
    navigateTo({ path: '/watch', query: { v: videoId, list: listId } });
}

const { data: videos, error } = await useAsyncData<TrendingVideoType[]>('playlist', () =>
    $fetch<TrendingVideoType[]>('/api/playlist', {
        method: 'POST',
        body: { listId }
    })
);
</script>
<template>
    <template v-if="videos">
        <div v-for="video in videos" @click="moveWatchPage(video.id)">
            <PlaylistPlayListItem :video="video"></PlaylistPlayListItem>
        </div>
    </template>
</template>
<style lang='scss' scoped></style>

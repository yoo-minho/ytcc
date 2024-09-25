<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-6">구독 채널의 인기 동영상</h1>
        <UButton v-if="!isAuthenticated" @click="startAuth" color="red" class="mb-4">
            Google로 로그인
        </UButton>
        <div v-else-if="pending" class="text-center">
            <USpinner />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="video in popularVideos" :key="video.id.videoId"
                class="bg-gray-800 rounded-lg overflow-hidden shadow-lg" @click="move(video.id)">
                <img :src="video.snippet.thumbnails.medium.url" :alt="video.snippet.title"
                    class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-semibold mb-2 truncate">{{ video.snippet.title }}</h2>
                    <p class="text-gray-400 text-sm mb-2">{{ video.snippet.channelTitle }}</p>
                    <p class="text-gray-300 text-sm">{{ formatDate(video.snippet.publishedAt) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';

const isAuthenticated = ref(true);
const { data: popularVideos, pending, error } = await useFetch('/api/popular-videos', {
    lazy: true,
});

const startAuth = () => {
    navigateTo("/api/auth/google");
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const move = (videoId: string) => {
    navigateTo({ path: '/watch', query: { v: videoId } });
}


watch(popularVideos, (newPopularVideos) => {
    if (newPopularVideos && newPopularVideos.length > 0) {
        isAuthenticated.value = true;
    }
});

onMounted(() => {
    if (!popularVideos.value) {
        refreshNuxtData('popularVideos');
    }
});
</script>

<script setup lang="ts">
import type { TrendingVideoType } from "@/types/comm";

defineProps<{ video: TrendingVideoType }>()
</script>

<template>
    <div class="cursor-pointer" @click="navigateTo(`watch?v=${video.id}`)">
        <div class="relative">
            <div
                class="absolute top-2 left-2 bg-yellow-500 bg-opacity-90 text-black rounded px-1 font-bold text-sm tracking-tight">
                {{ formatViewCount(video.viewCount, true) }}
            </div>
            <img class="w-full" :src="video.thumbnail" alt="Video Thumbnail" style="aspect-ratio: 16 / 9;">
            <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white rounded px-1 font-bold">
                {{ video.duration }}
            </div>
        </div>
        <div class="p-4">
            <div class="flex">
                <img class="w-10 h-10 rounded-full" :src="video.channelThumbnail" alt="Channel Thumbnail">
                <div class="ml-4">
                    <p class="text-white text-base leading-tight">{{ video.title }}</p>
                    <p class="text-gray-400 text-sm">
                        {{ video.channelTitle }} •
                        조회수 {{ formatViewCount(video.viewCount) }} •
                        댓글수 {{ formatViewCount(video.commentCount) }} •
                        {{ video.publishedAt }}
                        {{ video.categoryName }}
                        {{ video.channelCountry }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
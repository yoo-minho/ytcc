<script setup lang="ts">
import type { TrendingVideoType } from "@/types/comm";

defineProps<{ video: TrendingVideoType }>()
</script>

<template>
    <div class="cursor-pointer flex px-4 py-2 gap-2">
        <div class="flex-1 p-1">
            <div class="relative">
                <img class="w-full" :src="video.thumbnail" alt="Video Thumbnail" style="aspect-ratio: 16 / 9;">
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white rounded px-1 font-bold text-xs">
                    {{ video.duration }}
                </div>
            </div>
        </div>
        <div class="flex-1 p-1 ">
            <div>
                <p class="text-white text-base leading-tight">{{ video.title }}</p>
                <p class="text-gray-400 text-sm">{{ video.publishedAt }}</p>
                <p class="text-gray-400 text-sm">조회수 {{ video.viewCount }} • 댓글수 {{ video.commentCount }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
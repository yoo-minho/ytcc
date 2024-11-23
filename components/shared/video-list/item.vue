<script setup lang="ts">
import type { TrendingVideoType } from "@/types/comm";
defineProps<{ video: TrendingVideoType; idx?: number }>();
</script>
<template>
    <div class="cursor-pointer flex gap-4 py-2" @click="moveVideoDetail(video.id)">
        <div class="w-1/2">
            <div class="relative">
                <img class="w-full rounded-md" :src="video.thumbnail" alt="Video Thumbnail"
                    style="aspect-ratio: 16 / 9;">
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white rounded px-1 font-bold text-xs">
                    {{ video.duration }}
                </div>
            </div>
        </div>
        <div class="w-1/2">
            <div>
                <p class="text-white text-base leading-tight line-clamp-3 tracking-tight break-keep">
                    {{ video.title }}
                </p>
                <p class="text-gray-400 text-xs truncate">
                    {{ video.channelTitle }}
                </p>
                <p class="text-gray-400 text-xs">
                    조회수 {{ formatViewCount(video.viewCount) }} • {{ formatPublishedAt(video.publishedAt, "fromNow") }}
                </p>
            </div>
        </div>
    </div>

</template>

<style scoped></style>
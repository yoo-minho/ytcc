<script setup lang="ts">
import type { TrendingVideoType } from "@/types/comm";
defineProps<{ video: TrendingVideoType; idx?: number }>();
</script>
<template>
    <div class="cursor-pointer flex gap-2 py-2" @click="moveVideoDetail(video.id)">
        <div class="p-1 w-1/2">
            <div class="relative">
                <img class="w-full" :src="video.thumbnail" alt="Video Thumbnail" style="aspect-ratio: 16 / 9;">
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white rounded px-1 font-bold text-xs">
                    {{ video.duration }}
                </div>
                <div v-if="idx !== undefined"
                    class="absolute top-2 left-2 bg-black bg-opacity-75  rounded px-1 font-bold ">
                    <div v-if="idx < 3" class="text-red-red-500 text-2xl">
                        {{ idx + 1 }}
                    </div>
                    <div v-else-if="idx < 10" class="text-white text-xl">
                        {{ idx + 1 }}
                    </div>
                    <div v-else>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-1 w-1/2">
            <div>
                <p class="text-white text-sm leading-tight line-clamp-3 tracking-tight">{{ video.title }}</p>
                <p class="text-gray-400 text-xs truncate">
                    {{ video.channelTitle }}
                </p>
                <p class="text-gray-400 text-xs">
                    {{ video.publishedAt }}
                </p>
                <p class="text-gray-400 text-xs">
                    조회수 {{ formatViewCount(video.viewCount) }} •
                    댓글수 {{ formatViewCount(video.commentCount) }}
                </p>
            </div>
        </div>
    </div>

</template>

<style scoped></style>
<script setup lang="ts">
defineProps<{ playlist: any; thumbnail: boolean }>();
</script>
<template>
    <div class="cursor-pointer" @click="movePlaylistDetail(playlist.playlistId)">
        <div class="flex flex-col gap-2">
            <div v-if="thumbnail" class="relative rounded-lg overflow-hidden border border-black-900">
                <img class="w-full" :src="playlist.thumbnail" alt="Video Thumbnail" style="aspect-ratio: 16 / 9;">
            </div>
            <div>
                <p class="text-xs">
                    {{ playlist.cycle }}
                </p>
                <p class="text-white font-bold leading-tight line-clamp-1 tracking-tight">
                    {{ playlist.title }}
                </p>
                <p class="text-gray-300 text-xs line-clamp-1 tracking-tight break-keep">
                    {{ playlist.description }}
                </p>
                <p v-if="playlist.actor" class="text-gray-400 text-xs mt-1">
                    출연 : {{ playlist.actor }}
                </p>
                <p class="text-gray-400 text-xs line-clamp-1"> 제작채널 : {{ playlist.channelTitle }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
defineProps<{ playlist: any; thumbnail: boolean }>();
</script>
<template>
    <div class="cursor-pointer" @click="movePlaylistDetail(playlist.playlistId)">
        <div class="flex flex-col gap-2">
            <div v-if="thumbnail" class="relative rounded-lg overflow-hidden border border-black-900">
                <img class="w-full" :src="playlist.thumbnail" alt="Video Thumbnail" style="aspect-ratio: 16 / 9;">
                <div v-if="playlist.day !== '완결'"
                    class="absolute bottom-0 right-0 inline-block px-1 py-0.5 mr-1 mb-1 rounded text-xs font-bold text-white bg-red-600">
                    ON AIR
                </div>
            </div>
            <div>
                <p class="text-red-red text-sm tracking-tight">
                    {{ playlist.cycle }}
                </p>
                <p class="text-white text-xl font-bold leading-tight line-clamp-2 tracking-tight">
                    {{ playlist.title }}
                </p>
                <p class="text-gray-400 text-xs line-clamp-2 tracking-tight break-keep">
                    {{ playlist.description }}
                </p>
                <p v-if="playlist.actor" class="text-gray-400 text-xs mt-1">
                    출연 : {{ playlist.actor }}
                </p>
                <p class="text-gray-400 text-xs"> 제작채널 : {{ playlist.channelTitle }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

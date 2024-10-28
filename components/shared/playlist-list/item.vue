<script setup lang="ts">
defineProps<{ playlist: any; thumbnail: boolean }>();
</script>
<template>
    <div class="cursor-pointer" @click="movePlaylistDetail(playlist.playlistId)">
        <div class="flex flex-col gap-2">
            <template v-if="thumbnail">
                <div class="relative rounded-lg overflow-hidden border border-black-900">
                    <img class="w-full" :src="playlist.thumbnail" alt="Video Thumbnail" style="aspect-ratio: 16 / 9;">
                </div>
                <div class="text-xs tracking-tight">
                    <p>{{ playlist.cycle }}</p>
                    <p class="text-white font-bold leading-tight line-clamp-1 text-base">{{ playlist.title }}</p>
                    <p class="text-gray-300 line-clamp-1 break-keep"> {{ playlist.description }}</p>
                    <p v-if="playlist.actor" class="text-gray-400 mt-1"> 출연 : {{ playlist.actor }} </p>
                    <p class="text-gray-400 line-clamp-1"> 제작채널 : {{ playlist.channelTitle }}</p>
                </div>
            </template>
            <template v-else>
                <div class="text-sm tracking-tight">
                    <p>{{ playlist.cycle }}</p>
                    <p class="text-xl text-white font-bold leading-tight line-clamp-1 ">{{ playlist.title }}</p>
                    <p class="text-gray-300 line-clamp-1 break-keep"> {{ playlist.description }}</p>
                    <p v-if="playlist.actor" class="text-gray-400 mt-1"> 출연 : {{ playlist.actor }} </p>
                    <p class="text-gray-400 line-clamp-1"> 제작채널 : {{ playlist.channelTitle }}</p>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

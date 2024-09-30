<script setup lang="ts">
import { WEEKLY_PLAYLIST_ARR } from "@/constants/youtube";
const videoDataState = useVideoDataState();
const { data: playlists, error, status } = (await videoDataState.value).weeklyVideoResponse;
const errorMessage = computed(() => (error.value?.data as any).statusMessage);

const today = new Date().getDay();
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const selectedDayOfWeek = ref(daysOfWeek[today]);

const selectDayOfWeek = (day: string) => {
    selectedDayOfWeek.value = day;
}

const formattedPlaylists = computed(() => playlists.value
    ?.map(p => {
        const matchingData = WEEKLY_PLAYLIST_ARR.find(v => v.id === p.playlistId);
        return {
            playlistId: matchingData?.id || p.playlistId,
            thumbnail: p.thumbnail,
            title: matchingData?.title || p.title,
            description: matchingData?.description || p.description,
            channelTitle: p.channelTitle,
            actor: matchingData?.actor,
            cycle: matchingData?.cycle,
            day: matchingData?.day,
        };
    })
    ?.filter(p => {
        if (selectedDayOfWeek.value === '') return true;
        return p.day?.includes(selectedDayOfWeek.value)
    })
)

</script>
<template>
    <template v-if="status === 'pending'">
        <div class="p-4">
            loading...
        </div>
    </template>
    <template v-else-if="error">
        <div class="p-4">
            {{ errorMessage }}
        </div>
    </template>
    <template v-else>
        <div class="flex h-screen overflow-hidden w-full" style="height: calc(100vh - 60px);">
            <div class="w-[52px] flex-shrink-0 flex flex-col bg-gray-900 items-center gap-4 p-4">
                <template v-for="day in ['월', '화', '수', '목', '금', '토', '일']">
                    <div class="flex items-center justify-center w-10 h-10 rounded-2xl" :class="[
        day === selectedDayOfWeek ? 'bg-primary-500' : 'border-4 border-gray-700']" @click="selectDayOfWeek(day)">
                        <span :class="[day === selectedDayOfWeek ? 'font-bold text-xl' : 'text-gray-500']">
                            {{ day }}
                        </span>
                    </div>
                </template>
            </div>
            <div class="flex-1 overflow-y-auto w-full">
                <div class="flex flex-col gap-4 p-4 ">
                    <template v-for="(playlist) in formattedPlaylists">
                        <div class="cursor-pointer" @click="navigateTo(`playlist?v=${playlist.playlistId}`)">
                            <div class="flex flex-col gap-2">
                                <div class="relative rounded-lg overflow-hidden border border-black-900">
                                    <img class="w-full" :src="playlist.thumbnail" alt="Video Thumbnail"
                                        style="aspect-ratio: 16 / 9;">
                                    <div
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
                                    <p class="text-gray-400 text-xs mt-1"> 출연 : {{ playlist.actor }}</p>
                                    <p class="text-gray-400 text-xs"> 제작채널 : {{ playlist.channelTitle }}</p>
                                </div>
                            </div>
                        </div>
                        <UDivider />
                    </template>
                </div>
            </div>
        </div>
    </template>
</template>
<style lang='scss' scoped></style>

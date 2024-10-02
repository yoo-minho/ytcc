<script setup lang="ts">
import { WEEKLY_PLAYLIST_ARR } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const videoDataState = useVideoDataState();
const youtubeApi = useYoutubeApi();

const { data: playlists, error, status } = youtubeApi.fetchWeeklyVideos();
videoDataState.value.weeklyVideoData = playlists.value || [];

const errorMessage = computed(() => (error.value?.data as any).statusMessage);

const today = new Date().getDay();
const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일', '상시'];
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

    <div class="flex flex-col h-screen overflow-hidden w-full" style="height: calc(100vh - 60px);">
        <div class="h-[48px] flex-shrink-0 flex bg-gray-900 justify-center items-center gap-2">
            <template v-for="day in daysOfWeek">
                <div class="flex items-center justify-center w-10 h-10 rounded-2xl"
                    :class="[day === selectedDayOfWeek ? 'text-primary-500 underline underline-offset-4' : 'border-1 border-gray-700']"
                    @click="selectDayOfWeek(day)">
                    <span :class="[day === selectedDayOfWeek ? 'font-bold text-xl' : 'text-gray-500']">
                        {{ day }}
                    </span>
                </div>
            </template>
        </div>
        <div class="flex-1 overflow-y-auto w-full">
            <div class="flex flex-col gap-4 p-4 ">
                <template v-if="status === 'pending'">
                    <div>
                        loading...
                    </div>
                </template>
                <template v-else-if="error">
                    <div>
                        {{ errorMessage }}
                    </div>
                </template>
                <template v-else-if="formattedPlaylists && formattedPlaylists.length === 0">
                    <div>
                        재생목록이 존재하지 않습니다.
                    </div>
                </template>
                <template v-else>
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
                                    <p v-if="playlist.actor" class="text-gray-400 text-xs mt-1">
                                        출연 : {{ playlist.actor }}
                                    </p>
                                    <p class="text-gray-400 text-xs"> 제작채널 : {{ playlist.channelTitle }}</p>
                                </div>
                            </div>
                        </div>
                        <UDivider />
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
<style lang='scss' scoped></style>

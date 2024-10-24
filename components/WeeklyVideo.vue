<script setup lang="ts">
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const videoDataState = useVideoDataState();
const youtubeApi = useYoutubeApi();

const { data: playlists } = youtubeApi.fetchWeeklyVideos();
videoDataState.value.weeklyVideoData = playlists.value || [];

const formattedPlaylists = computed(() => playlists.value?.filter(p => {
    if (selectedDayOfWeek.value === '') return true;
    return p.day?.includes(selectedDayOfWeek.value)
}))

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayDay = yesterday.getDay();
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const daysLabel = ['월', '화', '수', '목', '금', '토', '일', '완결'];
const selectedDayOfWeek = ref(daysOfWeek[yesterdayDay]);

const selectDayOfWeek = (day: string) => {
    selectedDayOfWeek.value = day;
}
</script>
<template>
    <div class="w-full flex flex-col">
        <div class="flex justify-between gap-2 pt-4 px-4 py-2 sticky top-0 z-10 bg-black">
            <template v-for="day in daysLabel">
                <div class="text-center w-10 h-8"
                    :class="[day === selectedDayOfWeek ? 'text-primary-500 border-b-2 border-primary-500' : '']"
                    @click="selectDayOfWeek(day)">
                    {{ day }}
                </div>
            </template>
        </div>
        <div style="calc(100% - 40px)">
            <div class="grid grid-cols-2 gap-4 py-2 px-4">
                <template v-for="(playlist) in formattedPlaylists">
                    <PlaylistItem :playlist="playlist" :thumbnail="true" />
                </template>
            </div>
        </div>
    </div>
</template>
<style lang='scss' scoped></style>

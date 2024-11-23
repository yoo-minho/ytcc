<script setup lang="ts">
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const videoDataState = useVideoDataState();
const youtubeApi = useYoutubeApi();

const { data: playlists, status } = youtubeApi.fetchWeeklyVideos();
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

useCustomSeoMeta('weekly');
</script>
<template>
    <div class="w-full flex flex-col">
        <div class="flex justify-between gap-2 px-4 pt-2 mb-2 sticky top-0 z-10 border-b border-white/20 bg-black">
            <template v-for="day in daysLabel">
                <div class="text-center w-8 h-8 cursor-pointer"
                    :class="[day === selectedDayOfWeek ? 'text-white border-b-2' : 'text-white/50']"
                    @click="selectDayOfWeek(day)">
                    {{ day }}
                </div>
            </template>
        </div>
        <div style="calc(100% - 40px)">
            <div class="py-2 px-4">
                <SharedPlaylistList :playlists="formattedPlaylists || []" :status="status" :thumbnail="true"
                    :loading-item-count="8" />
            </div>
        </div>
    </div>
</template>
<style lang='scss' scoped></style>

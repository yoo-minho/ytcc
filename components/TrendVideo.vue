<script setup lang="ts">
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";
import type { TrendingVideoType } from "~/types/comm";
import dayjs from "dayjs";

const youtubeApi = useYoutubeApi();
const videoDataState = useVideoDataState();

const { data: videos, error, status } = youtubeApi.fetchTrendingVideos(MAX_TREND_VIDEO_COUNT);
watch(videos, () => {
    videoDataState.value.trendVideoData = videos.value as TrendingVideoType[];
})

const errorMessage = computed(() => (error.value?.data as any)?.statusMessage);

const selectedDay = ref('어제');

const trendVideoByDay = computed(() => {
    return videoDataState.value.trendVideoData.filter(v => {
        console.log(v.publishedAt, selectedDay.value)
        return v.publishedAt === selectedDay.value
    });
})

function getLastSevenDays() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = dayjs().subtract(i, "day");
        const weekdayIndex = date.day();
        const koreanWeekdays = ['일', '월', '화', '수', '목', '금', '토'];
        let formattedDate;
        if (i === 0) {
            formattedDate = '오늘';
        } else if (i === 1) {
            formattedDate = '어제';
        } else {
            formattedDate = date.format("MM/DD") + `(${koreanWeekdays[weekdayIndex]})`;
        }
        dates.push(formattedDate);
    }
    return dates;
}


</script>
<template>
    <div class="w-full">
        <div class="flex justify-between pt-4 px-4 py-2 sticky top-0 z-10 bg-black">
            <template v-for="day in getLastSevenDays()">
                <div class="text-center h-8 cursor-pointer text-xs"
                    :class="[day === selectedDay ? 'text-primary-500 border-b-2 border-primary-500' : '']"
                    @click="selectedDay = (day)">
                    {{ day }}
                </div>
            </template>
        </div>
        <template v-if="status === 'pending'">
            <div class="p-4 w-full">loading...</div>
        </template>
        <template v-else-if="error">
            <div class="p-4 w-full">
                {{ errorMessage }}
            </div>
        </template>
        <template v-else>
            <template v-if="trendVideoByDay.length === 0">
                <div class="p-4">인기 동영상이 없네요!</div>
            </template>
            <template v-else>
                <div v-for="(video, idx) in trendVideoByDay">
                    <PlaylistPlayListItem :video="video" :idx="idx" class="px-4" />
                </div>
            </template>
        </template>
    </div>
</template>
<style lang="scss" scoped></style>

<script setup lang="ts">
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const videoDataState = useVideoDataState();
const youtubeApi = useYoutubeApi();

const { data: playlists, error, status } = youtubeApi.fetchWeeklyVideos();
videoDataState.value.weeklyVideoData = playlists.value || [];

const formattedPlaylists = computed(() => playlists.value?.filter(p => {
    if (selectedDayOfWeek.value === '') return true;
    return p.day?.includes(selectedDayOfWeek.value)
})
)

const errorMessage = computed(() => (error.value?.data as any).statusMessage);

const today = new Date().getDay();
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const daysLabel = ['시즌', '월', '화', '수', '목', '금', '토', '일', '완결'];
const selectedDayOfWeek = ref(daysOfWeek[today]);

const selectDayOfWeek = (day: string) => {
    selectedDayOfWeek.value = day;
}
</script>
<template>
    <div class="w-full">
        <div class="flex-shrink-0 flex justify-center gap-2 pt-4 px-4 py-2 sticky top-0 z-10 bg-black">
            <template v-for="day in daysLabel">
                <div class="flex justify-center w-10 h-8"
                    :class="[day === selectedDayOfWeek ? 'text-primary-500 border-b-2 border-primary-500' : '']"
                    @click="selectDayOfWeek(day)">
                    {{ day }}
                </div>
            </template>
        </div>
        <div class="flex-1 overflow-y-auto w-full" style="calc(100% - 40px)">
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
                        <PlaylistItem :playlist="playlist" :thumbnail="true" />
                        <UDivider />
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
<style lang='scss' scoped></style>

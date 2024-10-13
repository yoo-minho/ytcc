<script setup lang='ts'>
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";

const displayState = useDisplayState();
const toast = useToast();


const moveMain = () => navigateTo({ path: '/' });

const copyLink = async () => {
    await navigator.clipboard.writeText(location.href);
    toast.add({
        id: "copyLink",
        title: "링크 복사! 공유를 시작하세요!",
        icon: "i-heroicons-check-circle",
    });
} 
</script>
<template>
    <div v-if="displayState.currentPage !== 'video'"
        class="px-4 flex items-center gap-3 h-[60px] border-b border-gray-800 w-full">
        <div v-if="String(displayState.currentPage) !== ''" @click="moveBack()"
            class="flex items-center cursor-pointer">
            <UIcon name="i-ph-arrow-left-bold" size="28px" />
        </div>
        <div class="flex-1 flex items-end">
            <template v-if="displayState.currentPage === 'trend'">
                <span class="text-xl font-bold tracking-tighter">인기 급상승 동영상</span>
            </template>
            <template v-else-if="displayState.currentPage === 'weekly'">
                <span class="text-xl font-bold tracking-tighter">요일 웹 예능 • 프로그램</span>
            </template>
            <template v-else-if="displayState.currentPage === 'playlist'">
                <span class="text-xl font-bold tracking-tighter">플레이리스트</span>
            </template>
            <template v-else>
                <div class="flex items-end" @click="moveMain()">
                    <span class="text-xl font-bold tracking-tighter">Moments</span>
                    <span class="text-xs font-light ml-2 tracking-tight flex flex-wrap items-center">
                        <span class="mr-1">for</span>
                        <UIcon name="i-openmoji-youtube" size="20px" />
                        <span>Youtube</span>
                    </span>
                </div>
            </template>
        </div>
        <!-- <MyIcon :show="displayState.currentPage === ''" name="ph:compass" size="28px" @click="openTrendVideo()" />
        <MyIcon :show="displayState.currentPage === ''" name="ph:calendar-blank" size="28px"
            @click="openWeeklyVideo()" /> -->
        <MyIcon :show="true" name="ph:share-network" size="24px" @click="copyLink()" />
    </div>
</template>

<style lang='scss' scoped></style>

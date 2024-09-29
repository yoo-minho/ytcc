<script setup lang='ts'>
const displayState = useDisplayState();
const toast = useToast();

const openTrendVideo = () => {
    displayState.value.currentPage = 'TREND';
}

const openWeeklyVideo = () => {
    displayState.value.currentPage = 'WEEKLY';
}

const moveMain = () => {
    displayState.value.currentPage = '';
}

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
    <div class="px-4 flex items-center gap-3 h-[60px] border-b border-gray-800 w-full">
        <div v-if="displayState.currentPage !== ''" @click="moveMain()" class="flex items-center cursor-pointer">
            <UIcon name="i-ph-arrow-left-bold" size="28px" />
        </div>
        <div class="flex-1 flex items-end">
            <template v-if="displayState.currentPage === 'TREND'">
                <span class="text-xl font-bold tracking-tighter">인기 급상승 동영상 TOP 100</span>
            </template>
            <template v-else-if="displayState.currentPage === 'WEEKLY'">
                <span class="text-xl font-bold tracking-tighter">요일 웹 예능 • 프로그램</span>
            </template>
            <template v-else>
                <div class="flex items-end" @click="moveMain()">
                    <span class="text-xl font-bold tracking-tighter">YTCC</span>
                    <span class="text-xs font-light ml-2 tracking-tight flex flex-wrap items-center">
                        <span class="mr-1">for</span>
                        <UIcon name="i-openmoji-youtube" size="20px" />
                        <span>Youtube</span>
                    </span>
                </div>
            </template>
        </div>
        <div v-if="displayState.currentPage === ''" @click="openTrendVideo()" class="flex items-center cursor-pointer">
            <UIcon name="i-ph-compass" size="28px" />
        </div>
        <div v-if="displayState.currentPage === ''" @click="openWeeklyVideo()" class="flex items-center cursor-pointer">
            <UIcon name="i-ph-calendar-blank" size="28px" />
        </div>
        <div class="flex items-center cursor-pointer" @click="() => copyLink()">
            <UIcon name="i-ph-share-network" size="24px" />
        </div>
    </div>
</template>

<style lang='scss' scoped></style>

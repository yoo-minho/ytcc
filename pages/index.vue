<script setup lang="ts">
import TrendVideo from "@/components/TrendVideo.vue";
import WeeklyVideo from "@/components/WeeklyVideo.vue";
import PlaylistDetail from "@/components/PlaylistDetail.vue";
import SpecialVideo from "@/components/SpecialVideo.vue";

const displayState = useDisplayState();

const pageComponents = {
    trend: TrendVideo,
    weekly: WeeklyVideo,
    playlist: PlaylistDetail,
    special: SpecialVideo,
};

const currentComponent = computed(
    () => pageComponents[displayState.value.currentPage as keyof typeof pageComponents]
);
</script>

<template>
    <div class="relative flex flex-wrap justify-center h-full">
        <LandingHero v-if="displayState.currentPage === ''" class="absolute inset-0 z-10" />
        <WatchPage v-show="displayState.currentPage === 'video'" class="absolute inset-0 z-30 bg-black" />
        <component :is="currentComponent" v-if="currentComponent" class="abolute inset-0 z-20 bg-black" />
    </div>
</template>

<style lang="scss" scoped></style>

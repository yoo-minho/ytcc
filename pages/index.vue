<script setup lang="ts">
import TrendVideo from "@/components/TrendVideo.vue";
import WeeklyVideo from "@/components/WeeklyVideo.vue";
import PlaylistDetail from "@/components/PlaylistDetail.vue";

const displayState = useDisplayState();

const pageComponents = {
    trend: TrendVideo,
    weekly: WeeklyVideo,
    playlist: PlaylistDetail,
};

const currentComponent = computed(
    () => pageComponents[displayState.value.currentPage as keyof typeof pageComponents]
);
</script>

<template>
    <div class="relative flex flex-wrap justify-center h-full">
        <LandingHero v-if="displayState.currentPage === '' && !$route.query.v" class="absolute inset-0 z-10" />
        <WatchPage v-show="$route.query.v" class="absolute inset-0 z-30 bg-black" />
        <component :is="currentComponent" v-if="currentComponent" class="abolute inset-0 z-20 bg-black" />
    </div>
</template>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

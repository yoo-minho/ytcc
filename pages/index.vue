<script setup lang="ts">
const displayState = useDisplayState();
</script>
<template>
    <div class="flex flex-wrap justify-center h-full">
        <LandingHero v-if="displayState.currentPage === ''" />
        <TrendVideo v-if="displayState.currentPage === 'TREND'" />
        <WeeklyVideo v-if="displayState.currentPage === 'WEEKLY'" />
        <VideoDetail v-if="displayState.currentPage === 'DETAIL'" />
    </div>
</template>
<style lang='scss' scoped></style>
<script setup lang="ts">
defineProps<{ videoId: string }>();

const LOOP_TIMES = [10, 15, 30, 60];

const { player, t, currentTime, isMuted, loop, seekTo } = usePlayerProvider();
const 루프경과시간 = computed(() => Math.ceil(Math.max((currentTime.value - t.value), 0)));

watch(루프경과시간, () => {
    if (루프경과시간.value > loop.value) seekTo();
});

const toggleMute = () => {
    if (!player.value) return;

    isMuted.value = !isMuted.value;
    if (isMuted.value) {
        player.value.mute();
    } else {
        player.value.unMute();
        seekTo();
    }
};

const toggleLoop = () => {
    const currentIndex = LOOP_TIMES.indexOf(loop.value);
    const nextIndex = (currentIndex + 1) % LOOP_TIMES.length;
    loop.value = LOOP_TIMES[nextIndex];
};

</script>

<template>
    <div class="h-[60px] flex w-full items-center justify-center px-2 gap-2 opacity-70 tracking-tighter">
        <span>{{ formatSeconds(루프경과시간) }}</span>
        <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="toggleLoop()">
            <div class="flex items-center">
                <UIcon name="i-ph-repeat" size="20px" />
                <div>{{ loop }}초</div>
            </div>
        </UButton>
        <UiYoutubeAppBtn :video-id="videoId" :ui="{ rounded: 'rounded-full' }" text="원본 보기" />
        <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="toggleMute()">
            <div class="flex items-center justify-center gap-1">
                <template v-if="isMuted">
                    <Icon name="ph:speaker-simple-slash-fill" size="20px" />
                    <div>음소거 해제</div>
                </template>
                <Icon v-else name="ph:speaker-simple-high-fill" size="20px" />
            </div>
        </UButton>
    </div>
</template>

<style scoped></style>
<script setup lang="ts">
const displayState = useDisplayState();
const scrollPosition = ref(0);
const scrollContainer = ref<HTMLElement | null>(null);

watch(() => displayState.value.currentPage, (afterPage, beforePage) => {
    const { scroll } = displayState.value;
    beforePage = beforePage || 'landing';

    // console.log({ afterPage, beforePage })

    if (['video'].includes(beforePage) && scroll[afterPage] > 0) {
        nextTick(() => {
            setTimeout(() => {
                if (scrollContainer.value) {
                    scrollContainer.value.scrollTop = scroll[afterPage];
                }
            }, 0);
        });
    } else {
        displayState.value.scroll = {
            ...scroll,
            [beforePage]: scrollPosition.value,
        }
        if (scrollContainer.value) {
            scrollContainer.value.scrollTop = 0;
        }
    }
})
</script>
<template>
    <div class="flex justify-center">
        <div class="min-w-xs max-w-[430px] w-full flex flex-col h-dvh bg-black text-white">
            <UNotifications />
            <LayoutDefaultHeader />
            <!-- <div class="absolute bottom-2 right-2 bg-yellow-500 bg-opacity-90 z-50 m-12 w-[240px]">
                scrollPosition :: {{ scrollPosition }}
                displayState.scrollPositon :: {{ displayState.scroll }}
            </div> -->
            <div class="flex-1 overflow-y-auto" ref="scrollContainer"
                @scroll="scrollPosition = ($event.target as HTMLElement).scrollTop">
                <slot />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

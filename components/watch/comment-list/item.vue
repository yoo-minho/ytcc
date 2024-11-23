<script setup lang="ts">
const props = defineProps<{ videoId: string; comment: TimelineCommentType }>();

const { currentTime, t, loop, scrollToElement } = usePlayerProvider();
const filterComments = computed(() => props.comment.comments
    .filter((v) => Boolean(v.comment.trim()))
    .splice(0, 3));

const progressWidth = ref(0);

watch(currentTime, () => {
    if (props.comment.sec === t.value) {
        const elapsedTime = currentTime.value - props.comment.sec;
        if (elapsedTime > 0 && elapsedTime < loop.value) {
            progressWidth.value = Math.min((elapsedTime / loop.value) * 100, 100);
            if (elapsedTime <= 0.5) scrollToElement();
        } else {
            progressWidth.value = 0;
        }
    } else {
        progressWidth.value = 0;
    }
});
</script>
<template>
    <div class="dark">
        <UCard class="flex gap-2 relative overflow-hidden rounded-none cursor-pointer" :ui="{
            body: { base: 'w-full', padding: 'p-4 sm:p-4' },
        }">
            <div class="absolute top-0 left-0 h-full w-full bg-blue-500 opacity-10"
                :style="{ width: `${progressWidth}%` }"></div>
            <div class="flex gap-2">
                <div class="flex-1 flex flex-col items-start gap-1" style="width: 100%">
                    <div style="color: #3ea6ff">
                        <div class="tracking-tight text-[13px]">{{ comment.videoTitle }}</div>
                        <div class="flex justify-between w-full">
                            <div class="flex gap-2">
                                <span> {{ formatSeconds(comment.sec) }}</span>
                                <span class="opacity-30">~ {{ formatSeconds(comment.sec + loop) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex flex-col">
                        <template v-for="(c) in filterComments">
                            <p class="flex gap-1">
                                <span class="w-[16px] text-gray-400">
                                    <Icon name="iconamoon:comment-dots-thin" />
                                </span>
                                <span class="text-[13px] line-clamp-2 tracking-tighter text-gray-400">
                                    {{ c.comment }}
                                </span>
                            </p>
                        </template>
                    </div>
                    <div class="flex justify-between w-full gap-2 items-center">
                        <div v-if="comment.totalLikeCount > 0" class="flex items-center gap-1"
                            :class="{ 'animate-bounce': comment.sec === t }">
                            <Icon name="heroicons:hand-thumb-up" class="like-icon" />
                            <div>{{ formatCount(comment.totalLikeCount) }}</div>
                        </div>
                        <div v-else></div>
                        <div v-if="comment.comments.length > 1" class="flex items-center gap-1 flex-1">
                            <Icon name="iconamoon:comment-dots-thin" />
                            <div>{{ formatCount(comment.comments.length) }}</div>
                        </div>
                        <div v-else></div>
                        <div class="flex gap-2">
                            <!-- <UiYoutubeAppBtn :video-id="videoId" :time="comment.sec" /> -->
                            <UiShareIcon :t="comment.sec" />
                        </div>
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>

<style lang="scss" scoped>
.like-icon {
    transition: transform 0.2s ease-in-out;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-2px);
    }
}

.animate-bounce {
    animation: bounce 0.5s infinite;
}
</style>

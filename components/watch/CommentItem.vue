<script setup lang="ts">
import type { TimelineCommentType } from "@/types/comm";

const props = defineProps<{ comment: TimelineCommentType }>();

const { currentTime, t, loop } = usePlayerProvider(); // 현재 재생 시간 추적
const filterComments = computed(() => props.comment.comments.map((v) => v.comment.trim())
    .filter(Boolean)
    .splice(0, 3));

const progressWidth = ref(0);

watch(currentTime, () => {
    if (props.comment.sec === t.value) {
        const elapsedTime = currentTime.value - props.comment.sec;
        if (elapsedTime > 0 && elapsedTime < loop.value) {
            progressWidth.value = Math.min((elapsedTime / loop.value) * 100, 100);
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
                    <div class="flex justify-between w-full">
                        <div class="flex gap-2" style="color: #3ea6ff">
                            <span> {{ formatSeconds(comment.sec) }}</span>
                            <span class="opacity-30">~ {{ formatSeconds(comment.sec + loop) }}</span>
                        </div>
                    </div>
                    <div class="w-full flex flex-col">
                        <template v-for="(text) in filterComments">
                            <p class="line-clamp-2 tracking-tighter text-[13px]">
                                <Icon name="material-symbols:subdirectory-arrow-right" /> {{ text }}
                            </p>
                        </template>
                    </div>
                    <div class="flex justify-between w-full">
                        <div v-if="comment.totalLikeCount > 0" class="flex items-center gap-1"
                            :class="{ 'animate-bounce': comment.sec === t }">
                            <UIcon name="i-heroicons-hand-thumb-up" class="like-icon" />
                            <div>{{ formatCount(comment.totalLikeCount) }}</div>
                        </div>
                        <div v-else></div>
                        <div>
                            <ShareIcon :t="comment.sec" />
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

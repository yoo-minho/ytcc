<script setup lang="ts">
import type { TimelineCommentType } from "@/types/comm";

const props = defineProps<{ comment: TimelineCommentType }>();

const { currentTime, t, loop } = usePlayerProvider(); // 현재 재생 시간 추적
const filterComments = [...props.comment.comments]
    .filter((c) => c.likeCount > 0)
    .splice(0, 3);

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
                    <div class="w-full overflow-hidden">
                        <p class="text-[13px] line-clamp-3 text-ellipsis overflow-hidden">
                            {{
                                filterComments
                                    .map((v) => v.comment.trim())
                                    .filter(Boolean)
                                    .join(" / ")
                            }}
                        </p>
                    </div>
                    <div class="flex justify-between w-full">
                        <div class="flex items-center gap-1 text-base">
                            <UIcon name="i-heroicons-hand-thumb-up" />
                            <div>{{ formatCount(comment.totalLikeCount) }}</div>
                        </div>
                        <div>
                            <ShareIcon :t="comment.sec" />
                        </div>
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>

<style lang="scss" scoped></style>

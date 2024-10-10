<script setup lang='ts'>
import type { TimelineCommentType } from '@/types/comm';

const props = defineProps<{ comment: TimelineCommentType; }>();

const { currentTime, t, loop } = usePlayerProvider(); // 현재 재생 시간 추적
const filterComments = [...props.comment.comments].filter(c => c.likeCount > 0).splice(0, 3);

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
})
</script>

<template>
    <div class="dark">
        <UCard class="flex gap-2 relative overflow-hidden rounded-none" :ui="{
            body: { base: 'w-full', padding: 'px-4 py-5 sm:p-3' }
        }">
            <div class="absolute top-0 left-0 h-full w-full bg-blue-500 opacity-10"
                :style="{ width: `${progressWidth}%` }">
            </div>
            <div class="flex gap-2">
                <div class="flex-1 flex flex-col items-start gap-1" style="width: 0;">
                    <div class="flex justify-between w-full">
                        <div style="color:#3ea6ff">
                            {{ formatSeconds(comment.sec) }}
                        </div>
                        <ShareIcon :t="comment.sec" />
                    </div>
                    <template v-for="(v, i) in filterComments">
                        <div class="flex w-full gap-1 text-[13px]">
                            {{ filterComments.length === 1 ? v.comment : `${i + 1}. ${v.comment}
                            (${formatCount(v.likeCount)})` }}
                        </div>
                    </template>
                    <div class="flex items-center gap-1 text-base ">
                        <UIcon name="i-heroicons-hand-thumb-up" />
                        <div>{{ formatCount(comment.totalLikeCount) }}</div>
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>

<style lang='scss' scoped></style>
<script setup lang='ts'>
import type { TimelineCommentType } from '@/types/comm';

const props = defineProps<{ comment: TimelineCommentType; }>();

const { currentTime, currentSec } = usePlayer(); // 현재 재생 시간 추적
const filterComments = [...props.comment.comments].filter(c => c.likeCount > 0).splice(0, 5);

const progressWidth = ref(0);
watch(currentTime, () => {
    if (props.comment.sec === currentSec.value) {
        const elapsedTime = currentTime.value - props.comment.sec;
        if (elapsedTime > 0 && elapsedTime < 10) {
            const duration = 10; // 10초
            progressWidth.value = Math.min((elapsedTime / duration) * 100, 100);
        } else {
            progressWidth.value = 0;
        }
    } else {
        progressWidth.value = 0;
    }
})

const copyCheck = ref('');
const copyTimelineCommentLink = (sec: number) => {
    const toast = useToast();
    navigator.clipboard.writeText(window.location.href)
        .then(() => {
            toast.add({ title: '클립보드에 복사하였습니다!' });
            copyCheck.value = '-check';
            setTimeout(() => {
                copyCheck.value = '';
            }, 3000);
        })
        .catch(err => {
            toast.add({ title: '잠시 후 다시 시도해주세요!' });
        });
}
</script>

<template>
    <UCard class="flex gap-2 relative overflow-hidden rounded-none" :ui="{
        body: { base: 'w-full', padding: 'px-4 py-5 sm:p-3' }
    }">
        <div class="absolute top-0 left-0 h-full w-full bg-blue-500 opacity-10" :style="{ width: `${progressWidth}%` }">
        </div>
        <div class="flex gap-2">
            <div class="flex-1 flex flex-col items-start gap-1" style="width: 0;">
                <div style="color:#3ea6ff">
                    {{ formatSeconds(comment.sec) }}
                </div>
                <template v-for="(v, i) in filterComments">
                    <div class="flex w-full gap-1">
                        <template v-if="filterComments.length === 1">
                            <div class="text-sm font-medium w-full text-left">
                                {{ v.comment }}
                            </div>
                        </template>
                        <template v-else>
                            <div class="text-sm font-medium w-full text-left">
                                {{ i + 1 }}. {{ v.comment }} ({{ formatCount(v.likeCount) }})
                            </div>
                        </template>
                    </div>
                </template>
                <div class="flex items-center gap-1 text-base ">
                    <UIcon name="i-heroicons-hand-thumb-up" />
                    <div>{{ formatCount(comment.totalLikeCount) }}</div>
                </div>
            </div>
            <div>
                <UIcon :name="`i-heroicons-clipboard-document${copyCheck}`" class="cursor-pointer"
                    @click.stop="copyTimelineCommentLink(comment.sec)" />
            </div>
        </div>
    </UCard>
</template>

<style lang='scss' scoped>
.class {}
</style>
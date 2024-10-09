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

onMounted(() => {
    sharable.value = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) && !!navigator.share
})

const sharable = ref(false);
const copyCheck = ref('');
const toast = useToast();

const getShareUrl = (sec?: number) => {
    const url = new URL(window.location.href);
    if (sec) url.searchParams.set('t', sec.toString());
    if (loop.value !== 10) url.searchParams.set('loop', loop.value.toString());
    return url.toString();
};

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.add({ title: '클립보드에 복사하였습니다!' });
        copyCheck.value = '-check';
        setTimeout(() => copyCheck.value = '', 3000);
    } catch (err) {
        toast.add({ title: '잠시 후 다시 시도해주세요!' });
    }
};

const shareContent = async (url: string) => {
    try {
        await navigator.share({
            title: '타임라인 댓글 공유',
            text: '이 시간대의 댓글을 확인해보세요!',
            url
        });
        console.log('공유 성공');
    } catch (error) {
        console.error('공유 실패:', error);
    }
};

const shareTimelineComment = (sec?: number) => {
    const url = getShareUrl(sec);
    sharable.value ? shareContent(url) : copyToClipboard(url);
};
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

<style lang='scss' scoped>
.class {}
</style>
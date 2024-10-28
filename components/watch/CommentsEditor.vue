<script setup lang="ts">
import type { TimelineCommentType } from '@/types/comm';
import dayjs from 'dayjs';

const isOpenEditor = defineModel<boolean>();
const props = defineProps<{ comments: TimelineCommentType[] }>();

const topN = ref('');
const copyTxt = ref('');

onMounted(() => {
    watch(() => props.comments, () => {
        topN.value = `TOP ${props.comments.length || ''}`;
        copyTxt.value = [
            `<타임라인 댓글 ${topN.value}>으로 주요장면 다시보기`,
            [...props.comments]
                .sort((a, b) => a.sec - b.sec)
                .map(comment => [
                    formatSeconds(comment.sec),
                    truncateString(comment.comments[0].comment, 25),
                    `(👍${formatCount(comment.totalLikeCount)})`
                ].join(' ')
                ).join('\n'),
            ``,
            `시청해 주셔서 감사합니다`,
            '좋아요와 구독은 큰 힘이 됩니다',
            ``,
            `위 데이터는`,
            `과거 ${topN.value} 입니다. (${dayjs().format('YYYY년 MM월 DD일 HH시')} 기준)`,
            `현재 ${topN.value} 궁금하다면 아래 사이트로 방문해주세요!`,
            `${location.href.replace(location.origin, 'https://yttc.vercel.app')}`,
            ``,
            ``,
        ].join('\n');
    })
})
</script>
<template>
    <div v-if="isOpenEditor" class="flex-1 p-4">
        <div class="flex items-center justify-between pb-4">
            <div><b>타임라인 댓글 만들기</b></div>
            <UButton>복사</UButton>
        </div>
        <UTextarea :model-value="copyTxt" color="primary" variant="outline" placeholder="Search..." :rows="12" />
    </div>
</template>

<style lang="scss" scoped></style>

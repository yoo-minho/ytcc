<script setup lang="ts">
import type { TimelineCommentType } from '@/types/comm';

const { currentSec, seekTo } = usePlayerProvider();

definePageMeta({ layout: 'shorts' });

const route = useRoute();
const { v: videoId, list: listId, t } = route.query;
const time = ref();

const backPage = () => {
    if (listId) {
        navigateTo(`/playlist?v=${listId}`, { replace: true })
    } else {
        navigateTo('/', { replace: true })
    }
}

const isOpenEditor = ref(false);
const toggleEditor = () => {
    isOpenEditor.value = !isOpenEditor.value
}

const comments = ref<TimelineCommentType[]>();

const headerMessage = computed(() => {
    const _comment = comments.value?.find((comment: any) => comment.sec === currentSec.value)?.comments[0].comment;
    const defaultComment = `댓글 누르면 쇼츠 재생`
    return _comment || defaultComment;
})

const { data, status, error } = await useFetch<TimelineCommentType[]>(`/api/time-comment/${videoId}`, {
    lazy: true,
    server: false,
});

watch(data, () => {
    if (!data.value) return;

    comments.value = data.value;
    time.value = Number(t) || comments.value?.[0].sec || 0;
});
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="h-[60px] flex justify-center items-center">
            <div class="p-6 truncate text-4xl font-bold tracking-tighter">
                {{ headerMessage }}
            </div>
        </div>
        <YoutubePlayer :video-id="String(videoId)" :t="time" />
        <div class="flex-1 flex flex-col h-0 bg-gray-900 rounded-t-3xl mt-2">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-800 gap-2">
                <div class="flex-1"><b>인기 타임라인 댓글</b></div>
                <div v-if="(comments?.length || 0) > 0" class="flex cursor-pointer" @click="toggleEditor()">
                    <UIcon name="i-heroicons-sparkles-solid" size="20px" />
                </div>
                <div class="flex cursor-pointer mr-[-6px]" @click="backPage()">
                    <UIcon name="i-heroicons-x-mark-20-solid" size="32px" />
                </div>
            </div>
            <div class="flex-1 overflow-scroll">
                <template v-if="status === 'error'">
                    <div class="p-4 flex w-full h-full justify-center items-center">
                        {{ error?.data.message }}
                    </div>
                </template>
                <template v-else-if="status === 'pending'">
                    <div class="p-4 flex w-full h-full justify-center items-center">
                        loading...
                    </div>
                </template>
                <template v-else-if="comments && comments.length === 0">
                    <div class="p-4 flex flex-col w-full h-full justify-center items-center gap-2">
                        이 콘텐츠에는 인기 있는 타임라인 댓글이 없습니다.<br>
                        유튜브에서 타임라인 댓글을 작성해보세요!
                        <UButton>유튜브로 이동</UButton>
                    </div>
                </template>
                <template v-else>
                    <div class="flex flex-col">
                        <template v-for="(comment, idx) in comments">
                            <WatchCommentItem :comment="comment" @click="seekTo(comment.sec)" />
                        </template>
                    </div>
                </template>
            </div>
        </div>
        <CommentsEditor v-model="isOpenEditor" :comments="comments || []" />
    </div>
</template>

<style lang="scss" scoped></style>

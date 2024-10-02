<script setup lang="ts">
import type { TimelineCommentType } from '@/types/comm';

const { player, currentSec, seekTo } = usePlayerProvider();
const route = useRoute();
const { v: videoId, list: listId, t, beforePage } = route.query;

const backPage = () => {
    console.log('backPage', route.query);
    if (beforePage) {
        navigateTo({ query: { page: beforePage } }, { replace: true });
    } else if (listId) {
        navigateTo(`/playlist?v=${listId}`, { replace: true })
    } else {
        navigateTo('/', { replace: true })
    }
}

const isOpenEditor = ref(false);
const toggleEditor = () => (isOpenEditor.value = !isOpenEditor.value);

const { data: comments, status, error } = await useAsyncData<TimelineCommentType[]>('time-comment', () => $fetch<TimelineCommentType[]>(`/api/time-comment/${videoId}`), {
    lazy: true,
    server: false,
});

const headerMessage = ref('');
const time = ref();
watch([() => currentSec.value, () => comments.value], () => {
    const _comment = comments.value?.find((comment: any) => comment.sec === currentSec.value)?.comments[0].comment;
    headerMessage.value = _comment || '';

    time.value = Number(t) || comments.value?.[0].sec || 0;
})

const isMuted = ref(true);
const toggleMute = () => {
    if (isMuted.value) {
        player.value.unMute();
        isMuted.value = false;
    } else {
        player.value.mute();
        isMuted.value = true;
    }
}
</script>

<template>
    <div class="flex flex-col h-full w-full">
        <div class="h-[60px] flex justify-center items-center">
            <div class="p-6 truncate text-4xl font-bold tracking-tighter">
                {{ headerMessage }}
            </div>
        </div>
        <YoutubePlayer :video-id="String(videoId)" :t="time" />
        <div class="flex-1 flex flex-col h-0 bg-gray-900 rounded-t-3xl mt-2">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-800 gap-2">
                <div class="flex-1 text-xl tracking-tight"><b>인기 타임라인 댓글 TOP {{ comments?.length || '' }}</b></div>
                <div class="flex cursor-pointer" @click="toggleEditor()">
                    <UIcon name="i-heroicons-sparkles-solid" size="24px" />
                </div>
                <div class="flex cursor-pointer" @click="toggleMute()">
                    <UIcon :name="isMuted ? 'i-ph-speaker-simple-slash-fill' : 'i-ph-speaker-simple-high-fill'"
                        size="24px" />
                </div>
                <div class="flex cursor-pointer" @click="backPage()">
                    <UIcon name="i-ph-x-bold" size="28px" />
                </div>
            </div>
            <div class="flex-1 overflow-scroll">
                <template v-if="status === 'error'">
                    <div class="p-4 flex w-full h-full justify-center items-center">
                        {{ error }}
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

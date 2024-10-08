<script setup lang="ts">
import type { TimelineCommentType } from '@/types/comm';

const { player, currentSec, isMuted, loopTime, seekTo } = usePlayerProvider();
const route = useRoute();
const { v: videoId, t } = route.query;

const isOpenEditor = ref(false);
const toggleEditor = () => (isOpenEditor.value = !isOpenEditor.value);

const { data, status, error } = await useAsyncData('time-comment',
    () => $fetch<{ comments: TimelineCommentType[], channelTitle: string }>(`/api/time-comment/${videoId}`), {
    lazy: true,
    server: false,
});

const comments = ref();
const channelTitle = ref();

channelTitle.value = '채널이름';

watch(data, () => {
    comments.value = data.value?.comments;
    channelTitle.value = data.value?.channelTitle;
})

const headerMessage = ref('');
const time = ref();
watch([() => currentSec.value, () => comments.value], () => {
    const _comment = comments.value?.find((comment: any) => comment.sec === currentSec.value)?.comments[0].comment;
    headerMessage.value = _comment || '댓글 누르면 쇼츠 플레이';

    time.value = Number(t) || comments.value?.[0].sec || 0;
})

const toggleMute = () => {
    if (isMuted.value) {
        player.value.unMute();
        isMuted.value = false;
    } else {
        player.value.mute();
        isMuted.value = true;
    }
}

const toggleLoop = () => {
    const loopTimes = [10, 15, 30, 60];
    const currentIndex = loopTimes.indexOf(loopTime.value);
    const nextIndex = (currentIndex + 1) % loopTimes.length;
    loopTime.value = loopTimes[nextIndex];

    seekTo(currentSec.value);
}
</script>

<template>
    <div class="flex flex-col h-full w-full">

        <div class="h-[60px] flex justify-center items-center">
            <div class="p-6 truncate text-4xl font-bold tracking-tighter">
                {{ headerMessage }}
            </div>
        </div>
        <YoutubePlayer :video-id="String(videoId)" :t="time" :isMuted="isMuted" />
        <div class="h-[60px] flex justify-center items-center">
            <div class="p-6 truncate font-bold tracking-tighter flex items-center gap-1">
                <UIcon name="i-openmoji-youtube" size="48px" />
                <span class="text-[24px]">{{ channelTitle }}</span>
            </div>
        </div>
        <div class="h-[60px] flex w-full items-center justify-between px-4 gap-2 border-b border-gray-800">
            <div class="flex items-center justify-center ">
                <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="toggleMute()">
                    <UIcon :name="isMuted ? 'i-ph-speaker-simple-slash-fill' : 'i-ph-speaker-simple-high-fill'"
                        size="20px">
                    </UIcon>
                </UButton>
            </div>
            <div class="w-[80px]">
                <UButton color="black" class="flex items-center justify-center gap-1" @click="toggleLoop()">
                    <UIcon name="i-ph-repeat" size="24px" />
                    <div>{{ loopTime }}초</div>
                </UButton>
            </div>
            <div class="flex-1 flex items-center justify-end ">

            </div>
        </div>
        <div class="flex-1 flex flex-col h-0 bg-gray-900">
            <div class="p-4 border-b border-gray-800">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex-1 tracking-tight flex items-center gap-2 font-bold">
                        인기 타임라인 댓글
                        <div class="flex cursor-pointer" @click="toggleEditor()">
                            <UIcon name="i-heroicons-sparkles-solid" size="20px" />
                        </div>
                    </div>

                    <div class="flex cursor-pointer" @click="moveBack()">
                        <UIcon name="i-ph-x" size="28px" />
                    </div>
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
                        <template v-for="( comment ) in  comments ">
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

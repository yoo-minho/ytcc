<script setup lang="ts">
import type { TimelineCommentType } from '@/types/comm';

const { player, t, isMuted, loop, scrollContainer, seekTo, scrollToElement } = usePlayerProvider();

const isOpenEditor = ref(false);
const toggleEditor = () => (isOpenEditor.value = !isOpenEditor.value);

const videoId = ref();
const route = useRoute();
watch(() => route.query.v, () => {
    videoId.value = route.query.v ? String(route.query.v) : undefined;
}, { immediate: true })

type CommentType = { comments: TimelineCommentType[], channelTitle: string };

const { data, status, error } = await useAsyncData('time-comment',
    () => {
        if (!videoId.value) return Promise.resolve({ comments: [], channelTitle: '' });
        return $fetch<CommentType>(`/api/time-comment/${videoId.value}`);
    }, {
    lazy: true,
    server: false,
    watch: [videoId],
});

const comments = ref();
const channelTitle = ref('채널이름');
const headerMessage = ref('');

watch(data, () => {
    channelTitle.value = data.value?.channelTitle || '채널이름';
    comments.value = data.value?.comments;
    t.value = comments.value?.[0]?.sec || 0;
    headerMessage.value = comments.value?.[0]?.comments[0].comment || '댓글 누르면 쇼츠 플레이';
})

watch(t, () => {
    headerMessage.value = comments.value?.find((v: any) => v.sec === t.value)?.comments[0].comment || '댓글 누르면 쇼츠 플레이';
    scrollToElement();
})

const toggleMute = () => {
    if (isMuted.value) {
        player.value.unMute();
        isMuted.value = false;
        seekTo(t.value);
    } else {
        player.value.mute();
        isMuted.value = true;
    }
}

const toggleLoop = () => {
    const loopTimes = [10, 15, 30, 60];
    const currentIndex = loopTimes.indexOf(loop.value);
    const nextIndex = (currentIndex + 1) % loopTimes.length;
    loop.value = loopTimes[nextIndex];

    seekTo(t.value);
    scrollToElement();
}
</script>

<template>
    <div class="flex flex-col h-full w-full">
        <div class="h-[60px] flex justify-center items-center">
            <div class="p-6 truncate text-4xl font-bold tracking-tighter">
                {{ headerMessage }}
            </div>
        </div>
        <YoutubePlayer :video-id="videoId" />
        <!-- <div class="h-[60px] flex justify-center items-center">
            <div class="p-6 truncate font-bold tracking-tighter flex items-center gap-1">
                <UIcon name="i-openmoji-youtube" size="48px" />
                <span class="text-[24px]">{{ channelTitle }}</span>
            </div>
        </div> -->
        <div class="h-[60px] flex w-full items-center justify-center px-2 gap-2 opacity-70 tracking-tighter">
            <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="toggleMute()">
                <div class="flex">
                    <MyIcon :show="isMuted" name="ph:speaker-simple-slash-fill" size="20px" />
                    <MyIcon :show="!isMuted" name="ph:speaker-simple-high-fill" size="20px" />
                </div>
            </UButton>
            <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="scrollToElement()">
                <MyIcon :show="true" name="ph:gps-fix-fill" size="20px" />
            </UButton>
            <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="toggleLoop()">
                <div class="flex items-center">
                    <UIcon name="i-ph-repeat" size="20px" />
                    <div>{{ loop }}초</div>
                </div>
            </UButton>
            <UButton color="black" :ui="{ rounded: 'rounded-full' }" class="flex items-center justify-center gap-1"
                @click="openYouTubeApp(videoId)">
                <UIcon name="i-openmoji-youtube" size="24px" />
                <div>유튜브 앱에서 즐기기</div>
            </UButton>
        </div>
        <div class="flex-1 flex flex-col h-0 bg-gray-900">
            <div class="p-4 border-b border-gray-800">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex-1 tracking-tight flex items-center gap-2 font-bold">
                        타임라인 댓글 <div>[ 인기순 ]</div>
                        <div class="flex cursor-pointer" @click="toggleEditor()">
                            <UIcon name="i-heroicons-sparkles-solid" size="20px" />
                        </div>
                    </div>
                    <div class="flex cursor-pointer" @click="moveBack()">
                        <UIcon name="i-ph-x" size="28px" />
                    </div>
                </div>
            </div>
            <div class="flex-1 overflow-scroll" ref="scrollContainer">
                <template v-if="status === 'error'">
                    <div class="p-4 flex w-full h-full justify-center items-center">
                        {{ error }}
                    </div>
                </template>
                <template v-else-if="['idle', 'pending'].includes(status)">
                    <div class="p-4 flex w-full h-full justify-center items-center">
                        로딩중...
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
                        <template v-for="(comment) in comments">
                            <WatchCommentItem :id="`comment-${comment.sec}`" :comment="comment"
                                @click="seekTo(comment.sec); scrollToElement()" />
                        </template>
                    </div>
                </template>
            </div>
        </div>
        <CommentsEditor v-model="isOpenEditor" :comments="comments || []" />
    </div>
</template>

<style lang="scss" scoped></style>

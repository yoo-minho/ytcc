<script setup lang="ts">
import type { TimelineCommentType } from '@/types/comm';
import dayjs from 'dayjs';

import { usePlayerState } from '@/composables/useState/usePlayerState';

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

definePageMeta({
    layout: 'shorts',
});

const route = useRoute();
const router = useRouter();
const { v: videoId, list: listId, t } = route.query;

const backPage = () => {
    if (listId) {
        navigateTo(`/playlist?v=${listId}`, { replace: true })
    } else {
        navigateTo('/', { replace: true })
    }
}

let player: any;
let playerTimer: any;
const commentsWrapEl = ref();
const playerState = usePlayerState(); // 현재 재생 시간 추적
const currentSec = ref();
const duration = ref(formatSeconds(0));
let timeUpdateInterval: any; // 타임 업데이트를 위한 interval

const copyTxt = ref('');
const isOpenEditor = ref(false);

const toggleEditor = () => {

    if (isOpenEditor.value) {
        isOpenEditor.value = false;
    } else {
        if (!comments.value) return;
        isOpenEditor.value = true;
        copyTxt.value = [
            `<타임라인 댓글 ${topN.value}>으로 주요장면 다시보기`,
            [...comments.value]
                .sort((a, b) => a.sec - b.sec)
                .map(comment => [
                    formatSeconds(comment.sec),
                    truncateString(comment.comments[0].comment, 25),
                    `(👍${comment.totalLikeCount})`
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
        ].join('\n')
    }
}

const seekTo = (sec: number) => {
    player.playVideo();
    player.seekTo(sec, true);
    router.push({ query: { ...route.query, t: sec } });

    currentSec.value = sec;
    clearTimeout(playerTimer);
    playerTimer = setTimeout(() => {
        currentSec.value = 0;
    }, (10 * 1000));
};

const comments = ref<TimelineCommentType[]>();
const commentsLoading = ref(false);
const topN = computed(() => `TOP ${comments.value?.length || ''}`);

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
    commentsLoading.value = status.value === "pending";

    if (window.YT) {
        setYoutubePlayer(window.YT);
    } else {
        window.onYouTubeIframeAPIReady = () => setYoutubePlayer(window.YT);
    }
});

function setYoutubePlayer(YT: any) {
    const { Player, PlayerState } = YT;
    player = new Player("youtube-player", {
        videoId,
        playerVars: {
            controls: 0, // 0: 숨김, 1: 표시
            autoplay: 1, // 자동 재생 활성화
            mute: 0, // 음소거 (1: 음소거, 0: 음소거 해제)
            rel: 0, // 관련 동영상 표시 여부 (0: 표시 안 함)
            modestbranding: 1, // YouTube 로고 표시 여부 (1: 최소화)
            disablekb: 1,
            cc_load_policy: 3, // 자막 완전 비활성화
            cc_lang_pref: "none", // 자막 언어 선호도 없음
            hl: "none", // 플레이어 언어 설정 없음
        },
        events: {
            onReady: (event: any) => {
                duration.value = formatSeconds(player?.getDuration());
                console.log("onReady");

                const firstSeekTime = Number(t || comments.value?.[0].sec || 0);
                seekTo(firstSeekTime); // 동영상 재생 시작
            },
            onStateChange: (event: any) => {
                console.log("Player state changed:", event.data);

                // 재생 상태일 때 타임 업데이트 시작
                if (event.data === PlayerState.PLAYING) {
                    if (!timeUpdateInterval) {
                        const updateTime = () => {
                            playerState.value.currentTime = player.getCurrentTime();
                            requestAnimationFrame(updateTime);
                        };
                        requestAnimationFrame(updateTime);
                    }
                }

                // 일시정지 또는 정지 상태일 때 타임 업데이트 중지
                if (event.data === PlayerState.PAUSED || event.data === PlayerState.ENDED) {
                    clearInterval(timeUpdateInterval);
                    clearTimeout(playerTimer);
                    timeUpdateInterval = null;
                    currentSec.value = 0;
                    playerState.value.currentTime = 0;
                }

                console.log('event.data', event.data, PlayerState)
            },
        },
    });
}
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="h-[60px] flex justify-center items-center">
            <div class="p-8 truncate text-4xl font-bold tracking-tighter">
                {{ headerMessage }}
            </div>
        </div>
        <div class="w-full" style="aspect-ratio: 16 / 9">
            <div id="youtube-player" class="w-full h-full"></div>
        </div>
        <div class="flex-1 flex flex-col h-0 bg-gray-900 rounded-t-3xl mt-2">
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-800 gap-2">
                <div class="flex-1"><b>타임라인 댓글 {{ topN }}</b></div>
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
                <template v-else-if="(comments?.length || 0) > 0">
                    <div ref="commentsWrapEl" class="flex flex-col">
                        <template v-for="(comment, idx) in comments">
                            <WatchCommentItem :idx="idx" :selected="comment.sec === currentSec" :comment="comment"
                                @click="seekTo(comment.sec)" />
                        </template>
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
                    <div class="p-4 flex w-full h-full justify-center items-center">
                        loading...
                    </div>
                </template>
            </div>
        </div>
        <div v-if="isOpenEditor" class="flex-1 p-4">
            <div class="flex items-center justify-between pb-4">
                <div><b>타임라인 댓글 만들기</b></div>
                <UButton>복사</UButton>
            </div>
            <UTextarea :model-value="copyTxt" color="primary" variant="outline" placeholder="Search..." :rows="12" />
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

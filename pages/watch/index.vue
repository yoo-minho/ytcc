<script setup lang="ts">
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
const { v: videoId } = route.query;

let player: any;
let playerTimer: any;
const currentTime = ref(0); // 현재 재생 시간 추적
const currentSec = ref();
const currentFormatTime = computed(() => formatSeconds(currentTime.value));
const duration = ref(formatSeconds(0));
let timeUpdateInterval: any; // 타임 업데이트를 위한 interval

const seekTo = (sec: number) => {
    currentSec.value = sec;
    const prevSec = sec;
    const speed = 1.25;
    player.playVideo();
    player.seekTo(prevSec, true);
    player.setPlaybackRate(speed);
    clearTimeout(playerTimer);
    playerTimer = setTimeout(() => {
        seekTo(sec);
    }, (10 * 1000) / speed);
};

const { data, status } = await useFetch(`/api/time-comment/${videoId}`, {
    lazy: true,
    server: false,
});
const comments = ref();
watch(data, () => {
    comments.value = data.value?.items;
});

const headerMessage = computed(() => {
    const _comment = comments.value?.find((comment: any) => comment.sec === currentSec.value)?.comments[0].comment;
    const defaultComment = `댓글 누르면 쇼츠 재생`
    return _comment || defaultComment;
})

onMounted(() => {
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
            autoplay: 0, // 자동 재생 (0: 비활성, 1: 활성)
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
                console.log("onReady", event.target, event.target.playVideo);
            },
            onStateChange: (event: any) => {
                console.log("Player state changed:", event.data, player, player.getDuration());

                // 재생 상태일 때 타임 업데이트 시작
                if (event.data === PlayerState.PLAYING) {
                    if (!timeUpdateInterval) {
                        timeUpdateInterval = setInterval(() => {
                            currentTime.value = player.getCurrentTime();
                        }, 500); // 500ms마다 업데이트
                    }
                }

                // 일시정지 또는 정지 상태일 때 타임 업데이트 중지
                if (event.data === PlayerState.PAUSED || event.data === PlayerState.ENDED) {
                    clearInterval(timeUpdateInterval);
                    clearTimeout(playerTimer);
                    timeUpdateInterval = null;
                    currentSec.value = 0;
                }
            },
        },
    });
}
</script>

<template>
    <div class="flex flex-col h-full flex-1 cursor-pointer">
        <div class="h-[60px] flex justify-center items-center font-bold text-4xl ">
            <div class="p-8 truncate">
                {{ headerMessage }}
            </div>
        </div>
        <div class="w-full" style="aspect-ratio: 16 / 9">
            <div id="youtube-player" class="w-full h-full"></div>
        </div>
        <div class="flex items-center justify-between p-4 border-b border-gray-800 mt-2" style="background:rgb(17, 24, 39); border-radius: 20px 20px 0 0;
    ">
            <div><b>타임라인 댓글</b> <span class="text-sm">{{ comments?.length }}</span> </div>
            <div class="flex cursor-pointer" @click="navigateTo('/', { replace: true })">
                <UIcon name="i-heroicons-x-mark-20-solid" size="24px" />
            </div>
        </div>
        <div class="flex-1 overflow-scroll">
            <template v-if="status === 'success'">
                <div class="flex flex-col">
                    <template v-for="(comment, idx) in comments">
                        <WatchCommentItem :idx="idx" :selected="comment.sec === currentSec" :comment="comment"
                            @click="seekTo(comment.sec)" />
                    </template>
                </div>
            </template>
            <template v-else>
                <div class="flex w-full h-full justify-center items-center">loading...</div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

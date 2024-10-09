<script setup lang="ts">
const {
    player,
    t,
    isMuted,
    currentTime,
    seekTo,
    updateTime,
    clear,
} = usePlayerProvider();

const props = defineProps<{ videoId: string }>();

onMounted(() => {
    setYoutubePlayer();
});

watch([() => props.videoId], () => {
    player.value?.loadVideoById(props.videoId);
    if (isMuted.value) {
        player.value.mute();
    } else {
        player.value.unMute();
    }
});

watch(t, () => {
    seekTo(t.value);
});

onUnmounted(() => {
    clear();
});

function setYoutubePlayer() {
    const { Player, PlayerState } = (window as any).YT;
    player.value = new Player("youtube-player", {
        videoId: props.videoId,
        playerVars: {
            controls: 0, // 0: 숨김, 1: 표시
            autoplay: 0, // 0: 비활성화, 1: 활성화
            mute: 1, // 음소거 (1: 음소거, 0: 음소거 해제)
            rel: 0, // 관련 동영상 표시 여부 (0: 표시 안 함)
            modestbranding: 1, // YouTube 로고 표시 여부 (1: 최소화)
            disablekb: 1,
            cc_load_policy: 3, // 자막 완전 비활성화
            cc_lang_pref: "none", // 자막 언어 선호도 없음
            hl: "none", // 플레이어 언어 설정 없음
            playsinline: 1, // 인라인 재생 활성화 (모바일에서 중요)
        },
        events: {
            onReady: (event: any) => {
                if (props.videoId && t.value) {
                    seekTo(t.value);
                }
            },
            onStateChange: (event: any) => {
                let animationFrameId: number | null = null;

                if (event.data === PlayerState.PLAYING) {
                    const _updateTime = () => {
                        updateTime();
                        animationFrameId = requestAnimationFrame(_updateTime);
                    };
                    animationFrameId = requestAnimationFrame(_updateTime);
                } else {
                    if (animationFrameId !== null) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }

                    if (event.data === PlayerState.PAUSED || event.data === PlayerState.ENDED) {
                        t.value = 0;
                        currentTime.value = 0;
                        clear();
                    }
                }
            },
            onError: (event: any) => {
                console.error("YouTube 플레이어 오류:", event.data);
            },
        },
    });

    console.log("YouTube 플레이어 설정 완료", player.value);
}
</script>
<template>
    <div class="w-full" style="aspect-ratio: 16 / 9">
        <div id="youtube-player" class="w-full h-full"></div>
    </div>
</template>

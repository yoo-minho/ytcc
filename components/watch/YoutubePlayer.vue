<script setup lang="ts">

const { player, playerLoading, videoId, t, updateTime } = usePlayerProvider();

onMounted(() => {
    player.value = setYoutubePlayer();
});

function setYoutubePlayer() {
    const { Player, PlayerState } = (window as any).YT;
    return new Player("youtube-player", {
        videoId: videoId.value,
        playerVars: {
            controls: 0, // 0: 숨김, 1: 표시
            autoplay: 1, // 0: 비활성화, 1: 활성화 
            mute: 1, // 음소거 (1: 음소거, 0: 음소거 해제)
            rel: 0, // 관련 동영상 표시 여부 (0: 표시 안 함)
            modestbranding: 1, // YouTube 로고 표시 여부 (1: 최소화)
            disablekb: 1, // 키보드 단축키 비활성화
            cc_load_policy: 3, // 자막 비활성화 (1: 활성화, 3: 비활성화)
            cc_lang_pref: "none", // 자막 언어 선호도: 한국어
            hl: "none", // 플레이어 언어 설정: 한국어
            playsinline: 1, // 인라인 재생 활성화 (모바일에서 중요)
            start: t.value, // 시작 시간 지정 (초 단위)
            enablejsapi: 1, // JavaScript API 활성화
        },
        events: {
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

                    // if (event.data === PlayerState.PAUSED || event.data === PlayerState.ENDED) {
                    //     clear();
                    // }
                }
            },
            onError: (event: any) => {
                console.error("YouTube 플레이어 오류:", event.data);
            },
        },
    });
}
</script>
<template>
    <div class="relative">
        <template v-if="playerLoading">
            <div class="absolute inset-0 z-10">
                <div class="w-full h-full flex items-center justify-center bg-gray-900">
                    <div class="w-16 h-16 border-4 border-gray-700 border-t-gray-200 rounded-full animate-spin">
                    </div>
                </div>
            </div>
        </template>
        <div class="w-full" style="aspect-ratio: 16 / 9">
            <div id="youtube-player" class="w-full h-full"></div>
        </div>
    </div>
</template>
<style></style>
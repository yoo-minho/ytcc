<script setup lang="ts">
defineProps<{ videoId?: string; text?: string }>();

const openYouTubeApp = (videoCode?: string) => {
    const youtubeUrl = videoCode ? `https://www.youtube.com/watch?v=${videoCode}` : "https://www.youtube.com/";

    // 모바일 웹 또는 PWA 모바일 웹 확인
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile) {
        if (isPWA) {
            // PWA 모바일 웹일 경우
            const newWindow = window.open(youtubeUrl, '_blank');
            if (newWindow) {
                newWindow.addEventListener('load', () => {
                    window.close(); // 새 창이 로드된 후 기존 PWA 창 닫기
                });
            }
        } else {
            // 일반 모바일 웹일 경우
            const youtubeAppUrl = videoCode ? `vnd.youtube:${videoCode}` : 'vnd.youtube://';

            // 딥링크로 앱 열기 시도
            window.location.href = youtubeAppUrl;

            // 앱이 열리지 않았을 경우 웹 페이지로 이동
            setTimeout(() => {
                if (document.hasFocus()) {
                    window.location.href = youtubeUrl;
                }
            }, 2000); // 2초 후 확인
        }
    } else {
        // 일반 웹일 경우
        navigateTo(youtubeUrl, {
            external: true,
            open: { target: "youtube" },
        });
    }
};

</script>

<template>
    <UButton color="black" class="flex items-center justify-center gap-1" @click="openYouTubeApp(videoId)">
        <Icon name="openmoji:youtube" size="20px" />
        <div class="tracking-tighter">{{ text || "앱 열기" }}</div>
    </UButton>
</template>

<style scoped></style>
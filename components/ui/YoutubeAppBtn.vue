<script setup lang="ts">
defineProps<{ videoId?: string; text?: string; time?: number }>();

const openYouTubeApp = (videoId?: string, time?: number) => {
    const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}${time ? `&t=${time}` : ''}` : "https://www.youtube.com/";

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
            const youtubeAppUrl = videoId ? `vnd.youtube:${videoId}${time ? `?t=${time}` : ''}` : 'vnd.youtube://';

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
    <template v-if="time">
        <Icon name="openmoji:youtube" size="20px" @click="openYouTubeApp(videoId, time)" />
    </template>
    <template v-else>
        <UButton color="black" class="flex items-center justify-center gap-1" @click="openYouTubeApp(videoId)">
            <Icon name="openmoji:youtube" size="20px" s />
            <div class="tracking-tighter">{{ text || "앱 열기" }}</div>
        </UButton>
    </template>
</template>

<style scoped></style>
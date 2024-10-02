<script setup lang="ts">
const url = ref('');
const loading = ref(false);

const makeCollection = () => {
    const { videoId, playlistId } = extractYouTubeInfo(url.value);
    if (videoId === '' && playlistId === '') {
        const toast = useToast();
        toast.add({ title: '유효한 링크가 아닙니다!' })
        return;
    }

    loading.value = true;

    if (videoId) {
        navigateTo({ path: '/watch', query: { v: videoId } });
        return;
    }

    if (playlistId) {
        navigateTo({ path: '/playlist', query: { v: playlistId } });
        return;
    }
}

function extractYouTubeInfo(url: string) {
    //https://youtu.be/sUERlBS2MTU?si=nUOU41IVm1ecJSkT
    //https://www.youtube.com/watch?v=sUERlBS2MTU
    //https://www.youtube.com/playlist?app=desktop&list=PLBKy1umsMi3QKhFNFXEkhZJhUtMCrVrse
    let videoId = '';
    let playlistId = '';
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname === 'youtu.be') {
            videoId = parsedUrl.pathname.slice(1);
        } else if (parsedUrl.hostname.includes('youtube.com')) {
            const searchParams = new URLSearchParams(parsedUrl.search);
            videoId = searchParams.get('v') || '';
            playlistId = searchParams.get('list') || '';
        }
    } catch (error) {
        console.error('URL 파싱 오류:', error);
    }
    return { videoId, playlistId };
}

const texts = ['가장 인기있는 순간', '인기 타임라인 댓글'];
const currentText = ref(texts[0]);

const changeText = () => {
    currentText.value = currentText.value === texts[0] ? texts[1] : texts[0];
};

onMounted(() => {
    setInterval(changeText, 3000);
});

const openApiSite = () => {
    navigateTo('https://developers.google.com/youtube/v3?hl=ko', { external: true });
}
</script>
<template>
    <div class="w-full flex flex-col justify-between">
        <div class="p-4 w-full">
            <div>
                <div class="text-2xl font-bold tracking-tight">유튜브 동영상 링크를 넣어주시면</div>
                <div class="text-2xl font-bold tracking-tight flex">
                    <div class="relative h-8 overflow-hidden w-[172px]">
                        <transition-group name="roll" tag="div">
                            <div v-for="text in texts" :key="text"
                                class="absolute  text-red-500 transition-transform duration-500 ease-in-out"
                                :class="{ 'translate-y-full': text !== currentText, 'translate-y-0': text === currentText }">
                                {{ text }}
                            </div>
                        </transition-group>
                    </div>
                    <div class="inline">을 찾아볼게요</div>
                </div>
            </div>
            <div class="flex gap-2 mt-4">
                <UTextarea v-model="url" color="white" placeholder="Youtube URL" size="xl" class="flex-1" autoresize
                    :rows="1" />
                <UButton color="primary" variant="solid" size="xl" :loading="loading" @click="makeCollection()">
                    <UIcon name="i-ph-magnifying-glass-bold" class="text-white" size="20px" />
                </UButton>
            </div>
        </div>
        <div class="flex flex-col items-center p-4 pb-12">
            <div>Powered by <span class="underline" @click="openApiSite()">YouTubeDataAPI</span></div>
            <div>© 2024 Make1k. All rights reserved.</div>
        </div>
    </div>
</template>
<style scoped>
.roll-move {
    transition: transform 0.5s;
}

.roll-enter-active,
.roll-leave-active {
    transition: transform 0.5s;
}

.roll-enter-from,
.roll-leave-to {
    transform: translateY(100%);
}
</style>

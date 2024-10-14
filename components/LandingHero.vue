<script setup lang="ts">
const url = ref('');
const toast = useToast();

const texts = ['10분', '21분', '34분'];
const currentText = ref(texts[0]);

const changeText = () => {
    currentText.value = currentText.value === texts[0] ? texts[1] : texts[0];
};

onMounted(() => {
    setInterval(changeText, 3000);
});

const makeCollection = () => {
    const { videoId, playlistId, empty } = extractYouTubeInfo(url.value);
    if (empty) return toast.add({ title: '유효한 링크가 아닙니다!' });
    if (videoId) return moveVideoDetail(videoId);
    if (playlistId) return movePlaylistDetail(playlistId)
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
    }
    return { videoId, playlistId, empty: videoId === '' && playlistId === '' };
}

const openApiSite = () => {
    navigateTo('https://developers.google.com/youtube/v3?hl=ko', {
        external: true,
        open: { target: 'developers.google.com/youtube' }
    });
}

const tempComments = [
    {
        sec: 13 * 60 + 56,
        totalLikeCount: 9155,
        comments: [{ comment: '급한 분들은 여기부터 보시면 됩니다', likeCount: 9155 }]
    }
];

// 최근 클립보드 내용을 가져와 URL 입력란에 붙여넣는 함수
const pasteFromClipboard = async () => {
    try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
            if (extractYouTubeInfo(clipboardText.trim()).empty) return;
            url.value = clipboardText.trim();
        }
    } catch (error) {
        console.error('클립보드 접근 오류:', error);
    }
};

const openTrendVideo = () => navigateTo({ query: { page: 'trend' } });
const openWeeklyVideo = () => navigateTo({ query: { page: 'weekly' } });

</script>
<template>
    <div class="w-full flex flex-col justify-between">
        <div class="p-4 w-full flex flex-col gap-4">
            <div>
                <div class="tracking-tight text-center">
                    <span class="font-bold">팬</span>들이 직접 뽑은 유튜브 영상 속
                </div>
                <div class="text-3xl tracking-tighter font-bold text-center">
                    최고 인기있는 <span class="text-red-red-500">10초</span>
                </div>
                <div class="tracking-tight text-center">궁금하다면 링크를 가져오세요!</div>
                <!-- <div class="text-2xl font-bold tracking-tight">유튜브 동영상 링크를 넣어주시면</div> -->
                <!-- <div class="text-2xl font-bold tracking-tight flex">
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
                </div> -->
            </div>

            <div class="flex gap-2 items-center justify-between">
                <UTextarea v-model="url" placeholder="Youtube URL" size="xl" class="dark w-full" autoresize :rows="1"
                    @focus="pasteFromClipboard()" />
                <UButton color="primary" variant="solid" size="xl" @click="makeCollection()">
                    <UIcon name="i-ph-magnifying-glass-bold" class="text-white" size="24px" />
                </UButton>
            </div>
            <UiYoutubeAppBtn text="유튜브 앱 열고 링크 가져오기" />

            <UDivider class="dark" label="OR" />

            <div class="flex gap-2 items-center justify-between">
                <div>
                    <div class="text-2xl tracking-tighter font-bold">
                        인급동 : 인기 급상승 동영상
                    </div>
                </div>
                <UButton color="primary" variant="solid" size="xl" @click="openTrendVideo()">
                    <Icon name="heroicons:fire" size="24px" class="text-white" />
                </UButton>
            </div>

            <UDivider class="dark" label="OR" />

            <div class="flex gap-2 items-center justify-between">
                <div>
                    <div class="text-2xl tracking-tighter font-bold">
                        요일 웹 예능 • 프로그램
                    </div>
                </div>
                <UButton color="primary" variant="solid" size="xl" @click="openWeeklyVideo()">
                    <Icon name="ph:calendar-blank" size="24px" class="text-white" />
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

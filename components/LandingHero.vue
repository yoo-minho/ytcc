<script setup lang="ts">
const url = ref('');

const makeCollection = () => {
    const { videoId, playlistId } = extractYouTubeInfo(url.value);
    if (videoId === '' && playlistId === '') {
        const toast = useToast();
        toast.add({ title: '유효한 링크가 아닙니다!' })
        return;
    }

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
        console.error('URL 파싱 오류:', error);
    }
    return { videoId, playlistId };
}

const texts = ['인기 타임라인 댓글', '인기 타임라인 댓글'];
const currentText = ref(texts[0]);

const changeText = () => {
    currentText.value = currentText.value === texts[0] ? texts[1] : texts[0];
};

onMounted(() => {
    setInterval(changeText, 3000);
});

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
        comments: [{ comment: '[예시] 급한 분들은 여기부터 보시면 됩니다', likeCount: 9155 }]
    }
];
</script>
<template>
    <div class="w-full flex flex-col justify-between">
        <div class="p-4 w-full flex flex-col gap-4">
            <div>
                <div class="text-3xl font-bold tracking-tighter text-center">유튜브 동영상 링크 넣고</div>
                <div class="text-3xl font-bold tracking-tighter text-center">
                    <span class="text-red-red-500">인기 타임라인 댓글</span>
                    찾기
                </div>
            </div>

            <div class="flex gap-2">
                <UTextarea v-model="url" placeholder="Youtube URL" size="xl" class="flex-1 dark" autoresize :rows="1" />
                <UButton color="primary" variant="solid" size="xl" @click="makeCollection()">
                    <UIcon name="i-ph-magnifying-glass-bold" class="text-white" size="20px" />
                </UButton>
            </div>

            <UDivider class="dark" />
            <UButton @click="openYouTubeApp" color="black" class="w-full px-4 py-3 text-md flex justify-center">
                <span class="flex items-center">
                    <UIcon name="i-openmoji-youtube" size="20px" />Youtube
                </span>
                <span>앱 바로가기</span>
            </UButton>

            <UDivider class="dark" />

            <div class="flex flex-col gap-4">
                <div class="text-gray-300 flex flex-col">
                    <span class="flex items-center gap-1 tracking-tighter">
                        <UIcon name="i-ph-question-mark-light" /><span class="font-bold">타임라인 댓글</span>이란
                    </span>
                    <span class="tracking-tighter text-sm">
                        시간과 함께 등록하는 댓글�� 말함! 해당 시점으로 바로 이동가능!
                    </span>
                </div>
                <tempComment v-for="comment in tempComments">
                    <WatchCommentItem :comment="comment" />
                </tempComment>
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

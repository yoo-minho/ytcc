<script setup lang="ts">
import { MAX_TREND_VIDEO_COUNT } from "@/constants/youtube";
import { useYoutubeApi } from "@/composables/api/useYoutubeApi";

const youtubeApi = useYoutubeApi();
const videoDataState = useVideoDataState();

const { data: videos, status: videoStatus } = youtubeApi.fetchTrendingVideos(MAX_TREND_VIDEO_COUNT);
console.log({ videos });
watch(videos, () => {
    videoDataState.value.trendVideoData = videos.value || [];
})

const trend3Videos = computed(() => {
    return [...videoDataState.value.trendVideoData].splice(0, 3);
});

const today = new Date().getDay();
const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
const { data: playlists, status: playlistsStatus } = youtubeApi.fetchWeeklyVideos();
watch(playlists, () => {
    videoDataState.value.weeklyVideoData = playlists.value || []
})

const todayPlaylists = computed(() => {
    return videoDataState.value.weeklyVideoData?.filter(p => p.day?.includes(daysOfWeek[today])).splice(0, 2);
});

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

                <div class="text-3xl tracking-tight font-bold pb-2">
                    영상 <span class="text-red-red-500">최고의 순간</span>을 즐기는 방법
                </div>
                <div class="text-xs tracking-tight">
                    1️⃣ 타임라인 댓글을 인기순으로 모아본다.
                </div>
                <div class="text-xs tracking-tight">
                    2️⃣ 타임라인 댓글을 친구들에게 공유한다.
                </div>
            </div>

            <div class="flex gap-2 items-center justify-between">
                <UTextarea v-model="url" placeholder="Youtube URL" size="xl" class="dark w-full text-xs" autoresize
                    :rows="1" @focus="pasteFromClipboard()" />
            </div>
            <div>
                <UiYoutubeAppBtn v-if="extractYouTubeInfo(url).empty" text="유튜브 앱 열고 링크 가져오기" class="w-full" />
                <UButton v-else color="black" class=" text-white flex items-center justify-center gap-1 w-full"
                    @click="makeCollection()">
                    <Icon name="openmoji:youtube" size="24px" />
                    <div class="tracking-tighter">영상 최고의 순간 찾기</div>
                    <Icon name="openmoji:eyes" size="24px" />
                </UButton>
            </div>

            <UDivider class="dark" />

            <div>
                <div class="flex gap-2 items-center justify-between">
                    <div>
                        <div class="text-xl tracking-tighter font-bold flex items-center gap-1">
                            <MyIcon name="ph:calendar-blank" /> {{ daysOfWeek[today] }}요웹예능
                        </div>
                    </div>
                    <div class="cursor-pointer text-sm text-gray-400 flex items-center" @click="openWeeklyVideo()">
                        전체 보기
                        <MyIcon name="ph:caret-right-bold" />
                    </div>
                </div>
                <div>
                    <div class="grid grid-cols-2 py-2 gap-4">
                        <template v-if="playlistsStatus !== 'success'">
                            <template v-for="n in 2 ">
                                <PlaylistSkeletonItem />
                            </template>
                        </template>
                        <template v-else>
                            <template v-for="(playlist) in todayPlaylists">
                                <PlaylistItem :playlist="playlist" :thumbnail="true" />
                            </template>
                        </template>
                    </div>
                </div>
            </div>

            <UDivider class="dark" />

            <div>
                <div class="flex gap-2 items-center justify-between">
                    <div>
                        <div class="text-xl tracking-tighter font-bold flex items-center gap-1">
                            <Icon name="ph:fire"></Icon> 인기 급상승 동영상
                        </div>
                    </div>
                    <div class="cursor-pointer text-sm text-gray-400 flex items-center" @click="openTrendVideo()">
                        전체 보기 <Icon name="ph:caret-right-bold"></Icon>
                    </div>
                </div>
                <div>
                    <template v-if="videoStatus === 'pending'">
                        <div v-for="n in 3 ">
                            <PlaylistPlayListSkeletonItem />
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="(video, idx) in trend3Videos">
                            <PlaylistPlayListItem :video="video" :idx="idx" />
                        </div>
                    </template>
                </div>
            </div>

            <UDivider class="dark" />


        </div>
        <div class="flex flex-col items-center p-4 pb-12">
            <div>Powered by <span class="underline" @click="openApiSite()">YouTubeDataAPI</span></div>
            <div>© 2024 Make1k. All rights reserved.</div>
        </div>
    </div>
</template>
<style scoped></style>

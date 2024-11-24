<script setup lang="ts">
const videos = [
    {
        title: "하승진",
        thumbnail: "https://i.ytimg.com/vi/DGyKCqqDS9s/mqdefault.jpg",
    }, {
        title: "전태풍",
        thumbnail: "https://i.ytimg.com/vi/eY07DR3Zr5g/mqdefault.jpg",
    }, {
        title: "최윤아",
        thumbnail: "https://i.ytimg.com/vi/dXSCgvlinf4/mqdefault.jpg",
    }, {
        title: "정희현",
        thumbnail: "https://i.ytimg.com/vi/3SjXQ72B_Jg/mqdefault.jpg",
    }, {
        title: "서문세찬",
        thumbnail: "https://i.ytimg.com/vi/B7mI59yKjp8/mqdefault.jpg",
    }, {
        title: "이승구",
        thumbnail: "https://i.ytimg.com/vi/DZElgEOz9-4/mqdefault.jpg",
    }, {
        title: "정연우",
        thumbnail: "https://i.ytimg.com/vi/peQZM0ZTFgo/mqdefault.jpg",
    }, {
        title: "전정민",
        thumbnail: "https://i.ytimg.com/vi/LvlkOHEjS3s/mqdefault.jpg",
    }, {
        title: "하승윤",
        thumbnail: "https://i.ytimg.com/vi/3sZ6CylWvAk/mqdefault.jpg",
    }, {
        title: "최성현",
        thumbnail: "https://i.ytimg.com/vi/DC9m23wrxlc/mqdefault.jpg",
    }, {
        title: "이상현",
        thumbnail: "https://i.ytimg.com/vi/jpsN9hD0OAo/mqdefault.jpg",
    }, {
        title: "정현석",
        thumbnail: "https://i.ytimg.com/vi/sFrgZ17deF8/mqdefault.jpg",
    }, {
        title: "정성훈",
        thumbnail: "https://i.ytimg.com/vi/KaWXrDuZF2o/mqdefault.jpg",
    }
] as TrendingVideoType[];

const movePage = (q: string) => {
    navigateTo({ query: { f: 'turnover', q } });
}

useCustomSeoMeta({
    title: `Special Thanks To "턴오버"`,
    description: '그동안 열정을 담아 이 도전을 완성해주셔서 감사합니다!',
    image: 'https://i.ytimg.com/vi/lnOG6320aNM/mqdefault.jpg',
});
</script>
<template>
    <div class="w-full m-4">
        <div class="flex flex-col gap-2 text-center w-full">
            <div>
                <p class="text-gray-400 mb-[-4px]">Special Thanks To</p>
                <p class="text-white text-3xl font-bold">Turnover 🏀</p>
                <span class="text-sm text-gray-300">2024 KBL 드래프트 도전기</span>
            </div>
            <div class="flex w-full gap-4 text-sm mt-4">
                <div class="w-1/2 text-right text-gray-400 flex flex-col gap-2">
                    <p>전체 에피소드</p>
                    <p>시작 에피소드</p>
                    <p>마지막 에피소드</p>
                </div>
                <div class="w-1/2 text-left text-gray-300 flex flex-col gap-2">
                    <p>55화</p>
                    <p>2023-9-23 (EP0)</p>
                    <p>2024-11-18 (EP54)</p>
                </div>
            </div>
            <div class="mt-4">
                <p class="text-gray-400">출연진</p>
            </div>
        </div>
        <div class="flex flex-col gap-8 p-4 items-center">
            <template v-for="(video) in videos">
                <div class="cursor-pointer flex flex-col w-1/2" @click="movePage(video.title)">
                    <img class="w-full rounded-md" :src="video.thumbnail" alt="Video Thumbnail"
                        style="aspect-ratio: 16 / 9;">
                    <p class="text-white text-xl tracking-widest font-light text-center mt-1">
                        {{ video.title }}
                    </p>
                </div>
            </template>
        </div>
        <div class="flex flex-col gap-2 text-center w-full my-4">
            <div class="flex flex-col gap-4">
                <span class="text-sm text-gray-300">그동안 열정을 담아</span>
                <span class="text-sm text-gray-300">이 도전을 완성해주셔서 감사합니다!</span>
                <p class="text-white text-3xl font-bold">End</p>
            </div>
        </div>
    </div>
</template>

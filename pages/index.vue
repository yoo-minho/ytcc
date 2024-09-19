<script setup lang="ts">
const url = ref('');
const loading = ref(false);

const makeCollection = () => {
    const videoId = extractYouTubeVideoId(url.value);
    if (videoId === null) {
        const toast = useToast();
        toast.add({ title: '유효한 링크가 아닙니다!' });
        return;
    }

    loading.value = true;
    navigateTo({ path: '/watch', query: { v: videoId } });
}

function extractYouTubeVideoId(url: string) {
    //https://youtu.be/sUERlBS2MTU?si=nUOU41IVm1ecJSkT
    //https://www.youtube.com/watch?v=sUERlBS2MTU
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const { data, status } = await useFetch(`/api/trend`, { lazy: true, server: false });
const videos = ref();

watch(data, () => {
    videos.value = data.value;
})
</script>
<template>
    <div class="p-4 w-full flex flex-col gap-4 ">
        <UInput v-model="url" color="primary" variant="outline" placeholder="Youtube URL 붙여넣기" size="xl" />
        <UButton color="primary" variant="solid" size="xl" :loading="loading" @click="makeCollection()">시간 댓글 모아보기
        </UButton>
    </div>
    <div v-for="video in videos">
        <TrendVideoItem :video="video"></TrendVideoItem>
    </div>
</template>
<style lang='scss' scoped></style>

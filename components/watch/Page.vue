<script setup lang="ts">
const { headerMessage, changeT } = usePlayerProvider();

const videoId = ref();
const comments = ref<TimelineCommentType[]>([]);
const route = useRoute();

watch(
  () => route.query.v,
  () => {
    videoId.value = route.query.v ? String(route.query.v) : undefined;
    headerMessage.value = "댓글 누르면 순간 플레이";
  },
  { immediate: true }
);

const { data, status, error } = await useAsyncData(
  "time-comment",
  async () => {
    if (!videoId.value) return { comments: [], channelTitle: "", thumbnail: "", title: "" };
    return await $fetch<TimelineCommentWrapType>(`/api/time-comment/${videoId.value}`);
  },
  { watch: [videoId] }
);

watch(data, () => {
  comments.value = data.value?.comments || [];
  const firstSec = comments.value[0]?.sec || 0;
  changeT(firstSec, comments.value);
}, { immediate: true });

useSeoMeta({
  title: headerMessage,
  ogTitle: headerMessage,
  description: data.value?.videoTitle,
  ogDescription: data.value?.videoTitle,
  twitterCard: "summary_large_image",
  ogImage: data.value?.thumbnail || '/og-image.png'
});
</script>
<template>
  <div class="flex flex-col h-full w-full">
    <div class="h-[60px] flex justify-center items-center">
      <div class="p-6 truncate text-3xl font-bold tracking-tighter">
        {{ headerMessage }}
      </div>
    </div>
    <WatchYoutubePlayer :video-id="videoId" :status="status" />
    <template v-if="videoId">
      <WatchVideoFooter :video-id="videoId" :video-title="data?.videoTitle" :channel-title="data?.channelTitle"
        :channel-thumbnail="data?.channelThumbnail" />
    </template>
    <div class="flex-1 flex flex-col h-0 bg-gray-900">
      <div class="flex items-center justify-between gap-2 p-4 border-b border-gray-800 h-[60px]">
        <div class="flex-1 tracking-tight flex items-center gap-2 font-bold">
          타임라인 댓글
          <div>{{ data?.commentCount }}</div>
          <div class="bg-white text-black rounded-md px-2 py-1 text-sm">인기순</div>
        </div>
        <div class="flex cursor-pointer" @click="moveBack()">
          <UIcon name="i-ph-x" size="28px" />
        </div>
      </div>
      <template v-if="videoId">
        <WatchCommentList :comments="comments" :video-id="videoId" :status="status" :error="error"
          @change-time="(sec) => changeT(sec, comments)" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

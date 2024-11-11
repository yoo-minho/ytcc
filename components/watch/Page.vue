<script setup lang="ts">
const { headerMessage, changeT } = usePlayerProvider();

const videoId = ref();
const comments = ref<TimelineCommentType[]>([]);
const route = useRoute();

const { data, status, error } = await useAsyncData(
  "time-comment",
  async () => {
    if (!videoId.value) return;
    return await $fetch<TimelineCommentWrapType>(`/api/time-comment/${videoId.value}`);
  },
  { watch: [videoId] }
);

watch(
  () => route.query.v,
  () => {
    console.log('route.query.v', route.query.v, data.value)
    if (route.query.v) {
      videoId.value = String(route.query.v);
      headerMessage.value = "댓글 누르면 순간 플레이";
    }
    if (data.value) {
      const targetSec = comments.value[0]?.sec || 0
      changeT(targetSec, comments.value);
    }
  },
  { immediate: true }
);

watch(data, () => {
  comments.value = data.value?.comments || [];
  let targetSec;
  if (route.query.t) {
    targetSec = Number(route.query.t);
  } else {
    targetSec = comments.value[0]?.sec || 0
  }
  changeT(targetSec, comments.value);
}, { immediate: true });

// watch(() => route.query.t, () => {
//   if (!route.query.t) {
//     const targetSec = comments.value[0]?.sec || 0
//     changeT(targetSec, comments.value);
//   }
// })

const videoInfo = computed(() => data.value?.videoInfo);

if (route.query.v) {
  useSeoMeta({
    title: headerMessage,
    ogTitle: headerMessage,
    description: videoInfo.value?.videoTitle,
    ogDescription: videoInfo.value?.videoTitle,
    twitterCard: "summary_large_image",
    ogImage: videoInfo.value?.thumbnail || '/og-image.png'
  });
}
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
      <WatchVideoFooter :video-id="videoId" :video-info="videoInfo" />
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

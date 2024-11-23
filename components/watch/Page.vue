<script setup lang="ts">
const { headerMessage, t, videoId, seekTo } = usePlayerProvider();

const route = useRoute();
const router = useRouter();

const id = computed(() => {
  if (route.query.f) return String(route.query.f).split("-")[0];
  return route.query.v ? String(route.query.v) : "";
});

const { data, status, error } = await useAsyncData(
  `time-comment-${id.value}`,
  async () => {
    if (!id.value) return { comments: [], commentCount: 0, videoInfo: undefined };

    const specialFor = String(route.query.f).split("-");
    if (specialFor.length === 2) {
      return await $fetch<TimelineCommentWrapType>(`/api/time-comment/${id.value}`, {
        query: { f: specialFor[1] },
      });
    } else {
      return await $fetch<TimelineCommentWrapType>(`/api/time-comment/${id.value}`);
    }
  },
  { watch: [id] }
);

// 1. t가 있는 상태로 새로고침 ( route.query.t => sec => refresh => t 동일 )
// 2. 메인에서 들어오면서 t가 갱신됨 ( data.value => sec => refresh => t 동일 )
// 3. 댓글을 눌러서 t 변경 ( refresh => t 새로 => sec => refresh )

const sec = computed(() =>
  route.query.t ? Number(route.query.t) : data.value?.comments[0]?.sec || 0
);
const comments = computed(() => data.value?.comments || []);

watch(
  () => route.query.v,
  () => {
    if (route.query.v) {
      videoId.value = String(route.query.v);
    } else {
      videoId.value = comments.value[0]?.videoId || "";
    }
  },
  { immediate: true }
);

watch(
  comments,
  () => {
    seekToSec(sec.value);
  },
  { immediate: true }
);

function seekToSec(sec: number, _videoId?: string) {
  headerMessage.value =
    comments.value.find((v) => v.sec === sec)?.comments[0].comment ||
    "댓글 누르면 순간 플레이";

  if (sec && sec !== t.value) {
    if (_videoId) {
      router.push({ replace: true, query: { ...route.query, v: _videoId, t: sec } });
      t.value = sec;
      videoId.value = _videoId;
    } else {
      router.push({ replace: true, query: { ...route.query, t: sec } });
      t.value = sec;
    }
  }

  seekTo();
}

const videoInfo = computed(() => data.value?.videoInfo);

// SEO 메타 데이터 설정
if (route.query.v || route.query.f) {
  useSeoMeta({
    ogUrl: useRequestURL().href,
    title: headerMessage,
    ogTitle: headerMessage,
    description: videoInfo.value?.videoTitle,
    ogDescription: videoInfo.value?.videoTitle,
    twitterCard: "summary_large_image",
    ogImage: videoInfo.value?.thumbnail || "/og-image.png",
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
      <template v-if="id">
        <WatchCommentList :comments="comments" :video-id="videoId" :status="status" :error="error"
          @change-time="(sec, videoId) => seekToSec(sec, videoId)" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

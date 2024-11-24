<script setup lang="ts">
import { useYoutubeApi } from "~/composables/api/useYoutubeApi";

const { headerMessage, t, videoId, seekTo, scrollToElement } = usePlayerProvider();
const route = useRoute();
const router = useRouter();

const youtubeApi = useYoutubeApi();
const { data, status, error } = await youtubeApi.fetchTimeComments();

const comments = computed(() => data.value?.comments || []);
const videoInfo = computed(() => data.value?.videoInfo);

const sec = computed(() =>
  route.query.t ? Number(route.query.t) : comments.value[0]?.sec || 0
);

watch(
  comments,
  (newComments) => {
    if (newComments.length === 0) return;

    videoId.value = route.query.v
      ? String(route.query.v)
      : comments.value[0]?.videoId || "";
    seekToSec(sec.value, videoId.value);
  },
  { immediate: true }
);

function seekToSec(sec: number, _videoId?: string) {
  headerMessage.value =
    comments.value.find((v) => v.sec === sec)?.comments[0].comment ||
    "댓글 누르면 순간 플레이";

  // console.log('seekToSec', { sec, _videoId, t: t.value })

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

  seekTo(sec, _videoId);
  setTimeout(() => {
    scrollToElement();
  }, 0);
}

// SEO 메타 데이터 설정
const displayState = useDisplayState();
if (displayState.value.currentPage === "video") {
  const getTitle = (title: string) =>
    title.length > 20 ? title.slice(0, 20) + "..." : title;
  useCustomSeoMeta({
    title: `[공유하고픈순간❤️] ${getTitle(headerMessage.value)}`,
    description: videoInfo.value?.videoTitle || "",
    image: videoInfo.value?.thumbnail || "/og-image.png",
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
      <WatchCommentList :comments="comments" :video-id="videoId" :status="status" :error="error"
        @change-time="(sec, videoId) => seekToSec(sec, videoId)" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

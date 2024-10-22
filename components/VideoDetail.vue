<script setup lang="ts">
const {
  player,
  t,
  currentTime,
  isMuted,
  loop,
  scrollContainer,
  seekTo,
  scrollToElement,
} = usePlayerProvider();

const isOpenEditor = ref(false);
const toggleEditor = () => (isOpenEditor.value = !isOpenEditor.value);

const videoId = ref();
const route = useRoute();

watch(
  () => route.query.v,
  () => {
    videoId.value = route.query.v ? String(route.query.v) : undefined;
  },
  { immediate: true }
);


const { data, status, error } = await useAsyncData(
  "time-comment",
  async () => {
    if (!videoId.value) return { comments: [], channelTitle: "" };
    return await $fetch<TimelineCommentWrapType>(`/api/time-comment/${videoId.value}`);
  },
  {
    lazy: true,
    server: false,
    watch: [videoId],
  }
);

const comments = ref();
const channelTitle = ref("채널이름");
const headerMessage = ref("");

const updateHeaderMessage = (comment: string = "댓글 누르면 순간 플레이") => {
  headerMessage.value = comment;
};

const findCommentAtCurrentTime = () => {
  if (t.value === 0) return;

  const targetComment = comments.value?.find((v: any) => v.sec === t.value);
  return targetComment?.comments[0]?.comment;
};

const setTime = (sec: number) => {
  t.value = sec;
}

const 루프경과시간 = computed(() => Math.ceil(Math.max((currentTime.value - t.value), 0)));

watch(data, () => {
  if (data.value) {
    channelTitle.value = data.value.channelTitle || "채널이름";
    comments.value = data.value.comments;
    setTime(comments.value?.[0]?.sec || 0);
  }
});

watch(t, () => {
  console.log('tttt', t.value)
  seekTo();
  updateHeaderMessage(findCommentAtCurrentTime());
  scrollToElement();
});

watch(루프경과시간, () => {
  if (루프경과시간.value > loop.value) {
    console.log('루프경과시간', 루프경과시간.value)
    seekTo();
  }
});

const toggleMute = () => {
  if (!player.value) return;

  isMuted.value = !isMuted.value;

  if (isMuted.value) {
    player.value.mute();
  } else {
    player.value.unMute();
    seekTo();
  }
};

const toggleLoop = () => {
  const loopTimes = [10, 15, 30, 60];
  const currentIndex = loopTimes.indexOf(loop.value);
  const nextIndex = (currentIndex + 1) % loopTimes.length;
  loop.value = loopTimes[nextIndex];
};

route.query.loop && (loop.value = Number(route.query.loop));

const loading = computed(() => {
  return ['idle', 'pending'].includes(status.value)
})
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div class="h-[60px] flex justify-center items-center">
      <div class="p-6 truncate text-3xl font-bold tracking-tighter">
        {{ headerMessage }}
      </div>
    </div>

    <YoutubePlayer :video-id="videoId" :loading="loading" />

    <div class="h-[60px] flex w-full items-center justify-center px-2 gap-2 opacity-70 tracking-tighter">
      <!-- <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="scrollToElement()">
        <MyIcon :show="true" name="ph:gps-fix-fill" size="20px" />
      </UButton> -->
      <span>{{ formatSeconds(루프경과시간) }}</span>
      <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="toggleLoop()">
        <div class="flex items-center">
          <UIcon name="i-ph-repeat" size="20px" />
          <div>{{ loop }}초</div>
        </div>
      </UButton>
      <UiYoutubeAppBtn :video-id="videoId" :ui="{ rounded: 'rounded-full' }" />
      <UButton color="black" :ui="{ rounded: 'rounded-full' }" @click="toggleMute()">
        <div class="flex items-center justify-center gap-1">
          <template v-if="isMuted">
            <Icon name="ph:speaker-simple-slash-fill" size="20px" />
            <div>음소거 해제</div>
          </template>
          <Icon v-else name="ph:speaker-simple-high-fill" size="20px" />
        </div>
      </UButton>
    </div>
    <div class="flex-1 flex flex-col h-0 bg-gray-900">
      <div class="p-4 border-b border-gray-800">
        <div class="flex items-center justify-between gap-2">
          <div class="flex-1 tracking-tight flex items-center gap-2 font-bold">
            타임라인 댓글
            <div class="bg-white text-black rounded-md px-2 py-1 text-sm">인기순</div>
            <div class="flex cursor-pointer" @click="toggleEditor()">
              <UIcon name="i-heroicons-sparkles-solid" size="20px" />
            </div>
          </div>
          <div class="flex cursor-pointer" @click="moveBack()">
            <UIcon name="i-ph-x" size="28px" />
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-scroll" ref="scrollContainer">
        <template v-if="status === 'error'">
          <div class="p-4 flex w-full h-full justify-center items-center">
            {{ error }}
          </div>
        </template>
        <template v-else-if="['idle', 'pending'].includes(status)">
          <div class="flex flex-col">
            <template v-for="n in 3">
              <WatchSkeletonCommentItem />
            </template>
          </div>
        </template>
        <template v-else-if="comments && comments.length === 0">
          <div class="p-4 flex flex-col w-full h-full justify-center items-center gap-2">
            이 콘텐츠에는 타임라인 댓글이 없습니다.<br />
            첫번째 타임라인 댓글을 작성해보세요!
            <UiYoutubeAppBtn :video-id="videoId" />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col">
            <template v-for="comment in comments">
              <WatchCommentItem :id="`comment-${comment.sec}`" :video-id="videoId" :comment="comment"
                @click="setTime(comment.sec)" />
            </template>
          </div>
        </template>
      </div>
    </div>
    <CommentsEditor v-model="isOpenEditor" :comments="comments || []" />
  </div>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
defineProps<{
  videoId: string;
  videoInfo?: VideoInfoType
}>();

const LOOP_TIMES = [10, 15, 30, 60];

const { player, t, currentTime, isMuted, loop, seekTo } = usePlayerProvider();
const 루프경과시간 = computed(() => Math.ceil(Math.max(currentTime.value - t.value, 0)));

watch(루프경과시간, () => {
  if (루프경과시간.value > loop.value) seekTo();
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
  const currentIndex = LOOP_TIMES.indexOf(loop.value);
  const nextIndex = (currentIndex + 1) % LOOP_TIMES.length;
  loop.value = LOOP_TIMES[nextIndex];
};
</script>

<template>
  <div class="h-[90px] w-full px-4">
    <template v-if="videoInfo">
      <div class="flex h-full">
        <div class="flex-1 flex flex-col justify-center gap-2">
          <span class="flex items-center gap-2 tracking-tight justify-between">
            <div class="flex items-center gap-2 cursor-pointer"
              @click="openYouTube({ channelId: videoInfo.channelId })">
              <img :src="videoInfo.channelThumbnail" class="w-[30px] h-[30px] rounded-full border border-white/40" />
              <span class="font-bold">@{{ videoInfo.channelTitle }}</span>
            </div>
            <div class="flex items-end gap-2">
              <div
                class="flex items-center justify-center bg-gray-300 rounded-full w-[30px] h-[30px] cursor-pointer opacity-60"
                @click="toggleLoop()">
                <div class="text-gray-700 text-sm">{{ loop }}s</div>
              </div>
              <div class="flex items-center justify-center gap-1 rounded-full w-[30px] h-[30px] cursor-pointer"
                :class="isMuted ? `bg-red-700` : `bg-gray-300 opacity-60`" @click="toggleMute()">
                <Icon v-if="isMuted" name="ph:speaker-simple-slash-fill" size="16px" class="text-white" />
                <Icon v-else name="ph:speaker-simple-high-fill" size="16px" class="text-gray-700" />
              </div>
            </div>
          </span>
          <span class="ml-1 line-clamp-1 tracking-tighter cursor-pointer" @click="openYouTube({ videoId })">
            ▶<span class="ml-2"> {{ videoInfo.videoTitle }} </span>
          </span>
        </div>
      </div>
    </template>
    <template v-else> </template>
  </div>
</template>

<style scoped></style>

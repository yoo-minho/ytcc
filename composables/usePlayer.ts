import type { YouTubePlayer } from "youtube-player/dist/types";

const player = ref<YouTubePlayer>();
const scrollContainer = ref<HTMLElement | null>(null);
const currentTime = ref(0); //지금 선택한 시간
const videoId = ref("");
const isMuted = ref(true);
const loop = ref(10);
const t = ref(0);
const headerMessage = ref("");
const playerLoading = ref(false);

export function usePlayerProvider() {
  const route = useRoute();

  if (route.query.loop) {
    loop.value = Number(route.query.loop);
  }

  const updateTime = async () => {
    if (player.value?.getCurrentTime) {
      currentTime.value = await player.value.getCurrentTime();
    }
  };

  const scrollToElement = () => {
    if (scrollContainer.value) {
      const elementId = `comment-${t.value}`;
      const element = document.getElementById(elementId);
      if (element) {
        scrollContainer.value.scrollTo({
          top: element.offsetTop - scrollContainer.value.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  const seekTo = async (sec?: number, videoId?: string) => {
    if (videoId) {
      await player.value?.loadVideoById?.(videoId, sec);
    } else {
      await player.value?.seekTo?.(sec || t.value, true);
      await player.value?.playVideo?.();
    }
    playerLoading.value = false;
  };

  const playerContext = {
    player,
    videoId,
    t,
    currentTime,
    isMuted,
    loop,
    scrollContainer,
    headerMessage,
    playerLoading,
    updateTime,
    seekTo,
    scrollToElement,
  };
  return playerContext;
}

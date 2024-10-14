import type { YouTubePlayer } from "youtube-player/dist/types";

let playerTimer: any = null;

const player = ref<YouTubePlayer>();
const scrollContainer = ref<HTMLElement | null>(null);
const currentTime = ref(0);
const videoId = ref("");
const isMuted = ref(true);
const loop = ref(5);
const t = ref();

export function usePlayerProvider() {
  const route = useRoute();

  if (route.query.loop) {
    loop.value = Number(route.query.loop);
  }
  if (route.query.t) {
    t.value = Number(route.query.t);
  }

  const updateTime = async () => {
    if (player.value?.getCurrentTime) {
      currentTime.value = await player.value.getCurrentTime();
    }
  };

  const clear = () => {
    player.value?.stopVideo();
    clearTimeout(playerTimer);
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

  const seekTo = (sec: number) => {
    if (player.value && player.value.playVideo && sec > 0) {
      t.value = sec;

      console.log("시작", { sec });

      player.value.playVideo();
      player.value.seekTo(sec, true);

      clearTimeout(playerTimer);
      playerTimer = setTimeout(() => {
        seekTo(sec);
      }, loop.value * 1000);
    }
  };

  const playerContext = {
    player,
    videoId,
    t,
    currentTime,
    isMuted,
    loop,
    scrollContainer,
    updateTime,
    seekTo,
    scrollToElement,
    clear,
  };
  provide("playerContext", playerContext);
  return playerContext;
}

export function usePlayer() {
  const context = inject<any>("playerContext");
  if (!context) {
    throw new Error("usePlayer는 PlayerProvider 내에서 사용되어야 합니다");
  }
  return context;
}

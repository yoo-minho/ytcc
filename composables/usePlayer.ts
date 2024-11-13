import type { YouTubePlayer } from "youtube-player/dist/types";

let playerTimer: any = null;

const player = ref<YouTubePlayer>();
const scrollContainer = ref<HTMLElement | null>(null);
const currentTime = ref(0);
const videoId = ref("");
const isMuted = ref(true);
const loop = ref(10);
const t = ref(0);
const headerMessage = ref("");

export function usePlayerProvider() {
  const route = useRoute();
  const router = useRouter();

  if (route.query.loop) {
    loop.value = Number(route.query.loop);
  }

  if (route.query.v) {
    videoId.value = String(route.query.v);
  }

  const updateTime = async () => {
    if (player.value?.getCurrentTime) {
      currentTime.value = await player.value.getCurrentTime();
    }
  };

  const clear = () => {
    player.value?.pauseVideo();
    currentTime.value = 0;
    clearTimeout(playerTimer);
    headerMessage.value = "댓글 누르면 순간 플레이";

    if (!!route.query.v) return;

    t.value = 0;
    const query = { ...route.query };
    delete query.t;
    router.push({ query });
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

  const seekTo = () => {
    player.value?.seekTo?.(t.value, true);
  };

  const changeT = (sec: number) => {
    if (!sec) return;

    router.push({ replace: true, query: { ...route.query, t: sec } });
    t.value = sec;
    seekTo();
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
    updateTime,
    seekTo,
    scrollToElement,
    changeT,
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

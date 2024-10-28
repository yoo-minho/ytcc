import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import type { YouTubePlayer } from "youtube-player/dist/types";

let playerTimer: any = null;

const player = ref<YouTubePlayer>();
const scrollContainer = ref<HTMLElement | null>(null);
const currentTime = ref(0);
const videoId = ref("");
const isMuted = ref(true);
const loop = ref(10);
const t = ref(0);

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

  const setT = (sec: number) => {
    t.value = sec;
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

  const seekTo = async () => {
    if (player.value?.playVideo) {
      if (t.value === 0) {
        player.value.stopVideo();
        return;
      }

      try {
        await player.value.playVideo();
      } catch (e) {
        console.log("player.value.playVideo 1", player.value.playVideo);
        console.log("player.value.playVideo 2", e);
      }

      // 재생이 시작될 때까지 대기합니다.
      await new Promise<void>((resolve) => {
        const checkPlayingState = async () => {
          const state = await player.value?.getPlayerState();
          if (state === PlayerStates.PLAYING) {
            // 1은 재생 중 상태
            resolve();
          } else {
            setTimeout(checkPlayingState, 50); // 50ms 간격으로 재확인
          }
        };
        checkPlayingState();
      });

      await player.value.seekTo(t.value, true);
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
    setT,
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

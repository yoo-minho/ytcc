let playerTimer: any;

const player = ref<any>(null);
const currentTime = ref(0);
const isMuted = ref(true);
const loopTime = ref(10);
const currentSec = ref();

export function usePlayerProvider() {
  const route = useRoute();

  if (route.query.loop) {
    loopTime.value = Number(route.query.loop);
  }
  if (route.query.t) {
    currentSec.value = Number(route.query.t);
  }

  const updateTime = () => {
    if (player.value.getCurrentTime) {
      currentTime.value = player.value.getCurrentTime();
    }
  };

  const clear = () => {
    clearTimeout(playerTimer);
  };

  const seekTo = (sec: number) => {
    if (player.value && player.value.playVideo) {
      currentSec.value = sec;

      player.value.playVideo();
      player.value.seekTo(sec, true);

      clearTimeout(playerTimer);
      playerTimer = setTimeout(() => {
        seekTo(sec);
      }, loopTime.value * 1000);
    }
  };

  const playerContext = {
    player,
    currentSec,
    currentTime,
    isMuted,
    loopTime,
    updateTime,
    seekTo,
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

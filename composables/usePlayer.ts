let playerTimer: any;
const player = ref<any>(null);
const currentSec = ref();
const currentTime = ref(0);

export function usePlayerProvider() {
  const updateTime = () => {
    currentTime.value = player.value.getCurrentTime();
  };

  const seekTo = (sec: number) => {
    if (player.value) {
      player.value.playVideo();
      player.value.seekTo(sec, true);

      const route = useRoute();
      const router = useRouter();
      router.push({ query: { ...route.query, t: sec } });

      currentSec.value = sec;
      clearTimeout(playerTimer);
      playerTimer = setTimeout(() => {
        currentSec.value = 0;
      }, 10 * 1000);
    }
  };

  const playerContext = {
    player,
    currentSec,
    currentTime,
    updateTime,
    seekTo,
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

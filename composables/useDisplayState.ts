let watchInitialized = false;

export const useDisplayState = () => {
  const route = useRoute();
  const state = useState("display", () => ({
    currentPage: String(route.query.page || ""),
    scroll: {} as any,
  }));

  if (!watchInitialized) {
    watchInitialized = true;

    watch(
      () => route.query,
      () => {
        const route = useRoute();
        if (!!route.query.v || !!route.query.f) {
          state.value.currentPage = "video";
        } else {
          state.value.currentPage = (route.query.page as string) || "";
        }
      },
      { immediate: true, deep: true }
    );

    watch(
      () => route.query.v,
      () => {
        const route = useRoute();
        const { player, playerLoading, headerMessage } = usePlayerProvider();
        if (!!route.query.v) {
          if (!!route.query.f) {
            // console.log("playerLoading.value = pass;");
          } else {
            playerLoading.value = true;
            // console.log("playerLoading.value = true;");
          }
        } else {
          headerMessage.value = "댓글 누르면 순간 플레이";
          player.value?.pauseVideo?.();
        }
      },
      { immediate: true }
    );
  }

  return state;
};

export const moveBack = () => {
  const router = useRouter();
  if (history.state.back) {
    router.back();
  } else {
    const route = useRoute();
    const query: { page?: string } = {};
    if (route.query.v) {
      if (route.query.page) {
        query.page = route.query.page as string;
      }
      navigateTo({ path: "/", query, replace: true });
      return;
    }
    navigateTo({ path: "/", replace: true });
  }
};

export const moveVideoDetail = (videoId: string, search?: boolean) => {
  if (search) {
    const { gtag } = useGtag();
    gtag("event", "search_click", {
      category: "Search",
      action: "click",
      label: `video-${videoId}`,
    });
  }
  navigateTo({ query: { v: videoId } });
};

export const movePlaylistDetail = (listId: string, search?: boolean) => {
  if (search) {
    const { gtag } = useGtag();
    gtag("event", "search_click", {
      category: "Search",
      action: "click",
      label: `playlist-${listId}`,
    });
  }
  const query = {
    page: "playlist",
    list: listId,
  } as any;
  navigateTo({ query });
};

let watchInitialized = false;

const getPage = () => {
  const route = useRoute();

  if (route.query.v) {
    return "video";
  }

  if (route.query.f && !route.query.page) {
    return "video";
  }

  return String(route.query.page || "");
};

export const useDisplayState = () => {
  const route = useRoute();
  const state = useState("display", () => ({
    currentPage: getPage(),
    scroll: {} as any,
  }));

  if (!watchInitialized) {
    watchInitialized = true;

    watch(
      () => route.query,
      () => {
        state.value.currentPage = getPage();
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
            console.log("playerLoading.value = pass;", route.query);
          } else {
            playerLoading.value = true;
            console.log("playerLoading.value = true;", route.query);
          }
        } else {
          console.log("pauseVideo", route.query);
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

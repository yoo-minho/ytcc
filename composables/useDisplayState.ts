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
        if (!!route.query.v) {
          state.value.currentPage = "video";
        } else {
          state.value.currentPage = (route.query.page as string) || "";
        }
      },
      { immediate: true, deep: true }
    );
  }

  return state;
};

export const moveBack = () => {
  const router = useRouter();
  if (history.state.back) {
    router.back();
  } else {
    navigateTo({ path: "/", replace: true });
  }
};

export const moveVideoDetail = (videoId: string) => {
  navigateTo({ query: { v: videoId } });
};

export const movePlaylistDetail = (listId: string) => {
  const query = {
    page: "playlist",
    list: listId,
  } as any;
  navigateTo({ query });
};

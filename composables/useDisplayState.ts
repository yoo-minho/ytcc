let watchInitialized = false;

export const useDisplayState = () => {
  const route = useRoute();
  const state = useState("display", () => ({
    currentPage: route.query.page || "",
    firstVideoDetail: true,
  }));

  if (!watchInitialized) {
    watchInitialized = true;
    watch(
      () => route.query.page,
      (newPage) => {
        state.value.currentPage = (newPage as string) || "";
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
    navigateTo({ path: "/", replace: true });
  }
};

export const moveVideoDetail = (videoId: string) => {
  const query = {
    page: "video",
    v: videoId,
  } as any;
  navigateTo({ query });

  useDisplayState().value.firstVideoDetail = false;
};

export const movePlaylistDetail = (listId: string) => {
  const query = {
    page: "playlist",
    list: listId,
  } as any;
  navigateTo({ query });
};

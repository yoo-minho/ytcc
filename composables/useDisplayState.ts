let watchInitialized = false;

export const useDisplayState = () => {
  const route = useRoute();
  const state = useState("display", () => ({
    currentPage: route.query.page || "",
  }));

  if (!watchInitialized) {
    watchInitialized = true;
    watch(
      () => route.query.page,
      (newPage) => {
        console.log("useDisplayState", newPage);
        state.value.currentPage = (newPage as string) || "";
      },
      { immediate: true }
    );
  }

  return state;
};

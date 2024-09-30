export const useDisplayState = () =>
  useState("display", () => ({
    currentPage: "",
  }));

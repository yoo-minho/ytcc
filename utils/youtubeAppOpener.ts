export const openYouTubeApp = (videoCode?: string) => {
  const youtubeUrl = videoCode ? `https://www.youtube.com/watch?v=${videoCode}` : "https://www.youtube.com/";
  if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.src = youtubeUrl;

    // 일정 시간 후에 앱이 열리지 않았다면 웹 페이지로 이동
    setTimeout(() => {
      if (document.hasFocus()) {
        navigateTo(youtubeUrl, {
          external: true,
          open: { target: "youtube" },
        });
      }
    }, 2000); // 2초 후 확인
  } else {
    navigateTo(youtubeUrl, {
      external: true,
      open: { target: "youtube" },
    });
  }
};

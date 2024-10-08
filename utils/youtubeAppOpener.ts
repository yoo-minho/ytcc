export const openYouTubeApp = (videoCode?: string) => {
  if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
    const youtubeDeepLink = videoCode ? `vnd.youtube:${videoCode}` : "youtube://";
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.src = youtubeDeepLink;
  } else {
    const youtubeUrl = videoCode ? `https://www.youtube.com/watch?v=${videoCode}` : "https://www.youtube.com/";
    navigateTo(youtubeUrl, {
      external: true,
      open: { target: "youtube" },
    });
  }
};

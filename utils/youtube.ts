type YoutubeProps = {
  videoId?: string;
  playlistId?: string;
  channelId?: string;
  time?: number;
};

export const openYouTube = (props: YoutubeProps) => {
  const youtubeUrl = generateYoutubeUrl(props);
  const youtubeAppUrl = generateYoutubeAppUrl(props);

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(window.navigator.userAgent);
  const isPWA = window.matchMedia("(display-mode: standalone)").matches;

  if (isMobile) {
    isPWA ? handleMobilePWA(youtubeUrl) : handleMobileApp(youtubeUrl, youtubeAppUrl);
  } else {
    handleDesktop(youtubeUrl);
  }
};

const generateYoutubeUrl = (props: YoutubeProps): string => {
  const { videoId, playlistId, channelId, time } = props;
  let baseUrl = "https://www.youtube.com/";
  if (videoId) {
    baseUrl += `watch?v=${videoId}`;
  } else if (playlistId) {
    baseUrl += `playlist?list=${playlistId}`;
  } else if (channelId) {
    baseUrl += `channel/${channelId}`;
  }
  return time ? `${baseUrl}&t=${time}` : baseUrl;
};

const generateYoutubeAppUrl = (props: YoutubeProps): string => {
  const { videoId, playlistId, channelId, time } = props;
  let baseUrl = "vnd.youtube://";
  if (videoId) {
    baseUrl += videoId;
  } else if (playlistId) {
    baseUrl += `www.youtube.com/playlist?list=${playlistId}`;
  } else if (channelId) {
    baseUrl += `www.youtube.com/channel/${channelId}`;
  }
  return time ? `${baseUrl}?t=${time}` : baseUrl;
};

const handleMobilePWA = (youtubeUrl: string) => {
  const newWindow = window.open(youtubeUrl, "_blank");
  if (newWindow) {
    newWindow.addEventListener("load", () => newWindow.close());
  }
};

const handleMobileApp = (youtubeUrl: string, youtubeAppUrl: string) => {
  // 숨겨진 iframe 생성
  const hiddenIframe = document.createElement("iframe");
  hiddenIframe.style.display = "none";
  hiddenIframe.src = youtubeAppUrl;
  document.body.appendChild(hiddenIframe);

  // 앱이 실행되지 않았을 경우를 위한 fallback
  setTimeout(() => {
    if (document.hasFocus()) {
      window.location.href = youtubeUrl;
    }
    // iframe 정리
    document.body.removeChild(hiddenIframe);
  }, 2000);
};

const handleDesktop = (youtubeUrl: string) => {
  navigateTo(youtubeUrl, {
    external: true,
    open: { target: "youtube" },
  });
};

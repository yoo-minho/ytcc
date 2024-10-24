import { google, youtube_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const { googleApiKey, googleClientId, googleClientSecret, googleRedirectUri } = useRuntimeConfig();

export const youtube = google.youtube({
  version: "v3",
  auth: googleApiKey,
});

export const oauth2Client = new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri);

export const youtube2 = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

export const setAccessToken = (accessToken: string) => {
  oauth2Client.setCredentials({ access_token: accessToken });
};

export const getTokenInfo = async (accessToken: string) => {
  return await oauth2Client.getTokenInfo(accessToken);
};

export const getSubscriptions = async (params: any = {}) => {
  const response = await youtube.subscriptions.list({
    part: ["snippet"],
    mine: true,
    maxResults: 50,
    ...params,
  });
  return response.data.items || [];
};

export const getPopularVideosForChannel = async (channelId: string, params: any = {}) => {
  const response = await youtube.search.list({
    part: ["snippet"],
    channelId: channelId,
    order: "viewCount",
    type: "video",
    maxResults: 5,
    ...params,
  });
  return response.data.items || [];
};

export const getVideoDetails = async (videoIds: string[], params: any = {}) => {
  const response = await youtube.videos.list({
    part: ["snippet", "statistics"],
    id: videoIds,
    ...params,
  });
  return response.data.items || [];
};

export async function getTrendingVideos(pageToken?: string) {
  const maxResults = 200;
  const params: any = {
    part: ["snippet", "statistics", "contentDetails"],
    chart: "mostPopular",
    regionCode: "KR",
    maxResults: maxResults,
  };

  if (pageToken) {
    params.pageToken = pageToken;
  }
  try {
    const response = await youtube.videos.list(params);
    return {
      videos: response.data.items,
      pageToken: response.data.nextPageToken || "",
    };
  } catch (error: any) {
    if (error.code === 403) {
      throw createError({
        statusCode: error.code,
        statusMessage: "YouTube API Exceed, 할당량을 초과했습니다. 나중에 다시 시도해 주세요.",
      });
    }
    throw createError({
      statusCode: error.code,
      statusMessage: "데이터를 찾을 수 없습니다.",
    });
  }
}

export async function getPlaylistsInfo(playlistIds: string[]) {
  const response = await youtube.playlists.list({
    part: ["snippet"],
    id: playlistIds,
  });
  return response.data.items;
}

export async function fetchPlaylistDataById(playlistId: string, pageToken?: string) {
  const params: any = {
    part: ["snippet", "contentDetails"],
    playlistId: playlistId,
    maxResults: 50,
    pageToken: pageToken,
  };

  try {
    const response = await youtube.playlistItems.list(params);
    return response.data;
  } catch (error: any) {
    if (error.code === 403) {
      throw createError({
        statusCode: error.code,
        statusMessage: "YouTube API Exceed, 할당량을 초과했습니다. 나중에 다시 시도해 주세요.",
      });
    }
    throw createError({
      statusCode: error.code,
      statusMessage: "데이터를 찾을 수 없습니다.",
    });
  }
}

export async function getVideosByIds(videoIds: string[]) {
  const params2 = {
    part: ["statistics", "contentDetails"],
    id: videoIds,
  };
  const response = await youtube.videos.list(params2);
  return response.data.items;
}

export async function getChannelDetails(channelIds: string[]) {
  const response = await youtube.channels.list({
    part: ["snippet"],
    id: channelIds,
  });
  return response.data.items;
}

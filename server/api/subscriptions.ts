import { youtube2, oauth2Client } from "@/server/utils/youtube";
import { OAuth2Client } from "google-auth-library";

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, "youtube_access_token");

  if (!accessToken) {
    return sendError(event, createError({ statusCode: 401, statusMessage: "인증되지 않음" }));
  }

  try {
    // 토큰 정보 확인
    const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
    console.log("토큰 정보:", tokenInfo);

    // 토큰이 유효한지 확인
    if (tokenInfo.expiry_date && tokenInfo.expiry_date < Date.now()) {
      return sendError(event, createError({ statusCode: 401, statusMessage: "토큰이 만료되었습니다" }));
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    const response = await youtube2.subscriptions.list({
      part: ["snippet"],
      mine: true,
      maxResults: 50,
    });

    return response.data.items;
  } catch (error) {
    console.error("구독 목록 가져오기 실패:", error);
    if (error instanceof Error) {
      console.error("에러 메시지:", error.message);
    }
    return sendError(event, createError({ statusCode: 500, statusMessage: "구독 목록을 가져오는데 실패했습니다" }));
  }
});

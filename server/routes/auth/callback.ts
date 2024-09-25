import { oauth2Client, youtube } from "@/server/utils/youtube";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 토큰을 세션에 저장하거나 데이터베이스에 저장해야 합니다.
    // 여기서는 간단히 쿠키에 저장합니다.
    setCookie(event, "youtube_access_token", tokens.access_token as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1시간
    });

    return sendRedirect(event, "/");
  } catch (error) {
    console.error("Error getting OAuth tokens:", error);
    return sendError(event, createError({ statusCode: 500, statusMessage: "Authentication failed" }));
  }
});

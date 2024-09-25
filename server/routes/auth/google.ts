import { oauth2Client } from "@/server/utils/youtube";

export default defineEventHandler(async (event) => {
  const scopes = ["https://www.googleapis.com/auth/youtube.readonly"];

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
  });

  return sendRedirect(event, authorizationUrl);
});

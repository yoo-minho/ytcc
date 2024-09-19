import { google } from "googleapis";

const apiKey = "AIzaSyCbFbmMsVTKyAp6SZ_xtM3yK9y6AazMM1o";
export const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

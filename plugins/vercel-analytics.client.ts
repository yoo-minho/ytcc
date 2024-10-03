import { inject } from "@vercel/analytics";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    inject(); // Vercel Analytics를 클라이언트 사이드에서 실행
  }
});

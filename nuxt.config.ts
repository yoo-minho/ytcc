// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-gtag"],
  runtimeConfig: {
    googleApiKey: process.env.GOOGLE_API_KEY,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
  gtag: {
    enabled: process.env.NODE_ENV === "production",
    id: "G-B9HSLQ7KY1",
  },
  icon: {
    serverBundle: {
      collections: ["ph", "heroicons", "openmoji"], // <!--- this
    },
  },
  colorMode: {
    preference: "light",
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // Deprecation Warning: The legacy JS API. Sass 2.0.0.
        },
      },
    },
  },
  app: {
    head: {
      viewport: "width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0",
      script: [
        {
          src: "https://www.youtube.com/iframe_api",
          async: false,
          defer: false,
        },
      ],
    },
  },
});

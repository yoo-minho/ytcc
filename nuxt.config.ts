import { version } from "./package.json";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,

  modules: ["@nuxt/ui", "nuxt-gtag", "@nuxt/icon", "@vite-pwa/nuxt"],

  runtimeConfig: {
    googleApiKey: process.env.GOOGLE_API_KEY,
  },

  gtag: {
    enabled: process.env.NODE_ENV === "production",
    id: "G-B9HSLQ7KY1",
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

  icon: {
    serverBundle: {
      collections: ["ph"],
    },
  },

  pwa: {
    // workbox: {
    //   navigateFallback: "/",
    //   globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
    //   cacheId: `calcreator-${version}`,
    //   cleanupOutdatedCaches: true,
    //   skipWaiting: true,
    //   clientsClaim: true,
    //   runtimeCaching: [
    //     {
    //       urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|ico)$/,
    //       handler: "CacheFirst",
    //       options: {
    //         cacheName: "asset-cache",
    //         expiration: {
    //           maxEntries: 50,
    //           maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
    //         },
    //       },
    //     },
    //     {
    //       urlPattern: "https://calcreator.cc/.*",
    //       handler: "NetworkFirst",
    //       options: {
    //         cacheName: "domain-cache",
    //         expiration: {
    //           maxEntries: 100,
    //           maxAgeSeconds: 60 * 60 * 24 * 7, // 7일
    //         },
    //         networkTimeoutSeconds: 3,
    //       },
    //     },
    //   ],
    // },
    client: {
      installPrompt: "true",
    },
    includeAssets: ["favicon.ico", "apple-touch-icon.png"],
    manifest: {
      name: "Youtube Moments",
      short_name: "Youtube Moments",
      start_url: "/",
      display: "standalone",
      background_color: "#ff0000",
      theme_color: "#000000",
      icons: [
        {
          src: "icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icon-192-maskable.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "icon-512-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
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

import { version } from "./package.json";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  ssr: true,

  modules: ["@nuxt/ui", "nuxt-gtag", "@nuxt/icon", "@vite-pwa/nuxt", "@nuxtjs/seo"],

  runtimeConfig: {
    googleApiKey: process.env.GOOGLE_API_KEY,
  },

  colorMode: {
    preference: "dark", // 디폴트 컬러모드 다크
    fallback: "light",
    classSuffix: "",
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
    clientBundle: {
      scan: true,
    },
  },

  imports: {
    dirs: ["types"],
  },

  pwa: {
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    includeAssets: ["favicon.ico", "apple-touch-icon.png"],
    manifest: {
      name: "Youtube Moments",
      short_name: "Youtube Moments",
      description: "YouTube 영상 최고의 순간을 즐기고 공유하세요",
      start_url: "/",
      display: "standalone",
      background_color: "#000000",
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
      title: "영상 최고의 순간을 즐기세요 | YouTube Moments",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0" },
        {
          hid: "description",
          name: "description",
          content: "YouTube 영상 최고의 순간을 즐기고 공유하세요.",
        },
        { property: "og:title", content: "YouTube Moments" },
        { property: "og:description", content: "YouTube 영상 최고의 순간을 즐기고 공유하세요." },
        { property: "og:image", content: "/og-image.png" },
        { property: "og:url", content: "https://youtube-moments.make1k.app" },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      script: [
        {
          src: "https://www.youtube.com/iframe_api",
          async: false,
          defer: false,
        },
      ],
    },
  },

  site: {
    url: "https://youtube-moments.make1k.app",
    defaultLocale: "ko",
  },

  sitemap: {
    xsl: false,
    exclude: ["/*/components/**", "/*/data/**"],
  },
});

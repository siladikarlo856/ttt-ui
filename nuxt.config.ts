// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      link: [
        {
          id: "theme-link",
          rel: "stylesheet",
          href:
            (process.env.BASE_URL || "http://localhost:8080/") +
            "themes/md-dark-indigo/theme.css",
        },
      ],
    },
  },
  devtools: { enabled: true },
  devServer: {
    port: 8080,
  },
  routeRules: {
    "/api/**": {
      proxy: process.env.API_URL || "http://localhost:3000/**",
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/eslint",
  ],
  primevue: {
    importTheme: { from: "@/themes/mytheme.js" },

    options: {
      ripple: true,
    },
  },
  css: ["~/assets/css/tailwind.css", "primeicons/primeicons.css"],
  colorMode: {
    classSuffix: "", // disable the default '-mode' suffix
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          id: "theme-link",
          rel: "stylesheet",
          href: "http://localhost:8080/" + "themes/md-dark-indigo/theme.css",
        },
      ],
    },
  },
  devtools: { enabled: true },
  devServer: {
    port: 8080,
  },
  routeRules: {
    "/api/**": { proxy: "http://localhost:3000/**" },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
  ],
  primevue: {
    options: {
      ripple: true,
    },
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
  },
  css: ["~/assets/css/tailwind.css", "primeicons/primeicons.css"],
});

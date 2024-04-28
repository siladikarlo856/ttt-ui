// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          id: "theme-link",
          rel: "stylesheet",
          href: "http://localhost:8080/" + "themes/md-light-indigo/theme.css",
        },
      ],
    },
  },
  devtools: { enabled: true },
  devServer: {
    port: 8080,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-primevue",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  primevue: {
    options: {
      ripple: true,
    },
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
  },
  css: ["~/assets/css/tailwind.css", "primeicons/primeicons.css"],
});

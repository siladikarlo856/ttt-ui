// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    port: 8080,
  },
  modules: ["@nuxtjs/tailwindcss", "nuxt-primevue"],
  primevue: {
    options: {
      ripple: true,
    },
    cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
  },
  css: [
    "~/assets/css/tailwind.css",
    "primevue/resources/themes/aura-dark-green/theme.css",
    "primeicons/primeicons.css",
  ],
});

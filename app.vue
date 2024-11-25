<script setup lang="ts">
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

useDarkMode();

const nuxtApp = useNuxtApp();

nuxtApp.vueApp.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      options: {
        darkModeSelector: ".dark-mode",
      },
    },
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
</template>

<style lang="postcss">
.error-message {
  @apply text-danger h-6;
}
</style>

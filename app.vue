<script setup lang="ts">
const darkModeStore = useDarkModeStore();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
</template>

<style>
.error-message {
  @apply text-danger h-6;
}
</style>

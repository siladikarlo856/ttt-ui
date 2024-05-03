<script setup lang="ts">
const darkModeStore = useDarkModeStore();
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.error-message {
  @apply text-danger h-6;
}
</style>

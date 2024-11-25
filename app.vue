<script setup lang="ts">
useDarkMode();
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

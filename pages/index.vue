<script setup lang="ts">
const value = ref("");
</script>
<template>
  <div class="text-2xl mb-4">Index page</div>
  <div class="flex flex-col gap-2">
    <label for="username">Username</label>
    <InputText id="username" v-model="value" aria-describedby="username-help" />
    <small id="username-help"
      >Enter your username to reset your password.</small
    >
  </div>
</template>

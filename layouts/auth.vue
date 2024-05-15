<script lang="ts" setup>
import DarkModeSwitcher from "~/components/header/DarkModeSwitcher.vue";
</script>

<template>
  <Transition name="fade" mode="out-in">
    <main>
      <div class="flex justify-end m-4">
        <DarkModeSwitcher />
      </div>
      <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <slot />
      </div>
    </main>
  </Transition>
</template>

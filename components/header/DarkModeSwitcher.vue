<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import LightIcon from "@/components/icons/LightIcon";
import DarkIcon from "@/components/icons/DarkIcon";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <label
    :class="{
      'bg-[#9FA8DA]': isDark,
      'bg-stroke': !isDark,
    }"
    class="relative m-0 block h-7.5 w-14 rounded-full"
    @click="() => toggleDark()"
  >
    <input
      type="checkbox"
      class="absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
    />
    <span
      :class="{ 'right-1 translate-x-full': isDark }"
      class="absolute top-1/2 left-1 flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear"
    >
      <span class="dark:hidden">
        <LightIcon />
      </span>
      <span class="hidden dark:inline-block">
        <DarkIcon />
      </span>
    </span>
  </label>
</template>

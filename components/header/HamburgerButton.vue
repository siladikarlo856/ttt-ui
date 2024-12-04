<script setup lang="ts">
defineProps<{ isSidebarOpen: boolean }>();

const emit = defineEmits<{
  click: [];
}>();

function onClick() {
  emit("click");
}
</script>

<template>
  <button
    class="hamburger-button z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden cursor-pointer"
    data-outside-click-exclude
    @click="onClick"
  >
    <span
      class="hamburger-button pointer-events-none relative block h-5.5 w-5.5"
    >
      <span class="hamburger-button du-block absolute right-0 h-full w-full">
        <span
          class="hamburger-button relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white"
          :class="{ '!w-full delay-300': !isSidebarOpen }"
        />
        <span
          class="hamburger-button relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white"
          :class="{ '!w-full delay-400': !isSidebarOpen }"
        />
        <span
          class="hamburger-button relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white"
          :class="{ '!w-full delay-500': !isSidebarOpen }"
        />
      </span>
      <span
        class="hamburger-button du-block absolute right-0 h-full w-full rotate-45"
      >
        <span
          class="hamburger-button absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white"
          :class="{ '!h-0 delay-[0]': !isSidebarOpen }"
        />
        <span
          class="hamburger-button delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white"
          :class="{ '!h-0 delay-200': !isSidebarOpen }"
        />
      </span>
    </span>
  </button>
</template>

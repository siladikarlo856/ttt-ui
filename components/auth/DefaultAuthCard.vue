<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="flex flex-wrap items-center">
      <div class="hidden w-full xl:block xl:w-1/2">
        <div class="py-17.5 px-26 text-center">
          <router-link
            class="mb-5.5 flex items-center justify-center gap-4"
            to="/"
          >
            <img src="@/assets/images/logo/logo.svg" class="h-12" alt="Logo" />
            <span class="text-2xl"> Table Tennis Tracker </span>
          </router-link>

          <p class="font-medium 2xl:px-20">
            Game, set, analyze! Track your progress with a match log & stat in
            Table Tennis Tracker app.
          </p>

          <span class="mt-15 inline-block">
            <img
              src="@/assets/images/illustration/illustration-03.svg"
              alt="illustration"
            />
          </span>
        </div>
      </div>
      <div
        class="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2"
      >
        <div class="w-full p-4 sm:p-12.5 xl:p-17.5">
          <h2
            class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2"
          >
            {{ title }}
          </h2>

          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

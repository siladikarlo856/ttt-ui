<script setup lang="ts">
import { useSidebarStore } from "@/stores/sidebar";
import DarkModeSwitcher from "./DarkModeSwitcher.vue";
import DropdownUser from "./DropdownUser.vue";

const store = useSidebarStore();

const { toggleSidebar } = store;
const { isSidebarOpen } = storeToRefs(store);

function onButtonClick() {
  toggleSidebar();
}
</script>

<template>
  <header
    class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none"
  >
    <div
      class="flex flex-grow items-center justify-between lg:justify-end py-4 px-4 shadow-2 md:px-6 2xl:px-11"
    >
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <HeaderHamburgerButton
          :is-sidebar-open="isSidebarOpen"
          @click="onButtonClick"
        />
        <router-link
          class="flex flex-shrink-0 lg:hidden gap-2 items-center"
          to="/"
        >
          <img src="@/assets/images/logo/logo.svg" alt="Logo" />
          <span class="font-medium text-bodydark2">TT Tracker</span>
        </router-link>
      </div>

      <div class="flex items-center gap-3 2xsm:gap-7">
        <DarkModeSwitcher />
        <DropdownUser />
      </div>
    </div>
  </header>
</template>

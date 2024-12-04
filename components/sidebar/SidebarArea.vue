<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import DashboardIcon from "../icons/DashboardIcon.vue";
import ProfileIcon from "../icons/ProfileIcon.vue";

const target = ref(null);

const sidebarStore = useSidebarStore();

onClickOutside(target, (event: PointerEvent) => {
  if (
    event.target instanceof Element &&
    event.target.classList.contains("hamburger-button")
  ) {
    return;
  }

  sidebarStore.isSidebarOpen = false;
});

const menuGroups = ref([
  {
    name: "",
    menuItems: [
      {
        icon: DashboardIcon,
        label: "Dashboard",
        route: "/",
      },
      {
        icon: ProfileIcon,
        label: "Profile",
        route: "/profile",
      },
    ],
  },
]);
</script>

<template>
  <aside
    ref="target"
    class="absolute left-0 top-0 z-999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen,
    }"
  >
    <SidebarHeader />
    <SidebarMenu :menu-groups="menuGroups" />
  </aside>
</template>

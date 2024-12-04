import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useSidebarStore = defineStore("sidebarStore", () => {
  const isSidebarOpen = ref(false);
  const selected = useLocalStorage("selected", "home");
  const page = useLocalStorage("page", "home");

  function closeSidebar() {
    isSidebarOpen.value = false;
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }

  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    selected,
    page,
  };
});

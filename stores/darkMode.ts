import { ref } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { usePrimeVue } from "primevue/config";

export const useDarkModeStore = defineStore("darkMode", () => {
  const darkMode = useLocalStorage("darkMode", ref(true));
  const PrimeVue = usePrimeVue();

  function toggleDarkMode() {
    darkMode.value = !darkMode.value;
    document?.documentElement.classList.toggle("dark", darkMode.value);
    setTheme(darkMode.value);
  }

  function setTheme(isDarkMode: boolean) {
    if (isDarkMode) {
      PrimeVue.changeTheme("md-light-indigo", "md-dark-indigo", "theme-link");
    } else {
      PrimeVue.changeTheme("md-dark-indigo", "md-light-indigo", "theme-link");
    }
  }

  onMounted(() => {
    document?.documentElement?.classList.toggle("dark", darkMode.value);
    setTheme(darkMode.value);
  });
  return { darkMode, toggleDarkMode };
});

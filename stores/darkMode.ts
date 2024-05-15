import { defineStore } from "pinia";
import { usePrimeVue } from "primevue/config";
import { useLocalStorage } from "@vueuse/core";

export const useDarkModeStore = defineStore("darkMode", () => {
  const colorMode = useColorMode();
  const PrimeVue = usePrimeVue();

  const storedColorMode = useLocalStorage("color-mode", "system");

  const isDarkMode = ref<boolean>(storedColorMode.value === "dark");

  console.log("isDarkMode", isDarkMode.value, storedColorMode.value);

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value;
    setColorMode();
  }

  function setColorMode() {
    colorMode.preference = isDarkMode.value ? "dark" : "light";
    storedColorMode.value = colorMode.preference;
    setTheme();
  }

  function setTheme() {
    if (colorMode.preference === "dark") {
      PrimeVue.changeTheme("md-light-indigo", "md-dark-indigo", "theme-link");
    } else {
      PrimeVue.changeTheme("md-dark-indigo", "md-light-indigo", "theme-link");
    }
  }

  onMounted(() => {
    if (storedColorMode.value === "system") {
      const prefersDarkColorScheme = () =>
        window &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDarkColorScheme()) {
        isDarkMode.value = true;
        colorMode.preference = "dark";
      }
    }
    setTheme();
  });

  console.log("storedColorMode", storedColorMode.value);
  return { isDarkMode, setColorMode, toggleDarkMode };
});

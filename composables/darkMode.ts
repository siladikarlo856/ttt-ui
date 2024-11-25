import { usePrimeVue } from "primevue/config";
import { useDark } from "@vueuse/core";

export function useDarkMode() {
  const isDark = useDark();
  const PrimeVue = usePrimeVue();

  watch(
    isDark,
    (newValue) => {
      if (newValue) {
        PrimeVue.changeTheme("md-light-indigo", "md-dark-indigo", "theme-link");
      } else {
        PrimeVue.changeTheme("md-dark-indigo", "md-light-indigo", "theme-link");
      }
    },
    {
      immediate: true,
    }
  );
}

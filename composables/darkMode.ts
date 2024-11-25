import { usePrimeVue } from "primevue/config";
import { useDark } from "@vueuse/core";

export function useDarkMode() {
  const isDark = useDark();
  const PrimeVue = usePrimeVue();

  watch(isDark, (newValue) => {}, {
    immediate: true,
  });
}

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import LogoutIcon from "~/components/icons/LogoutIcon.vue";
import DropdownIcon from "~/components/icons/DropdownIcon.vue";

const authStore = useAuthStore();
const router = useRouter();

const target = ref(null);
const dropdownOpen = ref(false);

const userInitials = computed(() => {
  return (
    (authStore.user?.firstName?.[0] ?? "") +
    (authStore.user?.lastName?.[0] ?? "")
  );
});

onClickOutside(target, () => {
  dropdownOpen.value = false;
});

function logout() {
  authStore.logUserOut();
  dropdownOpen.value = false;
  router.push("/signin");
}

function onDropdownClick() {
  dropdownOpen.value = !dropdownOpen.value;
}
</script>

<template>
  <div ref="target" class="relative">
    <div
      class="flex items-center gap-4 cursor-pointer"
      @click="onDropdownClick"
    >
      <span class="hidden text-right lg:block">
        <span class="block text-sm font-medium text-black dark:text-white"
          >{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</span
        >
      </span>
      <Avatar v-if="userInitials" :label="userInitials" />
      <DropdownIcon :rotate="dropdownOpen" />
    </div>

    <div
      v-show="dropdownOpen"
      class="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <button
        class="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        @click="logout"
      >
        <LogoutIcon />
        Log Out
      </button>
    </div>
  </div>
</template>

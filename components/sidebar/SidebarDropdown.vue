<script setup lang="ts">
import { useSidebarStore } from "@/stores/sidebar";

const sidebarStore = useSidebarStore();

const props = defineProps<{
  items: { label: string; route: string }[];
  page: string;
}>();

const handleItemClick = (index: number) => {
  const pageName =
    sidebarStore.selected === props.items[index].label
      ? ""
      : props.items[index].label;
  sidebarStore.selected = pageName;
};
</script>

<template>
  <ul class="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
    <template v-for="(childItem, index) in props.items" :key="index">
      <li>
        <router-link
          :to="childItem.route"
          :class="{
            '!text-white': childItem.label === sidebarStore.selected,
          }"
          class="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white"
          @click="handleItemClick(index)"
        >
          {{ childItem.label }}
        </router-link>
      </li>
    </template>
  </ul>
</template>

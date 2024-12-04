<script setup lang="ts">
import type { MenuGroup } from "~/types";

defineProps<{ menuGroups: MenuGroup[] }>();
</script>

<template>
  <div
    class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear"
  >
    <nav class="py-4 px-4 lg:px-6">
      <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
        <div>
          <h3 class="mb-4 ml-4 text-sm font-medium text-bodydark2">
            {{ menuGroup.name }}
          </h3>

          <ul class="mb-6 flex flex-col gap-1.5">
            <SidebarItem
              v-for="(menuItem, index) in menuGroup.menuItems"
              :key="index"
              :item="menuItem"
              :index="index"
            />
          </ul>
        </div>
      </template>
    </nav>
  </div>
</template>

<style></style>

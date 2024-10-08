<script lang="ts" setup>
defineProps<{
  title: string;
  value?: string | number;
  description?: string;
  color: string;
}>();
</script>

<template>
  <Card>
    <template #content>
      <div :class="['font-semibold mb-1 text-lg', color]">{{ title }}</div>
      <div class="font-semibold text-5xl tracking-tight">{{ value }}</div>
      <div class="font-normal italic">{{ description }}</div>
    </template>
  </Card>
</template>

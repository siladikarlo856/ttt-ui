<script lang="ts" setup>
withDefaults(
  defineProps<{
    title: string;
    color: string;
    value?: string | number;
    description?: string;
  }>(),
  {
    value: undefined,
    description: undefined,
  }
);
</script>

<template>
  <Card>
    <template #content>
      <div :class="['font-semibold mb-1 text-lg', color]">{{ title }}</div>
      <div class="font-semibold text-5xl tracking-tight">
        {{ value ?? "-" }}
      </div>
      <div class="font-normal italic">{{ description }}</div>
    </template>
  </Card>
</template>

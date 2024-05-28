<script setup lang="ts">
import { useField } from "vee-validate";

const props = defineProps<{
  setNumber: number;
}>();

const { value, errorMessage, setValue } = useField<
  (number | null)[] | undefined
>(`sets[${props.setNumber - 1}]`);

const homePlayerPoints = ref(value.value?.[0] ?? null);
const awayPlayerPoints = ref(value.value?.[1] ?? null);

watchEffect(() => {
  if (homePlayerPoints.value === null || awayPlayerPoints.value === null) {
    setValue(undefined);
    return;
  }
  setValue([homePlayerPoints.value, awayPlayerPoints.value]);
});
</script>

<template>
  <div class="grid grid-cols-2 gap-2">
    <label class="col-span-2">Set #{{ setNumber }}</label>
    <InputNumber v-model="homePlayerPoints" :min="0" />
    <InputNumber v-model="awayPlayerPoints" :min="0" />
    <small class="error-message col-span-2">{{ errorMessage }}</small>
  </div>
</template>

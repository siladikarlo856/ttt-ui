<script lang="ts" setup>
import SetField from "./SetField.vue";
import { defineProps, defineEmits } from "vue";
const props = defineProps<{
  modelValue: (number[] | undefined)[];
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: (number[] | undefined)[]];
  "update:visible": [value: boolean];
}>();

// FUNCTIONS
function onCancelClick() {
  emit("update:visible", false);
}

const { handleSubmit, resetForm } = useForm({
  initialValues: { sets: props.modelValue ?? [] },
});

watch(
  () => props.modelValue,
  (value) => {
    resetForm({ values: { sets: value } });
  }
);

watch(
  () => props.visible,
  (value) => {
    if (value) {
      resetForm({ values: { sets: props.modelValue } });
    }
  }
);

const onSaveClick = handleSubmit((values) => {
  emit("update:modelValue", values.sets);
  emit("update:visible", false);
});
</script>

<template>
  <Dialog
    :visible="visible"
    full-screen
    class="fullscreen-dialog"
    header="Set points"
    :base-z-index="9000"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-4">
      <SetField :set-number="1" />
      <SetField :set-number="2" />
      <SetField :set-number="3" />
      <SetField :set-number="4" />
      <SetField :set-number="5" />
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="onCancelClick"
        />
        <Button type="button" label="Save" @click="onSaveClick" />
      </div>
    </template>
  </Dialog>
</template>

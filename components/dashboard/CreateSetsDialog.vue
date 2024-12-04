<script lang="ts" setup>
import SetField from "./SetField.vue";

const modelValue = defineModel<number[] | undefined>();
const visible = defineModel<boolean>();

// FUNCTIONS
function onCancelClick() {
  visible.value = false;
}

const { handleSubmit, resetForm } = useForm({
  initialValues: { sets: modelValue.value ?? [] },
});

watch(modelValue, (value) => {
  resetForm({ values: { sets: value } });
});

watch(visible, (value) => {
  if (value) {
    resetForm({ values: { sets: modelValue.value } });
  }
});

const onSaveClick = handleSubmit((values) => {
  modelValue.value = values.sets;
  visible.value = false;
});
</script>

<template>
  <Dialog
    v-model:visible="visible"
    full-screen
    class="fullscreen-dialog"
    header="Set points"
    :base-z-index="9000"
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

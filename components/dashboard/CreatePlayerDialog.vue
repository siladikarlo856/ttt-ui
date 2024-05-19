<script lang="ts" setup>
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import InputText from "primevue/inputtext";

defineProps({
  visible: Boolean,
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  "created:player": [];
}>();

const toast = useToast();

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      firstName: z
        .string({ required_error: "First name is required." })
        .min(1, "First name is required"),
      lastName: z
        .string({ required_error: "Last name is required." })
        .min(1, "Last Name is required"),
    })
  ),
});

const [firstName, firstNameAttrs] = defineField("firstName", {
  validateOnBlur: true,
});
const [lastName, lastNameAttrs] = defineField("lastName", {
  validateOnBlur: true,
});

// FUNCTIONS
function onCancelClick() {
  emit("update:visible", false);
}
const onSubmit = handleSubmit(async (values) => {
  const { data, error, status } = await useFetch("/api/players", {
    server: false,
    onRequest({ options }) {
      options.headers = options.headers || {};
      (options.headers as Record<string, string>).authorization =
        "Bearer " + useCookie("accessToken").value;
    },
    method: "POST",
    body: {
      firstName: values.firstName,
      lastName: values.lastName,
    },
  });
  if (status.value === "success") {
    toast.add({
      severity: "success",
      summary: "Player is added successfully.",
      life: 3000,
    });

    emit("update:visible", false);
    emit("created:player");
  }
});
</script>

<template>
  <Dialog
    header="Add New Player"
    :visible="visible"
    :baseZIndex="1"
    @update:visible="$emit('update:visible', $event)"
    @hide="resetForm"
  >
    <form @submit.prevent="onSubmit">
      <div class="flex flex-col items-start gap-2 mb-4">
        <label for="first-name">First Name</label>
        <InputText
          id="first-name"
          v-model="firstName"
          v-bind="firstNameAttrs"
          placeholder="Enter first name"
          class="w-full"
        />
        <small class="error-message">{{ errors.firstName }}</small>
      </div>
      <div class="flex flex-col items-start gap-2 mb-4">
        <label for="last-name">Last Name</label>
        <InputText
          id="last-name"
          v-model="lastName"
          v-bind="lastNameAttrs"
          placeholder="Enter last name"
          class="w-full"
        />
        <small class="error-message">{{ errors.lastName }}</small>
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="onCancelClick"
        />
        <Button type="submit" label="Save" @click="onSubmit" />
      </div>
    </form>
  </Dialog>
</template>

<style></style>

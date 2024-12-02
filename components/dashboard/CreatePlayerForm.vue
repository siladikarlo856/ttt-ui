<script lang="ts" setup>
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import InputText from "primevue/inputtext";

const validationSchema = toTypedSchema(
  z.object({
    firstName: z
      .string({ required_error: "First name is required." })
      .min(1, "First name is required"),
    lastName: z
      .string({ required_error: "Last name is required." })
      .min(1, "Last Name is required"),
  })
);

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema,
});

const [firstName, firstNameAttrs] = defineField("firstName", {
  validateOnBlur: true,
});
const [lastName, lastNameAttrs] = defineField("lastName", {
  validateOnBlur: true,
});

const emit = defineEmits<{
  "click:create": [player: CreatePlayerDto];
  "click:cancel": [];
}>();

const onSubmit = handleSubmit((values) => {
  emit("click:create", values);
});

defineExpose({ resetForm });
</script>

<template>
  <form @submit="onSubmit">
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
        @click="$emit('click:cancel')"
      />
      <Button type="submit" label="Save" />
    </div>
  </form>
</template>

<style></style>

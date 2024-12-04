<script setup lang="ts">
import { validationSchema } from "./validationSchema";

export interface SignUpFormSubmitParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const emit = defineEmits<{
  submit: [values: SignUpFormSubmitParams];
}>();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema,
});

const [firstName, firstNameAttrs] = defineField("firstName", {
  validateOnBlur: true,
});
const [lastName, lastNameAttrs] = defineField("lastName", {
  validateOnBlur: true,
});
const [email, emailAttrs] = defineField("email", {
  validateOnBlur: true,
});
const [password, passwordAttrs] = defineField("password", {
  validateOnBlur: true,
});
const [retypePassword, retypePasswordAttrs] = defineField("retypePassword", {
  validateOnBlur: true,
});

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});
</script>

<template>
  <form @submit="onSubmit">
    <div class="flex flex-col items-start gap-1 mb-2">
      <label for="first-name">First Name</label>
      <InputText
        id="first-name"
        v-model="firstName"
        v-bind="firstNameAttrs"
        placeholder="Enter your first name"
        type="text"
        class="w-full"
      />
      <small class="error-message">{{ errors.firstName }}</small>
    </div>
    <div class="flex flex-col items-start gap-1 mb-2">
      <label for="last-name">Last Name</label>
      <InputText
        id="last-name"
        v-model="lastName"
        v-bind="lastNameAttrs"
        placeholder="Enter your last name"
        type="text"
        class="w-full"
      />
      <small class="error-message">{{ errors.lastName }}</small>
    </div>
    <div class="flex flex-col items-start gap-1 mb-2">
      <label for="email">Email</label>
      <InputText
        id="email"
        v-model="email"
        v-bind="emailAttrs"
        placeholder="Enter your email"
        type="email"
        class="w-full"
      />
      <small class="error-message">{{ errors.email }}</small>
    </div>
    <div class="flex flex-col items-start gap-1 mb-2">
      <label for="password">Password</label>
      <InputText
        id="password"
        v-model="password"
        v-bind="passwordAttrs"
        placeholder="Enter your password"
        type="password"
        class="w-full"
      />
      <small class="error-message">{{ errors.password }}</small>
    </div>

    <div class="flex flex-col items-start gap-1 mb-2">
      <label for="retype-password">Re-type Password</label>
      <InputText
        id="retype-password"
        v-model="retypePassword"
        v-bind="retypePasswordAttrs"
        placeholder="Re-enter your password"
        type="password"
        class="w-full"
      />
      <small class="error-message">{{ errors.retypePassword }}</small>
    </div>
    <Button type="submit" class="w-full mt-6" label="Sign Up" />
  </form>
</template>

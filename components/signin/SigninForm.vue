<script setup lang="ts">
import { validationSchema } from "./validationSchema";

defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  submit: [payload: { email: string; password: string }];
}>();

const { errors, handleSubmit, defineField } = useForm<{
  email: string;
  password: string;
}>({
  validationSchema,
});

const [email, emailAttrs] = defineField("email", {
  validateOnBlur: true,
});

const [password, passwordAttrs] = defineField("password", {
  validateOnBlur: true,
});

const onSubmit = handleSubmit(() => {
  emit("submit", {
    email: email.value,
    password: password.value,
  });
});
</script>

<template>
  <form @submit="onSubmit">
    <div class="flex flex-col items-start gap-2 mb-2">
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
    <div class="flex flex-col items-start gap-2">
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
    <Button
      :loading="loading"
      type="submit"
      class="w-full mt-6 text-center"
      label="Sign In"
    />
  </form>
</template>

<script lang="ts" setup>
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import DefaultAuthCard from "~/components/auth/DefaultAuthCard.vue";

definePageMeta({
  layout: "auth",
});

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const { isAuthenticated, isLoading } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs
const router = useRouter();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string({ required_error: "Email is required" }).email({
        message: "Please enter valid e-mail address",
      }),
      password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
    })
  ),
});

const [email, emailAttrs] = defineField("email", {
  validateOnBlur: true,
});
const [password, passwordAttrs] = defineField("password", {
  validateOnBlur: true,
});

const onSubmit = handleSubmit((values) => {
  authenticateUser({ email: values.email, password: values.password });

  if (isAuthenticated.value) {
    router.push("/");
  }
});
</script>

<template>
  <div class="mt-6 text-center">
    <DefaultAuthCard title="Sign In to Table Tennis Tracker">
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
          :loading="isLoading"
          type="submit"
          class="w-full mt-6 text-center"
          label="Sign In"
        />
      </form>
    </DefaultAuthCard>
    <p class="font-medium">
      Don’t have any account?
      <nuxt-link to="/signup" class="text-primary">Sign up</nuxt-link>
    </p>
  </div>
</template>

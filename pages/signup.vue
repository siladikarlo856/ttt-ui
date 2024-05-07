<script lang="ts" setup>
import { z } from "zod";
import DefaultAuthCard from "~/components/auth/DefaultAuthCard.vue";

definePageMeta({
  layout: "auth",
});

const router = useRouter();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      firstName: z.string({ required_error: "First Name is required" }),
      lastName: z.string({ required_error: "Last Name is required" }),
      email: z.string({ required_error: "Email is required" }).email({
        message: "Please enter valid e-mail address",
      }),
      password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required"),
      retypePassword: z
        .string({ required_error: "Retype Password is required" })
        .min(1, "Retype Password is required")
        .refine((data): boolean => password.value === data, {
          message: "Passwords must match",
          path: ["retypePassword"],
        }),
    })
  ),
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

const toast = useToast();

const onSubmit = handleSubmit(async (values) => {
  const { data, error, status } = await useFetch("/api/auth/signup", {
    method: "POST",
    body: {
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    },
  });

  if (status.value === "success") {
    toast.add({
      severity: "success",
      summary: "Account created successfully",
      detail: "You will be redirected to the login page shortly.",
      life: 3000,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push("/");
  } else {
    if (Array.isArray(error.value?.data?.message)) {
      error.value?.data?.message?.forEach?.((error: string) => {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: error,
          life: 3000,
        });
      });
    } else if (error.value?.data?.message) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.value?.data?.message,
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "An error occurred",
        life: 3000,
      });
    }
  }
});
</script>

<template>
  <div class="text-center">
    <DefaultAuthCard title="Sign Up to Table Tennis Tracker">
      <form @submit.prevent="onSubmit">
        <div class="flex flex-col items-start gap-2 mb-4">
          <label for="first-name">First Name</label>
          <InputText
            id="first-name"
            v-model="firstName"
            placeholder="Enter your first name"
            type="text"
            class="w-full"
          />
          <small class="error-message">{{ errors.firstName }}</small>
        </div>
        <div class="flex flex-col items-start gap-2 mb-4">
          <label for="last-name">Last Name</label>
          <InputText
            id="last-name"
            v-model="lastName"
            placeholder="Enter your last name"
            type="text"
            class="w-full"
          />
          <small class="error-message">{{ errors.lastName }}</small>
        </div>
        <div class="flex flex-col items-start gap-2 mb-4">
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
        <div class="flex flex-col items-start gap-2 mb-4">
          <label for="password">Password</label>
          <InputText
            id="password"
            v-model="password"
            placeholder="Enter your password"
            type="password"
            class="w-full"
          />
          <small class="error-message">{{ errors.password }}</small>
        </div>

        <div class="flex flex-col items-start gap-2">
          <label for="retype-password">Re-type Password</label>
          <InputText
            id="retype-password"
            v-model="retypePassword"
            placeholder="Re-enter your password"
            type="password"
            class="w-full"
          />
          <small class="error-message">{{ errors.retypePassword }}</small>
        </div>
        <Button type="submit" class="w-full mt-6" label="Sign Up" />
      </form>
    </DefaultAuthCard>

    <div class="mt-6 text-center">
      <p class="font-medium">
        Already have an account?
        <nuxt-link to="/signin" class="text-primary">Sign in</nuxt-link>
      </p>
    </div>
  </div>
</template>

<style></style>

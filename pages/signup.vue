<script lang="ts" setup>
import DefaultAuthCard from "~/components/auth/DefaultAuthCard.vue";
import SignUpForm, {
  type SignUpFormSubmitParams,
} from "~/components/signup/SignUpForm.vue";

definePageMeta({
  layout: "auth",
});

const router = useRouter();
const toast = useToast();

async function onSubmit(params: SignUpFormSubmitParams) {
  const { error, status } = await useFetch("/api/auth/signup", {
    method: "POST",
    body: params,
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
}
</script>

<template>
  <div class="text-center">
    <DefaultAuthCard title="Sign Up to Table Tennis Tracker">
      <SignUpForm @submit="onSubmit" />
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

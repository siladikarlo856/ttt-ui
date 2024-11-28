<script lang="ts" setup>
import DefaultAuthCard from "~/components/auth/DefaultAuthCard.vue";

definePageMeta({
  layout: "auth",
});

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const { isAuthenticated, isLoading } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs
const router = useRouter();

async function onSubmit(payload: { email: string; password: string }) {
  await authenticateUser(payload);

  if (isAuthenticated.value) {
    router.push("/");
  }
}
</script>

<template>
  <div class="mt-6 text-center">
    <DefaultAuthCard title="Sign In to Table Tennis Tracker">
      <SigninForm :loading="isLoading" @submit="onSubmit" />
    </DefaultAuthCard>
    <p class="font-medium">
      Don’t have any account?
      <nuxt-link to="/signup" class="text-primary">Sign up</nuxt-link>
    </p>
  </div>
</template>

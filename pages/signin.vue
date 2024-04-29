<script lang="ts" setup>
import DefaultAuthCard from "~/components/auth/DefaultAuthCard.vue";

definePageMeta({
  layout: "auth",
});

const email = ref("");
const password = ref("");
</script>

<template>
  <div class="mt-6 text-center">
    <DefaultAuthCard title="Sign In to Table Tennis Tracker">
      <form @submit.prevent="">
        <div class="flex flex-col items-start gap-2 mb-4">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="email"
            placeholder="Enter your email"
            type="email"
            class="w-full"
          />
        </div>
        <div class="flex flex-col items-start gap-2">
          <label for="password">Password</label>
          <InputText
            id="password"
            v-model="password"
            placeholder="Enter your password"
            type="password"
            class="w-full"
          />
        </div>
        <Button type="submit" class="w-full mt-6 text-center" label="Sign In" />
      </form>
    </DefaultAuthCard>
    <p class="font-medium">
      Don’t have any account?
      <nuxt-link to="/signup" class="text-primary">Sign up</nuxt-link>
    </p>
  </div>
</template>

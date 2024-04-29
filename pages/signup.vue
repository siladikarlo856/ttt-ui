<script lang="ts" setup>
import DefaultAuthCard from "~/components/auth/DefaultAuthCard.vue";

definePageMeta({
  layout: "auth",
});

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const retypePassword = ref("");
</script>

<template>
  <div class="text-center">
    <DefaultAuthCard title="Sign Up to Table Tennis Tracker">
      <form @submit.prevent="">
        <div class="flex flex-col items-start gap-2 mb-4">
          <label for="first-name">First Name</label>
          <InputText
            id="first-name"
            v-model="firstName"
            placeholder="Enter your first name"
            type="text"
            class="w-full"
          />
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
        </div>
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
        <div class="flex flex-col items-start gap-2 mb-4">
          <label for="password">Password</label>
          <InputText
            id="password"
            v-model="password"
            placeholder="Enter your password"
            type="password"
            class="w-full"
          />
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

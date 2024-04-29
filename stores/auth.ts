import { defineStore } from "pinia";

interface UserPayloadInterface {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const isLoading = ref(false);

  async function authenticateUser({ email, password }: UserPayloadInterface) {
    const { data, pending } = await useFetch("api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email, password },
      server: false,
    });

    isLoading.value = pending.value;

    if (data.value) {
      const accessToken = useCookie("accessToken");
      accessToken.value = data.value?.accessToken;
      isAuthenticated.value = true;
    }
  }

  function logUserOut() {
    const accessToken = useCookie("accessToken");
    accessToken.value = null;
    isAuthenticated.value = false;
  }

  return {
    isAuthenticated,
    isLoading,
    authenticateUser,
    logUserOut,
  };
});

import { defineStore } from "pinia";

interface UserPayloadInterface {
  email: string;
  password: string;
}

interface SigninResponse {
  accessToken: string;
  refreshToken: string;
}

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const isLoading = ref(false);

  const toast = useToast();

  async function authenticateUser({ email, password }: UserPayloadInterface) {
    isLoading.value = true;

    const { data, error } = await useFetch<SigninResponse>("api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email, password },
      server: false,
    });

    if (data.value) {
      const accessToken = useCookie("accessToken");
      const refreshToken = useCookie("refreshToken");

      accessToken.value = data.value?.accessToken;
      refreshToken.value = data.value?.refreshToken;

      isAuthenticated.value = true;
    } else {
      console.log(JSON.stringify(error.value));
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Invalid email or password. Please try again.",
        life: 3000,
      });
    }

    isLoading.value = false;
  }

  function logUserOut() {
    const accessToken = useCookie("accessToken");
    const refreshToken = useCookie("refreshToken");
    accessToken.value = null;
    refreshToken.value = null;
    isAuthenticated.value = false;
  }

  return {
    isAuthenticated,
    isLoading,
    authenticateUser,
    logUserOut,
  };
});

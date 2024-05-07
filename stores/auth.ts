import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

interface UserPayloadInterface {
  email: string;
  password: string;
}

interface SigninResponse {
  accessToken: string;
  refreshToken: string;
}

interface User {
  playerId: string;
  email: string;
}

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const user = ref<User>();

  const toast = useToast();

  // on create
  const accessToken = useCookie("accessToken");
  if (accessToken.value) {
    user.value = jwtDecode(accessToken.value);
    isAuthenticated.value = true;
  }

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
      user.value = jwtDecode(data?.value?.accessToken);
    } else {
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
    user,
    isAuthenticated,
    isLoading,
    authenticateUser,
    logUserOut,
  };
});

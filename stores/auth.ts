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
  const refreshTokenTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const toast = useToast();

  // ON CREATE
  console.log("on create auth store");

  const refreshToken = useCookie("refreshToken");
  const accessToken = useCookie("accessToken");

  if (accessToken.value) {
    user.value = jwtDecode(accessToken.value);
    isAuthenticated.value = true;
  }

  if (refreshToken.value) {
    // refresh token
    console.log("refresh token", jwtDecode(refreshToken.value));
  }

  // FUNCTIONS
  async function authenticateUser({ email, password }: UserPayloadInterface) {
    isLoading.value = true;

    const { data, error } = await useFetch<SigninResponse>("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email, password },
    });

    if (data.value) {
      const accessToken = useCookie("accessToken");
      const refreshToken = useCookie("refreshToken");

      accessToken.value = data.value?.accessToken;
      refreshToken.value = data.value?.refreshToken;

      isAuthenticated.value = true;
      user.value = jwtDecode(data?.value?.accessToken);
      console.log("user", user.value);
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

  async function refreshAccessToken() {
    const { data } = await useFetch<{ accessToken: string }>(
      "/api/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { refreshToken: refreshToken.value },
      }
    );

    if (data.value && data.value.accessToken) {
      accessToken.value = data.value.accessToken;
      refreshTokenTimeout.value = setTimeout(
        refreshAccessToken,
        1000 * 60 * 15
      );
    } else {
      logUserOut();
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    authenticateUser,
    logUserOut,
  };
});

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
  firstName: string;
  lastName: string;
}

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const user = ref<User>();
  const refreshTokenTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const toast = useToast();

  const refreshToken = useCookie("refreshToken");
  const accessToken = useCookie("accessToken");

  // FUNCTIONS
  async function authenticateUser({ email, password }: UserPayloadInterface) {
    isLoading.value = true;

    const { data, error } = await useFetch<SigninResponse>("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email, password },
    });

    if (data.value) {
      accessToken.value = data.value?.accessToken;
      refreshToken.value = data.value?.refreshToken;
      isAuthenticated.value = true;
      startRefreshAccessTokenTimer();
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Invalid email or password. Please try again.",
        life: 3000,
      });
    }

    isLoading.value = false;
    getUser();
  }

  function logUserOut() {
    const accessToken = useCookie("accessToken");
    const refreshToken = useCookie("refreshToken");
    accessToken.value = null;
    refreshToken.value = null;
    isAuthenticated.value = false;
    user.value = undefined;
    stopRefreshTokenTimer();
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
      startRefreshAccessTokenTimer();
    } else {
      logUserOut();
    }
  }

  async function getUser() {
    const { data, status } = await useFetch<User>("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
      server: false,
    });

    if (status.value === "success") {
      user.value = data.value!;
    } else {
      logUserOut();
    }
  }

  function startRefreshAccessTokenTimer() {
    if (!accessToken.value || !refreshToken.value) {
      logUserOut();
    }

    const refreshTokenExpires = jwtDecode(refreshToken.value ?? "").exp ?? 0;
    if (new Date(refreshTokenExpires * 1000).getTime() < Date.now()) {
      logUserOut();
      return;
    }

    const token = jwtDecode(accessToken.value ?? "");
    // set at timeout a minute before the token expires
    const timeout =
      new Date((token.exp ?? 0) * 1000).getTime() - Date.now() - 1000 * 60;
    if (timeout < 0) {
      refreshAccessToken();
      return;
    }

    refreshTokenTimeout.value = setTimeout(refreshAccessToken, timeout);
  }

  function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout.value!);
  }

  // ON CREATE
  if (accessToken.value) {
    isAuthenticated.value = true;
    startRefreshAccessTokenTimer();
    getUser();
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    authenticateUser,
    logUserOut,
  };
});

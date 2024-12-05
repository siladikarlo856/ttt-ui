import type { UseFetchOptions } from "#app";
import { defu } from "defu";

export async function useAuthFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
  const accessToken = useCookie("accessToken");

  const defaults: UseFetchOptions<T> = {
    key: url,
    headers: accessToken.value
      ? ({ Authorization: `Bearer ${accessToken.value}` } as Record<
          string,
          string
        >)
      : ({} as Record<string, string>),
    onResponse: async ({ response, options }) => {
      if (response.status === 401) {
        try {
          const newToken = await refreshToken();
          accessToken.value = newToken;

          options.headers = { Authorization: `Bearer ${newToken}` };

          useFetch(url, options as UseFetchOptions<T>);
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }
    },
  };

  const mergedOptions = defu(options, defaults);

  return useFetch<T>(url, mergedOptions);
}

async function refreshToken() {
  const refreshToken = useCookie("refreshToken");

  const { data, status } = await useFetch<{ access: string }>(
    "/api/token/refresh/",
    {
      method: "POST",
      body: { refresh: refreshToken.value },
    }
  );

  if (status.value === "success") {
    return data.value?.access;
  } else {
    throw new Error("Token refresh failed");
  }
}

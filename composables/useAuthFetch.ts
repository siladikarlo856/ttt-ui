import defu from "defu";
import type { UseFetchOptions } from "nuxt/app";

export function useAuthFetch<TReq = unknown>(
  url: string,
  options: UseFetchOptions<TReq> = {}
) {
  const token = useCookie("accessToken");

  const defaults: UseFetchOptions<TReq> = {
    server: false,
    key: url,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token.value}`,
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await navigateTo("/signin");
      }
    },
  };

  const mergedOptions = defu(options, defaults);

  return useFetch<TReq>(url, mergedOptions);
}

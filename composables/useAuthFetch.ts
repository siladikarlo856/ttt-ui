export function useAuthFetch<ResT = unknown>(url: string) {
  return useFetch<ResT>(url, {
    server: false,
    onRequest({ options }) {
      options.headers = options.headers || {};
      (options.headers as Record<string, string>).authorization =
        "Bearer " + useCookie("accessToken").value;
    },
  });
}

import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive

  // if is not authenticated exist redirect to log in
  if (
    !isAuthenticated.value &&
    to.name &&
    !["signin", "signup"].includes(to.name.toString())
  ) {
    abortNavigation();

    return navigateTo("/signin");
  }

  // if authenticated and url is /signin redirect to homepage
  if (isAuthenticated.value && to?.name === "signin") {
    return navigateTo("/");
  }
});

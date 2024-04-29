import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
  const accessToken = useCookie("accessToken"); // get token from cookies

  if (accessToken.value) {
    // check if value exists
    isAuthenticated.value = true; // update the state to authenticated
  }

  // if token exists and url is /signin redirect to homepage
  if (accessToken.value && to?.name === "signin") {
    return navigateTo("/");
  }

  // if token doesn't exist redirect to log in
  if (
    !accessToken.value &&
    to.name &&
    !["signin", "signup"].includes(to.name.toString())
  ) {
    abortNavigation();

    return navigateTo("/signin");
  }
});

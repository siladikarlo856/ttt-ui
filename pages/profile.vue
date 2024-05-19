<script lang="ts" setup>
const authStore = useAuthStore();

const userData = computed<Record<string, string>[]>(() => {
  return [
    { label: "First Name", value: authStore.user?.firstName ?? "" },
    { label: "Last Name", value: authStore.user?.lastName ?? "" },
    { label: "Email", value: authStore.user?.email ?? "" },
  ];
});
</script>

<template>
  <p class="text-xl flex items-center mb-4">
    <i class="pi pi-user mr-3"></i>User Profile
  </p>

  <DataTable :value="userData" stripedRows>
    <Column field="label" header-class="hidden" class="bold"></Column>
    <Column field="value" header-class="hidden"></Column>
  </DataTable>
</template>

<style></style>

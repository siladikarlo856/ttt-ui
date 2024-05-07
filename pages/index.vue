<script setup lang="ts">
import type { MatchDto } from "~/components/dashboard/MatchLogTable.vue.vue";
import MatchLogTable from "~/components/dashboard/MatchLogTable.vue.vue";

const { data: matches } = await useFetch<MatchDto[]>("api/matches", {
  server: false,
  onRequest({ options }) {
    options.headers = options.headers || {};
    (options.headers as Record<string, string>).authorization =
      "Bearer " + useCookie("accessToken").value;
  },
});
</script>
<template>
  <MatchLogTable :matches="matches ?? []" />
</template>

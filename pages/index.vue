<script setup lang="ts">
import CreateMatchDialog from "~/components/dashboard/CreateMatchDialog.vue.vue";
import type { MatchDto } from "~/components/dashboard/MatchLogTable.vue.vue";
import MatchLogTable from "~/components/dashboard/MatchLogTable.vue.vue";

const createMatchDialogVisible = ref(false);

const { data: matches, execute: getMatches } = await useFetch<MatchDto[]>(
  "api/matches",
  {
    server: false,
    onRequest({ options }) {
      options.headers = options.headers || {};
      (options.headers as Record<string, string>).authorization =
        "Bearer " + useCookie("accessToken").value;
    },
  }
);

function onAddMatchClick() {
  createMatchDialogVisible.value = true;
}
</script>
<template>
  <MatchLogTable :matches="matches ?? []" @add-match="onAddMatchClick" />
  <CreateMatchDialog
    v-model:visible="createMatchDialogVisible"
    @created:match="getMatches"
  />
</template>

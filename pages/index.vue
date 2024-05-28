<script setup lang="ts">
import CreateMatchDialog from "~/components/dashboard/CreateMatchDialog.vue";
import type { MatchDto } from "~/components/dashboard/MatchLogTable.vue";
import MatchLogTable from "~/components/dashboard/MatchLogTable.vue";

const isCreateMatchDialogVisible = ref(false);

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

const { data: players, execute: getPlayers } = await useFetch<SelectOption[]>(
  "api/players",
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
  isCreateMatchDialogVisible.value = true;
}
</script>
<template>
  <MatchLogTable :matches="matches ?? []" @add-match="onAddMatchClick" />
  <CreateMatchDialog
    v-model:visible="isCreateMatchDialogVisible"
    :players="players ?? []"
    @created:match="getMatches"
    @created:player="getPlayers"
  />
</template>

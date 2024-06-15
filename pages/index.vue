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

const matchId = ref<string>();
function onEdit(match: MatchDto) {
  console.log("Edit match", match);
  matchId.value = match.id;
  isCreateMatchDialogVisible.value = true;
}

const { data: user, pending } = useFetch("api/statistics/years", {
  server: false,
});
</script>
<template>
  <MatchLogTable
    :matches="matches ?? []"
    @add-match="onAddMatchClick"
    @edit="onEdit"
  />
  <CreateMatchDialog
    :match-id="matchId"
    v-model:visible="isCreateMatchDialogVisible"
    :players="players ?? []"
    @created:match="getMatches"
    @created:player="getPlayers"
  />
</template>

<script setup lang="ts">
import CreateMatchDialog from "~/components/dashboard/CreateMatchDialog.vue";
import type { MatchDto } from "~/components/dashboard/MatchLogTable.vue";
import MatchLogTable from "~/components/dashboard/MatchLogTable.vue";

const isCreateMatchDialogVisible = ref(false);

const { data: availableYears } = await useAuthFetch<string[]>(
  "/api/statistics/years"
);

const { data: matches, execute: getMatches } = await useAuthFetch<MatchDto[]>(
  "/api/matches"
);

const { data: players, execute: getPlayers } = await useAuthFetch<
  SelectOption[]
>("api/players");

const matchId = ref<string>();

function onAddMatchClick() {
  isCreateMatchDialogVisible.value = true;
}

function onEdit(match: MatchDto) {
  console.log("Edit match", match);
  matchId.value = match.id;
  isCreateMatchDialogVisible.value = true;
}
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

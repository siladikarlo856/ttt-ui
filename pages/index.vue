<script setup lang="ts">
import CreateMatchDialog from "~/components/dashboard/CreateMatchDialog.vue";
import CreatePlayerDialog from "~/components/dashboard/CreatePlayerDialog.vue";
import type { MatchDto } from "~/components/dashboard/MatchLogTable.vue";
import MatchLogTable from "~/components/dashboard/MatchLogTable.vue";

const isCreateMatchDialogVisible = ref(false);
const isCreatePlayerDialogVisible = ref(false);

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

function handleClickAddPlayer() {
  isCreatePlayerDialogVisible.value = true;
}

function onPlayerCreated() {
  getPlayers();
}
</script>
<template>
  <MatchLogTable :matches="matches ?? []" @add-match="onAddMatchClick" />
  <CreateMatchDialog
    v-model:visible="isCreateMatchDialogVisible"
    :players="players ?? []"
    @click:add-player="handleClickAddPlayer"
    @created:match="getMatches"
  />
  <CreatePlayerDialog
    v-model:visible="isCreatePlayerDialogVisible"
    @created:player="onPlayerCreated"
  />
</template>

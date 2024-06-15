<script setup lang="ts">
import { get } from "@vueuse/core";
import CreateMatchDialog from "~/components/dashboard/CreateMatchDialog.vue";
import type { MatchDto } from "~/components/dashboard/MatchLogTable.vue";
import MatchLogTable from "~/components/dashboard/MatchLogTable.vue";
import StatisticCard from "~/components/dashboard/StatisticCard.vue";

const isCreateMatchDialogVisible = ref(false);
const matchId = ref<string>();
const selectedOpponents = ref<string[]>([]);
const selectedTimeframe = ref<string>(
  new Date().toLocaleDateString("en-EN", {
    year: "numeric",
  })
);
const timeframeOptions = ref<SelectOption[]>([
  { label: selectedTimeframe.value, value: selectedTimeframe.value },
]);

const authStore = useAuthStore();

const { data: availableYears } = await useAuthFetch<string[]>(
  "/api/statistics/years"
);

const { data: matches, execute: getMatches } = await useAuthFetch<MatchDto[]>(
  "/api/matches"
);

const { data: players, execute: getPlayers } = await useAuthFetch<
  SelectOption[]
>("api/players");

const availablePlayers = computed<SelectOption[]>(() => {
  return (
    players.value?.filter(
      (player) => player.value !== authStore.user?.playerId
    ) ?? []
  );
});

function onAddMatchClick() {
  isCreateMatchDialogVisible.value = true;
}

function onEdit(match: MatchDto) {
  console.log("Edit match", match);
  matchId.value = match.id;
  isCreateMatchDialogVisible.value = true;
}

watch(
  () => players.value,
  () => {
    selectedOpponents.value = availablePlayers.value.map(
      (player) => player.value
    );
  },
  { deep: true, immediate: true }
);
</script>
<template>
  <div class="grid gap-4 grid-rows-[auto_auto_1fr] h-full">
    <div class="grid gap-2">
      <p class="text-xl flex items-center">
        <i class="pi pi-sliders-h mr-3"></i>Parameters
      </p>
      <div class="flex gap-4">
        <div class="flex flex-col items-start gap-2 w-full">
          <label for="opponents">Opponents</label>
          <MultiSelect
            v-model="selectedOpponents"
            class="w-full"
            id="opponents"
            :options="availablePlayers ?? []"
            option-value="value"
            option-label="label"
          />
        </div>
        <div class="flex flex-col items-start gap-2 w-full">
          <label for="time-frame">Time frame</label>
          <Dropdown
            v-model="selectedTimeframe"
            :options="timeframeOptions"
            option-value="value"
            option-label="label"
            class="w-full"
            id="time-frame"
          />
        </div>
      </div>
    </div>
    <div class="grid gap-2">
      <p class="text-xl flex items-center">
        <i class="pi pi-sparkles mr-3"></i>Statistics
      </p>
      <div class="flex gap-4">
        <StatisticCard
          class="w-full"
          color="text-success"
          title="Wins"
          :value="15"
        />
        <StatisticCard
          class="w-full"
          color="text-warning"
          title="Losses"
          :value="2"
        />
        <StatisticCard
          class="w-full"
          color="text-indigo-500"
          title="Win ratio"
          value="53.68%"
        />
        <StatisticCard
          class="w-full"
          color="text-meta-10"
          title="Winning streak"
          value="1"
          description="since 05.03.2024"
        />
      </div>
    </div>

    <MatchLogTable
      :matches="matches ?? []"
      @add-match="onAddMatchClick"
      @edit="onEdit"
    />
  </div>

  <CreateMatchDialog
    :match-id="matchId"
    v-model:visible="isCreateMatchDialogVisible"
    :players="players ?? []"
    @created:match="getMatches"
    @created:player="getPlayers"
  />
</template>

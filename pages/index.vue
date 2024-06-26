<script setup lang="ts">
import { formatDate } from "@vueuse/core";
import CreateMatchDialog from "~/components/dashboard/CreateMatchDialog.vue";
import type { MatchDto } from "~/components/dashboard/MatchLogTable.vue";
import MatchLogTable from "~/components/dashboard/MatchLogTable.vue";
import StatisticCard from "~/components/dashboard/StatisticCard.vue";

const isCreateMatchDialogVisible = ref(false);
const matchId = ref<string>();
const selectedOpponents = ref<string[]>([]);

const authStore = useAuthStore();

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

const { data: availableYears } = await useAuthFetch<SelectOption[]>(
  "/api/statistics/years"
);
const selectedTimeframe = ref<string>(availableYears.value?.[0]?.value ?? "");

const startDate = computed(() => new Date(selectedTimeframe.value.toString()));

const { data: statistics, execute: getStatistics } =
  await useFetch<StatisticsDto>("/api/statistics", {
    method: "POST",
    body: { startDate: startDate, opponents: selectedOpponents },
    headers: {
      Authorization: `Bearer ${useCookie("accessToken").value}`,
    },
  });

watch(
  () => players.value,
  () => {
    selectedOpponents.value = availablePlayers.value.map(
      (player) => player.value
    );
  },
  { deep: true, immediate: true }
);

const { data: matches, execute: getMatches } = await useAuthFetch<MatchDto[]>(
  "/api/matches",
  {
    params: {
      year: selectedTimeframe,
      opponents: selectedOpponents,
    },
  }
);

const areAllOpponentsSelected = computed(() => {
  return selectedOpponents.value.length === availablePlayers.value.length;
});

const currentStreakTitle = computed(() => {
  if (!statistics.value?.currentStreak?.startDate) return "No streak";
  return statistics.value?.currentStreak?.type === "win"
    ? "Winning streak"
    : "Losing streak";
});

const currentStreakDescription = computed(() => {
  if (!statistics.value?.currentStreak?.startDate) return "";

  const startDate = new Date(statistics.value?.currentStreak?.startDate);
  const formattedStartDate = formatDate(startDate, "DD.MM.YYYY");

  return `since ${formattedStartDate}`;
});

const winRatio = computed(() => {
  if (!statistics.value?.winRatio) return "";
  return (statistics.value?.winRatio * 100).toFixed(2) + "%";
});

function onAddMatchClick() {
  isCreateMatchDialogVisible.value = true;
}

function onEdit(match: MatchDto) {
  console.log("Edit match", match);
  matchId.value = match.id;
  isCreateMatchDialogVisible.value = true;
}

function onMatchCreated() {
  getMatches();
  getStatistics();
}
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
          >
            <template v-if="areAllOpponentsSelected" #value>All</template>
          </MultiSelect>
        </div>
        <div class="flex flex-col items-start gap-2 w-full">
          <label for="time-frame">Time frame</label>
          <Dropdown
            v-model="selectedTimeframe"
            :options="availableYears ?? []"
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
          :value="statistics?.wins"
        />
        <StatisticCard
          class="w-full"
          color="text-warning"
          title="Losses"
          :value="statistics?.losses"
        />
        <StatisticCard
          class="w-full"
          color="text-indigo-500"
          title="Win ratio"
          :value="winRatio"
        />
        <StatisticCard
          class="w-full"
          color="text-meta-10"
          :title="currentStreakTitle"
          :value="statistics?.currentStreak.length"
          :description="currentStreakDescription"
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
    @created:match="onMatchCreated"
    @created:player="getPlayers"
  />
</template>

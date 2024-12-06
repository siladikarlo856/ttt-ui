<script setup lang="ts">
import { formatDate } from "@vueuse/core";
import CreateMatchDialog from "~/components/dashboard/CreateMatchDialog.vue";
import MatchLogTable from "~/components/dashboard/MatchLogTable.vue";
import StatisticCard from "~/components/dashboard/StatisticCard.vue";
import type { MatchDto, SelectOption, StatisticsDto } from "~/types";

const isCreateMatchDialogVisible = ref(false);
const matchId = ref<string>();
const selectedOpponents = ref<string[]>([]);

const authStore = useAuthStore();

const { data: players, execute: getPlayers } = await useAuthFetch<
  SelectOption[]
>("api/players");

const availablePlayers = computed<SelectOption[]>(() => {
  return (
    (players.value as SelectOption[])?.filter(
      (player: SelectOption) => player.value !== authStore.user?.playerId
    ) ?? []
  );
});

const { data: availableYears } = await useAuthFetch<SelectOption[]>(
  "/api/statistics/years"
);
const selectedTimeframe = ref<string>(availableYears.value?.[0]?.value ?? "");

const startDate = computed(() => new Date(selectedTimeframe.value.toString()));

const { data: statistics, execute: getStatistics } =
  await useAuthFetch<StatisticsDto>("/api/statistics", {
    method: "POST",
    body: { startDate: startDate, opponents: selectedOpponents },
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
  if (!statistics.value?.winRatio) return undefined;
  return (statistics.value?.winRatio * 100).toFixed(2) + "%";
});

function onAddMatchClick() {
  isCreateMatchDialogVisible.value = true;
}

function onEdit(match: MatchDto) {
  matchId.value = match.id;
  isCreateMatchDialogVisible.value = true;
}

function onMatchCreated() {
  getMatches();
  getStatistics();
}

function onCreateMatchDialogHide() {
  matchId.value = "";
}

const toast = useToast();

async function onCreateMatch(match: any) {
  const { status, error } = await useAuthFetch(`/api/matches/`, {
    method: "POST",
    body: match,
  });

  if (status.value === "success") {
    isCreateMatchDialogVisible.value = false;
    toast.add({
      severity: "success",
      summary: "Match log is created",
      life: 3000,
    });
    getMatches();
    getStatistics();
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value?.message ?? "An error occurred",
    });
  }
}

async function onUpdateMatch({ matchId, match }: any) {
  const { status, error } = await useAuthFetch(`/api/matches/${matchId}`, {
    method: "PATCH",
    body: match,
  });

  if (status.value === "success") {
    isCreateMatchDialogVisible.value = false;
    toast.add({
      severity: "success",
      summary: "Match log is updated",
      life: 3000,
    });
    getMatches();
    getStatistics();
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value?.message ?? "An error occurred",
    });
  }
}
</script>
<template>
  <div class="grid gap-4 grid-rows-[auto_auto_1fr] h-full">
    <div class="grid gap-2">
      <p class="text-xl flex items-center">
        <i class="pi pi-sliders-h mr-3" />Parameters
      </p>
      <div class="flex gap-4">
        <div class="flex flex-col items-start gap-2 w-full">
          <label for="opponents">Opponents</label>
          <MultiSelect
            id="opponents"
            v-model="selectedOpponents"
            class="w-full"
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
            id="time-frame"
            v-model="selectedTimeframe"
            :options="availableYears ?? []"
            option-value="value"
            option-label="label"
            class="w-full"
          />
        </div>
      </div>
    </div>
    <div class="grid gap-2">
      <p class="text-xl flex items-center">
        <i class="pi pi-sparkles mr-3" />Statistics
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
    v-model:visible="isCreateMatchDialogVisible"
    :match-id="matchId"
    :players="players ?? []"
    @created:player="getPlayers"
    @create:match="onCreateMatch"
    @update:match="onUpdateMatch"
    @hide="onCreateMatchDialogHide"
  />
</template>

<script setup lang="ts">
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useAuthStore } from "~/stores/auth";
import CreatePlayerDialog from "./CreatePlayerDialog.vue";
import CreateSetsDialog from "./CreateSetsDialog.vue";
import { matchTypes } from "~/utils/constants";
import type { SelectOption, MatchDto, CreateMatchDto } from "~/types";

const props = withDefaults(
  defineProps<{
    players?: SelectOption[];
    matchId?: string;
  }>(),
  {
    players: () => [],
    matchId: undefined,
  }
);

const emit = defineEmits<{
  "click:add-player": [];
  "click:add-sets": [];
  "created:player": [];
  "create:match": [match: CreateMatchDto];
  "update:match": [
    params: {
      matchId: string;
      match: CreateMatchDto;
    }
  ];
  hide: [];
}>();

const visible = defineModel<boolean>("visible");

const store = useAuthStore();
const toast = useToast();

const { isVisible: isCreatePlayerDialogVisible, show: showCreatePlayerDialog } =
  useVisibilityController();

const { isVisible: isCreateSetsDialogVisible, show: showCreateSetsDialog } =
  useVisibilityController();

const isEditMode = computed(() => !!props.matchId);
const submitButtonText = computed(() => (isEditMode.value ? "Update" : "Save"));

const { handleSubmit, errors, defineField, resetForm, meta } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      date: z.date().nullable(),
      type: z.nativeEnum(MatchType).nullable(),
      homePlayerId: z.string().min(1).nullable(),
      awayPlayerId: z.string().min(1, "Opponent is required"),
      homePlayerSetsWon: z
        .number({
          required_error: "Sets won is required",
          message: "Sets won must not be empty",
        })
        .int()
        .min(0)
        .max(9)
        .nullable(),
      awayPlayerSetsWon: z
        .number({
          required_error: "Sets won is required",
          message: "Sets won must not be empty",
        })
        .int()
        .min(0)
        .max(9)
        .nullable(),
      sets: z.array(z.array(z.number()).optional()),
    })
  ),
  initialValues: {
    homePlayerId: store.user?.playerId ?? "",
    awayPlayerId: "",
    awayPlayerSetsWon: null,
    homePlayerSetsWon: null,
    date: new Date(),
    type: null,
    sets: [],
  },
});

const [date, dateAttrs] = defineField("date", {
  validateOnBlur: true,
});
const [matchType, matchTypeAttrs] = defineField("type", {
  validateOnBlur: true,
});
const [homePlayerId, homePlayerIdAttrs] = defineField("homePlayerId", {
  validateOnBlur: true,
});
const [awayPlayerId, awayPlayerIdAttrs] = defineField("awayPlayerId", {
  validateOnBlur: true,
});
const [homePlayerSetsWon, homePlayerSetsWonAttrs] = defineField(
  "homePlayerSetsWon",
  {
    validateOnBlur: true,
  }
);
const [awayPlayerSetsWon, awayPlayerSetsWonAttrs] = defineField(
  "awayPlayerSetsWon",
  {
    validateOnBlur: true,
  }
);

const [sets, setsAttrs] = defineField("sets", {
  validateOnBlur: true,
});

// COMPUTED
const availablePlayers = computed<SelectOption[]>(() => {
  return (
    props.players?.filter((player) => player.value !== homePlayerId.value) ?? []
  );
});

const isMatchSetsNotEmpty = computed(() =>
  sets.value?.some((s) => s?.some((p) => p !== null))
);

const setPointsButtonText = computed(() =>
  isMatchSetsNotEmpty.value ? "Edit set points" : "Add set points"
);

const matchSetsText = computed(() => {
  return sets.value?.reduce((acc, set) => {
    if (!set) return acc;
    return acc + `${set.join("-")}; `;
  }, "");
});

// FUNCTIONS
function onCancelClick() {
  visible.value = false;
}

function onHide() {
  resetForm({
    values: {
      date: new Date(),
      homePlayerId: store.user?.playerId ?? "",
      awayPlayerId: "",
      awayPlayerSetsWon: null,
      homePlayerSetsWon: null,
      sets: [],
      type: null,
    },
  });
  emit("hide");
}

function setCurrentDate() {
  date.value = new Date();
}

interface setDto {
  homePlayerPoints: number;
  awayPlayerPoints: number;
}

const onSubmit = handleSubmit(async (values) => {
  if (!meta.value.dirty) {
    toast.add({
      severity: "info",
      summary: "No changes",
      detail: "No changes detected.",
      life: 3000,
    });
    return;
  }

  const mappedSetsValue: setDto[] =
    sets.value?.reduce((acc, set) => {
      if (!set || !set?.[0] || !set?.[1]) return acc;
      return [
        ...acc,
        {
          homePlayerPoints: set[0],
          awayPlayerPoints: set[1],
        },
      ];
    }, [] as unknown as setDto[]) ?? [];

  const match: CreateMatchDto = {
    date: values.date?.toISOString() ?? null,
    homePlayerId: values.homePlayerId,
    awayPlayerId: values.awayPlayerId,
    homePlayerSetsWon: values.homePlayerSetsWon,
    awayPlayerSetsWon: values.awayPlayerSetsWon,
    sets: mappedSetsValue,
    type: values.type,
  };

  if (isEditMode.value) {
    if (!props.matchId) return;

    emit("update:match", { matchId: props.matchId, match });
    return;
  }

  emit("create:match", match);
});

function onCreateNewPlayerClick() {
  showCreatePlayerDialog();
}

function onAddSets() {
  showCreateSetsDialog();
}

async function onShow() {
  if (props.matchId) {
    const { data } = await useAuthFetch<MatchDto>(
      `api/matches/${props.matchId}`
    );

    const matchData = data as Ref<MatchDto>;

    resetForm({
      values: {
        date: new Date(matchData?.value?.date ?? ""),
        homePlayerId: matchData?.value?.homePlayer?.id,
        awayPlayerId: matchData?.value?.awayPlayer?.id,
        homePlayerSetsWon: matchData?.value?.homePlayerSetsWon,
        awayPlayerSetsWon: matchData?.value?.awayPlayerSetsWon,
        sets: matchData?.value?.sets?.map((set: setDto) => [
          set.homePlayerPoints,
          set.awayPlayerPoints,
        ]),
        type: matchData?.value?.type,
      },
    });
  } else {
    setCurrentDate();
  }
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    header="Add New Match"
    class="w-[90%] md:w-auto fullscreen-dialog"
    v-bind="$attrs"
    @show="onShow"
    @hide="onHide"
  >
    <form class="grid gap-4 pt-5">
      <div class="grid md:grid-cols-[2fr_1fr] grid-cols-[1fr] gap-4">
        <div class="flex flex-col items-start gap-2">
          <label for="homePlayer">You</label>
          <Dropdown
            id="homePlayer"
            v-model="homePlayerId"
            v-bind="homePlayerIdAttrs"
            :options="players"
            option-value="value"
            option-label="label"
            class="w-full"
            disabled
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-items-center">
                <div>
                  {{
                    players?.find(
                      (player: SelectOption) => player.value === slotProps.value
                    )?.label
                  }}
                  (You)
                </div>
              </div>
            </template>
          </Dropdown>
          <small class="error-message">{{ errors.homePlayerId }}</small>
        </div>
        <div class="flex flex-col items-start gap-2">
          <label for="homePlayerSetsWon">Sets won</label>
          <InputNumber
            id="homePlayerSetsWon"
            v-model="homePlayerSetsWon"
            v-bind="homePlayerSetsWonAttrs"
            :min="0"
            :max="9"
            class="w-full"
          />
          <small class="error-message">{{ errors.homePlayerSetsWon }}</small>
        </div>
        <div class="flex flex-col items-start gap-2">
          <label for="awayPlayer">Opponent</label>
          <Dropdown
            id="awayPlayer"
            v-model="awayPlayerId"
            v-bind="awayPlayerIdAttrs"
            :options="availablePlayers ?? []"
            option-value="value"
            option-label="label"
            filter
            class="w-full"
          >
            <template #footer>
              <Button
                label="Create new player"
                class="w-full bg-inherit text-inherit text-left"
                icon="pi pi-plus"
                @click="onCreateNewPlayerClick" /></template
          ></Dropdown>
          <small class="error-message">{{ errors.awayPlayerId }}</small>
        </div>
        <div class="flex flex-col items-start gap-2">
          <label for="homePlayerSetsWon">Sets won</label>
          <InputNumber
            id="homePlayerSetsWon"
            v-model="awayPlayerSetsWon"
            v-bind="awayPlayerSetsWonAttrs"
            :min="0"
            :max="9"
            class="w-full"
          />
          <small class="error-message">{{ errors.awayPlayerSetsWon }}</small>
        </div>
      </div>
      <div class="w-full">
        <div
          v-if="isMatchSetsNotEmpty"
          class="flex flex-col items-start gap-2 mb-4"
        >
          <label for="setPoints">Set Points</label>
          <InputText
            id="setPoints"
            :model-value="matchSetsText"
            disabled
            class="w-full"
          />
        </div>

        <div class="flex flex-col items-start gap-2 mb-4">
          <label for="matchDate">Date</label>
          <Calendar
            v-model="date"
            v-bind="dateAttrs"
            input-id="matchDate"
            :max-date="new Date()"
            date-format="dd.mm.yy."
            class="w-full"
            show-button-bar
          />
        </div>
        <div class="flex flex-col items-start gap-2 mb-4">
          <label for="matchType">MatchType</label>
          <Dropdown
            id="matchType"
            v-model="matchType"
            v-bind="matchTypeAttrs"
            :options="matchTypes"
            option-label="label"
            option-value="value"
            placeholder="Select match type"
            class="w-full"
          />
        </div>
      </div>

      <div class="flex justify-between">
        <Button
          :label="setPointsButtonText"
          icon="pi pi-plus"
          text
          @click="onAddSets"
        />
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="onCancelClick"
          />
          <Button type="button" :label="submitButtonText" @click="onSubmit" />
        </div>
      </div>
    </form>
  </Dialog>
  <CreatePlayerDialog
    v-model:visible="isCreatePlayerDialogVisible"
    @created:player="$emit('created:player')"
  />
  <CreateSetsDialog
    v-model="sets"
    v-model:visible="isCreateSetsDialogVisible"
    v-bind="setsAttrs"
  />
</template>

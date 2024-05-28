<script setup lang="ts">
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useAuthStore } from "~/stores/auth";
import CreatePlayerDialog from "./CreatePlayerDialog.vue";
import CreateSetsDialog from "./CreateSetsDialog.vue";

const props = defineProps<{
  visible: boolean;
  players: SelectOption[] | undefined;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  "created:match": [void];
  "click:add-player": [];
  "click:add-sets": [];
  "created:player": [];
}>();

const store = useAuthStore();
const toast = useToast();

const isCreatePlayerDialogVisible = ref(false);
const isCreateSetsDialogVisible = ref(false);

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      date: z.date(),
      homePlayerId: z.string().min(1),
      awayPlayerId: z.string().min(1, "Opponent is required"),
      homePlayerSetsWon: z
        .number({
          required_error: "Sets won is required",
          message: "Sets won must not be empty",
        })
        .int()
        .min(0)
        .max(9),
      awayPlayerSetsWon: z
        .number({
          required_error: "Sets won is required",
          message: "Sets won must not be empty",
        })
        .int()
        .min(0)
        .max(9),
      sets: z.array(z.array(z.number()).optional()),
    })
  ),
  initialValues: {
    homePlayerId: store.user?.playerId ?? "",
    awayPlayerId: "",
    sets: [],
  },
});

const [date, dateAttrs] = defineField("date", {
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
  emit("update:visible", false);
}

function onHide() {
  resetForm();
}

function getCurrentDate() {
  date.value = new Date();
}

interface setDto {
  homePlayerPoints: number;
  awayPlayerPoints: number;
}
const onSaveClick = handleSubmit(async (values) => {
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

  const { status, error } = await useFetch("api/matches", {
    method: "POST",
    body: {
      date: values.date.toISOString(),
      homePlayerId: values.homePlayerId,
      awayPlayerId: values.awayPlayerId,
      homePlayerSetsWon: values.homePlayerSetsWon,
      awayPlayerSetsWon: values.awayPlayerSetsWon,
      sets: mappedSetsValue,
    },
    onRequest({ options }) {
      options.headers = options.headers || {};
      (options.headers as Record<string, string>).authorization =
        "Bearer " + useCookie("accessToken").value;
    },
  });

  if (status.value === "success") {
    emit("update:visible", false);
    emit("created:match");
    toast.add({
      severity: "success",
      summary: "Match log is created.",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value?.message ?? "An error occurred",
    });
  }
});

function onCreateNewPlayerClick() {
  isCreatePlayerDialogVisible.value = true;
}

function onAddSets() {
  isCreateSetsDialogVisible.value = true;
}
</script>

<template>
  <Dialog
    :visible="visible"
    header="Add New Match"
    class="w-[90%] md:w-auto fullscreen-dialog"
    v-bind="$attrs"
    @update:visible="$emit('update:visible', $event)"
    @show="getCurrentDate"
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
            :options="players ?? []"
            option-value="value"
            option-label="label"
            class="w-full"
            disabled
          >
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-items-center">
                <div>
                  {{
                    players?.find((player) => player.value === slotProps.value)
                      ?.label
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
            inputId="matchDate"
            :maxDate="new Date()"
            date-format="dd.mm.yy."
            class="w-full"
            showButtonBar
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
          ></Button>
          <Button type="button" label="Save" @click="onSaveClick"></Button>
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

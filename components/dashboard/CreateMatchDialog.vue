<script setup lang="ts">
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useAuthStore } from "~/stores/auth";

const props = defineProps<{
  visible: boolean;
  players: SelectOption[] | undefined;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  "created:match": [void];
  "click:add-player": [];
}>();

const store = useAuthStore();
const toast = useToast();

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
    })
  ),
  initialValues: {
    homePlayerId: store.user?.playerId ?? "",
    awayPlayerId: "",
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

// COMPUTED
const availablePlayers = computed<SelectOption[]>(() => {
  return (
    props.players?.filter((player) => player.value !== homePlayerId.value) ?? []
  );
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

const onSaveClick = handleSubmit(async (values) => {
  useFetch("api/matches", {
    method: "POST",
    body: {
      date: values.date.toISOString(),
      homePlayerId: values.homePlayerId,
      awayPlayerId: values.awayPlayerId,
      homePlayerSetsWon: values.homePlayerSetsWon,
      awayPlayerSetsWon: values.awayPlayerSetsWon,
    },
    onRequest({ options }) {
      options.headers = options.headers || {};
      (options.headers as Record<string, string>).authorization =
        "Bearer " + useCookie("accessToken").value;
    },
  })
    .then(() => {
      emit("update:visible", false);
      emit("created:match");
    })
    .catch((error) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
    });
});
</script>

<template>
  <Dialog
    :visible="visible"
    header="Add New Match"
    class="w-[90%] md:w-auto"
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
                @click="$emit('click:add-player')" /></template
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

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="onCancelClick"
        ></Button>
        <Button type="button" label="Save" @click="onSaveClick"></Button>
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const store = useAuthStore();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  "created:match": [void];
}>();

const toast = useToast();

function onCancelClick() {
  emit("update:visible", false);
}

function onSaveClick() {
  useFetch("api/matches", {
    method: "POST",
    body: {
      date: date.value.toISOString(),
      homePlayerId: homePlayerId.value,
      awayPlayerId: awayPlayerId.value,
      homePlayerSetsWon: homePlayerSetsWon.value,
      awayPlayerSetsWon: awayPlayerSetsWon.value,
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
}

const date = ref<Date>(new Date());
const homePlayerId = ref(store.user?.playerId);
const awayPlayerId = ref<string>();
const homePlayerSetsWon = ref<number>(0);
const awayPlayerSetsWon = ref<number>(0);

const { data: players } = await useFetch<SelectOption[]>("api/players", {
  server: false,
  onRequest({ options }) {
    options.headers = options.headers || {};
    (options.headers as Record<string, string>).authorization =
      "Bearer " + useCookie("accessToken").value;
  },
});

const availablePlayers = computed<SelectOption[]>(() => {
  return (
    players.value?.filter((player) => player.value !== homePlayerId.value) ?? []
  );
});
</script>

<template>
  <Dialog
    header="Add New Match"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="grid gap-8 pt-5">
      <div class="grid grid-cols-[2fr_1fr] gap-8">
        <FloatLabel>
          <Dropdown
            id="homePlayer"
            v-model="homePlayerId"
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
          <label for="homePlayer">You</label>
        </FloatLabel>
        <FloatLabel>
          <InputNumber
            id="homePlayerSetsWon"
            v-model="homePlayerSetsWon"
            :min="0"
            :max="9"
            class="w-full"
          />
          <label for="homePlayerSetsWon">Sets won by You</label>
        </FloatLabel>
        <FloatLabel>
          <Dropdown
            id="awayPlayer"
            v-model="awayPlayerId"
            :options="availablePlayers ?? []"
            option-value="value"
            option-label="label"
            class="w-full"
          />
          <label for="awayPlayer">Opponent</label>
        </FloatLabel>
        <FloatLabel>
          <InputNumber
            id="awayPlayerSetsWon"
            v-model="awayPlayerSetsWon"
            :min="0"
            :max="9"
            class="w-full"
          />
          <label for="awayPlayerSetsWon">Sets won by Oppnent</label>
        </FloatLabel>
      </div>
      <div class="w-full">
        <FloatLabel>
          <label for="match_date">Date</label>
          <Calendar
            v-model="date"
            inputId="match_date"
            :maxDate="new Date()"
            date-format="dd.mm.yy."
            class="w-full"
            showButtonBar
          />
        </FloatLabel>
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
    </div>
  </Dialog>
</template>

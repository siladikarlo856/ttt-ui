<script lang="ts" setup>
import CreatePlayerForm from "@/components/dashboard/CreatePlayerForm.vue";
import type { CreatePlayerDto } from "~/types";

const emit = defineEmits<{
  "created:player": [];
}>();

const visible = defineModel<boolean>("visible");

const toast = useToast();

const createPlayerFormRef = ref<InstanceType<typeof CreatePlayerForm>>();

const { createPlayer } = usePlayersService();

async function onCreateClick(player: CreatePlayerDto) {
  const { status } = await createPlayer(player);

  if (status.value === "success") {
    toast.add({
      severity: "success",
      summary: "Player is added successfully.",
      life: 3000,
    });

    visible.value = false;

    emit("created:player");
  }
}

function resetForm() {
  createPlayerFormRef.value?.resetForm();
}

function onCancelClick() {
  visible.value = false;
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    header="Add New Player"
    :base-z-index="9000"
    class="fullscreen-dialog"
    @hide="resetForm"
  >
    <CreatePlayerForm
      @click:create="onCreateClick"
      @click:cancel="onCancelClick"
    />
  </Dialog>
</template>

<style></style>

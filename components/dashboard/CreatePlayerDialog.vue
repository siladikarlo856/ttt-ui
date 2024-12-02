<script lang="ts" setup>
import CreatePlayerForm from "@/components/dashboard/CreatePlayerForm.vue";

defineProps({
  visible: Boolean,
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  "created:player": [];
}>();

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

    emit("update:visible", false);
    emit("created:player");
  }
}

function resetForm() {
  createPlayerFormRef.value?.resetForm();
}

function onCancelClick() {
  emit("update:visible", false);
}
</script>

<template>
  <Dialog
    header="Add New Player"
    :visible="visible"
    :base-z-index="9000"
    class="fullscreen-dialog"
    @update:visible="$emit('update:visible', $event)"
    @hide="resetForm"
  >
    <CreatePlayerForm
      @click:create="onCreateClick"
      @click:cancel="onCancelClick"
    />
  </Dialog>
</template>

<style></style>

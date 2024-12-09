<script setup lang="ts">
import type { MatchDto, SelectOption } from "~/types";

defineProps<{ matches: MatchDto[] }>();

defineEmits<{
  addMatch: [];
  edit: [match: MatchDto];
}>();

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between">
      <p class="text-xl flex items-center">
        <i class="pi pi-receipt mr-3" />Matches
      </p>
      <Button
        icon="pi pi-plus"
        size="small"
        label="Add Match"
        text
        @click="$emit('addMatch')"
      />
    </div>
    <div class="flex-grow">
      <DataTable
        :value="matches ?? []"
        striped-rows
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20, 50]"
      >
        <Column style="width: 65px">
          <template #body="{ data }">
            <Button
              icon="pi pi-pencil"
              rounded
              size="small"
              class="h-8 w-8"
              @click="$emit('edit', data)"
          /></template>
        </Column>
        <Column field="date" header="Date" data-type="date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.date) }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar
              v-model="filterModel.value"
              date-format="mm/dd/yy"
              placeholder="mm/dd/yyyy"
              mask="99/99/9999"
            />
          </template>
        </Column>
        <Column field="homePlayer.label" header="Home Player" />
        <Column field="awayPlayer.label" header="Away Player" sortable />
        <Column field="homePlayerSetsWon" header="Home Player Sets" sortable />
        <Column field="awayPlayerSetsWon" header="Away Player Sets" sortable />
        <Column field="type" header="Type" sortable>
          <template #body="{ data }">
            {{
              matchTypes.find((t: SelectOption) => t.value === data.type)?.label
            }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

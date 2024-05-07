<script setup lang="ts">
export interface MatchDto {
  id: number;
  date: string;
  homePlayerFullName: string;
  awayPlayerFullName: string;
  homePlayerSetsWon: number;
  awayPlayerSetsWon: number;
}

defineProps<{ matches: MatchDto[] }>();

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
    <div class="flex justify-between py-3">
      <p class="text-xl flex items-center">
        <i class="pi pi-list mr-3"></i>Matches
      </p>
      <Button icon="pi pi-plus" label="Add Match" />
    </div>
    <div class="flex-grow">
      <DataTable
        :value="matches ?? []"
        stripedRows
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
      >
        <Column field="date" header="Date" dataType="date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.date) }}
          </template>
          <template #filter="{ filterModel }">
            <Calendar
              v-model="filterModel.value"
              dateFormat="mm/dd/yy"
              placeholder="mm/dd/yyyy"
              mask="99/99/9999"
            />
          </template>
        </Column>
        <Column field="homePlayerFullName" header="Home Player"></Column>
        <Column
          field="awayPlayerFullName"
          header="Away Player"
          sortable
        ></Column>
        <Column
          field="homePlayerSetsWon"
          header="Home Player Sets"
          sortable
        ></Column>
        <Column
          field="awayPlayerSetsWon"
          header="Away Player Sets"
          sortable
        ></Column>
      </DataTable>
    </div>
  </div>
</template>

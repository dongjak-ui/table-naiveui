<script setup lang="ts">
import {IPagination, ITable, RowActionType, RowSelectionMode} from "@dongjak-public-types/table";
import {Theme} from "@dongjak-public-types/commons";

const props = withDefaults(defineProps<ITable<any>>(), {
  theme: Theme.DARK,
  pk: 'id',
  pagination: () => {
    return {
      pageSize: 10,
      pageNo: 1
    } as IPagination
  },
  selectionMode: RowSelectionMode.MULTIPLE,
  rowActions: () => {
    return ["add", "edit", "delete"] as RowActionType[]
  }
})
</script>

<template>
  <n-data-table :columns="columns" :data="data" />
</template>

<style scoped>

</style>

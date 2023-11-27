<script setup lang="ts">
import {IPagination, ITable, RowActionType, RowSelectionMode} from "@dongjak-public-types/table";
import {QueryPayloads, Theme} from "@dongjak-public-types/commons";
import {createColumn} from "./column";
import {computed, onMounted} from "vue";
import {darkTheme, NConfigProvider} from 'naive-ui'

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
const _columns = computed(() => {
  return props?.columns?.map(createColumn(props))
})
const data = ref<any>([])
onMounted(async () => {
  const resData = (await props.dataSource.get(QueryPayloads.firstPage())).data?.data
  if (resData)
    data.value = resData
})
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-data-table :columns="_columns" :data="data"/>
  </n-config-provider>

</template>

<style scoped>

</style>

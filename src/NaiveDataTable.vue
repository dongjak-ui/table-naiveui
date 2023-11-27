<script setup lang="ts">
import {IPagination, ITable, RowActionType, RowSelectionMode} from "@dongjak-public-types/table";
import {IQueryPayload, QueryPayloads, Theme} from "@dongjak-public-types/commons";
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

const firstPage = QueryPayloads.firstPage()
const pagination = reactive({
  page: firstPage.pageNo,
  pageCount: 1,
  pageSize: firstPage.pageSize,
  pageSizes: [
    {
      label: '10 每页',
      value: 10
    },
    {
      label: '20 每页',
      value: 20
    },
    {
      label: '30 每页',
      value: 30
    },
    {
      label: '40 每页',
      value: 40
    }
  ],
  total: firstPage.pageSize
})
const isLoading = ref(false)
const load = (payload: IQueryPayload) => {
  isLoading.value = true
  props.dataSource.get(payload).then(res => {
    const resPage = res.data
    if (resPage) {
      data.value = resPage.data
      pagination.pageCount = resPage.totalPages
      pagination.pageSize = resPage.pageSize
      pagination.page = resPage.pageNo
      pagination.total = resPage.totalElements
    }
  }).finally(() => {
    isLoading.value = false
  })
}

onMounted(async () => {
  load(firstPage)
})


const getRowKey = (rowData: any): any => {
  return rowData[props.pk]

}
const onUpdatePageSize = (pageSize: number) => {
  pagination.page = 1
  load(QueryPayloads.ofPage(pagination.page, pageSize))
}
const onUpdatePage = (page: number) => {
  load(QueryPayloads.ofPage(page, pagination.pageSize!))
}


</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div class="flex flex-col  ">

      <n-scrollbar x-scrollable>
        <n-data-table        :loading="isLoading" :columns="_columns" :data="data" :row-key="getRowKey"/>
      </n-scrollbar>
      <n-pagination
          class="m-y-10px justify-end"
          :display-order="['quick-jumper', 'pages', 'size-picker']"
          :page-count="pagination.pageCount"
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          show-quick-jumper
          show-size-picker
          :on-update:page="onUpdatePage"
          :on-update:page-size="onUpdatePageSize"
      >
        <template #suffix="{ endIndex }">
          共{{ pagination.total }}条数据
        </template>
      </n-pagination>
    </div>

  </n-config-provider>

</template>

<style scoped>

</style>

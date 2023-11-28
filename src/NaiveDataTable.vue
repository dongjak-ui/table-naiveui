<script setup lang="ts">
import {IPagination, ITable, RowActionType, RowSelectionMode} from "@dongjak-public-types/table";
import {QueryPayloads, Theme} from "@dongjak-public-types/commons";
import {useColumn} from "./column";
import {darkTheme, NButton, NConfigProvider, NSpace} from 'naive-ui'
import {Icon} from '@iconify/vue';
import {defaultToolbarItems, useToolbar} from "./toolbar";
import {useDataSource} from "./datasource";
import {useTable} from "./index";

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
  },
  toolbar: () => {
    return {
      items: defaultToolbarItems
    }
  }
})


const {columns} = useColumn(props)
const {leftToolbarItems, rightToolbarItems} = useToolbar(props)
const {data, pagination, isLoading, load, onUpdatePage, onUpdatePageSize} = useDataSource(props)
const {getRowKey, onUpdateCheckedRows ,selectedRows} = useTable(props)
onMounted(async () => {
  load(QueryPayloads.ofPage(pagination.page, pagination.pageSize))
})


</script>

<template>
  <n-config-provider :theme="darkTheme">
    <div class="flex flex-col  ">
      <n-space class="pb-12px" justify="space-between">

        <n-space>
          <template v-for="(item,index) in leftToolbarItems">

            <n-button :type="item.btnType" @click="item.handler?.($event , selectedRows)">
              <!--            <icon-ic-round-plus class="mr-4px text-20px"/>-->
              <!--                        <Icon icon="ic-round-plus" class="mr-4px text-20px"/>-->
              <component :is="item.icon"/>
              {{ item.text }}
            </n-button>
          </template>

          <!--          <n-button type="error">-->
          <!--            <icon-ic-round-delete class="mr-4px text-20px"/>-->
          <!--            删除-->
          <!--          </n-button>-->
          <!--          <n-button type="success">-->
          <!--            <icon-uil:export class="mr-4px text-20px"/>-->
          <!--            导出Excel-->
          <!--          </n-button>-->
        </n-space>
        <!--        <n-space align="center" :size="18">-->
        <!--          <n-button size="small" type="primary" @click="getTableData">-->
        <!--            <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }"/>-->
        <!--            刷新表格-->
        <!--          </n-button>-->
        <!--          &lt;!&ndash;          <column-setting v-model:columns="columns"/>&ndash;&gt;-->
        <!--        </n-space>-->
      </n-space>
      <n-scrollbar x-scrollable>
        <n-data-table :loading="isLoading" :columns="columns" :data="data" :row-key="getRowKey"
                      :on-update:checked-row-keys="onUpdateCheckedRows"/>
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

<script setup lang="ts">
import {IPagination, ITable, RowActionType, RowSelectionMode} from "@dongjak-public-types/table";
import {QueryPayloads, Theme} from "@dongjak-public-types/commons";
import {useColumn} from "./column";
import {darkTheme, NButton, NConfigProvider, NSpace, useMessage} from 'naive-ui'
import {defaultToolbarItems, useToolbar} from "./toolbar";
import {useDataSource} from "./datasource";
import {useTable} from "./index";
import FiltersForm from "./FiltersForm.vue";
import {useFilter} from "./filter";
import {TableApi} from "./TableApi";

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
    return [ "edit", "delete"] as RowActionType[]
  },
  toolbar: () => {
    return {
      items: defaultToolbarItems
    }
  },
  localStorageKey: () => {
    return window.location.pathname
  }
})
const {data, pagination, isLoading, load, onUpdatePage, onUpdatePageSize} = useDataSource(props)
const {getRowKey, selectedRowKeys} = useTable(props)
const api = new TableApi(props, selectedRowKeys, data, pagination, load)
const {columns} = useColumn(props, api)
const {leftBtnToolbarItems, rightToolbarItems, rightCustomToolbarItems} = useToolbar(props, {
  api, columns
})
const {filters} = useFilter(props)

onMounted(async () => {
  load(QueryPayloads.ofPage(pagination.page, pagination.pageSize))
  window.$message = useMessage()
})


</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <div class="flex flex-col  ">

        <filters-form :pagination="pagination" :load="load" :filters="filters"></filters-form>
        <!--          <n-collapse>-->
        <!--            <template #arrow>-->
        <!--              <Icon icon="mdi-drag" class="mr-8px text-20px cursor-move"/>-->
        <!--            </template>-->
        <!--            <n-collapse-item  name="1">-->
        <!--              <filters-form></filters-form>-->
        <!--            </n-collapse-item>-->

        <!--          </n-collapse>-->

        <n-space class="pb-12px" justify="space-between">

          <n-space>
            <template v-for="(item,index) in leftBtnToolbarItems">

              <n-button :type="item.btnType" @click="item.handler?.($event )">
                <!--            <icon-ic-round-plus class="mr-4px text-20px"/>-->
                <!--                        <Icon icon="ic-round-plus" class="mr-4px text-20px"/>-->
                <component :is="item.icon"/>
                {{ item.text }}
              </n-button>
            </template>


          </n-space>
          <n-space align="center" :size="18">
            <template v-for="(item,index) in rightCustomToolbarItems">

              <component :is="item.component"/>
            </template>
          </n-space>
        </n-space>
        <n-scrollbar x-scrollable>
          <n-data-table v-model:checked-row-keys="selectedRowKeys" :loading="isLoading" :columns="columns" :data="data"
                        :row-key="getRowKey"/>
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
    </n-message-provider>
  </n-config-provider>

</template>

<style scoped>

</style>

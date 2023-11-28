<template>
  <n-popover placement="bottom" trigger="click">
    <template #trigger>
      <n-button size="small" type="primary">
        <Icon icon="uil:setting" class="mr-4px text-16px"/>
        表格列设置
      </n-button>
    </template>
    <div class="w-180px">
      <vue-draggable v-model="list" item-key="key">
        <template #item="{ element }">
          <div v-if="element.key" class="flex-y-center h-36px px-12px hover:bg-primary_active">
            <Icon icon="mdi-drag" class="mr-8px text-20px cursor-move"/>
            <n-checkbox v-model:checked="element.checked">
              {{ element.title }}
            </n-checkbox>
          </div>
        </template>
      </vue-draggable>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue';
import VueDraggable from 'vuedraggable';
import {useLocalStorage} from "@vueuse/core";
import {ArrayUtil} from "@dongjak-extensions/lang";
import {TableBaseColumn} from "naive-ui/es/data-table/src/interface";

type Column = TableBaseColumn & { checked?: boolean };

interface Props {
  columns: Column[];
  storeKey: string;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'updateColumns', columns: TableBaseColumn[]): void;
}

const emit = defineEmits<Emits>();


const localStorage = useLocalStorage(
    props.storeKey,
    {
      columns: [] as Column[]
    },
)
const list = ref(initList());

function initList(): Column[] {
  if (!ArrayUtil.isValidArray(localStorage.value.columns)) {
    return props.columns.map(item => {
      const checked = true;
      return {...item, checked}
    });
  } else
      // @ts-ignore
    return localStorage.value.columns.map(item => {

      const item2 = props.columns?.findLast(item2 => item2.key === item.key || item2.key === item.type);
      const checked = item?.checked ?? true;
      return {...item2, checked}
    });
}

watch(
    list,
    newValue => {

      localStorage.value = {
        columns: newValue.map((item:Column) => {
          return {
            key: item.key || item.type,
            checked: item.checked!
          } as Column
        })
      }
      const newColumns = newValue.filter(item => item.checked);

      const columns: Column[] = newColumns.map(item => {
        const column = {...item};
        delete column.checked;

        return column;
      }) as Column[];
      emit('updateColumns', columns);
    },
    {deep: true, immediate: true}
);
</script>

<style scoped></style>

<script setup lang="ts">
import {NSelect} from 'naive-ui'

import {SelectMixedOption} from "naive-ui/es/select/src/interface";
import {IColumn, ISelectFilter, ISelectOption, SelectorReturnValueType} from "@dongjak-public-types/table";

interface Props {
  filter: ISelectFilter,
  column: IColumn,
  onChange: (value: any) => void
}

const props = defineProps<Props>()

const value = ref(null)
const placeholder = computed(() => props?.filter?.placeholder ?? `请选择${props.column?.label}`)
const options = ref([] as SelectMixedOption[])
const selectRef = ref(null)
onMounted(async () => {
  switch (typeof props.filter.options) {

    case "function":
      options.value.push(...(await props.filter.options()).map(
          it => {
            return {
              ...it,
              label: it[props.filter.labelField!],
              value: it[props.filter.valueField!]
            } as SelectMixedOption
          }
      ))
      break

    case "object":
      options.value.push(...(props.filter.options as ISelectOption []).map(
          it => {
            return {
              ...it,
              label: it[props.filter.labelField!],
              value: it[props.filter.valueField!]
            } as SelectMixedOption
          }
      ))
      break
  }
})

const onUpdateValue = (value: string, option: ISelectOption) => {
  //fixPlaceholder('')
  switch (props.filter.returnValueType) {
    case SelectorReturnValueType.OPTION:
      props.onChange(option)
      break
    case SelectorReturnValueType.VALUE:
      props.onChange(value)
      break
  }
}

const onClear = () => {
  props.onChange(null)
}

</script>

<template>
  <n-select
      ref="selectRef"
      filterable
      :on-clear="onClear"
      @update:value="onUpdateValue"
      clearable
      :placeholder="placeholder"
      :options="options"
  />


</template>

<style scoped>

</style>


<script setup lang="ts">
import {NSelect} from 'naive-ui'

import {SelectMixedOption} from "naive-ui/es/select/src/interface";
import {ISelectOption, ISelector, SelectorReturnValueType} from "@dongjak-public-types/table";

interface Props {
  value: any
  editor: ISelector
}
const props = defineProps<Props>()
const emit = defineEmits(['update:value'])
const modelValue = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('update:value', value)
  }
})

const option = computed(() => {
  if (props.value !== null && props.value !== undefined) {
    const converter = props.editor.convertValueToOption
    if (converter)
      return converter(props.value)
    else return props.value
  }
  return {
    [props.editor.labelField!]: "",
    "__INVALID__": true
  }
})
const value = ref(option.value[props.editor.valueField!])
// if(!value.value) alert(props.value)

const options = ref([] as SelectMixedOption[])
onMounted(async () => {
  switch (typeof props.editor.options) {

    case "function":
      options.value.push(...(await props.editor.options()).map(
          it => {
            return {
              ...it,
              label: it[props.editor.labelField!],
              value: it[props.editor.valueField!]
            } as SelectMixedOption
          }
      ))
      break

    case "object":
      options.value.push(...(props.editor.options as ISelectOption []).map(
          it => {
            return {
              ...it,
              label: it[props.editor.labelField!],
              value: it[props.editor.valueField!]
            } as SelectMixedOption
          }
      ))
      break
  }
})
const onUpdateValue = (value: string, option: ISelectOption) => {
  switch (props.editor.returnValueType) {
    case SelectorReturnValueType.OPTION:
      modelValue.value = option
      break
    case SelectorReturnValueType.VALUE:
      modelValue.value = value
      break
  }
}
</script>

<template>
  <n-select
      class="w-full"
      v-model:value="value"
      filterable
      @update:value="onUpdateValue"
      :placeholder="props.editor.placeholder"
      :options="options"
  />
</template>

<style scoped>

</style>

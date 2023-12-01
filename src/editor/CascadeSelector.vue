

<script setup lang="ts">

import {CascaderOption, darkTheme, NCascader, NConfigProvider} from "naive-ui";

import {ICascadeSelector, ISelectOption} from "@dongjak-public-types/table";


interface Props {
  value: any
  editor: ICascadeSelector
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


const level = props.editor.level!

const inputValue = ref(modelValue.value ? modelValue.value[props.editor.labelField!] : undefined)
const options = ref([] as ISelectOption[])
const onUpdateValue = (value: string, option: ISelectOption) => {
  modelValue.value = option
}

const handleLoad = async (option: CascaderOption | ISelectOption) => {
  const parent = option as ISelectOption
  return props.editor.getByParent!(parent).then(it => {
    option.children = it.map(it => {
      return {
        ...it,
        label: it[props.editor?.labelField!],
        value: it[props.editor?.valueField!],
        depth: it[props.editor?.levelField!],
        isLeaf: it[props.editor?.levelField!] == level
      }
    })
  })
}
onMounted(async () => {
  options.value = (await props.editor?.getRoots!()).map(it => {
    return {
      ...it,
      label: it[props.editor?.labelField!],
      value: it[props.editor?.valueField!],
      depth: it[props.editor?.levelField!],
      isLeaf: false
    }
  })
})
</script>

<template>
  <n-config-provider :theme="darkTheme" style="background-color: #59595e">
    <n-cascader
        v-model:value="inputValue"
        @update-value="onUpdateValue"
        class="min-w-150px  "
        :placeholder="props.editor.placeholder"
        :options="options"
        check-strategy="child"
        :show-path="true"
        remote
        :on-load="handleLoad "
    />
  </n-config-provider>

</template>

<style scoped>

</style>

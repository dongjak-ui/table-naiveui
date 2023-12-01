
<script lang="ts" setup>
import {CascaderOption, NCascader} from 'naive-ui'
import {IAdministrativeArea, IAdministrativeAreaEditor} from "@dongjak-public-types/table";


interface Props {
  value: any
  editor: IAdministrativeAreaEditor
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
const inputValue = ref(props.value ? props.value[props.editor.labelField!] : undefined)
const options = ref([] as IAdministrativeArea[])
onMounted(async () => {

  options.value = (await props.editor?.getProvinces()).map(it => {
    return {
      ...it,
      label: it[props.editor?.labelField!],
      value: it[props.editor?.valueField!],
      depth: it[props.editor?.levelField!],
      isLeaf: false
    }
  })
})

const onUpdateValue = (value: string, option: IAdministrativeArea) => {
  modelValue.value = {
    [props.editor?.labelField!]: option[props.editor?.labelField!],
    [props.editor?.valueField!]: option[props.editor?.valueField!],
  }
}
const handleLoad =  (option: CascaderOption) => {
  const area = option as IAdministrativeArea
  if (area[props.editor.levelField!] == 1) {
    return props.editor.getCitiesByProvince(area).then(it => {
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

  } else if (area[props.editor.levelField!] == 2) {
    return props.editor.getDistrictsByCity(area).then(it => {
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

  return Promise.resolve()
}
</script>
<template>
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

</template>

<style scoped>

</style>

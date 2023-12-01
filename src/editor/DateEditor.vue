
<script setup lang="ts">

import {NDatePicker, NConfigProvider, zhCN, dateZhCN, darkTheme} from 'naive-ui'
import {DatePickerType} from "naive-ui/es/date-picker/src/config";
import {DateType, IAdministrativeAreaEditor, IDateEditor, IDatePreset} from "@dongjak-public-types/table";

interface Props {
  value: any
  editor: IDateEditor
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

const getValue = () => {
  if (props.editor?.valueField && props?.value) {
    return props.value[props.editor.valueField]
  } else {
    return props.value
  }
}
const value = ref(getValue())
const getFormat = () => {
  if (props.editor?.formatField && props?.value) {
    return props.value[props.editor.formatField]
  } else {
    return "yyyy-MM-dd"
  }
}
const format = computed(() => getFormat())
const type = computed(() => {
  switch (props.editor?.dateType) {
    case DateType.DATE:
      return "date" as DatePickerType
    case DateType.DATETIME:
      return "datetime" as DatePickerType
    case DateType.TIME:
      return "time" as DatePickerType
    case DateType.YEAR:
      return "year" as DatePickerType
    case DateType.MONTH:
      return "month" as DatePickerType
    default:
      return "date" as DatePickerType
  }
})
let returnValue = props.value
const onUpdateValue = (value: number, formattedValue: string) => {
  if (props.editor?.valueField) {
    returnValue = {
      ...returnValue,
      [props.editor.valueField]: value,
      [props.editor.localizationStrField!]: formattedValue
    }
    modelValue.value=returnValue
  } else {
    returnValue = value
    modelValue.value=returnValue
  }
}

const applyPreset = (preset: IDatePreset) => {
  modelValue.value=preset.value
 value.value=preset.value.value
}
</script>

<template>
  <n-config-provider class="w-full" :theme="darkTheme" :locale="zhCN" :date-locale="dateZhCN"  >
   <div class="w-full flex flex-nowrap">
     <n-date-picker class="flex-1"  @update:value="onUpdateValue" v-model:value="value" :format="format" :type="type"/>
     <n-button @click="applyPreset(preset)" class="m-l-10px" :key="index" v-for="(preset,index) in props.editor.presets">{{preset.label}}</n-button>
   </div>
  </n-config-provider>

</template>

<style scoped>

</style>

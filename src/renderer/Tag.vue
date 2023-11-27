<script setup lang="ts">
import {NTag} from 'naive-ui'
import {computed} from "vue";
import {ITagRenderer} from "@dongjak-public-types/table";

interface Props {
  renderer: ITagRenderer,
  value:any
}

const props = defineProps<Props>()
const option = computed(() => {
  if (props.value !== null && props.value !== undefined) {
    const converter = props.renderer.convertValueToOption
    if (converter)
      return converter(props.value)
    else return props.value
  }
  return {
    [props.renderer.labelField!]: "",
    [props.renderer.textColorField!]: "white",
    [props.renderer.colorField!]: "black",
    "__INVALID__": true
  }
})
/**
 * 标签文本
 */
const label = computed(() => {
  return option.value [props.renderer.labelField!]
})
const textColor = computed(() => {
  return option.value[props.renderer.textColorField!]
})
const color = computed(() => {
  const color = option.value[props.renderer.colorField!]
  return {
    color: color,
    textColor: textColor.value,
    borderColor: color
  }
})
</script>

<template>
  <n-tag :color="color" v-if="!option['__INVALID__']">
    {{ label }}
  </n-tag>
</template>

<style scoped>

</style>

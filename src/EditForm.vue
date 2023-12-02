<script setup lang="ts">
import {IColumnEditor, ITable} from "@dongjak-public-types/table";
import {useEditors} from "./editor";
import {Icon} from "@iconify/vue";
import {FormInst} from "naive-ui";

interface Props {
  editors: IColumnEditor[]
}
const props = withDefaults(defineProps<Props>(), {})

const {editors ,formValue,rules} = useEditors(props)

interface Emits{
   (e: 'submit',formValue:any):void
}
const  emits = defineEmits<Emits>()

const formRef = ref<FormInst | null>(null)
const save= (e: MouseEvent)=>{
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      emits('submit',formValue.value)
    }
  })
}
</script>

<template>
  <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      size="medium"
  >
    <n-form-item v-for="(editor,index) in editors" :key="index" :label="editor.label" :path="editor.field">
      <component :is="editor.component" v-model:value="formValue[editor.field!]"   />
    </n-form-item>

    <n-form-item >
      <div  class="flex justify-center w-full  ">
      <n-button  @click="save"    size="large" class="w-100px"   >
        <Icon icon="material-symbols:save" class="mr-8px text-20px cursor-move"/>保存
      </n-button>

      </div>

    </n-form-item>
  </n-form>
</template>

<style scoped>

</style>

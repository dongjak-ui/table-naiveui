
<script setup lang="ts">
import {IImageEditor} from "@dongjak-public-types/table";
import {darkTheme, NConfigProvider, NUpload, UploadFileInfo} from "naive-ui";

interface Props {
  value: any
  editor: IImageEditor
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
const returnValue= props.value??[]
const images = computed(() => {
  return (props.value as { [key: string]: string }[])?.map(
      (item) => {
        return {
          url: item[props.editor.srcField!],
          id: item[props.editor.idField!],
          status: 'finished',
        } as UploadFileInfo;
      }
  )??[]
})
const style = computed(() => {
  return {
    width: `${props.editor?.width ?? 400}px`,
    // backgroundColor: '#181d1f',
  }
})

const additionalData = computed(() => {
  if (props.editor.data) {
    const data: { [key: string]: any } = {}
    Object.keys(props.editor.data).forEach((key) => {
      if (typeof props.editor.data![key] == "function")
        data[key] = props.editor.data![key](props.data)
      else data[key] = props.editor.data![key]
    })


    return data
  }
  return {}
})


const onUploadFinished = ({
                            file,
                            event
                          }: {
  file: UploadFileInfo
  event?: ProgressEvent
}) => {
  const respData = JSON.parse((event?.target as XMLHttpRequest).response).data
  returnValue.push(respData)
  modelValue.value= new Array(...returnValue)
}

const onRemove = (file: UploadFileInfo) => {
  const index = returnValue.findIndex((item) => item[props.editor.idField!] == file.id)
  returnValue.splice(index, 1)
  modelValue.value= new Array(...returnValue)
}
</script>

<template>
  <n-upload

      :multiple="props.editor.multiple"
      :data="additionalData"
      :action="props.editor.endpoint"
      :default-file-list="images"
      list-type="image-card"
      @remove="onRemove"
      @finish="onUploadFinished"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-40px h-40px fill-white">
      <path
          d="M368.5 240H272v-96.5c0-8.8-7.2-16-16-16s-16 7.2-16 16V240h-96.5c-8.8 0-16 7.2-16 16 0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7H240v96.5c0 4.4 1.8 8.4 4.7 11.3 2.9 2.9 6.9 4.7 11.3 4.7 8.8 0 16-7.2 16-16V272h96.5c8.8 0 16-7.2 16-16s-7.2-16-16-16z"
      />
    </svg>
  </n-upload>
</template>

<style scoped>
:global(.n-upload-file-list) {
  display: flex;
  align-content: center;
  justify-content: space-around;
  justify-items: end;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px;
}

:global(.n-image) {
  height: 100%;
}

/*.n-upload :deep(.n-upload-file-list .n-upload-file-list--grid){
  display: flex;
  align-content: center;
  justify-content: space-around;
  justify-items: end;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  padding: 10px;
}*/
</style>

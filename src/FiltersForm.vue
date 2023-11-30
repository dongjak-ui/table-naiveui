<script setup lang="ts">
import {FormInst, NSelect, useMessage} from "naive-ui";
import {IColumnFilter, ITable} from "@dongjak-public-types/table";
import {IFilter, IQueryPayload, QueryPayloads} from "@dongjak-public-types/commons";

interface Props {

  filters: IColumnFilter[]
  load: (payload: IQueryPayload) => void
  pagination: {
    page: number,
    pageSize: number
  }
}

const props = withDefaults(defineProps<Props>(), {})
const formRef = ref<FormInst | null>(null)
const rules = {
  user: {
    name: {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    },
    age: {
      required: true,
      message: '请输入年龄',
      trigger: ['input', 'blur']
    }
  },
  phone: {
    required: true,
    message: '请输入电话号码',
    trigger: ['input']
  }
}
const formValue = ref<Record<string, IColumnFilter>>(
    props.filters.reduce((acc, cur) => {
      cur.value = undefined
      acc[cur.property!] = cur
      return acc
    }, {} as any)
)
const message = useMessage()


const onChange = (filter: IColumnFilter) => {

  // const messageReactive = message.loading('Verifying', {
  //   duration: 0
  // })
  // formRef.value?.validate((errors) => {
  //
  //   if (!errors) {
  //     message.success('Valid')
  //   } else {
  //     //message.error(errors[0].message])
  //     //console.log('errors', errors)
  //   }
  //   //messageReactive.destroy()
  // })

  return (value: any) => {
    nextTick(() => {
      const filters = Object.keys(formValue.value)
          .map(key => formValue.value[key])
          .filter(it => it.value)
          .map(it => {
            return {
              operator: it.operator!,
              property: it.property!,
              value: fixValue(it.value, it)
            }
          })
      props.load(
          QueryPayloads.ofPage(props.pagination.page, props.pagination.pageSize, filters)
      )
    })

  }

}
const fixValue = (value: any, filter: IColumnFilter) => {
  switch (filter.type) {
    case "text":

      return `%${value}%`

    default:
      return value
  }
}

const reset = () => {
  Object.keys(formValue.value).forEach(key => {
    formValue.value[key].value = ''
  })
  props.load(
      QueryPayloads.ofPage(props.pagination.page, props.pagination.pageSize, [])
  )
}


const opts1 = [
  {
    label: "Everybody's Got Something to Hide Except Me and My Monkey",
    value: 'song0',
    disabled: true
  },
  {
    label: 'Drive My Car',
    value: 'song1'
  },
  {
    label: 'Norwegian Wood',
    value: 'song2'
  },
  {
    label: "You Won't See",
    value: 'song3',
    disabled: true
  },
  {
    label: 'Nowhere Man',
    value: 'song4'
  },
  {
    label: 'Think For Yourself',
    value: 'song5'
  },
  {
    label: 'The Word',
    value: 'song6'
  },
  {
    label: 'Michelle',
    value: 'song7',
    disabled: true
  },
  {
    label: 'What goes on',
    value: 'song8'
  },
  {
    label: 'Girl',
    value: 'song9'
  },
  {
    label: "I'm looking through you",
    value: 'song10'
  },
  {
    label: 'In My Life',
    value: 'song11'
  },
  {
    label: 'Wait',
    value: 'song12'
  }
]
const value = ref(null)
</script>

<template>
  <n-form
      ref="formRef"
      inline
      label-placement="left"
      label-width="auto"
      :model="formValue"
      :rules="rules"
      size="medium"
      :style="{
            alignItems:'center'
      }"
  >
    <n-form-item v-for="(filter,index) in props.filters" :key="index" :label="filter.label" :path="filter.property">
      <!--      <n-input v-model:value="formValue.user.name" placeholder="输入姓名"/>-->
      <component :is="filter.component" v-model:value="formValue[filter.property!].value"
                 :on-change="onChange( filter)"/>


    </n-form-item>

    <!--    <n-form-item label="年龄" path="user.age">-->
    <!--      <n-input v-model:value="formValue.user.age" placeholder="输入年龄" />-->
    <!--    </n-form-item>-->
    <!--    <n-form-item label="电话号码" path="phone">-->
    <!--      <n-input v-model:value="formValue.phone" placeholder="电话号码" />-->
    <!--    </n-form-item>-->
    <n-form-item>
      <n-button attr-type="button" @click="reset">
        重置
      </n-button>
    </n-form-item>
  </n-form>
</template>

<style scoped>

</style>

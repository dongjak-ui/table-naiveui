
<script setup lang="ts">
import {NInput, NPopover, NScrollbar, NTabPane, NTabs, NTag} from "naive-ui";
import {ICarBrandSelect, ISelectOption} from "@dongjak-public-types/table";
import "@dongjak-extensions/lang";

interface Props {
  value: any
  editor: ICarBrandSelect
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
const popover = ref( )

const carModelSearchText = computed( ()=>{

  return `${currentSelectedBrand.value?.['name']??''}/${currentSelectedSeries.value?.['name']??''}/${modelValue.value?.['year']??''}款/${modelValue.value?.['name']??''}`
})
const currentActivatedTab = ref("brand")

const brands = ref([] as ISelectOption[])
const series = ref([] as ISelectOption[])
const models = ref([] as ISelectOption[])
const brandsGroupByPinyin = computed(() => {
  return brands.value.groupBy$ext("pinyin")
})

const seriesGroupByFactory = computed(() => {
  return series.value.transformItemsToTree$ext()
})

const modelsGroupByYear = computed(() => {
  return models.value.groupBy$ext("year").sortByKeysDesc$ext()
})
onMounted(async () => {
  brands.value = await props.editor.getBrands!(carModelSearchText.value)

  if (modelValue.value) {
    onBrandSelected(brands.value.find(it => it["id"] == modelValue.value["brandId"])!, true)
  }
})

const currentSelectedBrand = ref({} as ISelectOption)
const onBrandSelected = (brand1: ISelectOption, value: boolean) => {
  brands.value.forEach(it => it.checked = false)
  brand1.checked = value
  currentSelectedBrand.value = brand1
  currentActivatedTab.value = "series"
}
const currentSelectedSeries = ref({} as ISelectOption)
const onSeriesSelected = (series1: ISelectOption, value: boolean) => {
  series.value.forEach(it => it.checked = false)
  series1.checked = value
  currentSelectedSeries.value = series1
  currentActivatedTab.value = "model"
}

const onModelSelected = (model1: ISelectOption, value: boolean, stopEditing = true) => {
  models.value.forEach(it => it.checked = false)
  model1.checked = value
  modelValue.value = model1
  //emit('update:value', 11111)
 if (stopEditing) popover.value.setShow(false)
}

watch(currentSelectedBrand, async (value) => {
  if (value.checked) {
    series.value = await props.editor.getSeries!(value, carModelSearchText.value)
    if (modelValue.value) {
      onSeriesSelected(series.value.find(it => it["id"] == modelValue.value["seriesId"])!, true)
    }
  }
})


watch(currentSelectedSeries, async (value) => {
  if (value.checked) {
    models.value = await props.editor.getModels!(value, carModelSearchText.value)

    if (modelValue.value) {
      onModelSelected(models.value.find(it => it["id"] == modelValue.value["id"])!, true)
    }
  }
})
</script>

<template>
  <n-popover ref="popover" trigger="click" :show-arrow="false" placement="bottom" >
    <template #trigger>
      <n-input  ref="inputRef" class="w-full"  v-model:value="carModelSearchText" type="text" placeholder="搜索车型"/>
    </template>
    <n-scrollbar style="max-height: 600px">
      <n-tabs
          v-model:value="currentActivatedTab"
          type="card"
      >
        <n-tab-pane
            tab="品牌"
            name="brand"
        >
          <div v-for="(brand,index) in brandsGroupByPinyin" :key="index">
            <h5 class="m-y-5px"> {{ brand[0] }} </h5>
            <n-tag :checked="brand1.checked" @update:checked="onBrandSelected(brand1,$event)" checkable
                   v-for="(brand1,index) in brand[1]"
                   :key="index">

              {{ brand1[props.editor.labelField!] }}
            </n-tag>
          </div>


        </n-tab-pane>
        <n-tab-pane
            tab="系列"
            name="series"
        >
          <div v-for="(series,index) in seriesGroupByFactory" :key="index">

            <h5 class="m-y-5px"> {{ series[props.editor.labelField!] }} </h5>
            <n-tag :checked="series1.checked" @update:checked="onSeriesSelected(series1,$event)" checkable
                   v-for="(series1,index) in series.children"
                   :key="index">

              {{ series1[props.editor.labelField!] }}
            </n-tag>
          </div>
        </n-tab-pane>
        <n-tab-pane
            tab="型号"
            name="model"
        >
          <div v-for="(model,index) in modelsGroupByYear" :key="index">
            <h5 class="m-y-5px"> {{ model[0] }}款 </h5>
            <n-tag :checked="model1.checked" @update:checked="onModelSelected(model1,$event)" checkable
                   v-for="(model1,index) in model[1]"
                   :key="index">

              {{ model1[props.editor.labelField!] }}
            </n-tag>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-scrollbar>


  </n-popover>

</template>

<style scoped>

</style>

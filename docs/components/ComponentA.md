---
title: ComponentA
comment: false
editLink: false
prev: false
next: false
order: 1
---

## 示例

::: vue-playground ComponentA
@file App.vue

```vue

<script lang="ts" setup>
  import {ComponentA} from 'table-naiveui'
  import {onMounted} from "vue";
  import {Columns, ColumnType, IColumn, Renderers, ValueFormatters} from "@dongjak-public-types/table";

  const dateFieldFormatter = ValueFormatters.filedOf("localizationStr")
  const columns: (IColumn | ColumnType)[] = [
    "select",
    {label: '名称', field: 'name'},
    {
      label: '车型', field: 'model', valueFormatter: ValueFormatters.nameField
    },
    {label: '公里数(万公里)', field: 'mileage'},
    {label: '售价(万元)', field: 'price'},
    {label: '新车指导价(万元)', field: 'priceOnNew'},
    {
      label: '车源地', field: 'sourceCity', valueFormatter: ValueFormatters.nameField
    },
    {label: '车牌地', field: 'plateCity', valueFormatter: ValueFormatters.nameField},
    {
      label: '外观图片',
      field: 'appearanceImages',
      renderer: Renderers.image({
        srcField: "url",
        throttleMode: true,
      }),
    },
    {
      label: '内饰图片',
      field: 'interiorImages',

      renderer: Renderers.image({
        srcField: "url",
        throttleMode: true,
      })
    },
    {
      label: '状态', field: 'status',
      renderer: Renderers.tag({
        labelField: "title"
      })
    },
    {
      label: '颜色', field: 'color',
      renderer: Renderers.tag({
        labelField: "label",
        colorField: "value"
      })
    },
    {
      label: '首次上牌', field: 'firstRegistrationDate', valueFormatter: dateFieldFormatter
    },
    {
      label: '年检到期', field: 'annualInspectionExpiryDate', valueFormatter: dateFieldFormatter
    }, {
      label: '交强险到期', field: 'compulsoryInsuranceExpiryDate', valueFormatter: dateFieldFormatter
    }, {
      label: '商业险到期', field: 'businessInsuranceExpiryDate', valueFormatter: dateFieldFormatter
    },
    {
      label: '过户次数', field: 'transferTimes'
    },
    {
      label: '燃油类型', field: 'fuelType', renderer: Renderers.tag({
        labelField: "chineseName"
      })
    }, {
      label: '车身类型', field: 'bodyType', renderer: Renderers.tag({
        labelField: "chineseName"
      })
    },
    {
      label: '排放标准', field: 'emissionStandard', renderer: Renderers.tag({
        labelField: "chineseName"
      })
    }, {
      label: '变速箱', field: 'gearType', renderer: Renderers.tag({
        labelField: "chineseName"
      })
    },
    Columns.bool({
      label: '可按揭', field: 'installment',
      trueText: "能",
      falseText: "不能"
    }), Columns.bool({
      label: '可过户', field: 'transferable',
      trueText: "能",
      falseText: "不能",
    }),
    {
      label: '描述', field: 'desc', tooltip: "text", renderer: "long-text"
    },
    {
      label: 'vin码', field: 'vinCode'
    },

    {
      label: '所属车行', field: 'dealer', valueFormatter: ValueFormatters.nameField,
    }
  ]

  onMounted(() => {
    console.log(ComponentA)
  })
</script>
<template>
  <ComponentA/>
</template>
<style>
  @import "http://localhost:8080/lib/style.css";
</style>
```
@import

```json
{
  "imports": {
    "table-naiveui": "http://localhost:8080/lib/table-naiveui.es.js"
  }
}
```
:::

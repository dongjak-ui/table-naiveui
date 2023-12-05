<script setup lang="ts">
import {NaiveDataTable} from "@dongjak-ui/table-naiveui";
import {Columns, ColumnType, IColumn, IDataSource, Renderers, ValueFormatters} from "@dongjak-public-types/table";
import {onMounted} from "vue";
import {IPage, IQueryPayload, JsonResponse, Pages} from "@dongjak-public-types/commons";
// import VueFullscreen from 'vue-fullscreen'
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
import page1 from "./page1.json"

const dataSource: IDataSource<any> = {
  saveOrUpdate(row: any): Promise<JsonResponse<boolean>> {
    return Promise.resolve(undefined);
  }, deleteRows(rowIds: number[]): Promise<JsonResponse<boolean>> {
    return Promise.resolve(undefined);
  },
  get(queryPayload: IQueryPayload): Promise<JsonResponse<IPage<any>>> {
    if (queryPayload.pageNo == 1) {
      return Promise.resolve(JsonResponse.parse(page1));
    }
    return Promise.resolve(undefined);
  }

}
</script>
<template>
  <!--  <n-button>111</n-button>-->
  <n-message-provider>
    <NaiveDataTable :columns="columns" :dataSource="dataSource"/>
  </n-message-provider>

</template>
<style scoped>
</style>

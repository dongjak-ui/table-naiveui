import {IColumn, IColumnFilter, ITable} from "@dongjak-public-types/table";
import {NInput} from 'naive-ui'
import {Operator} from "@dongjak-public-types/commons";
import SelectFilter from "../filter/SelectFilter.vue";

export const useFilter = (table: ITable<any>) => {
    const createFilterItem = (column: IColumn): IColumnFilter => {
        if (typeof column?.filter === "string") {
            switch (column?.filter) {
                case "text":
                    return {
                        type: 'text',
                        label: column.label,
                        property: column.field,
                        operator: Operator.LIKE,
                        component: h(NInput, {
                            placeholder: `请输入${column.label}`,
                            clearable: true
                        })
                    }
                // case "show_columns":
                //     return {
                //         type: "show_columns",
                //         componentType:"custom",
                //         position:"right",
                //         //@ts-ignore
                //         component: h(ShowColumns, {
                //             columns:columns.value,
                //             storeKey:`${table.localStorageKey}/columns`,
                //             onUpdateColumns: (data: any) => {
                //                 columns.value = data
                //             }
                //         })
                //     }
            }
        } else if (typeof column?.filter === "object") {
            switch (column?.filter?.type) {
                case "select":
                    return column.filter.component ? column.filter : {
                        label: column.label,
                        property: column.field,
                        operator: Operator.EQUALS,
                        ...column.filter,
                        //@ts-ignore
                        component: h(SelectFilter, {
                            filter: column.filter,
                            column: column
                        })

                    }

            }
        }

        throw new Error(`不支持的过滤器类型：${column?.filter}`)
    }


    const filters = computed(() => {
        return table.columns
            .filter(column => typeof column === "object" && column.filter)
            .map(column => column as IColumn)
            .map(column => createFilterItem(column))
    })

    return {
        createFilterItem,
        filters
    }
}

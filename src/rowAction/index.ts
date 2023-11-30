import {IRowAction, ITable, RowActionType} from "@dongjak-public-types/table";
import {NButton, NPopconfirm, NSpace, NText} from 'naive-ui';
import {TableApi} from "../TableApi";

const useRowActions = (table: ITable<any>, api: TableApi) => {

    const createRowAction = (rowAction: IRowAction<any> | RowActionType): IRowAction<any> => {

        if (typeof rowAction === "string") {
            switch (rowAction) {
                case "edit":
                    return {
                        text: "编辑",
                        component: ()=>h(NButton, {size: 'small', onClick: () => console.log('编辑')}, {default: () => '编辑'}),
                    }
                case "delete":
                    return {
                        text: "删除",
                        component: (rowData:any)=>h(NPopconfirm, {onPositiveClick: () => api.deleteRow(rowData)}, {
                            default: () => '确认删除',
                            trigger: () => h(NButton, {size: 'small'}, {default: () => '删除'})
                        })
                    }

                default:
                    throw new Error(`不支持的行操作类型:${rowAction}`)
            }
        } else {
            return rowAction
        }
    }


    return {
        createRowAction
    }
}

export default useRowActions

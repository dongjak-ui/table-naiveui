import {ColumnType, IColumn, ITable} from "@dongjak-public-types/table";
import {TableBaseColumn, TableColumn, TableSelectionColumn} from "naive-ui/es/data-table/src/interface";
import {VNodeChild} from "vue";
import {createRenderer} from "../renderer";
import {NSpace, NText} from 'naive-ui';
import {TableApi} from "../TableApi";
import useRowActions from "../rowAction";


//@ts-ignore
const useColumn = (table: ITable<any>, api: TableApi): { columns: any } => {
    const {createRowAction} = useRowActions(table, api)
    const createColumn = (column: IColumn | ColumnType) => {
        if ((typeof column) === "string") {
            switch (column) {
                case "select":
                    return {
                        type: 'selection'
                    } as TableSelectionColumn
                case "actions":
                    //@ts-ignore
                    return {
                        title: '操作',
                        // width: 40 + (table?.rowActions?.length ?? 0) * 50,
                        key: 'actions',
                        render: (rowData: any, rowIndex: number): VNodeChild => {
                            return h(NSpace, {}, {
                                default: () =>
                                    table?.rowActions?.map(createRowAction)?.map(rowAction => {
                                        //@ts-ignore
                                        return rowAction.component!(rowData, api)
                                    }  )
                            })
                        }
                    } as TableBaseColumn<any>
                case "status":
                    return {
                        title: '状态',
                        key: 'status',
                        render: (rowData: any, rowIndex: number): VNodeChild => {
                            return h(NText, {depth: 3}, {default: () => '未填写'})
                        }
                    } as TableBaseColumn<any>
                default:
                    throw new Error(`${column}不是一个有效的列`)
            }
        } else {
            return {
                // menuTabs:['generalMenuTab', 'filterMenuTab', 'columnsMenuTab'],
                title: (column as IColumn).label,
                key: (column as IColumn).field,
                minWidth: 100,
                ellipsis: {
                    tooltip: true
                },
                // ellipsisComponent:"performant-ellipsis",
                // resizable: true,
                // submitField: (column as IColumn).submitField ?? (column as IColumn).field,
                // submitValueGetter: (column as IColumn).submitValueGetter,
                // flex: 1,
                // headerTooltip: (column as IColumn).label,
                // cellStyle: {
                //     display: "flex",
                //     justifyContent: "center",
                //     alignItems: "center"
                // },
                //editable: (column as IColumn).editor !== undefined,
                // ...createTooltip(column as IColumn, table)((column as IColumn).tooltip),
                ...createRenderer(table)((column as IColumn).renderer, (column as IColumn)),
                // ...createEditor(table)((column as IColumn).editor),
                // ...createValueGetter(column as IColumn),
                // ...createValueFormatter(column as IColumn)
            } as TableColumn<any>
        }
    }

    const columns = ref(table?.columns?.map(createColumn))

    return {
        columns
    }
}

export {
    useColumn
}

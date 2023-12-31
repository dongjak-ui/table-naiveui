import {ITable, IToolbar, IToolbarItem, ToolbarItemType} from "@dongjak-public-types/table";

import {Icon} from '@iconify/vue';
import ShowColumns from "./ShowColumns.vue";
import {TableColumn} from "naive-ui/es/data-table/src/interface";
import {TableApi} from "../TableApi";

/**
 * 默认工具条项目列表
 */
const defaultToolbarItems: ToolbarItemType[] = ['refresh', 'add', 'delete', "show_columns"]

const useToolbar = (table: ITable<any>, {api, columns}: {
    columns: {
        value: TableColumn<any>[]
    },
    api: TableApi
}) => {


    /**
     * 创建工具条项目定义
     * @param toolbarItem
     */
    const createToolbarItem = (toolbarItem: IToolbarItem | ToolbarItemType): IToolbarItem => {
        if (typeof toolbarItem === "string") {
            switch (toolbarItem) {
                case "add":
                    return {
                        type: "add",
                        text: "新增",
                        componentType: "button",
                        btnType: "primary",
                        position: "left",
                        handler: () => {
                            console.log("新增")
                        },
                        icon: h(Icon, {class: 'mr-4px text-20px', icon: 'ic-round-plus'})
                    }
                case "delete":
                    return {
                        componentType: "button",
                        type: "delete",
                        text: "删除",
                        position: "left",
                        btnType: "error",
                        handler: () => api.deleteSelectedRows(),
                        icon: h(Icon, {class: 'mr-4px text-20px', icon: 'ic-round-delete'})
                    }
                case "refresh":
                    return {
                        componentType: "button",
                        type: "refresh",
                        text: "刷新",
                        position: "left",
                        btnType: "default",
                        handler: () => api.refresh(),
                        icon: h(Icon, {class: 'mr-4px text-20px', icon: 'ic-round-refresh'})
                    }

                case "show_columns":
                    return {
                        type: "show_columns",
                        componentType: "custom",
                        position: "right",
                        //@ts-ignore
                        component: h(ShowColumns, {
                            columns: columns.value,
                            storeKey: `${table.localStorageKey}/columns`,
                            onUpdateColumns: (data: any) => {
                                columns.value = data
                            }
                        })
                    }
            }
        }/* else if (typeof renderer === "object") {
            switch (renderer?.type) {
                case "tag":
                    return {
                        render: (rowData: any, rowIndex: number) : VNodeChild =>{

                            return h(TagRenderer, { renderer ,value:  rowData[column.field] } )
                        }
                    }
                case "image":
                    return {
                        render: (rowData: any, rowIndex: number) : VNodeChild =>{

                            return h(ImageRenderer, { renderer ,value:  rowData[column.field] } )
                        }
                    }
            }
        }*/

        throw new Error(`不支持的工具条项目类型：${toolbarItem}`)
    }


    const createToolbar = (toolbar: IToolbar | (IToolbarItem | ToolbarItemType)[]): IToolbar => {
        if (Array.isArray(toolbar)) {
            return {
                items: toolbar.map(item => createToolbarItem(item))
            }
        } else {
            return {
                items: toolbar.items.map(item => createToolbarItem(item))
            }
        }
    }
    const toolbar = computed<IToolbar>(() => {
        return createToolbar(table.toolbar ?? defaultToolbarItems)
    })

    const leftBtnToolbarItems = computed<IToolbarItem[]>(() => {
        return toolbar.value.items
            .map(item => item as IToolbarItem)
            .filter(item => item.position === "left")
            .filter(item => item.componentType === "button")


    })

    const leftCustomToolbarItems = computed<IToolbarItem[]>(() => {
        return toolbar.value.items
            .map(item => item as IToolbarItem)
            .filter(item => item.position === "left")
            .filter(item => item.componentType === "custom")
    })

    const rightToolbarItems = computed<IToolbarItem[]>(() => {
            return toolbar.value.items
                .map(item => item as IToolbarItem)
                .filter(item => item.position === "right")
                .filter(item => item.componentType === "button")
        }
    )

    const rightCustomToolbarItems = computed<IToolbarItem[]>(() => {
        return toolbar.value.items
            .map(item => item as IToolbarItem)
            .filter(item => item.position === "right")
            .filter(item => item.componentType === "custom")
    })

    return {
        toolbar,
        leftBtnToolbarItems,
        leftCustomToolbarItems,
        rightCustomToolbarItems,
        rightToolbarItems
    }
}
export {
    defaultToolbarItems,

    useToolbar
}

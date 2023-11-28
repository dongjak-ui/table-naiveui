import {IDataSource, ITable, IToolbar, IToolbarItem, ToolbarItemType} from "@dongjak-public-types/table";

import {Icon} from '@iconify/vue';
import {useDataSource} from "../datasource";
import {QueryPayloads} from "@dongjak-public-types/commons";


/**
 * 默认工具条项目列表
 */
const defaultToolbarItems: ToolbarItemType[] = ['refresh', 'add', 'delete']

const useToolbar = (table: ITable<any>, {data, pagination, load, selectedRowKeys}: {
    data: {
        value: any[]
    },
    selectedRowKeys: {
        value: number[]
    },
    pagination: {
        total: number,
        page: number,
        pageSize: number
    },
    load: any
}) => {

    const deleteRows = () => {
        if (selectedRowKeys.value.length === 0) {
            window.$message.warning(
                '没有选中任何数据'
            )
        } else {

            table.dataSource.deleteRows(selectedRowKeys.value).then(res => {
                if (res.isSuccessful()) {
                    window.$message.success(
                        '删除成功'
                    )
                    const  selectedRows= data.value.filter((item: any) => selectedRowKeys.value.includes(item[table.pk!]))
                    data.value = data.value.filter((item: any) => !selectedRows.includes(item))
                    pagination.total = pagination.total - selectedRows.length
                    // selectedRows.value = []
                    // load(QueryPayloads.ofPage(pagination.page, pagination.pageSize))
                    selectedRowKeys.value = []
                } else {
                    window.$message.error(
                        '删除失败'
                    )
                }
            })
        }

    }
    const refresh = () => {
        load(QueryPayloads.ofPage(pagination.page, pagination.pageSize))
    }

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
                        btnType: "primary",
                        position: "left",
                        handler: () => {
                            console.log("新增")
                        },
                        icon: h(Icon, {class: 'mr-4px text-20px', icon: 'ic-round-plus'})
                    }
                case "delete":
                    return {
                        type: "delete",
                        text: "删除",
                        position: "left",
                        btnType: "error",
                        handler: deleteRows,
                        icon: h(Icon, {class: 'mr-4px text-20px', icon: 'ic-round-delete'})
                    }
                case "refresh":
                    return {
                        type: "refresh",
                        text: "刷新",
                        position: "left",
                        btnType: "default",
                        handler: refresh,
                        icon: h(Icon, {class: 'mr-4px text-20px', icon: 'ic-round-refresh'})
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

    const leftToolbarItems = computed<IToolbarItem[]>(() => {
        return toolbar.value.items
            .map(item => item as IToolbarItem)
            .filter(item => item.position === "left")
    })

    const rightToolbarItems = computed<IToolbarItem[]>(() => {
            return toolbar.value.items
                .map(item => item as IToolbarItem)
                .filter(item => item.position === "right")
        }
    )

    return {
        toolbar,
        leftToolbarItems,
        rightToolbarItems
    }
}
export {
    defaultToolbarItems,

    useToolbar
}

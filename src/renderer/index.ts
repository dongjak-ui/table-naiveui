import {ColumnRendererType, IColumn, IColumnRenderer, ITable} from "@dongjak-public-types/table";
import TagRenderer from './TagRenderer.vue';
import ImageRenderer from './ImageRenderer.vue';
import {VNodeChild} from "vue/dist/vue";
import {NText} from "naive-ui";
/**
 * 用于创建渲染器定义
 * @param table
 */
export const createRenderer = (table: ITable<any>): (renderer: IColumnRenderer | ColumnRendererType | ((table: ITable<any>) => IColumnRenderer) | undefined ,column:IColumn) => Record<string,any>  => {
    return (renderer: IColumnRenderer | ColumnRendererType | ((table: ITable<any>) => IColumnRenderer ) | undefined ,column:IColumn) => {
        if(column.valueFormatter){
            return {
                render: (rowData: any, rowIndex: number) : VNodeChild =>{

                    return h(NText, {   }, { default: () =>    column.valueFormatter?.(rowData[column.field]) })
                }
            }
        } else if (typeof renderer === "string") {
            // switch (renderer) {
            //     case "image":
            //         return {
            //             cellRenderer: ImageRenderer,
            //             cellRendererParams: {
            //                 renderer: Renderers.image()
            //             }
            //         }
            //     case "tag":
            //         return {
            //             cellRenderer: Tag,
            //             cellRendererParams: {
            //                 renderer
            //             }
            //         }
            //     case "long-text":
            //         return {
            //             cellRenderer: LongText
            //         }
            // }
        } else if (typeof renderer === "object") {
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
        }

        return {}
    }
}

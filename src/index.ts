import {ITable} from "@dongjak-public-types/table";

const useTable = (table: ITable<any>) => {

    const getRowKey = (rowData: any): any => {
        return rowData[table.pk!]

    }
    const selectedRows = ref<any[]>([])
    const selectedRowKeys=ref([])
    const onUpdateCheckedRows = (keys: Array<string | number>, rows: object[], meta: {
        row: object | undefined,
        action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
    }): void => {
        selectedRows.value = rows.filter(row => row !== undefined && row !== null)
    }


    return {
        getRowKey,
        selectedRowKeys,
      //  onUpdateCheckedRows
    }

}

export {

    useTable
}

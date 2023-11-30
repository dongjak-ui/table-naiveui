import {ITable} from "@dongjak-public-types/table";

const useTable = (table: ITable<any>) => {

    const getRowKey = (rowData: any): any => {
        return rowData[table.pk!]

    }
    const selectedRowKeys = ref([])


    return {
        getRowKey,
        selectedRowKeys
    }

}

export {

    useTable
}

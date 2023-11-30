import {ITable} from "@dongjak-public-types/table";
import {IQueryPayload, QueryPayloads} from "@dongjak-public-types/commons";

export class TableApi {

    private readonly table: ITable<any>
    private readonly selectedRowKeys: {
        value: number[]
    }
    private data: {
        value: any[]
    }
    private pagination: {
        total: number,
        page: number,
        pageSize: number
    }

    private readonly load: (payload: IQueryPayload) => void

    constructor(table: ITable<any>, selectedRowKeys: { value: number[] }, data: { value: any[] }, pagination: {
        total: number;
        page: number;
        pageSize: number
    }, load: (payload: IQueryPayload) => void) {
        this.table = table;
        this.selectedRowKeys = selectedRowKeys;
        this.data = data;
        this.pagination = pagination;
        this.load = load;
    }

    refresh() {
        this.load(QueryPayloads.ofPage(this.pagination.page, this.pagination.pageSize))
    }

    deleteRow(rowData: any) {

        this.table.dataSource.deleteRows([rowData[this.table.pk!]]).then(res => {
            if (res.isSuccessful()) {
                window.$message!.success(
                    '删除成功'
                )
                this.data.value = this.data.value.filter((item: any) => item[this.table.pk!] !== rowData[this.table.pk!])
                this.pagination.total = this.pagination.total - 1
            } else {
                window.$message!.error(
                    '删除失败'
                )
            }
        })
    }

    /**
     * 删除当前选中的行
     */
    deleteSelectedRows() {
        if (this.selectedRowKeys.value.length === 0) {
            window.$message!.warning(
                '没有选中任何数据'
            )
        } else {

            this.table.dataSource.deleteRows(this.selectedRowKeys.value).then(res => {
                if (res.isSuccessful()) {
                    window.$message!.success(
                        '删除成功'
                    )
                    const selectedRows = this.data.value.filter((item: any) => this.selectedRowKeys.value.includes(item[this.table.pk!]))
                    this.data.value = this.data.value.filter((item: any) => !selectedRows.includes(item))
                    this.pagination.total = this.pagination.total - selectedRows.length
                    // selectedRows.value = []
                    // load(QueryPayloads.ofPage(pagination.page, pagination.pageSize))
                    this.selectedRowKeys.value = []
                } else {
                    window.$message!.error(
                        '删除失败'
                    )
                }
            })
        }

    }
}

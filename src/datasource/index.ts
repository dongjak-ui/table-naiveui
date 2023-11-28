import {ITable} from "@dongjak-public-types/table";
import {IQueryPayload, QueryPayloads} from "@dongjak-public-types/commons";


const  useDataSource = (table:ITable<any>) => {
    const data = ref<any>([])
    const pagination = reactive({
        page: table.pagination!.pageNo,
        pageCount: 1,
        pageSize: table.pagination!.pageSize,
        pageSizes: [
            {
                label: '10 每页',
                value: 10
            },
            {
                label: '20 每页',
                value: 20
            },
            {
                label: '30 每页',
                value: 30
            },
            {
                label: '40 每页',
                value: 40
            }
        ],
        total: table.pagination!.pageSize
    })
    const isLoading = ref(false)

    const load = (payload: IQueryPayload) => {
        isLoading.value = true
        table.dataSource.get(payload).then(res => {
            const resPage = res.data
            if (resPage) {
                data.value = resPage.data
                pagination.pageCount = resPage.totalPages
                pagination.pageSize = resPage.pageSize
                pagination.page = resPage.pageNo
                pagination.total = resPage.totalElements
            }
        }).finally(() => {
            isLoading.value = false
        })
    }
    const onUpdatePageSize = (pageSize: number) => {
        pagination.page = 1
        load(QueryPayloads.ofPage(pagination.page, pageSize))
    }
    const onUpdatePage = (page: number) => {
        load(QueryPayloads.ofPage(page, pagination.pageSize!))
    }
    return {
        data,
        pagination,
        isLoading,
        load,
        onUpdatePageSize,
        onUpdatePage
    }

}

export {
    useDataSource
}

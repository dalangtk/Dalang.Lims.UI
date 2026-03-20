<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.pretreatCustomerPurposeMatchListData"
      ref="table"
      :total="state.total"
      v-on:pageOrSizeChange="onTablePageOrSizeChange"
      :loading="state.loading"
      stripe
    >
      <template #headerButton>
        <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
          <SvgIcon name="ele-Plus" />
          新增</el-button
        >
      </template>
      <el-table-column prop="isValid" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.isValid === true ? 'success' : 'warning'">
            {{ row.isValid === true ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-auths="[perms.delete]" label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <!-- <pretreat-customer-purpose-match-form
      ref="pretreatCustomerPurposeMatchFormRef"
      :title="state.pretreatCustomerPurposeMatchFormTitle"
    ></pretreat-customer-purpose-match-form> -->
  </div>
</template>

<script lang="ts" setup name="/pretreatment/customerpurposematch">
import { getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  PurposeMatchOutput,
  PurposeMatchQueryListInput
} from '/@/api/lims/pretreatment/datacontract/pretreatcustomerpurposematch-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { PretreatCustomerPurposeMatchApi } from '/@/api/lims/pretreatment/pretreatcustomerpurposematch'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
// const PretreatCustomerPurposeMatchForm = defineAsyncComponent(() => import('./components/customerpurposematch-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
// const pretreatCustomerPurposeMatchFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:pretreat-customer-purpose-match:add',
  update: 'api:lims:pretreat-customer-purpose-match:update',
  delete: 'api:lims:pretreat-customer-purpose-match:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  pretreatCustomerPurposeMatchFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<PurposeMatchOutput>,
  filter: {} as PurposeMatchQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<PurposeMatchQueryListInput>,
  pretreatCustomerPurposeMatchListData: [] as Array<PurposeMatchOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshPretreatCustomerPurposeMatch')
  eventBus.on('refreshPretreatCustomerPurposeMatch', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshPretreatCustomerPurposeMatch')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new PretreatCustomerPurposeMatchApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.pretreatCustomerPurposeMatchListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.pretreatCustomerPurposeMatchFormTitle = '新增目的对照'
  // pretreatCustomerPurposeMatchFormRef.value.open()
}

const onEdit = (row: PurposeMatchOutput) => {
  state.pretreatCustomerPurposeMatchFormTitle = '编辑目的对照'
  // pretreatCustomerPurposeMatchFormRef.value.open(row)
}

const onDelete = (row: PurposeMatchOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除?`)
    .then(async () => {
      await new PretreatCustomerPurposeMatchApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await onQuery()
}
</script>
<style scoped>
.my-container {
  padding-top: 10px;
}

.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

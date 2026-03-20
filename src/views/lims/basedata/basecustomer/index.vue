<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="客户"
      class="my-table"
      :data="state.baseCustomerListData"
      ref="table"
      fit="true"
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
      <el-table-column prop="customerCode" label="客户代码" show-overflow-tooltip width="90" />
      <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip width="120" />
      <el-table-column prop="customerNameAB" label="客户简称" show-overflow-tooltip width="120" />
      <el-table-column prop="area" label="区域" show-overflow-tooltip width />
      <el-table-column prop="customerLevel" label="客户等级" show-overflow-tooltip width="100" />
      <el-table-column prop="customerType" label="客户类型" show-overflow-tooltip width="100" />
      <el-table-column prop="customerNature" label="客户性质" show-overflow-tooltip width="100" />
      <el-table-column prop="collaborationMode" label="合作模式" show-overflow-tooltip width="90" />
      <el-table-column prop="contacts" label="联系人" show-overflow-tooltip width />
      <el-table-column prop="contactPhone" label="联系电话" show-overflow-tooltip width />
      <el-table-column prop="doubleInputType" label="录入方式" show-overflow-tooltip width />
      <el-table-column prop="cooperateType" label="合作方式" show-overflow-tooltip width />
      <el-table-column prop="customerClassification" label="客户分类" show-overflow-tooltip width />
      <!-- <el-table-column prop="customerLogo" label="logo" show-overflow-tooltip width /> -->
      <el-table-column prop="remark" label="备注" show-overflow-tooltip width />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width />
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

    <base-customer-form ref="baseCustomerFormRef" :title="state.baseCustomerFormTitle"></base-customer-form>
  </div>
</template>

<script lang="ts" setup name="/basedata/basecustomer">
import { defineAsyncComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseCustomerOutput, BaseCustomerQueryListInput } from '/@/api/lims/basedata/datacontract/customer-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BaseCustomerApi } from '/@/api/lims/basedata/basecustomer'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseCustomerForm = defineAsyncComponent(() => import('./components/base-customer-form.vue'))
var table = ref()
const baseCustomerFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-customer:add',
  update: 'api:lims:base-customer:update',
  delete: 'api:lims:base-customer:delete',
}
const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseCustomerFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BaseCustomerOutput>,
  filter: {} as BaseCustomerQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseCustomerQueryListInput>,
  baseCustomerListData: [] as Array<BaseCustomerOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseCustomer')
  eventBus.on('refreshBaseCustomer', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseCustomer')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseCustomerApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseCustomerListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseCustomerFormTitle = '新增客户'
  baseCustomerFormRef.value.open()
}

const onEdit = (row: BaseCustomerOutput) => {
  state.baseCustomerFormTitle = '编辑客户'
  baseCustomerFormRef.value.open(row)
}

const onDelete = (row: BaseCustomerOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.customerName}】?`, null)
    .then(async () => {
      await new BaseCustomerApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

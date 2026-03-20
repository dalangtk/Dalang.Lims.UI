<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.baseEntrustPurposeListData"
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
      <el-table-column prop="purCode" label="目的代码" show-overflow-tooltip width />
      <el-table-column prop="askRuleCode" label="问询规则" show-overflow-tooltip width />
      <el-table-column prop="beginTime" label="起始时间" show-overflow-tooltip width>
        <template #default="{ row }">
          <span>{{ formatDatetime(row.beginTime, 'YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="截止时间" show-overflow-tooltip width>
        <template #default="{ row }">
          <span>{{ formatDatetime(row.endTime, 'YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveDays" label="接收周期" show-overflow-tooltip width />
      <el-table-column prop="receiveTime" label="接收时间" show-overflow-tooltip width />
      <el-table-column prop="customerCode" label="客户代码" show-overflow-tooltip width />
      <el-table-column prop="sampleTypeCode" label="标本类型" show-overflow-tooltip width />
      <el-table-column prop="isCustomerReverse" label="客户反向" show-overflow-tooltip width>
        <template #default="{ row }">
          <el-tag :type="row.isCustomerReverse === true ? 'success' : 'warning'">
            {{ row.isCustomerReverse === true ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
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

    <BaseEntrustPurposeForm ref="baseEntrustPurposeFormRef" :title="state.baseEntrustPurposeFormTitle"></BaseEntrustPurposeForm>
  </div>
</template>

<script lang="ts" setup name="/basedata/entrustpurpose">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BaseEntrustPurposeOutput,
  BaseEntrustPurposeQueryListInput
} from '/@/api/lims/basedata/datacontract/entrustpurpose-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BaseEntrustPurposeApi } from '/@/api/lims/basedata/baseentrustpurpose'
import { auth, authAll } from '/@/utils/authFunction'
import { formatDatetime } from '/@/utils/formatTime'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseEntrustPurposeForm = defineAsyncComponent(() => import('./components/base-entrust-purpose-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const baseEntrustPurposeFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-entrust-purpose:add',
  update: 'api:lims:base-entrust-purpose:update',
  delete: 'api:lims:base-entrust-purpose:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseEntrustPurposeFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BaseEntrustPurposeOutput>,
  filter: {} as BaseEntrustPurposeQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseEntrustPurposeQueryListInput>,
  baseEntrustPurposeListData: [] as Array<BaseEntrustPurposeOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseEntrustPurpose')
  eventBus.on('refreshBaseEntrustPurpose', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseEntrustPurpose')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseEntrustPurposeApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseEntrustPurposeListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseEntrustPurposeFormTitle = '新增委托目的'
  baseEntrustPurposeFormRef.value.open()
}

const onEdit = (row: BaseEntrustPurposeOutput) => {
  state.baseEntrustPurposeFormTitle = '编辑委托目的'
  baseEntrustPurposeFormRef.value.open(row)
}

const onDelete = (row: BaseEntrustPurposeOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.purCode}】?`)
    .then(async () => {
      await new BaseEntrustPurposeApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

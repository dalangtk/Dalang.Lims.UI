<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.baseTenantReportExtendListData"
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
      <el-table-column prop="reportLogo" label="logo" show-overflow-tooltip width>
        <template #default="{ row }">
          <div class="my-flex">
            <el-image
              :src="row.reportLogo"
              :lazy="true"
              :hide-on-click-modal="true"
              fit="scale-down"
              preview-teleported
              style="width: 80px; height: 80px"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="reportMainTitle" label="报告主标题" show-overflow-tooltip width />
      <el-table-column prop="reportSubTitle" label="报告子标题" show-overflow-tooltip width />
      <el-table-column prop="reportSignature" label="签章" show-overflow-tooltip width>
        <template #default="{ row }">
          <div class="my-flex">
            <el-image
              :src="row.reportSignature"
              :lazy="true"
              :hide-on-click-modal="true"
              fit="scale-down"
              preview-teleported
              style="width: 80px; height: 80px"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip width />
      <el-table-column prop="telephone" label="电话" show-overflow-tooltip width />
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

    <base-tenant-report-extend-form
      ref="baseTenantReportExtendFormRef"
      :title="state.baseTenantReportExtendFormTitle"
    ></base-tenant-report-extend-form>
  </div>
</template>

<script lang="ts" setup name="/reportsetting/tenantreportextend">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BaseTenantReportExtendOutput,
  BaseTenantReportExtendQueryListInput
} from '/@/api/lims/basedata/datacontract/tenantreportextend-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BaseTenantReportExtendApi } from '/@/api/lims/basedata/basetenantreportextend'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseTenantReportExtendForm = defineAsyncComponent(() => import('./components/basetenantreportextend-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const baseTenantReportExtendFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-tenant-report-extend:add',
  update: 'api:lims:base-tenant-report-extend:update',
  delete: 'api:lims:base-tenant-report-extend:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseTenantReportExtendFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BaseTenantReportExtendOutput>,
  filter: {} as BaseTenantReportExtendQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseTenantReportExtendQueryListInput>,
  baseTenantReportExtendListData: [] as Array<BaseTenantReportExtendOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseTenantReportExtend')
  eventBus.on('refreshBaseTenantReportExtend', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseTenantReportExtend')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseTenantReportExtendApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseTenantReportExtendListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseTenantReportExtendFormTitle = '新增机构报告设置'
  baseTenantReportExtendFormRef.value.open()
}

const onEdit = (row: BaseTenantReportExtendOutput) => {
  state.baseTenantReportExtendFormTitle = '编辑机构报告设置'
  baseTenantReportExtendFormRef.value.open(row)
}

const onDelete = (row: BaseTenantReportExtendOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除配置?`)
    .then(async () => {
      await new BaseTenantReportExtendApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

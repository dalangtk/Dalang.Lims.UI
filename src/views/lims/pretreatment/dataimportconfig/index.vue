<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.pretreatDataImportConfigListData"
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
      <el-table-column prop="customerCode" label="客户" show-overflow-tooltip width />
      <el-table-column prop="cellName" label="列名" show-overflow-tooltip width />
      <el-table-column prop="fieldName" label="字段名" show-overflow-tooltip width />
      <el-table-column prop="translateFunction" label="转换函数" show-overflow-tooltip width />
      <el-table-column prop="isMustExists" label="必须存在" show-overflow-tooltip width>
        <template #default="{ row }">
          <el-tag :type="row.isMustExists === true ? 'success' : 'warning'">
            {{ row.isMustExists === true ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" min-width="100" />
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

    <pretreat-data-import-config-form
      ref="pretreatDataImportConfigFormRef"
      :title="state.pretreatDataImportConfigFormTitle"
    ></pretreat-data-import-config-form>
  </div>
</template>

<script lang="ts" setup name="/pretreatment/dataimportconfig">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  PretreatDataImportConfigOutput,
  PretreatDataImportConfigQueryListInput,
} from '/@/api/lims/pretreatment/datacontract/dataimportconfig-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { PretreatDataImportConfigApi } from '/@/api/lims/pretreatment/pretreatmentdataimportconfig'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const PretreatDataImportConfigForm = defineAsyncComponent(() => import('./components/pretreat-data-import-config-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const pretreatDataImportConfigFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:pretreat-data-import-config:add',
  update: 'api:lims:pretreat-data-import-config:update',
  delete: 'api:lims:pretreat-data-import-config:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  pretreatDataImportConfigFormTitle: '',
  total: 0,
  search: [{ label: '', prop: 'customerCode', placeholder: '客户代码', required: false, type: 'input' }],
  sels: [] as Array<PretreatDataImportConfigOutput>,
  filter: {} as PretreatDataImportConfigQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<PretreatDataImportConfigQueryListInput>,
  pretreatDataImportConfigListData: [] as Array<PretreatDataImportConfigOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshPretreatDataImportConfig')
  eventBus.on('refreshPretreatDataImportConfig', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshPretreatDataImportConfig')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new PretreatDataImportConfigApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.pretreatDataImportConfigListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.pretreatDataImportConfigFormTitle = '新增导入配置'
  pretreatDataImportConfigFormRef.value.open()
}

const onEdit = (row: PretreatDataImportConfigOutput) => {
  state.pretreatDataImportConfigFormTitle = '编辑导入配置'
  pretreatDataImportConfigFormRef.value.open(row)
}

const onDelete = (row: PretreatDataImportConfigOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除当前行?`)
    .then(async () => {
      await new PretreatDataImportConfigApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

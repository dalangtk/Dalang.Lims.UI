<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.basePathologySettingListData"
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
      <el-table-column prop="wfCode" label="工作流" show-overflow-tooltip width />
      <el-table-column prop="auditType" label="审核模式" show-overflow-tooltip width>
        <template #default="{ row }">
          {{ row.auditType === 1 ? '初复诊' : '复诊' }}
        </template>
      </el-table-column>
      <el-table-column prop="sampleNoSymbol" label="前缀" show-overflow-tooltip width />
      <el-table-column prop="reviewUserId" label="审核人Id" show-overflow-tooltip width />
      <el-table-column prop="reviewUserName" label="审核人" show-overflow-tooltip width />
      <el-table-column prop="reportCycle" label="报告周期" show-overflow-tooltip width />
      <el-table-column prop="canSameUserReport" label="同用户报告" show-overflow-tooltip width>
        <template #default="{ row }">
          {{ row.canSameUserReport === true ? '是' : '否' }}
        </template>
      </el-table-column>
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

    <base-pathology-setting-form ref="basePathologySettingFormRef" :title="state.basePathologySettingFormTitle"></base-pathology-setting-form>
  </div>
</template>

<script lang="ts" setup name="lims/basepathologysetting">
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount, defineAsyncComponent, computed } from 'vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BasePathologySettingOutput,
  BasePathologySettingListOutput,
  BasePathologySettingQueryListInput,
} from '/@/api/lims/pathology/datacontract/pathologysetting-datacontract'

import { BasePathologySettingApi } from '/@/api/lims/pathology/pathologysetting'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'
import modal from '/@/globalProperties/modal'

// 引入组件
const BasePathologySettingForm = defineAsyncComponent(() => import('./components/base-pathology-setting-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const basePathologySettingFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-pathology-setting:add',
  update: 'api:lims:base-pathology-setting:update',
  delete: 'api:lims:base-pathology-setting:delete',
  batDelete: 'api:lims:base-pathology-setting:batch-delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  basePathologySettingFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BasePathologySettingOutput>,
  filter: {} as BasePathologySettingQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BasePathologySettingQueryListInput>,
  basePathologySettingListData: [] as Array<BasePathologySettingOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBasePathologySetting')
  eventBus.on('refreshBasePathologySetting', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBasePathologySetting')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BasePathologySettingApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.basePathologySettingListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.basePathologySettingFormTitle = '新增病理配置'
  basePathologySettingFormRef.value.open()
}

const onEdit = (row: BasePathologySettingOutput) => {
  state.basePathologySettingFormTitle = '编辑病理配置'
  basePathologySettingFormRef.value.open(row)
}

const onDelete = (row: BasePathologySettingOutput) => {
  modal
    .confirmDelete(`确定要删除配置【${row.wfCode}】?`, null)
    .then(async () => {
      await new BasePathologySettingApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

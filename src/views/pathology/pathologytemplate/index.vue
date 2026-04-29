<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.basePathologyTemplateListData"
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
        > </template
      ><el-table-column prop="wfCode" label="工作流代码" width>
        <template #default="{ row }">
          <el-tag type="info">{{ row.wfCode || '无' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="templateCode" label="模板代码" width> </el-table-column>
      <el-table-column prop="templateName" label="模板名称" width> </el-table-column>
      <el-table-column prop="isValid" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.isValid === true ? 'success' : 'warning'">
            {{ row.isValid === true ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="templateType" label="模板类型" min-width="120">
        <template #default="{ row }">
          <el-tag type="">{{ row.templateType === 1 ? '诊断模板' : '巨检模板' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-auths="[perms.delete]" label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <base-pathology-template-form
      ref="basePathologyTemplateFormRef"
      :title="state.basePathologyTemplateFormTitle"
      :wf-code="state.currentWfCode"
      :row-data="state.currentRowData"
      @update:wf-code="state.currentWfCode = $event"
      @update:row-data="state.currentRowData = $event"
    ></base-pathology-template-form>
  </div>
</template>

<script lang="ts" setup name="pathology/basepathologytemplate">
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount, defineAsyncComponent, computed } from 'vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BasePathologyTemplateOutput,
  BasePathologyTemplateListOutput,
  BasePathologyTemplateQueryListInput,
} from '/@/api/lims/pathology/datacontract/pathologytemplate-datacontract'

import { BasePathologyTemplateApi } from '/@/api/lims/pathology/pathologytemplate'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'
import { LabelValueOutput } from '/@/api/admin/data-contracts'
import modal from '/@/globalProperties/modal'

// 引入组件
const BasePathologyTemplateForm = defineAsyncComponent(() => import('./components/base-pathology-template-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const basePathologyTemplateFormRef = ref()

//权限配置
const perms = {
  add: 'api:pathology:base-pathology-template:add',
  update: 'api:pathology:base-pathology-template:update',
  delete: 'api:pathology:base-pathology-template:delete',
  batDelete: 'api:pathology:base-pathology-template:batch-delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70
const templateTypeList = [
  { label: '诊断模板', value: 1 },
  { label: '巨检模板', value: 2 },
]
const state = reactive({
  loading: false,
  basePathologyTemplateFormTitle: '',
  total: 0,
  search: [
    {
      label: '类型',
      prop: 'wfCode',
      placeholder: '类型',
      required: true,
      type: 'select',
      options: [] as any[],
      defaultVal: 'tct',
    },
    {
      label: '模板类型',
      prop: 'templateType',
      placeholder: '模板类型',
      required: false,
      type: 'select',
      options: templateTypeList,
    },
  ],
  sels: [] as Array<BasePathologyTemplateOutput>,
  filter: {
    wfCode: 'tct',
  } as BasePathologyTemplateQueryListInput,
  currentWfCode: '',
  currentRowData: {} as BasePathologyTemplateOutput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BasePathologyTemplateQueryListInput>,
  basePathologyTemplateListData: [] as Array<BasePathologyTemplateOutput>,
  pathologyWfCodes: [
    { label: 'tct', value: 'tct' },
    { label: '组织病理', value: 'histology' },
  ],
})

onMounted(() => {
  state.search[0].options = state.pathologyWfCodes.map((item) => ({ label: item.label, value: item.value }))
  state.pageInput!.filter!.wfCode = 'tct'
  onQuery()
  eventBus.off('refreshBasePathologyTemplate')
  eventBus.on('refreshBasePathologyTemplate', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBasePathologyTemplate')
})

const onSearch = (data: EmptyObjectType) => {
  console.log(data)
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  // state.pageInput.filter = state.filter
  console.log(state.pageInput.filter)
  if (!state.pageInput.filter?.wfCode) {
    modal.msgError('请选择工作流代码')
    return
  }
  state.loading = true
  const res = await new BasePathologyTemplateApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.basePathologyTemplateListData = res?.data?.list ?? []
  console.log('查询结果:', res?.data?.list ?? [])
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  // 根据工作流代码新增模板
  const wfCode = state.pageInput.filter!.wfCode
  state.basePathologyTemplateFormTitle = '新增诊断模板'
  basePathologyTemplateFormRef.value.open({}, wfCode)
}

const onEdit = (row: BasePathologyTemplateOutput) => {
  // 获取该记录的 wfCode
  const wfCode = row.wfCode || ''
  console.log('wfcode:', wfCode)
  state.basePathologyTemplateFormTitle = '编辑诊断模板'
  state.currentRowData = row
  basePathologyTemplateFormRef.value.open(row, wfCode)
}

// 获取选择的工作流代码（可以扩展为多选逻辑）
const getWfCodeFromSelection = (): string => {
  // 这里可以扩展为用户选择的工作流代码
  // 例如：'tct'、'histology' 等
  // 暂时返回空，让用户通过其他方式指定
  return ''
}

const onDelete = (row: BasePathologyTemplateOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.templateName}】?`)
    .then(async () => {
      await new BasePathologyTemplateApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

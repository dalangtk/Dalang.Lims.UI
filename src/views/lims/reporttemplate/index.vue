<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.reportTemplateListData"
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
      <el-table-column prop="templateCode" label="模板代码" show-overflow-tooltip width />
      <el-table-column prop="templateName" label="模板名称" show-overflow-tooltip width />
      <el-table-column prop="templateDescription" label="描述" show-overflow-tooltip width />
      <el-table-column prop="groupCode" label="组别代码" show-overflow-tooltip width />
      <el-table-column prop="hospitalCode" label="客户代码" show-overflow-tooltip width />
      <el-table-column prop="itemCodes" label="项目代码" show-overflow-tooltip width />
      <el-table-column prop="purCodes" label="目的代码" show-overflow-tooltip width />
      <el-table-column prop="sampleNoSymbols" label="样本号" show-overflow-tooltip width />
      <el-table-column prop="genderCode" label="性别代码" show-overflow-tooltip width />
      <el-table-column prop="beginTime" label="起始时间" show-overflow-tooltip width />
      <el-table-column prop="endTime" label="截止时间" show-overflow-tooltip width />
      <el-table-column prop="isSubTemplate" label="子报表" show-overflow-tooltip width />
      <el-table-column prop="templateType" label="模板类型" show-overflow-tooltip width />
      <el-table-column prop="templateDataSource" label="数据源" show-overflow-tooltip width />
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
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="onEditTemplate(row)">设计</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <report-template-form ref="reportTemplateFormRef" :title="state.reportTemplateFormTitle"></report-template-form>
    <el-dialog fullscreen v-model="state.designerShow">
      <div>
        <ReportDesigner :onSaveReport="saveReport" ref="designerRef"></ReportDesigner>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="/reportsetting/reporttemplate">
import { defineAsyncComponent, nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { ReportTemplateOutput, ReportTemplateQueryListInput } from '/@/api/lims/reporttemplate/datacontract/reporttemplate-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { ReportTemplateApi } from '/@/api/lims/reporttemplate/reporttemplate'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

import ReportDesigner from '/@/components/my-report/reportdesigner.vue'
import modal from '/@/globalProperties/modal'

// 引入组件
const ReportTemplateForm = defineAsyncComponent(() => import('./components/reporttemplate-form.vue'))

var table = ref()
const reportTemplateFormRef = ref()
const designerRef = ref()

//权限配置
const perms = {
  add: 'api:template:report-template:add',
  update: 'api:template:report-template:update',
  delete: 'api:template:report-template:delete',
  editTemplate: 'api:template:report-template:edit-template',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 190 : 70

const state = reactive({
  designerShow: false,
  loading: false,
  reportTemplateFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<ReportTemplateOutput>,
  filter: {} as ReportTemplateQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<ReportTemplateQueryListInput>,
  reportTemplateListData: [] as Array<ReportTemplateOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshReportTemplate')
  eventBus.on('refreshReportTemplate', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshReportTemplate')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new ReportTemplateApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.reportTemplateListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.reportTemplateFormTitle = '新增模板'
  reportTemplateFormRef.value.open()
}

const onEdit = (row: ReportTemplateOutput) => {
  state.reportTemplateFormTitle = '编辑模板'
  reportTemplateFormRef.value.open(row)
}

const onEditTemplate = async (row: ReportTemplateOutput) => {
  let dataSource = row.templateDataSource
  const res = await new ReportTemplateApi().getReportData({ sourceName: dataSource! }).catch(() => {
    state.loading = false
  })
  let obj = res?.data
  console.log(obj)
  // return
  state.designerShow = true
  nextTick(() => {
    let templateContent = row.templateContent
    if (!templateContent) templateContent = null
    designerRef.value.open(templateContent, row.id, obj)
  })
}

const onDelete = (row: ReportTemplateOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.templateName}】?`, null)
    .then(async () => {
      await new ReportTemplateApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}
const saveReport = (templateId: number, json: string) => {
  console.log('保存报表模板', json)
  new ReportTemplateApi()
    .updateContent(
      {
        id: templateId,
        templateContent: json,
      },
      { showSuccessMessage: true, loading: true }
    )
    .then(() => {
      modal.msgSuccess('保存成功')
    })
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
:deep(.el-dialog__body) {
  max-height: 100vh !important;
  overflow: auto;
  padding: 0 !important;
}
</style>

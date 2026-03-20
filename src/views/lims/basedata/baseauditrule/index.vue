<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.baseAuditRuleListData"
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
      <el-table-column prop="ruleCode" label="规则代码" show-overflow-tooltip width="100" />
      <el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip width="100" />
      <el-table-column prop="ruleDescription" label="规则描述" show-overflow-tooltip width="120" />
      <el-table-column prop="ruleExpression" label="规则内容" show-overflow-tooltip width="150" />
      <el-table-column prop="groupName" label="组别" show-overflow-tooltip width="130" />
      <el-table-column prop="judgeType" label="判断类型" show-overflow-tooltip width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.judgeType == 0">项目</el-tag>
          <el-tag v-if="scope.row.judgeType == 1">信息</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="workFlowType" label="工作流" show-overflow-tooltip width />
      <el-table-column prop="purCodes" label="目的代码" show-overflow-tooltip width="120" />
      <el-table-column prop="itemCodes" label="项目代码" show-overflow-tooltip width="120" />
      <el-table-column prop="isAllContains" label="完全包含" show-overflow-tooltip width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.isAllContains == true">是</el-tag>
          <el-tag v-if="scope.row.isAllContains == false">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="noticeType" label="提示类型" show-overflow-tooltip width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.noticeType == 0">警告</el-tag>
          <el-tag v-if="scope.row.noticeType == 1">禁止</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="noticeMessage" label="提示消息" show-overflow-tooltip width="130" />
      <el-table-column prop="ruleProperty" label="规则等级" show-overflow-tooltip width="100" />
      <el-table-column prop="auditType" label="审核类型" show-overflow-tooltip width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.auditType == 0">单个</el-tag>
          <el-tag v-if="scope.row.auditType == 1">批量</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip width="80" />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width="80" />
      <el-table-column prop="isValid" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.isValid === true ? 'success' : 'warning'">
            {{ row.isValid === true ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-auths="[perms.delete]" label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)"></el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete"></el-button>
          <el-button text type="primary" @click="testRule(row)">测试</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <base-audit-rule-form ref="baseAuditRuleFormRef" :title="state.baseAuditRuleFormTitle"></base-audit-rule-form>
    <TestRuleDialog ref="testRuleDialog"></TestRuleDialog>
  </div>
</template>

<script lang="ts" setup name="/basedata/baseauditrule">
import { defineAsyncComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { BaseAuditRuleOutput, BaseAuditRuleQueryListInput } from '/@/api/lims/basedata/datacontract/auditrule-datacontract'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import TestRuleDialog from './components/testruledialog.vue'
import { BaseAuditRuleApi } from '/@/api/lims/basedata/baseauditrule'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseAuditRuleForm = defineAsyncComponent(() => import('./components/baseauditrule-form.vue'))

var table = ref()
const baseAuditRuleFormRef = ref()
const testRuleDialog = ref()

//权限配置
const perms = {
  add: 'api:lims:base-audit-rule:add',
  update: 'api:lims:base-audit-rule:update',
  delete: 'api:lims:base-audit-rule:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseAuditRuleFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BaseAuditRuleOutput>,
  filter: {} as BaseAuditRuleQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseAuditRuleQueryListInput>,
  baseAuditRuleListData: [] as Array<BaseAuditRuleOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseAuditRule')
  eventBus.on('refreshBaseAuditRule', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseAuditRule')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseAuditRuleApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseAuditRuleListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseAuditRuleFormTitle = '新增审核规则'
  baseAuditRuleFormRef.value.open()
}

const onEdit = (row: BaseAuditRuleOutput) => {
  state.baseAuditRuleFormTitle = '编辑审核规则'
  baseAuditRuleFormRef.value.open(row)
}

const onDelete = (row: BaseAuditRuleOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.ruleName}】?`, null)
    .then(async () => {
      await new BaseAuditRuleApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await onQuery()
}

const testRule = (row: BaseAuditRuleOutput) => {
  testRuleDialog.value.open(row)
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

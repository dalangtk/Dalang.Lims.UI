<template>
  <div class="my-flex-column w100 h100">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="检测计划"
      class="my-table"
      :data="state.baseExamPlanListData"
      ref="table"
      :total="state.total"
      v-on:pageOrSizeChange="onTablePageOrSizeChange"
      :loading="state.loading"
      stripe
      highlight-current-row
      @current-change="currentRowChange"
      row-key="id"
    >
      <template #headerButton>
        <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
          <SvgIcon name="ele-Plus" />
          新增</el-button
        >
      </template>
      <el-table-column prop="examPlanCode" label="代码" show-overflow-tooltip width />
      <el-table-column prop="examPlanName" label="名称" show-overflow-tooltip width />
      <el-table-column prop="planType" label="计划类型" show-overflow-tooltip width />
      <el-table-column prop="planCycle" label="检测周期" show-overflow-tooltip width />
      <el-table-column prop="isIncludeHoliday" label="包含节假日" show-overflow-tooltip width>
        <template #default="{ row }">
          <el-tag :type="row.isIncludeHoliday === true ? 'success' : 'warning'">
            {{ row.isIncludeHoliday === true ? '是' : '否' }}
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

    <BaseExamPlanForm ref="baseExamPlanFormRef" :title="state.baseExamPlanFormTitle"></BaseExamPlanForm>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount, defineAsyncComponent, computed } from 'vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseExamPlanOutput, BaseExamPlanListOutput, BaseExamPlanQueryListInput } from '/@/api/lims/basedata/datacontract/examplan-datacontract'

import { BaseExamPlanApi } from '/@/api/lims/basedata/baseexamplan'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'
import modal from '/@/globalProperties/modal'
const emit = defineEmits(['onCurrRowChange'])

// 引入组件
const BaseExamPlanForm = defineAsyncComponent(() => import('./base-exam-plan-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const baseExamPlanFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-exam-plan:add',
  update: 'api:lims:base-exam-plan:update',
  delete: 'api:lims:base-exam-plan:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseExamPlanFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BaseExamPlanOutput>,
  filter: {} as BaseExamPlanQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseExamPlanQueryListInput>,
  baseExamPlanListData: [] as Array<BaseExamPlanOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseExamPlan')
  eventBus.on('refreshBaseExamPlan', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseExamPlan')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseExamPlanApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseExamPlanListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false

  if (res?.data?.list) {
    table.value.setCurrentRow(res.data.list[0] ?? null)
  }
}

const onAdd = () => {
  state.baseExamPlanFormTitle = '新增检测计划'
  baseExamPlanFormRef.value.open()
}

const onEdit = (row: BaseExamPlanOutput) => {
  state.baseExamPlanFormTitle = '编辑检测计划'
  baseExamPlanFormRef.value.open(row)
}

const onDelete = (row: BaseExamPlanOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.examPlanName}】?`, null)
    .then(async () => {
      await new BaseExamPlanApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await onQuery()
}
const currentRowChange = (val: BaseExamPlanOutput | undefined) => {
  emit('onCurrRowChange', val)
}
defineExpose({
  currentRowChange,
})
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

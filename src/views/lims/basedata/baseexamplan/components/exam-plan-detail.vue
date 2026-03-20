<template>
  <div class="my-flex-column w100 h100">
    <MyTable
      border
      tableName="检测计划明细"
      class="my-table"
      :data="state.baseExamPlanDetailListData"
      ref="table"
      :loading="state.loading"
      :show-paging="false"
      stripe
    >
      <template #headerButton>
        <div>
          <el-tag type="primary" size="small">检测计划明细</el-tag>
          <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd" style="margin-left: 5px">
            <SvgIcon name="ele-Plus" />
            新增</el-button
          >
        </div>
      </template>
      <el-table-column prop="examPlanCode" label="计划代码" show-overflow-tooltip width />
      <el-table-column prop="receiveTime" label="接收时间" show-overflow-tooltip width />
      <el-table-column prop="testInterval" label="检测间隔" show-overflow-tooltip width />
      <el-table-column prop="reportInterval" label="报告间隔" show-overflow-tooltip width />
      <el-table-column prop="reportTimePoint" label="报告时间" show-overflow-tooltip width />
      <el-table-column prop="timePointType" label="时间类型" show-overflow-tooltip width />
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

    <BaseExamPlanDetailForm
      ref="baseExamPlanDetailFormRef"
      :currExamPlatCode="props.currExamPlan.examPlanCode"
      :title="state.baseExamPlanDetailFormTitle"
    ></BaseExamPlanDetailForm>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, onMounted } from 'vue'
import MyTable from '/@/components/my-table/index.vue'
import { BaseExamPlanDetailOutput, BaseExamPlanOutput } from '/@/api/lims/basedata/datacontract/examplan-datacontract'

import { BaseExamPlanDetailApi } from '/@/api/lims/basedata/baseexamplan'
import { auth, authAll } from '/@/utils/authFunction'
import modal from '/@/globalProperties/modal'
import eventBus from '/@/utils/mitt'

const props = defineProps({
  currExamPlan: {
    type: Object as () => BaseExamPlanOutput,
    default: null,
  },
})

// 引入组件
const BaseExamPlanDetailForm = defineAsyncComponent(() => import('./base-exam-plan-detail-form.vue'))
var table = ref()
const baseExamPlanDetailFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-exam-plan:add',
  update: 'api:lims:base-exam-plan:update',
  delete: 'api:lims:base-exam-plan:delete',
  batDelete: 'api:lims:base-exam-plan:batch-delete',
  softDelete: 'api:lims:base-exam-plan:soft-delete',
  batSoftDelete: 'api:lims:base-exam-plan:batch-soft-delete',
}
const actionColWidth = authAll([perms.update, perms.softDelete]) || authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseExamPlanDetailFormTitle: '',
  sels: [] as Array<BaseExamPlanDetailOutput>,
  baseExamPlanDetailListData: [] as Array<BaseExamPlanDetailOutput>,
})
onMounted(() => {
  eventBus.off('refreshBaseExamPlanDetail')
  eventBus.on('refreshBaseExamPlanDetail', async () => {
    onQuery()
  })
})
const refreshDetailItem = () => {
  onQuery()
}
const onQuery = async () => {
  if (!props.currExamPlan.examPlanCode) return
  state.loading = true
  const res = await new BaseExamPlanDetailApi().getAll({ examPlanCode: props.currExamPlan.examPlanCode }).catch(() => {
    state.loading = false
  })

  state.baseExamPlanDetailListData = res?.data ?? []
  state.loading = false
}

const onAdd = () => {
  if (props.currExamPlan == null) {
    modal.msgError('请选择检测计划！')
    return
  }

  state.baseExamPlanDetailFormTitle = '新增检测计划明细'
  baseExamPlanDetailFormRef.value.open()
}

const onEdit = (row: BaseExamPlanDetailOutput) => {
  state.baseExamPlanDetailFormTitle = '编辑检测计划明细'
  baseExamPlanDetailFormRef.value.open(row)
}
const onDelete = (row: BaseExamPlanDetailOutput) => {
  modal
    .confirmDelete(`确定要删除检测计划明细?`, null)
    .then(async () => {
      await new BaseExamPlanDetailApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}

defineExpose({
  refreshDetailItem,
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

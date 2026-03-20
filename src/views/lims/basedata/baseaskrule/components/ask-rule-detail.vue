<template>
  <div class="my-flex-column w100 h100">
    <MyTable
      border
      tableName="问询规则明细"
      class="my-table"
      :data="state.baseAskRuleDetailListData"
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
      <el-table-column prop="askRuleCode" label="问询规则代码" show-overflow-tooltip width />
      <el-table-column prop="entrustCycle" label="委托周期" show-overflow-tooltip width />
      <el-table-column prop="askDay" label="问询日期" show-overflow-tooltip width />
      <el-table-column prop="askTime" label="问询时间" show-overflow-tooltip width />
      <el-table-column prop="isIncludeHoliday" label="包含节假日" show-overflow-tooltip width>
        <template #default="{ row }">
          <el-tag :type="row.isIncludeHoliday === true ? 'success' : 'warning'">
            {{ row.isIncludeHoliday === true ? '是' : '否' }}
          </el-tag>
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

    <BaseAskRuleDetailForm
      ref="baseAskRuleDetailFormRef"
      :currAskRuleCode="props.currAskRule.askRuleCode"
      :title="state.baseAskRuleDetailFormTitle"
    ></BaseAskRuleDetailForm>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent,onMounted } from 'vue'
import MyTable from '/@/components/my-table/index.vue'
import { auth, authAll } from '/@/utils/authFunction'
import modal from '/@/globalProperties/modal'
import { BaseAskRuleDetailOutput, BaseAskRuleOutput } from '/@/api/lims/basedata/datacontract/askrule-datacontract'
import { BaseAskRuleDetailApi } from '/@/api/lims/basedata/baseaskrule'
import eventBus from '/@/utils/mitt'

const props = defineProps({
  currAskRule: {
    type: Object as () => BaseAskRuleOutput,
    default: null,
  },
})

// 引入组件
const BaseAskRuleDetailForm = defineAsyncComponent(() => import('./base-ask-rule-detail-form.vue'))
var table = ref()
const baseAskRuleDetailFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-ask-rule:add',
  update: 'api:lims:base-ask-rule:update',
  delete: 'api:lims:base-ask-rule:delete',
}
const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseAskRuleDetailFormTitle: '',
  sels: [] as Array<BaseAskRuleDetailOutput>,
  baseAskRuleDetailListData: [] as Array<BaseAskRuleDetailOutput>,
})
onMounted(() => { 
  eventBus.off('refreshBaseAskRuleDetail')
  eventBus.on('refreshBaseAskRuleDetail', async () => {
    onQuery()
  })
})
const refreshDetailItem = () => {
  onQuery()
}
const onQuery = async () => {
  if (!props.currAskRule.askRuleCode) return
  state.loading = true
  const res = await new BaseAskRuleDetailApi().getAll({ askRuleCode: props.currAskRule.askRuleCode }).catch(() => {
    state.loading = false
  })

  state.baseAskRuleDetailListData = res?.data ?? []
  state.loading = false
}

const onAdd = () => {
  if (props.currAskRule == null) {
    modal.msgError('请选择问询规则！')
    return
  }

  state.baseAskRuleDetailFormTitle = '新增问询规则明细'
  baseAskRuleDetailFormRef.value.open()
}

const onEdit = (row: BaseAskRuleDetailOutput) => {
  state.baseAskRuleDetailFormTitle = '编辑问询规则明细'
  baseAskRuleDetailFormRef.value.open(row)
}
const onDelete = (row: BaseAskRuleDetailOutput) => {
  modal
    .confirmDelete(`确定要删除问询规则明细?`, null)
    .then(async () => {
      await new BaseAskRuleDetailApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

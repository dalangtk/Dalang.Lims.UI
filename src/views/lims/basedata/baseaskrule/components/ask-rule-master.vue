<template>
  <div class="my-flex-column w100 h100">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="问询规则"
      class="my-table"
      :data="state.baseAskRuleListData"
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
      <el-table-column prop="askRuleCode" label="代码" show-overflow-tooltip width />
      <el-table-column prop="askRuleName" label="名称" show-overflow-tooltip width />
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

    <BaseAskRuleForm ref="baseAskRuleFormRef" :title="state.baseAskRuleFormTitle"></BaseAskRuleForm>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { BaseAskRuleApi } from '/@/api/lims/basedata/baseaskrule'
import { BaseAskRuleOutput, BaseAskRuleQueryInput } from '/@/api/lims/basedata/datacontract/askrule-datacontract'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'
const emit = defineEmits(['onCurrRowChange'])

// 引入组件
const BaseAskRuleForm = defineAsyncComponent(() => import('./base-ask-rule-form.vue'))

var table = ref()
const baseAskRuleFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-ask-rule:add',
  update: 'api:lims:base-ask-rule:update',
  delete: 'api:lims:base-ask-rule:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseAskRuleFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BaseAskRuleOutput>,
  filter: {} as BaseAskRuleQueryInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseAskRuleQueryInput>,
  baseAskRuleListData: [] as Array<BaseAskRuleOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseAskRule')
  eventBus.on('refreshBaseAskRule', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseAskRule')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseAskRuleApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseAskRuleListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false

  if (res?.data?.list) {
    table.value.setCurrentRow(res.data.list[0] ?? null)
  }
}

const onAdd = () => {
  state.baseAskRuleFormTitle = '新增问询规则'
  baseAskRuleFormRef.value.open()
}

const onEdit = (row: BaseAskRuleOutput) => {
  state.baseAskRuleFormTitle = '编辑检测计划'
  baseAskRuleFormRef.value.open(row)
}

const onDelete = (row: BaseAskRuleOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.askRuleName}】?`, null)
    .then(async () => {
      await new BaseAskRuleApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await onQuery()
}
const currentRowChange = (val: BaseAskRuleOutput | undefined) => {
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

<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.parameterListData"
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
      <el-table-column prop="paramName" label="参数名称" show-overflow-tooltip width />
      <el-table-column prop="paramValue" label="参数值" show-overflow-tooltip width />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip width />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width />
      <el-table-column prop="isValid" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.isValid === true ? 'success' : 'warning'">
            {{ row.isValid === true ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <parameter-form ref="parameterFormRef" :title="state.parameterFormTitle"></parameter-form>
  </div>
</template>

<script lang="ts" setup name="admin/parameter">
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount, defineAsyncComponent, computed } from 'vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { ParameterOutput, ParameterListOutput, ParameterQueryInput } from '/@/api/admin/data-contracts'

import { ParameterApi } from '/@/api/admin/Parameter'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'

// 引入组件
const ParameterForm = defineAsyncComponent(() => import('./components/parameter-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const parameterFormRef = ref()

//权限配置
const perms = {
  add: 'api:admin:parameter:add',
  update: 'api:admin:parameter:update',
  delete: 'api:admin:parameter:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  parameterFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<ParameterOutput>,
  filter: {} as ParameterQueryInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<ParameterQueryInput>,
  parameterListData: [] as Array<ParameterOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshParameter')
  eventBus.on('refreshParameter', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshParameter')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new ParameterApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.parameterListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.parameterFormTitle = '新增系统参数'
  parameterFormRef.value.open()
}

const onEdit = (row: ParameterOutput) => {
  state.parameterFormTitle = '编辑系统参数'
  parameterFormRef.value.open(row)
}

const onDelete = (row: ParameterOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.paramName}】?`)
    .then(async () => {
      await new ParameterApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

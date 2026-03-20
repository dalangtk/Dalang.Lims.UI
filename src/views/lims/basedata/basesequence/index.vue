<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.baseSequenceListData"
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
      <el-table-column prop="sequenceCode" label="序列代码" show-overflow-tooltip width />
      <el-table-column prop="sequenceName" label="序列名称" show-overflow-tooltip width />
      <el-table-column prop="identifier" label="序列标识" show-overflow-tooltip width />
      <el-table-column prop="perfix" label="前缀" show-overflow-tooltip width />
      <el-table-column prop="sequenceValue" label="序列内容" show-overflow-tooltip width />
      <el-table-column prop="startNo" label="起始号" show-overflow-tooltip width />
      <el-table-column prop="sequenceStep" label="步长" show-overflow-tooltip width />
      <el-table-column prop="completionLength" label="补齐长度" show-overflow-tooltip width />
      <el-table-column prop="completionChar" label="补齐字符" show-overflow-tooltip width />
      <el-table-column prop="suffix" label="后缀" show-overflow-tooltip width />
      <el-table-column prop="resetType" label="重置类型" show-overflow-tooltip width />
      <el-table-column prop="resetTime" label="重置时间" show-overflow-tooltip width />
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

    <base-sequence-form ref="baseSequenceFormRef" :title="state.baseSequenceFormTitle"></base-sequence-form>
  </div>
</template>

<script lang="ts" setup name="/basedata/basesequence">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseSequenceOutput, BaseSequenceQueryListInput } from '/@/api/lims/basedata/datacontract/sequence-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BaseSequenceApi } from '/@/api/lims/basedata/basesequence'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseSequenceForm = defineAsyncComponent(() => import('./components/basesequence-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const baseSequenceFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-sequence:add',
  update: 'api:lims:base-sequence:update',
  delete: 'api:lims:base-sequence:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseSequenceFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BaseSequenceOutput>,
  filter: {} as BaseSequenceQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseSequenceQueryListInput>,
  baseSequenceListData: [] as Array<BaseSequenceOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseSequence')
  eventBus.on('refreshBaseSequence', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseSequence')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseSequenceApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseSequenceListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseSequenceFormTitle = '新增序列'
  baseSequenceFormRef.value.open()
}

const onEdit = (row: BaseSequenceOutput) => {
  state.baseSequenceFormTitle = '编辑序列'
  baseSequenceFormRef.value.open(row)
}

const onDelete = (row: BaseSequenceOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.sequenceName}】?`)
    .then(async () => {
      await new BaseSequenceApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

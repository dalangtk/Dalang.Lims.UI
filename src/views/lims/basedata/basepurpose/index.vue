<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="检验目的"
      class="my-table"
      :data="state.basePurposeListData"
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
      <el-table-column prop="groupName" label="组别" show-overflow-tooltip width />
      <el-table-column prop="purCode" label="目的代码" show-overflow-tooltip width />
      <el-table-column prop="purName" label="目的名称" show-overflow-tooltip width />
      <el-table-column prop="purNameAB" label="目的简写" show-overflow-tooltip width />
      <el-table-column prop="purNameEN" label="目的英文" show-overflow-tooltip width />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip width />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width />
      <el-table-column prop="isEnable" label="状态" min-width="100">
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
    <base-purpose-form ref="basePurposeFormRef" :title="state.basePurposeFormTitle"></base-purpose-form>
  </div>
</template>

<script lang="ts" setup name="/basedata/basepurpose">
import { defineAsyncComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BasePurposeOutput, BasePurposeQueryListInput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import { BasePurposeApi } from '/@/api/lims/basedata/basepurpose'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BasePurposeForm = defineAsyncComponent(() => import('./components/base-purpose-form.vue'))
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))

var table = ref()
const basePurposeFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-purpose:add',
  update: 'api:lims:base-purpose:update',
  delete: 'api:lims:base-purpose:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  basePurposeFormTitle: '',
  total: 0,
  search: [
    {
      label: '组别筛选',
      prop: 'groupCode',
      placeholder: '组别',
      required: false,
      type: 'select',
      options: [] as any,
    },
    { label: '目的代码', prop: 'purCode', placeholder: '目的代码', required: false, type: 'input' },
  ],
  sels: [] as Array<BasePurposeOutput>,
  filter: {
    groupCode: '',
    purCode: '',
  } as BasePurposeQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BasePurposeQueryListInput>,
  basePurposeListData: [] as Array<BasePurposeOutput>,
})

onMounted(async () => {
  await new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.search[0].options = res!.data!.map((item) => {
        return {
          label: item.groupName,
          value: item.groupCode,
        }
      })
    })
    .catch((e) => {
      modal.msgError(e)
    })

  onQuery()
  eventBus.off('refreshBasePurpose')
  eventBus.on('refreshBasePurpose', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBasePurpose')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  const res = await new BasePurposeApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.basePurposeListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.basePurposeFormTitle = '新增检验目的'
  basePurposeFormRef.value.open()
}

const onEdit = (row: BasePurposeOutput) => {
  state.basePurposeFormTitle = '编辑检验目的'
  basePurposeFormRef.value.open(row)
}

const onDelete = (row: BasePurposeOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.purName}】?`, null)
    .then(async () => {
      await new BasePurposeApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

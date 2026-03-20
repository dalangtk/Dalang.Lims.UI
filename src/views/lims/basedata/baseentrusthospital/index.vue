<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="委托医院"
      class="my-table"
      :data="state.baseEntrustHospitalListData"
      ref="table"
      :total="state.total"
      v-on:pageOrSizeChange="onTablePageOrSizeChange"
      :loading="state.loading"
      stripe
    >
      <template #headerButton>
        <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
          <SvgIcon name="ele-Plus" />
          新增</el-button>
      </template>
      <el-table-column prop="entrustHospitalCode" label="委托医院代码" show-overflow-tooltip width />
      <el-table-column prop="entrustHospitalName" label="委托医院名称" show-overflow-tooltip width />
      <el-table-column prop="contacts" label="联系人" show-overflow-tooltip width />
      <el-table-column prop="contactPhone" label="联系电话" show-overflow-tooltip width />
      <el-table-column prop="pinYin" label="拼音" show-overflow-tooltip width />
      <el-table-column prop="wuBi" label="五笔" show-overflow-tooltip width />
      <el-table-column prop="customCode" label="自定义码" show-overflow-tooltip width />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip width />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width />
      <el-table-column prop="isValid" label="启用" show-overflow-tooltip width />
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

    <BaseEntrustHospitalForm ref="baseEntrustHospitalFormRef" :title="state.baseEntrustHospitalFormTitle"></BaseEntrustHospitalForm>
  </div>
</template>

<script lang="ts" setup name="/basedata/baseentrusthospital">
import { defineAsyncComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseEntrustHospitalOutput, BaseEntrustHospitalQueryListInput } from '/@/api/lims/basedata/datacontract/entrusthospital-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BaseEntrustHospitalApi } from '/@/api/lims/basedata/baseentrusthospital'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseEntrustHospitalForm = defineAsyncComponent(() => import('./components/entrusthospital-form.vue'))
var table = ref()
const baseEntrustHospitalFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-entrust-hospital:add',
  update: 'api:lims:base-entrust-hospital:update',
  delete: 'api:lims:base-entrust-hospital:delete',
}
const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseEntrustHospitalFormTitle: '',
  total: 0,
  search: [{ label: '委托医院代码', prop: 'entrustHospitalCode', placeholder: '委托医院代码', required: false, type: 'input' }],
  sels: [] as Array<BaseEntrustHospitalOutput>,
  filter: {
    entrustHospitalCode: null,
  } as BaseEntrustHospitalQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseEntrustHospitalQueryListInput>,
  baseEntrustHospitalListData: [] as Array<BaseEntrustHospitalOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseEntrustHospital')
  eventBus.on('refreshBaseEntrustHospital', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseEntrustHospital')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseEntrustHospitalApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseEntrustHospitalListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseEntrustHospitalFormTitle = '新增委托医院'
  baseEntrustHospitalFormRef.value.open()
}

const onEdit = (row: BaseEntrustHospitalOutput) => {
  state.baseEntrustHospitalFormTitle = '编辑委托医院'
  baseEntrustHospitalFormRef.value.open(row)
}

const onDelete = (row: BaseEntrustHospitalOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.entrustHospitalName}】?`, undefined)
    .then(async () => {
      await new BaseEntrustHospitalApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

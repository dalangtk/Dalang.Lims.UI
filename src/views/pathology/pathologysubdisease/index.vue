<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.basePathologySubDiseaseListData"
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
      <el-table-column prop="subDiseaseCode" label="子疾病代码" show-overflow-tooltip width />
      <el-table-column prop="subDiseaseName" label="子疾病名称" show-overflow-tooltip width />
      <el-table-column prop="explainUrl" label="描述外链" show-overflow-tooltip width >
        <template #default="{ row }">
          <el-link :href="row.explainUrl" target="_blank" type="primary">{{ row.explainUrl }}</el-link>
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

    <base-pathology-sub-disease-form
      ref="basePathologySubDiseaseFormRef"
      :title="state.basePathologySubDiseaseFormTitle"
    ></base-pathology-sub-disease-form>
  </div>
</template>

<script lang="ts" setup name="pathology/subdisease">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BasePathologySubDiseaseOutput,
  BasePathologySubDiseaseQueryListInput
} from '/@/api/lims/pathology/datacontract/pathologysubdisease-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BasePathologySubDiseaseApi } from '/@/api/lims/pathology/pathologysubdisease'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BasePathologySubDiseaseForm = defineAsyncComponent(() => import('./components/base-pathology-sub-disease-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const basePathologySubDiseaseFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-pathology-sub-disease:add',
  update: 'api:lims:base-pathology-sub-disease:update',
  delete: 'api:lims:base-pathology-sub-disease:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  basePathologySubDiseaseFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BasePathologySubDiseaseOutput>,
  filter: {} as BasePathologySubDiseaseQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BasePathologySubDiseaseQueryListInput>,
  basePathologySubDiseaseListData: [] as Array<BasePathologySubDiseaseOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshPathologySubDisease')
  eventBus.on('refreshPathologySubDisease', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshPathologySubDisease')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BasePathologySubDiseaseApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.basePathologySubDiseaseListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.basePathologySubDiseaseFormTitle = '新增子疾病'
  basePathologySubDiseaseFormRef.value.open()
}

const onEdit = (row: BasePathologySubDiseaseOutput) => {
  state.basePathologySubDiseaseFormTitle = '编辑子疾病'
  basePathologySubDiseaseFormRef.value.open(row)
}

const onDelete = (row: BasePathologySubDiseaseOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.subDiseaseName}】?`)
    .then(async () => {
      await new BasePathologySubDiseaseApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

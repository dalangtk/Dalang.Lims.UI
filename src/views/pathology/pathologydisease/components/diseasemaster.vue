<template>
  <div class="my-flex-column w100 h100">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.basePathologyDiseaseListData"
      ref="table"
      size="small"
      :total="state.total"
      highlight-current-row
      v-on:pageOrSizeChange="onTablePageOrSizeChange"
      :loading="state.loading"
      stripe
      @current-change="currentRowChange"
      row-key="id"
    >
      <template #headerButton>
        <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
          <SvgIcon name="ele-Plus" />
          新增</el-button
        >
      </template>
      <el-table-column prop="diseaseCode" label="疾病代码" show-overflow-tooltip width />
      <el-table-column prop="diseaseName" label="疾病名称" show-overflow-tooltip width="200" />
      <el-table-column prop="isMalignantTumor" label="恶性肿瘤" show-overflow-tooltip width="100">
        <template #default="{ row }">
          <el-tag :type="row.isMalignantTumor === true ? 'success' : 'warning'">
            {{ row.isMalignantTumor === true ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isNonInvasiveTumor" label="非浸润性肿瘤" show-overflow-tooltip width="100">
        <template #default="{ row }">
          <el-tag :type="row.isNonInvasiveTumor === true ? 'success' : 'warning'">
            {{ row.isNonInvasiveTumor === true ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="histologicalLevel" label="组织学分级" show-overflow-tooltip width="120" />
      <el-table-column prop="lmmuneMarkerEvaluation" label="免疫标记评估" show-overflow-tooltip width="120" />
      <el-table-column prop="chemotherapyReaction" label="化疗反应" show-overflow-tooltip width="120" />
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

    <base-pathology-disease-form ref="basePathologyDiseaseFormRef" :title="state.basePathologyDiseaseFormTitle"></base-pathology-disease-form>
  </div>
</template>

<script lang="ts" setup name="lims/basepathologydisease">
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount, defineAsyncComponent, computed } from 'vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BasePathologyDiseaseOutput,
  BasePathologyDiseaseListOutput,
  BasePathologyDiseaseQueryListInput,
} from '/@/api/lims/pathology/datacontract/pathologydisease-datacontract'

import { BasePathologyDiseaseApi } from '/@/api/lims/pathology/pathologydisease'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'
import modal from '/@/globalProperties/modal'

// 引入组件
const BasePathologyDiseaseForm = defineAsyncComponent(() => import('./pathology-disease-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const basePathologyDiseaseFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-pathology-disease:add',
  update: 'api:lims:base-pathology-disease:update',
  delete: 'api:lims:base-pathology-disease:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70
const emit = defineEmits(['onCurrRowChange'])

const state = reactive({
  loading: false,
  basePathologyDiseaseFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BasePathologyDiseaseOutput>,
  filter: {} as BasePathologyDiseaseQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BasePathologyDiseaseQueryListInput>,
  basePathologyDiseaseListData: [] as Array<BasePathologyDiseaseOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBasePathologyDisease')
  eventBus.on('refreshBasePathologyDisease', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBasePathologyDisease')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}
const currentRowChange = (val: BasePathologyDiseaseOutput) => {
  emit('onCurrRowChange', val)
}
const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BasePathologyDiseaseApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.basePathologyDiseaseListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  if(state.basePathologyDiseaseListData.length > 0){
    currentRowChange(state.basePathologyDiseaseListData[0])
  }
  state.loading = false
}

const onAdd = () => {
  state.basePathologyDiseaseFormTitle = '新增疾病管理'
  basePathologyDiseaseFormRef.value.open()
}

const onEdit = (row: BasePathologyDiseaseOutput) => {
  state.basePathologyDiseaseFormTitle = '编辑疾病管理'
  basePathologyDiseaseFormRef.value.open(row)
}

const onDelete = (row: BasePathologyDiseaseOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.diseaseName}】?`,null)
    .then(async () => {
      await new BasePathologyDiseaseApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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
.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

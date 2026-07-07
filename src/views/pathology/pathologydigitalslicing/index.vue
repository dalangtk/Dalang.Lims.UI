<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.examPathologyDigitalSlicingListData"
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
      <el-table-column prop="slicingName" label="切片名称" show-overflow-tooltip width />
      <el-table-column prop="slicingPath" label="切片路径" show-overflow-tooltip width />
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

    <ExamPathologyDigitalSlicingForm
      ref="examPathologyDigitalSlicingFormRef"
      :title="state.examPathologyDigitalSlicingFormTitle"
    ></ExamPathologyDigitalSlicingForm>
  </div>
</template>

<script lang="ts" setup name="lims/exampathologydigitalslicing">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  ExamPathologyDigitalSlicingOutput,
  ExamPathologyDigitalSlicingQueryListInput,
} from '/@/api/lims/pathology/datacontract/exampathologydigitalslicing-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { ExamPathologyDigitalSlicingApi } from '/@/api/lims/pathology/exampathologydigitalslicing'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const ExamPathologyDigitalSlicingForm = defineAsyncComponent(() => import('./components/exampathologydigitalslicing-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const examPathologyDigitalSlicingFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:exam-pathology-digital-slicing:add',
  update: 'api:lims:exam-pathology-digital-slicing:update',
  delete: 'api:lims:exam-pathology-digital-slicing:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  examPathologyDigitalSlicingFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<ExamPathologyDigitalSlicingOutput>,
  filter: {} as ExamPathologyDigitalSlicingQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<ExamPathologyDigitalSlicingQueryListInput>,
  examPathologyDigitalSlicingListData: [] as Array<ExamPathologyDigitalSlicingOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshExamPathologyDigitalSlicing')
  eventBus.on('refreshExamPathologyDigitalSlicing', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshExamPathologyDigitalSlicing')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new ExamPathologyDigitalSlicingApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.examPathologyDigitalSlicingListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.examPathologyDigitalSlicingFormTitle = '新增数字切片'
  examPathologyDigitalSlicingFormRef.value.open()
}

const onEdit = (row: ExamPathologyDigitalSlicingOutput) => {
  state.examPathologyDigitalSlicingFormTitle = '编辑数字切片'
  examPathologyDigitalSlicingFormRef.value.open(row)
}

const onDelete = (row: ExamPathologyDigitalSlicingOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.slicingName}】?`)
    .then(async () => {
      await new ExamPathologyDigitalSlicingApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

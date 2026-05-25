<template>
  <div class="my-flex-column w100 h100">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      size="small"
      :data="state.basePathologySamplingSpotListData"
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
      <el-table-column prop="samplingSpotCode" label="部位代码" show-overflow-tooltip width />
      <el-table-column prop="samplingSpotName" label="部位名称" show-overflow-tooltip width />
      <el-table-column prop="gender" label="性别" show-overflow-tooltip width />
      <el-table-column prop="pinYin" label="拼音" show-overflow-tooltip width />
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

    <pathology-sampling-spot-form ref="pathologySamplingSpotFormRef" :title="state.pathologySamplingSpotFormTitle"></pathology-sampling-spot-form>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BasePathologySamplingSpotOutput,
  BasePathologySamplingSpotQueryListInput,
} from '/@/api/lims/pathology/datacontract/pathologysamplingspot-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { BasePathologySamplingSpotApi } from '/@/api/lims/pathology/pathologysamplingspot'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const PathologySamplingSpotForm = defineAsyncComponent(() => import('./pathology-sampling-spot-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const pathologySamplingSpotFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-pathology-sampling-spot:add',
  update: 'api:lims:base-pathology-sampling-spot:update',
  delete: 'api:lims:base-pathology-sampling-spot:delete',
  batDelete: 'api:lims:base-pathology-sampling-spot:batch-delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70
const emit = defineEmits(['onCurrRowChange'])

const state = reactive({
  loading: false,
  pathologySamplingSpotFormTitle: '',
  total: 0,
  search: [{ label: '搜索', prop: 'samplingSpotName', placeholder: '', required: false, type: 'input' }],
  sels: [] as Array<BasePathologySamplingSpotOutput>,
  filter: {
    samplingSpotName: null,
  } as BasePathologySamplingSpotQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BasePathologySamplingSpotQueryListInput>,
  basePathologySamplingSpotListData: [] as Array<BasePathologySamplingSpotOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshPathologySamplingSpot')
  eventBus.on('refreshPathologySamplingSpot', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshPathologySamplingSpot')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BasePathologySamplingSpotApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.basePathologySamplingSpotListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.pathologySamplingSpotFormTitle = '新增取材部位'
  pathologySamplingSpotFormRef.value.open()
}

const onEdit = (row: BasePathologySamplingSpotOutput) => {
  state.pathologySamplingSpotFormTitle = '编辑取材部位'
  pathologySamplingSpotFormRef.value.open(row)
}

const onDelete = (row: BasePathologySamplingSpotOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.samplingSpotName}】?`)
    .then(async () => {
      await new BasePathologySamplingSpotApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

<style scoped lang="scss">
.my-container {
  padding-top: 10px;
}

.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

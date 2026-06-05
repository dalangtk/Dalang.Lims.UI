<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.basePathologySampleTypeListData"
      ref="table"
      size="small"
      row-key="id"
      default-expand-all
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
      <el-table-column prop="sampleTypeCode" label="标本类型代码" show-overflow-tooltip width />
      <el-table-column prop="sampleTypeName" label="标本类型名称" show-overflow-tooltip width />
      <!-- <el-table-column prop="parentCode" label="上级标本" show-overflow-tooltip width /> -->
      <el-table-column prop="typeGrade" label="级别" show-overflow-tooltip width />
      <el-table-column prop="diseaseCode" label="疾病代码" show-overflow-tooltip width />
      <el-table-column prop="templateCode" label="模板代码" show-overflow-tooltip width />
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
          <el-button v-auth="perms.add" v-if="row.typeGrade === 1" icon="ele-Plus" size="small" circle type="primary" @click="onAdd(row)"></el-button>
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" circle type="primary" @click="onEdit(row)"></el-button>
          <el-button size="small" circle type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete"></el-button>
        </template>
      </el-table-column>
    </MyTable>

    <base-pathology-sample-type-form
      ref="basePathologySampleTypeFormRef"
      :title="state.basePathologySampleTypeFormTitle"
    ></base-pathology-sample-type-form>
  </div>
</template>

<script lang="ts" setup name="/pathology/pathologysampletype">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BasePathologySampleTypeOutput,
  BasePathologySampleTypeQueryListInput,
} from '/@/api/lims/pathology/datacontract/pathologysampletype-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BasePathologySampleTypeApi } from '/@/api/lims/pathology/pathologysampletype'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'
import _ from 'lodash'

// 引入组件
const BasePathologySampleTypeForm = defineAsyncComponent(() => import('./components/base-pathology-sample-type-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const basePathologySampleTypeFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-pathology-sample-type:add',
  update: 'api:lims:base-pathology-sample-type:update',
  delete: 'api:lims:base-pathology-sample-type:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  basePathologySampleTypeFormTitle: '',
  total: 0,
  search: [],
  sels: [] as Array<BasePathologySampleTypeOutput>,
  filter: {} as BasePathologySampleTypeQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BasePathologySampleTypeQueryListInput>,
  basePathologySampleTypeListData: [] as Array<BasePathologySampleTypeOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBasePathologySampleType')
  eventBus.on('refreshBasePathologySampleType', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBasePathologySampleType')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BasePathologySampleTypeApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.basePathologySampleTypeListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = (row?: any) => {
  state.basePathologySampleTypeFormTitle = '新增病理标本'
  if (row != null) {
    let copy = _.cloneDeep(row)
    copy.id = 0
    copy.typeGrade = copy.typeGrade + 1
    basePathologySampleTypeFormRef.value.open(copy)
  } else {
    basePathologySampleTypeFormRef.value.open()
  }
}

const onEdit = (row: BasePathologySampleTypeOutput) => {
  state.basePathologySampleTypeFormTitle = '编辑病理标本'
  basePathologySampleTypeFormRef.value.open(row)
}

const onDelete = (row: BasePathologySampleTypeOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.sampleTypeName}】?`)
    .then(async () => {
      await new BasePathologySampleTypeApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="标本类型"
      class="my-table"
      :data="state.baseSampleTypeListData"
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
      <el-table-column prop="sampleTypeCode" label="标本类型代码" show-overflow-tooltip width />
      <el-table-column prop="sampleTypeName" label="标本类型名称" show-overflow-tooltip width />
      <el-table-column prop="pinYin" label="拼音" show-overflow-tooltip width />
      <el-table-column prop="wuBi" label="五笔" show-overflow-tooltip width />
      <el-table-column prop="customCode" label="自定义码" show-overflow-tooltip width />
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

    <base-sample-type-form ref="baseSampleTypeFormRef" :title="state.baseSampleTypeFormTitle"></base-sample-type-form>
  </div>
</template>

<script lang="ts" setup name="/basedata/basesampletype">
import { defineAsyncComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseSampleTypeOutput, BaseSampleTypeQueryListInput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseSampleTypeForm = defineAsyncComponent(() => import('./components/base-sample-type-form.vue'))

var table = ref()
const baseSampleTypeFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-sample-type:add',
  update: 'api:lims:base-sample-type:update',
  delete: 'api:lims:base-sample-type:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseSampleTypeFormTitle: '',
  total: 0,
  search: [{ label: '标本类型代码', prop: 'sampleTypeCode', placeholder: '标本类型代码', required: false, type: 'input' }],
  sels: [] as Array<BaseSampleTypeOutput>,
  filter: {
    sampleTypeCode: null,
  } as BaseSampleTypeQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseSampleTypeQueryListInput>,
  baseSampleTypeListData: [] as Array<BaseSampleTypeOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseSampleType')
  eventBus.on('refreshBaseSampleType', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseSampleType')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  const res = await new BaseSampleTypeApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseSampleTypeListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseSampleTypeFormTitle = '新增标本类型'
  baseSampleTypeFormRef.value.open()
}

const onEdit = (row: BaseSampleTypeOutput) => {
  state.baseSampleTypeFormTitle = '编辑标本类型'
  baseSampleTypeFormRef.value.open(row)
}

const onDelete = (row: BaseSampleTypeOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.sampleTypeName}】?`, null)
    .then(async () => {
      await new BaseSampleTypeApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="仪器"
      class="my-table"
      :data="state.baseInstrumentListData"
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
      <el-table-column prop="instrumentCode" label="仪器代码" show-overflow-tooltip width />
      <el-table-column prop="instrumentName" label="仪器名称" show-overflow-tooltip width />
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

    <BaseInstrumentForm ref="baseInstrumentFormRef" :title="state.baseInstrumentFormTitle"></BaseInstrumentForm>
  </div>
</template>

<script lang="ts" setup name="/basedata/baseinstrument">
import { defineAsyncComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { BaseInstrumentApi } from '/@/api/lims/basedata/baseinstrument'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseInstrumentOutput, BaseInstrumentQueryListInput } from '/@/api/lims/basedata/datacontract/instrument-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'
// 引入组件
const BaseInstrumentForm = defineAsyncComponent(() => import('./components/instrument-form.vue'))
var table = ref()
const baseInstrumentFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-instrument:add',
  update: 'api:lims:base-instrument:update',
  delete: 'api:lims:base-instrument:delete'
}
const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseInstrumentFormTitle: '',
  total: 0,
  search: [{ label: '仪器代码', prop: 'instrumentCode', placeholder: '仪器代码', required: false, type: 'input' }],
  sels: [] as Array<BaseInstrumentOutput>,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {
      instrumentCode: '',
    },
  } as GetPageInput<BaseInstrumentQueryListInput>,
  baseInstrumentListData: [] as Array<BaseInstrumentOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseInstrument')
  eventBus.on('refreshBaseInstrument', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseInstrument')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  const res = await new BaseInstrumentApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseInstrumentListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseInstrumentFormTitle = '新增仪器'
  baseInstrumentFormRef.value.open()
}

const onEdit = (row: BaseInstrumentOutput) => {
  state.baseInstrumentFormTitle = '编辑仪器'
  baseInstrumentFormRef.value.open(row)
}

const onDelete = (row: BaseInstrumentOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.instrumentName}】?`, undefined)
    .then(async () => {
      await new BaseInstrumentApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

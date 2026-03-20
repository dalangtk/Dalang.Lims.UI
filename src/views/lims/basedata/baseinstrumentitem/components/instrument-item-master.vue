<template>
  <div class="my-flex-column w100 h100">
    <TableSearch :search="state.search" @search="onSearch" style="margin-top: 10px" />
    <MyTable
      border
      tableName="上机项目"
      class="my-table"
      :data="state.baseInstrumentItemListData"
      ref="table"
      :total="state.total"
      v-on:pageOrSizeChange="onTablePageOrSizeChange"
      :loading="state.loading"
      stripe
      highlight-current-row
      @current-change="currentRowChange"
      row-key="id"
    >
      <template #headerButton>
        <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
          <SvgIcon name="ele-Plus" />
          新增</el-button
        >
      </template>
      <el-table-column prop="groupName" label="组别名称" show-overflow-tooltip width />
      <el-table-column prop="instrumentItemCode" label="代码" show-overflow-tooltip width />
      <el-table-column prop="instrumentItemName" label="名称" show-overflow-tooltip width />
      <el-table-column prop="printOrder" label="打印排序" show-overflow-tooltip width />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width />
      <el-table-column prop="isValid" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.isValid === true ? 'success' : 'warning'">
            {{ row.isValid === true ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip width />
      <el-table-column v-auths="[perms.delete]" label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>
  </div>

  <BaseInstrumentItemForm ref="baseInstrumentItemFormRef" :title="state.baseInstrumentItemFormTitle"></BaseInstrumentItemForm>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeMount, defineAsyncComponent } from 'vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseInstrumentItemOutput, BaseInstrumentItemQueryListInput } from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'
import { BaseInstrumentItemApi } from '/@/api/lims/basedata/baseinstrumentitem'
import eventBus from '/@/utils/mitt'
import { auth, authAll } from '/@/utils/authFunction'
// 引入组件
const BaseInstrumentItemForm = defineAsyncComponent(() => import('./base-instrument-item-form.vue'))
const baseInstrumentItemFormRef = ref()
import modal from '/@/globalProperties/modal'
const emit = defineEmits(['onCurrRowChange'])
var table = ref()

//权限配置
const perms = {
  add: 'api:lims:base-instrument-item:add',
  update: 'api:lims:base-instrument-item:update',
  delete: 'api:lims:base-instrument-item:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseInstrumentItemFormTitle: '',
  total: 0,
  search: [
    { label: '', prop: 'groupCode', placeholder: '组别代码', required: false, type: 'input' },
    { label: '', prop: 'instrumentItemCode', placeholder: '上机项目代码', required: false, type: 'input' },
  ],
  sels: [] as Array<BaseInstrumentItemOutput>,
  filter: {
    groupCode: '',
    instrumentItemCode: '',
  } as BaseInstrumentItemQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 10,
    filter: {
      groupCode: '',
      instrumentItemCode: '',
    },
  } as GetPageInput<BaseInstrumentItemQueryListInput>,
  baseInstrumentItemListData: [] as Array<BaseInstrumentItemOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseInstrumentItem')
  eventBus.on('refreshBaseInstrumentItem', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseInstrumentItem')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  onQuery()
}
const onQuery = async () => {
  state.loading = true
  const res = await new BaseInstrumentItemApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseInstrumentItemListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false

  if (res?.data?.list) {
    table.value.setCurrentRow(res.data.list[0] ?? null)
  }
}

const onAdd = () => {
  state.baseInstrumentItemFormTitle = '新增上机项目'
  baseInstrumentItemFormRef.value.open()
}

const onEdit = (row: BaseInstrumentItemOutput) => {
  state.baseInstrumentItemFormTitle = '编辑上机项目'
  baseInstrumentItemFormRef.value.open(row)
}

const onDelete = (row: BaseInstrumentItemOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.instrumentItemName}】?`, undefined)
    .then(async () => {
      await new BaseInstrumentItemApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}
const currentRowChange = (val: BaseInstrumentItemOutput | undefined) => {
  emit('onCurrRowChange', val)
}
const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await onQuery()
}

defineExpose({
  currentRowChange,
})
</script>

<style scoped>
.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

<template>
  <div class="my-layout my-container">
    <el-splitter>
      <el-splitter-panel size="70%">
        <div class="combodiv">
          <TableSearch :search="state.search" @search="onSearch" />
          <MyTable
            border
            tableName="baseGroup"
            class="my-table"
            :data="state.baseComboListData"
            ref="table"
            row-key="id"
            :total="state.total"
            v-on:pageOrSizeChange="onTablePageOrSizeChange"
            :loading="state.loading"
            highlight-current-row
            @current-change="comboChange"
            stripe
          >
            <template #headerButton>
              <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
                <SvgIcon name="ele-Plus" />
                新增</el-button
              >
            </template>
            <el-table-column prop="comboCode" label="套餐代码" show-overflow-tooltip width />
            <el-table-column prop="comboName" label="套餐名称" show-overflow-tooltip width />
            <el-table-column prop="customerCode" label="客户" show-overflow-tooltip width />
            <el-table-column prop="beginDate" label="起始时间" show-overflow-tooltip width>
              <template #default="{ row }">
                <span>{{ formatDatetime(row.beginDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="endDate" label="截至时间" show-overflow-tooltip width>
              <template #default="{ row }">
                <span>{{ formatDatetime(row.endDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sampleTypeCode" label="标本类型" show-overflow-tooltip width />
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
        </div>
      </el-splitter-panel>
      <el-splitter-panel :min="200">
        <ComboDetail ref="comboDetailRef" :readonly="true"></ComboDetail>
      </el-splitter-panel>

      <base-combo-form ref="baseComboFormRef" :title="state.baseComboFormTitle"></base-combo-form>
    </el-splitter>
  </div>
</template>

<script lang="ts" setup name="/basedata/basecombo">
import { defineAsyncComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BaseComboOutput,
  BaseComboQueryInput
} from '/@/api/lims/basedata/datacontract/combo-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import ComboDetail from '/@/views/lims/basedata/basecombo/components/combodetail.vue'

import { BaseComboApi } from '/@/api/lims/basedata/basecombo'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import { formatDatetime } from '/@/utils/formatTime'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseComboForm = defineAsyncComponent(() => import('./components/base-combo-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const baseComboFormRef = ref()
let comboDetailRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-combo:add',
  update: 'api:lims:base-combo:update',
  delete: 'api:lims:base-combo:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseComboFormTitle: '',
  total: 0,
  search: [{ label: '', prop: 'groupCode', placeholder: '组别代码/名称', required: false, type: 'input' }],
  sels: [] as Array<BaseComboOutput>,
  filter: {} as BaseComboQueryInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseComboQueryInput>,
  baseComboListData: [] as Array<BaseComboOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseCombo')
  eventBus.on('refreshBaseCombo', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseCombo')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseComboApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseComboListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0

  if (state.baseComboListData.length > 0) {
    // comboChange(state.baseComboListData[0])
    table.value.setCurrentRow(state.baseComboListData[0])
  }

  state.loading = false
}
const comboChange = (row: BaseComboOutput) => {
  if (row) comboDetailRef.value.refreshDetail(row.comboCode)
}
const onAdd = () => {
  state.baseComboFormTitle = '新增套餐'
  baseComboFormRef.value.open()
}

const onEdit = (row: BaseComboOutput) => {
  state.baseComboFormTitle = '编辑套餐'
  baseComboFormRef.value.open(row)
  // nextTick(() => {
  console.log(baseComboFormRef.value.refreshComboDetail)
  baseComboFormRef.value.refreshComboDetail(row.comboCode)
  // })
  // setTimeout(() => {
  //   console.log(baseComboFormRef.value)
  //   baseComboFormRef.value.refreshComboDetail(row.id)
  // }, 50)
}

const onDelete = (row: BaseComboOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.comboName}】?`, null)
    .then(async () => {
      await new BaseComboApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

.combodiv {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.my-table {
  flex-grow: 1;
}
</style>

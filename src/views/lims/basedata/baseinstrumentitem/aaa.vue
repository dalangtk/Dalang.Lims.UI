<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable border tableName="baseGroup" class="my-table" :data="state.baseInstrumentItemListData" ref="table"
      :total="state.total" v-on:pageOrSizeChange="onTablePageOrSizeChange" :loading="state.loading" stripe>
      <template #headerButton>
        <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">新增</el-button>
      </template>
      <el-table-column prop="groupCode" label="组别代码" show-overflow-tooltip width />
      <el-table-column prop="groupName" label="组别名称" show-overflow-tooltip width />
      <el-table-column prop="instrumentItemCode" label="上机项目代码" show-overflow-tooltip width />
      <el-table-column prop="instrumentItemName" label="上机项目名称" show-overflow-tooltip width />
      <el-table-column prop="printOrder" label="打印排序" show-overflow-tooltip width />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip width />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width />
      <el-table-column prop="isValid" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.isValid === true ? 'success' : 'warning'">
            {{ row.isValid === true ? "启用" : "停用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-auths="[perms.delete]" label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary"
            @click="onEdit(row)">编辑</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)"
            icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <base-instrument-item-form ref="baseInstrumentItemFormRef"
      :title="state.baseInstrumentItemFormTitle"></base-instrument-item-form>
  </div>
</template>

<script lang="ts" setup name="lims/baseinstrumentitem">
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount, defineAsyncComponent, computed } from 'vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import {
  BaseInstrumentItemOutput,
  BaseInstrumentItemListOutput,
  BaseInstrumentItemQueryListInput
}
  from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'

import { BaseInstrumentItemApi } from '/@/api/lims/basedata/baseinstrumentitem'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'

// 引入组件
const BaseInstrumentItemForm = defineAsyncComponent(() => import('./components/base-instrument-item-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref();
const baseInstrumentItemFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-instrument-item:add',
  update: 'api:lims:base-instrument-item:update',
  delete: 'api:lims:base-instrument-item:delete',
  batDelete: 'api:lims:base-instrument-item:batch-delete',
  softDelete: 'api:lims:base-instrument-item:soft-delete',
  batSoftDelete: 'api:lims:base-instrument-item:batch-soft-delete',
}

const actionColWidth = authAll([perms.update, perms.softDelete]) || authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseInstrumentItemFormTitle: '',
  total: 0,
  search: [
    { label: '组别代码', prop: 'groupCode', placeholder: '组别代码', required: false, type: 'input' },
    { label: '上机项目代码', prop: 'instrumentItemCode', placeholder: '上机项目代码', required: false, type: 'input' },

  ],
  sels: [] as Array<BaseInstrumentItemOutput>,
  filter: {
    groupCode: '',
    instrumentItemCode: '',
  } as BaseInstrumentItemQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {
      groupCode: '',
      instrumentItemCode: '',
    }
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
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data });
  table.value.pageReset();
}
const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseInstrumentItemApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseInstrumentItemListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false

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
  proxy.$modal
    .confirmDelete(`确定要删除【${row.instrumentItemName}】?`)
    .then(async () => {
      await new BaseInstrumentItemApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => { })
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage;
  state.pageInput.pageSize = page.pageSize;
  await onQuery();
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
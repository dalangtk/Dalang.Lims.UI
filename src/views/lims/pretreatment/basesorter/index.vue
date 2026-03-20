<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <div class="sortinfo">
      <MyTable
        border
        tableName="baseGroup"
        class="my-table"
        :data="state.baseSorterListData"
        ref="table"
        :total="state.total"
        v-on:pageOrSizeChange="onTablePageOrSizeChange"
        :loading="state.loading"
        highlight-current-row
        @current-change="currentRowChange"
        stripe
      >
        <template #headerButton>
          <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
            <SvgIcon name="ele-Plus" />
            新增</el-button
          >
        </template>
        <el-table-column prop="sorterCode" label="分拣仪代码" show-overflow-tooltip width />
        <el-table-column prop="sorterName" label="分拣仪名称" show-overflow-tooltip width />
        <el-table-column prop="shelfCount" label="架子数" show-overflow-tooltip width />
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
    <div class="sortshelf">
      <SorterShelf ref="sortshelf" :is-edit="false" style="" :sorter-info="state.currSortInfo"></SorterShelf>
    </div>
    <base-sorter-form ref="baseSorterFormRef" :title="state.baseSorterFormTitle"></base-sorter-form>
  </div>
</template>

<script lang="ts" setup name="/pretreatment/basesorter">
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount, defineAsyncComponent, computed, nextTick } from 'vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseSorterOutput, BaseSorterListOutput, BaseSorterQueryListInput } from '/@/api/lims/pretreatment/datacontract/basesorter-datacontract'
const SorterShelf = defineAsyncComponent(() => import('./components/sortershelf.vue'))

import { BaseSorterApi } from '/@/api/lims/pretreatment/basesorter'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'

// 引入组件
const BaseSorterForm = defineAsyncComponent(() => import('./components/basesorter-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const baseSorterFormRef = ref()
const sortshelf = ref()

//权限配置
const perms = {
  add: 'api:lims:base-sorter:add',
  update: 'api:lims:base-sorter:update',
  delete: 'api:lims:base-sorter:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseSorterFormTitle: '',
  total: 0,
  search: [],
  filter: {} as BaseSorterQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseSorterQueryListInput>,
  baseSorterListData: [] as Array<BaseSorterOutput>,
  currSortInfo: {} as BaseSorterOutput,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseSorter')
  eventBus.on('refreshBaseSorter', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseSorter')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  //state.pageInput.filter = state.filter
  const res = await new BaseSorterApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseSorterListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
  if (state.baseSorterListData) {
    table.value.setCurrentRow(state.baseSorterListData[0])
    state.currSortInfo = state.baseSorterListData[0]
    currentRowChange(state.baseSorterListData[0])
  }
}
const currentRowChange = (row: BaseSorterOutput) => {
  state.currSortInfo = row
  nextTick(() => {
    sortshelf.value.refreshDetailData()
  })
}

const onAdd = () => {
  state.baseSorterFormTitle = '新增分拣仪器'
  baseSorterFormRef.value.open()
}

const onEdit = (row: BaseSorterOutput) => {
  state.baseSorterFormTitle = '编辑分拣仪器'
  baseSorterFormRef.value.open(row)
}

const onDelete = (row: BaseSorterOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.sorterName}】?`)
    .then(async () => {
      await new BaseSorterApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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
  display: flex;
  flex-direction: row;
}

.my-table {
  flex: 1;
  overflow: hidden;
}
.sortinfo {
  display: flex;
  width: 50%;
}
.sortshelf {
  display: flex;
  width: 50%;
}
</style>

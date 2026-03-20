<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <div style="height: 100%; display: flex; flex-direction: row">
      <MyTable
        border
        tableName="baseGroup"
        class="my-table"
        :data="state.baseSortRuleListData"
        ref="table"
        :total="state.total"
        v-on:pageOrSizeChange="onTablePageOrSizeChange"
        :loading="state.loading"
        stripe
        highlight-current-row
        @current-change="onSelectionChange"
      >
        <template #headerButton>
          <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
            <SvgIcon name="ele-Plus" />
            新增</el-button
          >
        </template>
        <el-table-column prop="groupCode" label="组别代码" show-overflow-tooltip width />
        <el-table-column prop="groupName" label="组别名称" show-overflow-tooltip width />
        <el-table-column prop="ruleCode" label="规则代码" show-overflow-tooltip width />
        <el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip width />
        <el-table-column prop="sequenceCode" label="序列代码" show-overflow-tooltip width />
        <el-table-column prop="itemCount" label="匹配项目数" show-overflow-tooltip width />
        <el-table-column prop="isSortAll" label="是否分拣所有" show-overflow-tooltip width>
          <template #default="{ row }">
            <el-tag :type="row.isSortAll === true ? 'success' : 'warning'">
              {{ row.isSortAll === true ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isBatch" label="是否批量规则" show-overflow-tooltip width>
          <template #default="{ row }">
            <el-tag :type="row.isBatch === true ? 'success' : 'warning'">
              {{ row.isBatch === true ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
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
      <el-card style="margin-left: 10px">
        <template #header>
          <div class="card-header">
            <span>规则</span>
          </div>
        </template>
        <MyFilter ref="myFilterRef" :fields="state.filterFields" :disabled="true"></MyFilter>
      </el-card>
    </div>

    <base-sort-rule-form ref="baseSortRuleFormRef" :title="state.baseSortRuleFormTitle" :filterFields="state.filterFields"></base-sort-rule-form>
  </div>
</template>

<script lang="ts" setup name="/pretreatment/basesortrule">
import { defineAsyncComponent, getCurrentInstance, nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseSortRuleOutput, BaseSortRuleQueryListInput } from '/@/api/lims/pretreatment/datacontract/sortrule-datacontract'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import MyTable from '/@/components/my-table/index.vue'

import { BaseSortRuleApi } from '/@/api/lims/pretreatment/basesortrule'
import MyFilter from '/@/components/my-filter/index.vue'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'

// 引入组件
const BaseSortRuleForm = defineAsyncComponent(() => import('./components/basesortrule-form.vue'))

const { proxy } = getCurrentInstance() as any
var table = ref()
const baseSortRuleFormRef = ref()
const myFilterRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-sort-rule:add',
  update: 'api:lims:base-sort-rule:update',
  delete: 'api:lims:base-sort-rule:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  baseSortRuleFormTitle: '',
  total: 0,
  search: [
    {
      label: '查询',
      prop: 'sortRuleCode',
      placeholder: '',
      required: false,
      type: 'input',
    },
  ],
  sels: [] as Array<BaseSortRuleOutput>,
  filter: {} as BaseSortRuleQueryListInput,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseSortRuleQueryListInput>,
  baseSortRuleListData: [] as Array<BaseSortRuleOutput>,
  filterFields: [
    {
      field: 'customerCode',
      operator: 'Contains',
      description: '客户',
      componentName: 'el-select',
      type: 'select',
      remoteMethod: 'remoteQueryCustomer',
      filterable: true,
      remoteable: true,
      multipleable: true,
      options: null,
    },
    {
      field: 'groupCode',
      operator: 'Contains',
      description: '组别',
      componentName: 'el-select',
      type: 'select',
      remoteMethod: 'remoteQueryGroup',
      filterable: true,
      remoteable: true,
      multipleable: true,
      options: null,
    },
    {
      field: 'itemCode',
      operator: 'Contains',
      description: '项目',
      componentName: 'el-select',
      type: 'select',
      remoteMethod: 'remoteQueryGroup',
      filterable: true,
      remoteable: true,
      multipleable: true,
      options: null,
    },
    {
      field: 'purCode',
      operator: 'Contains',
      description: '目的',
      componentName: 'el-select',
      type: 'select',
      remoteMethod: 'remoteQueryPurpose',
      filterable: true,
      remoteable: true,
      multipleable: true,
      options: null,
    },
  ] as Array<any>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseSortRule')
  eventBus.on('refreshBaseSortRule', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseSortRule')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  const res = await new BaseSortRuleApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })

  state.baseSortRuleListData = res?.data?.list ?? []
  if (state.baseSortRuleListData.length > 0) {
    onSelectionChange(state.baseSortRuleListData[0])
  } else {
    myFilterRef.value.reset()
  }
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.baseSortRuleFormTitle = '新增分拣规则'
  baseSortRuleFormRef.value.open()
}

const onEdit = (row: BaseSortRuleOutput) => {
  state.baseSortRuleFormTitle = '编辑分拣规则'
  baseSortRuleFormRef.value.open(row)
}

const onDelete = (row: BaseSortRuleOutput) => {
  proxy.$modal
    .confirmDelete(`确定要删除【${row.ruleName}】?`)
    .then(async () => {
      await new BaseSortRuleApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}
const onSelectionChange = (data: BaseSortRuleOutput) => {
  console.log('onSelectionChange', data)
  if (!data?.ruleExpression) return
  var filterObj = JSON.parse(data.ruleExpression!)
  nextTick(() => {
    setOptions(filterObj)
    myFilterRef.value.setFilter(filterObj)
  })
}
const setOptions = (data: any) => {
  if (data.filters) {
    for (let i = data.filters.length - 1; i >= 0; i--) {
      if (data.logic == 0) {
        data.logic = 'And'
      } else if (data.logic == 1) {
        data.logic = 'Or'
      }
      if (data.filters[i].allOptions) {
        data.filters[i].options = data.filters[i].allOptions
      }
      if (data.filters[i].filters) {
        setOptions(data.filters[i])
      }
    }
  }
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
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>

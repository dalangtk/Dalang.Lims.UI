<template>
  <div class="my-layout my-container">
    <TableSearch :search="state.search" @search="onSearch" />
    <MyTable
      border
      tableName="组别"
      class="my-table"
      :data="state.ListData"
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
      <el-table-column prop="groupCode" label="分组代码" min-width="100" />
      <el-table-column prop="groupName" label="分组名称" min-width="100" />
      <el-table-column prop="sort" label="排序" min-width="100" />
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

    <GroupForm ref="FormRef" :title="state.FormTitle"></GroupForm>
  </div>
</template>

<script lang="ts" setup name="/basedata/basegroup">
import { defineAsyncComponent, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseGroupOutput, BaseGroupQueryListInput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import MyTable from '/@/components/my-table/index.vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'
// 引入组件
const GroupForm = defineAsyncComponent(() => import('./components/group-form.vue'))
const FormRef = ref()
var table = ref()

//权限配置
const perms = {
  add: 'api:lims:base-group:add',
  update: 'api:lims:base-group:update',
  delete: 'api:lims:base-group:delete',
}

const actionColWidth = authAll([perms.update]) || authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  FormTitle: '',
  total: 0,
  search: [{ label: '', prop: 'groupCode', placeholder: '组别代码/名称', required: false, type: 'input' }],
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {
      groupCode: '',
    },
  } as GetPageInput<BaseGroupQueryListInput>,
  ListData: [] as Array<BaseGroupOutput>,
})

onMounted(() => {
  onQuery()
  eventBus.off('refreshBaseGroup')
  eventBus.on('refreshBaseGroup', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseGroup')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onQuery = async () => {
  state.loading = true
  const res = await new BaseGroupApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })
  state.ListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false
}

const onAdd = () => {
  state.FormTitle = '新增组别'
  FormRef.value.open()
}

const onEdit = (row: BaseGroupOutput) => {
  state.FormTitle = '编辑组别'
  FormRef.value.open(row)
}

const onDelete = (row: BaseGroupOutput) => {
  if (row.groupCode == '8888' || row.groupCode == '9999') {
    modal.msgError('默认组别项目不能删除')
    return
  }
  modal
    .confirmDelete(`确定要删除【${row.groupName}】?`, undefined)
    .then(async () => {
      await new BaseGroupApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
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

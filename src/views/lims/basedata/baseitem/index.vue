<template>
  <div class="my-layout my-container">
    <div class="itemdiv">
      <TableSearch :search="state.search" @search="onSearch" />
      <MyTable
        border
        tableName="检验项目"
        class="my-table"
        :data="state.ListData"
        ref="table"
        :total="state.total"
        v-on:pageOrSizeChange="onTablePageOrSizeChange"
        :loading="state.loading"
        @current-change="currItemChange"
        highlight-current-row
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
        <el-table-column prop="itemCode" label="项目代码" min-width="100" />
        <el-table-column prop="itemName" label="项目名称" min-width="100" />
        <el-table-column prop="resultType" label="结果类型" min-width="100" />
        <el-table-column prop="decideType" label="判定方式" min-width="100" />
        <el-table-column prop="itemNameAB" label="简称" min-width="100" />
        <el-table-column prop="itemNameEN" label="英文" min-width="100" />
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
    </div>
    <div class="referencediv">
      <BaseItemReference ref="itemReferenceRef"></BaseItemReference>
    </div>
    <BaseItemForm ref="baseItemFormRef" :title="state.FormTitle"></BaseItemForm>
  </div>
</template>

<script lang="ts" setup name="/basedata/baseitem">
import MyTable from '/@/components/my-table/index.vue'
import TableSearch from '/@/components/my-table/MyTableSearch.vue'
import { ref, reactive, onMounted, onBeforeMount, defineAsyncComponent } from 'vue'
import { BaseItemQueryListInput, BaseItemOutput } from '/@/api/lims/basedata/datacontract/item-datacontract'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseItemApi } from '/@/api/lims/basedata/baseitem'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'
import modal from '/@/globalProperties/modal'
const BaseItemReference = defineAsyncComponent(() => import('./components/base-item-reference.vue'))
// 引入组件
const BaseItemForm = defineAsyncComponent(() => import('./components/base-item-form.vue'))

const table = ref()
const baseItemFormRef = ref()
const itemReferenceRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-item:add',
  update: 'api:lims:base-item:update',
  delete: 'api:lims:base-item:delete',
}

const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  FormTitle: '',
  total: 0,
  search: [
    {
      label: '组别筛选',
      prop: 'groupCode',
      placeholder: '组别',
      required: false,
      type: 'select',
      options: [] as any,
    },
    { label: '项目名称', prop: 'itemCode', placeholder: '请输入关键字搜索', required: false, type: 'input' },
  ],
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {
      itemCode: '',
      groupCode: '',
    },
  } as GetPageInput<BaseItemQueryListInput>,
  ListData: [] as Array<BaseItemOutput>,
})

onMounted(async () => {
  new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.search[0].options = res!.data!.map((item) => {
        return {
          label: item.groupName,
          value: item.groupCode,
        }
      })
    })
    .catch((e) => {
      modal.msgError(e)
    })

  onQuery()
  eventBus.off('refreshBaseItem')
  eventBus.on('refreshBaseItem', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseItem')
})

const onSearch = (data: EmptyObjectType) => {
  state.pageInput.filter = Object.assign({}, state.pageInput.filter, { ...data })
  table.value.pageReset()
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await onQuery()
}

const onQuery = async () => {
  state.loading = true
  const res = await new BaseItemApi().getPage(state.pageInput).catch(() => {
    state.loading = false
  })
  state.ListData = res?.data?.list ?? []
  state.total = res?.data?.total ?? 0
  state.loading = false

  if (state.ListData.length > 0) {
    table.value.setCurrentRow(state.ListData[0])
  }
}

const onAdd = () => {
  state.FormTitle = '新增项目'
  baseItemFormRef.value.open()
}

const onEdit = (row: BaseItemOutput) => {
  state.FormTitle = '编辑项目'
  baseItemFormRef.value.open(row)
}

const onDelete = (row: BaseItemOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.itemName}】?`, undefined)
    .then(async () => {
      await new BaseItemApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}

const currItemChange = (row: BaseItemOutput) => {
  itemReferenceRef.value.refreshItemReference(row)
}
</script>

<style scoped>
.my-container {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
}
.itemdiv {
  height: 70%;
  display: flex;
  flex-direction: column;
}
.referencediv {
  margin-top: 5px;
}
.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

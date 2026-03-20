<template>
  <div class="my-flex-column w100 h100">
    <MyTable
      border
      tableName="上机项目明细"
      class="my-table"
      :data="state.baseInstrumentItemListData"
      ref="table"
      :total="state.total"
      v-on:pageOrSizeChange="onTablePageOrSizeChange"
      :loading="state.loading"
      stripe
    >
      <template #headerButton>
        <div>
          <el-tag type="primary" size="small">上机项目明细</el-tag>
          <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd" style="margin-left: 5px">
            <SvgIcon name="ele-Plus" />
            新增</el-button
          >
        </div>
      </template>
      <el-table-column prop="itemCode" label="项目代码" how-overflow-tooltip width />
      <el-table-column prop="itemName" label="项目名称" how-overflow-tooltip width />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width />
      <el-table-column prop="isValid" label="状态" how-overflow-tooltip width>
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
  <ItemSelect ref="itemSelectRef" @confirm="itemSelectConfirm"></ItemSelect>
  <InstrumentItemForm ref="formRef" :title="state.formTitle"></InstrumentItemForm>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeMount, defineAsyncComponent, watch } from 'vue'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseInstrumentItemDetailApi } from '/@/api/lims/basedata/baseinstrumentitem'
import eventBus from '/@/utils/mitt'
import { auth, authAll } from '/@/utils/authFunction'
import {
  BaseInstrumentItemDetailOutput,
  BaseInstrumentItemOutput,
  BaseInstrumentItemQueryListInput,
} from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'
import { BaseItemListOutput } from '/@/api/lims/basedata/datacontract/item-datacontract'

import InstrumentItemForm from './instrument-item-detail-form.vue'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
const ItemSelect = defineAsyncComponent(() => import('./item-select.vue'))
const itemSelectRef = ref()
var table = ref()
var formRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-instrument-item:add',
  update: 'api:lims:base-instrument-item:update',
  delete: 'api:lims:base-instrument-item:delete',
  batDelete: 'api:lims:base-instrument-item:batch-delete',
  softDelete: 'api:lims:base-instrument-item:soft-delete',
  batSoftDelete: 'api:lims:base-instrument-item:batch-soft-delete',
}

const props = defineProps({
  currentInstrumentItem: {
    type: Object as () => BaseInstrumentItemOutput,
    default: null,
  },
})

const actionColWidth = authAll([perms.update, perms.softDelete]) || authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  total: 0,
  sels: [] as Array<BaseInstrumentItemOutput>,
  formTitle: '',
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
    },
  } as GetPageInput<BaseInstrumentItemQueryListInput>,
  baseInstrumentItemListData: [] as Array<BaseInstrumentItemDetailOutput>,
})

watch(
  () => props.currentInstrumentItem,
  () => {
    state.pageInput.filter!.groupCode = props.currentInstrumentItem?.groupCode!
    state.pageInput.filter!.instrumentItemCode = props.currentInstrumentItem?.instrumentItemCode!
  }
)
onMounted(() => {
  eventBus.off('refreshBaseInstrumentItemDetail')
  eventBus.on('refreshBaseInstrumentItemDetail', async () => {
    onQuery()
  })
})

onBeforeMount(() => {
  eventBus.off('refreshBaseInstrumentItemDetail')
})

const refreshDetailItem = () => {
  onQuery()
}

const onQuery = async () => {
  if (!state.pageInput.filter?.groupCode || !state.pageInput.filter?.instrumentItemCode) {
    state.baseInstrumentItemListData = []
    return
  }
  state.loading = true
  const res = await new BaseInstrumentItemDetailApi().getListByInstrumentItemCode([state.pageInput.filter.instrumentItemCode]).catch(() => {
    state.loading = false
  })

  state.baseInstrumentItemListData = res?.data ?? []
  state.loading = false
}

const onAdd = () => {
  if (!props.currentInstrumentItem.groupCode) {
    modal.msgError('请先选择上机项目！')
    return
  }
  itemSelectRef.value.open(props.currentInstrumentItem.groupCode)
}

const itemSelectConfirm = (selectItems: Array<BaseItemListOutput>) => {
  let addList = selectItems
    .filter((addItem) => !state.baseInstrumentItemListData.some((baseItem) => baseItem.itemCode === addItem.itemCode))
    .map((a) => ({ itemCode: a.itemCode, instrumentItemCode: props.currentInstrumentItem.instrumentItemCode, isValid: true }))
  if (addList.length <= 0) {
    modal.msgWarning('项目已存在，无待新增项目！')
    return
  }
  new BaseInstrumentItemDetailApi().addList(addList).then((res) => {
    if (res?.success) {
      modal.msgSuccess('新增成功')
      refreshDetailItem()
    }
  })
}
const onEdit = (row: BaseInstrumentItemDetailOutput) => {
  formRef.value.open(row)
  state.formTitle = '编辑上机项目明细'
}

const onDelete = (row: BaseInstrumentItemDetailOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.itemName}】?`, undefined)
    .then(async () => {
      await new BaseInstrumentItemDetailApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      onQuery()
    })
    .catch(() => {})
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await onQuery()
}

defineExpose({
  refreshDetailItem,
})
</script>

<style scoped>
.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

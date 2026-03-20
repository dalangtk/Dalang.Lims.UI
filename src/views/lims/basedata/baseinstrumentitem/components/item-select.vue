<template>
  <el-dialog v-model="state.showDialog" :destroy-on-close="true">
    <Transfer
      :title-texts="['待选择', '已选择']"
      min-height="300"
      max-height="600"
      row-key="itemCode"
      :data="state.pageInfo.list"
      :value="state.selectedItems"
      :key="state.timer"
      v-show="state.showDialog"
      :selectionChange="onSelectionChange"
    >
      <template #left-header>
        <el-form :inline="true" @submit.stop.prevent size="small">
          <el-form-item>
            <el-input v-model="state.search.itemCode" placeholder="项目名称" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="ele-Search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #left-table-columns>
        <el-table-column label="项目代码" align="left" prop="itemCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="项目名称" align="left" prop="itemName" header-align="center" show-overflow-tooltip :min-width="100" />
      </template>
      <template #right-table-columns>
        <el-table-column label="项目代码" align="left" prop="itemCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="项目名称" align="left" prop="itemName" header-align="center" show-overflow-tooltip :min-width="100" />
      </template>
    </Transfer>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel" size="default">取 消</el-button>
        <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Transfer from '/@/components/my-transfer/index.vue'
import { BaseItemApi } from '/@/api/lims/basedata/baseitem'
import { BaseInstrumentItemDetailOutput } from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'

const props = defineProps({
  onConfirm: {
    type: Function,
    default: null,
    required: true,
    parameters: Array<string>,
  },
})

const state = reactive({
  search: {
    itemCode: '',
  },
  groupCode: '',
  instrumentItemCode: '',
  showDialog: false,
  sureLoading: false,
  selectedItems: [] as BaseInstrumentItemDetailOutput[],
  pageInfo: {
    list: [] as any[],
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  timer: 0,
})

const handleSearch = () => {
  new BaseItemApi()
    .getPage({
      currentPage: 1,
      pageSize: 10,
      filter: {
        itemCode: state.search.itemCode,
        groupCode: state.groupCode,
      },
    })
    .then((res) => {
      console.log('res.data?.list', res.data?.list)
      state.pageInfo.list = res.data?.list ?? []
    })
}
const open = (groupCode: string, itemCode: string) => {
  state.groupCode = groupCode
  state.instrumentItemCode = itemCode
  state.timer = new Date().getTime()
  state.search.itemCode = ''
  state.showDialog = true
  state.selectedItems = []
  refreshDetailItem()
}

const onSelectionChange = (selectItems: []) => {
  state.selectedItems = selectItems!
}

const refreshDetailItem = () => {
  if (!state.instrumentItemCode) return
}

const onSure = () => {
  state.showDialog = false
  props.onConfirm(state.selectedItems)
}
const onCancel = () => {
  state.showDialog = false
}
defineExpose({
  open,
})
</script>

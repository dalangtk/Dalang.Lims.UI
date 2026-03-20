<template>
  <el-dialog v-model="state.showDialog" :destroy-on-close="true">
    <Transfer
      :title-texts="['待选择', '已选择']"
      min-height="300"
      max-height="600"
      row-key="instrumentItemCode"
      :data="state.pageInfo.list"
      :value="state.selectedItems"
      :key="state.timer"
      v-show="state.showDialog"
      :selectionChange="onSelectionChange"
    >
      <template #left-header>
        <el-form :inline="true" @submit.stop.prevent size="small">
          <el-form-item>
            <el-input v-model="state.search.instrumentItemCode" placeholder="项目名称" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="ele-Search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #left-table-columns>
        <el-table-column label="上机项目代码" align="left" prop="instrumentItemCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="上机项目名称" align="left" prop="instrumentItemName" header-align="center" show-overflow-tooltip :min-width="100" />
      </template>
      <template #right-table-columns>
        <el-table-column label="上机项目代码" align="left" prop="instrumentItemCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="上机项目名称" align="left" prop="instrumentItemName" header-align="center" show-overflow-tooltip :min-width="100" />
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
import { BaseInstrumentItemApi } from '/@/api/lims/basedata/baseinstrumentitem'
import { BaseInstrumentItemOutput } from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'

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
    instrumentItemCode: '',
  },
  groupCode: '',
  purCode: '',
  showDialog: false,
  sureLoading: false,
  selectedItems: [] as BaseInstrumentItemOutput[],
  pageInfo: {
    list: [] as any[],
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  timer: 0,
})

const handleSearch = () => {
  new BaseInstrumentItemApi()
    .getPage({
      currentPage: 1,
      pageSize: 10,
      filter: {
        instrumentItemCode: state.search.instrumentItemCode,
        groupCode: state.groupCode,
      },
    })
    .then((res) => {
      state.pageInfo.list = res.data?.list ?? []
    })
}
const open = (groupCode: string, purCode: string) => {
  state.groupCode = groupCode
  state.purCode = purCode
  state.timer = new Date().getTime()
  state.search.instrumentItemCode = ''
  state.showDialog = true
  state.selectedItems = []
  refreshDetailItem()
}

const onSelectionChange = (selectItems: []) => {
  console.log('onSelectionChange', selectItems)
  state.selectedItems = selectItems!
}

const refreshDetailItem = () => {
  if (!state.purCode) return
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

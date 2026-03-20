<template>
  <el-dialog v-model="state.showDialog" :destroy-on-close="true">
    <Transfer
      :title-texts="['待选择', '已选择']"
      min-height="300"
      max-height="600"
      row-key="purCode"
      :data="state.pageInfo.list"
      :value="state.selectedItems"
      :key="state.timer"
      v-show="state.showDialog"
      :selectionChange="onSelectionChange"
      :show-paging="false"
    >
      <template #left-header>
        <el-form :inline="true" @submit.stop.prevent size="small">
          <el-form-item>
            <el-input v-model="state.search.purCode" placeholder="项目名称" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="ele-Search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #left-table-columns>
        <el-table-column label="目的代码" align="left" prop="purCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="名称名称" align="left" prop="purName" header-align="center" show-overflow-tooltip :min-width="100" />
      </template>
      <template #right-table-columns>
        <el-table-column label="目的代码" align="left" prop="purCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="目的名称" align="left" prop="purName" header-align="center" show-overflow-tooltip :min-width="100" />
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
import { BasePurposeApi } from '/@/api/lims/basedata/basepurpose'
import { PurposeAndComboOutput, PurposeAndComboQueryInput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'

const props = defineProps({
  onConfirm: {
    type: Function,
    default: null,
    required: true,
    parameters: Array<string>,
  },
  groupCode: {
    type: String,
    default: '',
  },
})

const state = reactive({
  search: {
    purCode: '',
  },
  customerCode: '',
  purCode: '',
  showDialog: false,
  sureLoading: false,
  selectedItems: [] as PurposeAndComboOutput[],
  pageInfo: {
    list: [] as any[],
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  timer: 0,
})

const handleSearch = () => {
  // if (!state.search.purCode) return

  let param = {
    customerCode: state.customerCode,
    purCode: state.search.purCode,
    groupCode: props.groupCode,
  } as PurposeAndComboQueryInput

  new BasePurposeApi().getPurposeAndCombo(param).then((res) => {
    console.log('handleSearch', res.data)
    state.pageInfo.list = res.data as any[]
  })
}
const open = (customerCode: string, purCode: string) => {
  state.customerCode = customerCode
  state.purCode = purCode
  state.timer = new Date().getTime()
  state.search.purCode = ''
  state.showDialog = true
  state.selectedItems = []
  refreshDetailItem()
}

const onSelectionChange = (selectItems: []) => {
  console.log('onSelectionChange', selectItems)
  state.selectedItems = selectItems!
}

const refreshDetailItem = () => {
  //if (!state.purCode) return
  // new BasePurposeApi().getPurposeAndCombo({ purCode: state.purCode }).then((res) => {
  //   console.log('refreshDetailItem',res.data)
  //   state.pageInfo.list = res.data as any[]
  // })
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

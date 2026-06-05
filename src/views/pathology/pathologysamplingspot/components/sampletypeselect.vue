<template>
  <el-dialog v-model="state.showDialog" :destroy-on-close="true">
    <Transfer
      :title-texts="['待选择', '已选择']"
      min-height="300"
      max-height="600"
      row-key="subDiseaseCode"
      :data="state.pageInfo.list"
      :value="state.selectedSampleTypes"
      :key="state.timer"
      v-show="state.showDialog"
      :selectionChange="onSelectionChange"
    >
      <template #left-header>
        <el-form :inline="true" @submit.stop.prevent size="small">
          <el-form-item>
            <el-input v-model="state.search.sampleTypeCode" placeholder="样本类型名称" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="ele-Search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #left-table-columns>
        <el-table-column label="样本类型代码" align="left" prop="sampleTypeCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="样本类型名称" align="left" prop="sampleTypeName" header-align="center" show-overflow-tooltip :min-width="100" />
      </template>
      <template #right-table-columns>
        <el-table-column label="样本类型代码" align="left" prop="sampleTypeCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="样本类型名称" align="left" prop="sampleTypeName" header-align="center" show-overflow-tooltip :min-width="100" />
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
import { BasePathologySampleTypeOutput } from '/@/api/lims/pathology/datacontract/pathologysampletype-datacontract'
import { BasePathologySampleTypeApi } from '/@/api/lims/pathology/pathologysampletype'
import Transfer from '/@/components/my-transfer/index.vue'

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
    sampleTypeCode: '',
  },
  showDialog: false,
  sureLoading: false,
  selectedSampleTypes: [] as BasePathologySampleTypeOutput[],
  pageInfo: {
    list: [] as any[],
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  timer: 0,
})

const handleSearch = () => {
  new BasePathologySampleTypeApi()
    .getPageWithoutChildren({
      currentPage: 1,
      pageSize: 10,
      filter: {
        sampleTypeCode: state.search.sampleTypeCode,
      },
    })
    .then((res) => {
      console.log('res.data?.list', res.data?.list)
      state.pageInfo.list = res.data?.list ?? []
    })
}
const open = () => {
  state.search.sampleTypeCode = ''
  state.showDialog = true
  state.selectedSampleTypes = []
  handleSearch()
}

const onSelectionChange = (selectItems: []) => {
  state.selectedSampleTypes = selectItems!
}

const onSure = () => {
  state.showDialog = false
  props.onConfirm(state.selectedSampleTypes)
}
const onCancel = () => {
  state.showDialog = false
}
defineExpose({
  open,
})
</script>

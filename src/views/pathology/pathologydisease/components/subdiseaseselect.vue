<template>
  <el-dialog v-model="state.showDialog" :destroy-on-close="true">
    <Transfer
      :title-texts="['待选择', '已选择']"
      min-height="300"
      max-height="600"
      row-key="subDiseaseCode"
      :data="state.pageInfo.list"
      :value="state.selectedSubDiseases"
      :key="state.timer"
      v-show="state.showDialog"
      :selectionChange="onSelectionChange"
    >
      <template #left-header>
        <el-form :inline="true" @submit.stop.prevent size="small">
          <el-form-item>
            <el-input v-model="state.search.subDiseaseCode" placeholder="项目名称" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="ele-Search" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #left-table-columns>
        <el-table-column label="子疾病代码" align="left" prop="subDiseaseCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="子疾病名称" align="left" prop="subDiseaseName" header-align="center" show-overflow-tooltip :min-width="100" />
      </template>
      <template #right-table-columns>
        <el-table-column label="子疾病代码" align="left" prop="subDiseaseCode" header-align="center" show-overflow-tooltip :min-width="100" />
        <el-table-column label="子疾病名称" align="left" prop="subDiseaseName" header-align="center" show-overflow-tooltip :min-width="100" />
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
import { BasePathologySubDiseaseApi } from '/@/api/lims/pathology/pathologysubdisease'
import { BasePathologySubDiseaseOutput } from '/@/api/lims/pathology/datacontract/pathologysubdisease-datacontract'

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
    subDiseaseCode: '',
  },
  showDialog: false,
  sureLoading: false,
  selectedSubDiseases: [] as BasePathologySubDiseaseOutput[],
  pageInfo: {
    list: [] as any[],
    pageNum: 1,
    pageSize: 10,
    total: 0,
  },
  timer: 0,
})

const handleSearch = () => {
  new BasePathologySubDiseaseApi()
    .getPage({
      currentPage: 1,
      pageSize: 10,
      filter: {
        subDiseaseCode: state.search.subDiseaseCode,
      },
    })
    .then((res) => {
      console.log('res.data?.list', res.data?.list)
      state.pageInfo.list = res.data?.list ?? []
    })
}
const open = () => {
  state.search.subDiseaseCode = ''
  state.showDialog = true
  state.selectedSubDiseases = []
  handleSearch()
}

const onSelectionChange = (selectItems: []) => {
  state.selectedSubDiseases = selectItems!
}

const onSure = () => {
  state.showDialog = false
  props.onConfirm(state.selectedSubDiseases)
}
const onCancel = () => {
  state.showDialog = false
}
defineExpose({
  open,
})
</script>

<template>
  <div class="lims-splib-blood-container">
    <el-container class="w100 h100">
      <el-header class="header-bar" style="background-color: lightblue">
        <el-select v-model="state.status" style="width: 150px; display: block" @change="statusChange">
          <el-option key="0" label="未分血" value="0"></el-option>
          <el-option key="1" label="已分血" value="1"></el-option>
        </el-select>
        <el-date-picker
          v-model="state.queryDateRange"
          v-if="state.status == '1'"
          type="daterange"
          size="default"
          range-separator="-"
          style="max-width: 250px; width: 200px"
          start-placeholder="起始日期"
          end-placeholder="截止日期"
        />
        <el-input
          ref="barcodeInput"
          v-model="state.barcode"
          @keyup.enter="splitBlood('')"
          placeholder="请输入条码"
          clearable
          size="default"
          class="barcode-input"
        />
        <el-button type="primary" size="default" v-if="state.status == '1'" @click="onQuery" class="operation-btn">查询</el-button>
        <el-button type="primary" size="default" class="operation-btn">打印标签</el-button>
      </el-header>
      <el-container class="w100" style="height: calc(100% - 70px)">
        <el-splitter>
          <el-splitter-panel size="35%" style="min-width: 250px">
            <el-aside class="splitblood-panel w100 h100">
              <MyTable
                :show-paging="true"
                :data="state.splitBloodList"
                class="table"
                border
                :show-toolbox="false"
                highlight-current-row
                @current-change="currentChange"
                table-name="splitblood"
                :total="state.total"
                v-on:pageOrSizeChange="onTablePageOrSizeChange"
                :loading="state.loading"
                stripe
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="barcode" label="条码" show-overflow-tooltip width="140" />
                <el-table-column prop="purCodes" label="目的代码" show-overflow-tooltip width="120" resizable />
                <el-table-column prop="purNames" label="目的名称" show-overflow-tooltip width="120" resizable />
                <el-table-column prop="sampleTypeName" label="标本类型" show-overflow-tooltip width="120" resizable />
              </MyTable>
            </el-aside>
          </el-splitter-panel>
          <el-splitter-panel :min="200">
            <el-container class="w100 h100">
              <el-main class="main-panel" style="height: 100%">
                <el-table :data="state.splitBloodDetailList" class="table" :loading="state.loading" border>
                  <el-table-column prop="barcode" label="条码" show-overflow-tooltip width="140" />
                  <el-table-column prop="groupName" label="组别" show-overflow-tooltip width="120" resizable />
                  <el-table-column prop="purCodes" label="目的代码" show-overflow-tooltip width="120" resizable />
                  <el-table-column prop="purNames" label="目的名称" show-overflow-tooltip width="120" resizable />
                  <el-table-column prop="sampleTypeName" label="标本类型" show-overflow-tooltip width="120" resizable />
                  <!-- <el-table-column prop="entrustHospitalCode" label="委托医院代码" show-overflow-tooltip width="120" resizable /> -->
                  <el-table-column prop="entrustHospitalName" label="委托医院名称" show-overflow-tooltip width="120" resizable />
                </el-table>
              </el-main>
            </el-container>
          </el-splitter-panel>
        </el-splitter>
      </el-container>
    </el-container>

    <el-dialog v-model="state.selectSampleTypeDialogShow" destroy-on-close title="请选择要分拣的标本类型">
      <MySelectTable ref="mySelectTable" :data="state.tableDataSampleType" :mutil-select="false" style="width: 100%">
        <el-table-column prop="code" label="类型名称" show-overflow-tooltip resizable />
        <el-table-column prop="name" label="类型代码" show-overflow-tooltip resizable />
      </MySelectTable>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.selectSampleTypeDialogShow = false">取消</el-button>
          <el-button type="primary" @click="confirmSelectSampleType">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="/pretreatment/splitblood">
import { reactive, ref, onMounted } from 'vue'
import modal from '/@/globalProperties/modal'
import MySelectTable from '/@/components/my-select-table/index.vue'
import MyTable from '/@/components/my-table/index.vue'
import { CodeNameOutput } from '/@/api/admin/data-contracts'
import { SplitBloodApi } from '/@/api/lims/pretreatment/splitblood'
import {
  PretreatSortSplitBloodDetailOutput,
  PretreatSortSplitBloodOutput,
  PretreatSortSplitBloodQueryListInput,
} from '/@/api/lims/pretreatment/datacontract/splitblood-datacontract'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { getTodayEnd, getTodayStart } from '/@/utils/formatTime'

const barcodeInput = ref()
const mySelectTable = ref()

const state = reactive({
  loading: false,
  barcode: '',
  status: '0',
  total: 0,
  selectSampleTypeDialogShow: false,
  sampleTypeCode: '',
  splitBloodList: [] as PretreatSortSplitBloodOutput[],
  splitBloodDetailList: [] as PretreatSortSplitBloodDetailOutput[],
  tableDataSampleType: [] as CodeNameOutput[],
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<PretreatSortSplitBloodQueryListInput>,
  queryDateRange: [] as Date[],
})

onMounted(async () => {
  state.queryDateRange[0] = new Date()
  state.queryDateRange[1] = new Date()
})

const statusChange = (value: number) => {
  state.splitBloodList = []
  state.splitBloodDetailList = []
}
const confirmSelectSampleType = () => {
  var selectList = mySelectTable.value.getSelectionRows()
  if (selectList.length > 0) {
    let code = selectList[0].code
    state.selectSampleTypeDialogShow = false
    splitBlood(code)
  }
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  if (state.status == '0') {
    state.pageInput.currentPage = page.currentPage
    state.pageInput.pageSize = page.pageSize
    await onQuery()
  }
}
const currentChange = (row: PretreatSortSplitBloodOutput) => {
  if (row != null && row?.id > 0) {
    onQueryDetail(row.id)
  }
}
const onQueryDetail = (masterId: number) => {
  new SplitBloodApi().getDetail({ id: masterId }, { showErrorMessage: true }).then((res) => {
    if (res.success) {
      state.splitBloodDetailList = res?.data ?? []
    }
  })
}
const onQuery = async () => {
  if (!state.queryDateRange && !state.barcode) {
    modal.msgError('请选择查询时间或输入条码！')
    return
  }
  state.loading = true
  state.pageInput.filter!.barcode = state.barcode
  state.pageInput.filter!.beginDate = state.queryDateRange[0]
  state.pageInput.filter!.endDate = state.queryDateRange[1]

  new SplitBloodApi().getPage(state.pageInput, { showErrorMessage: true }).then((res) => {
    if (res.success) {
      state.splitBloodList = res?.data?.list ?? []
      if (state.splitBloodList != null && state.splitBloodList.length > 0) {
        onQueryDetail(state.splitBloodList[0].id)
      } else {
        state.splitBloodDetailList = []
        modal.msgWarning('没有查询到数据！')
      }
      state.total = res?.data?.total ?? 0
      state.loading = false
    }
  })
}
const splitBlood = (sampleType: string) => {
  try {
    if (state.status == '0') {
      if (!state.barcode) {
        modal.msgError('请输入条码！')
        return
      }
      if (state.barcode.length != 12) {
        modal.msgError('条码位数有误')
        return
      }

      if (!sampleType) {
        sampleType = state.sampleTypeCode
      }

      new SplitBloodApi().splitBlood({ barcode: state.barcode, sampleTypeCode: sampleType }, { showErrorMessage: true }).then((res) => {
        if (res.success) {
          if (res.data?.status == 0) {
            state.tableDataSampleType = res.data?.sampleTypeList
            state.selectSampleTypeDialogShow = true
          } else {
            state.splitBloodList = res.data!.splitBlood
            state.splitBloodDetailList = res.data!.splitBloodDetail
          }
        }
      })
    } else {
      onQuery()
    }
  } finally {
    barcodeInput.value.select()
  }
}

// 状态格式化
const statusFormatter = (row: any) => {
  return row.sampleStatus === '已分拣' ? '<span class="status-tag sorted">已分拣</span>' : '<span class="status-tag pending">未分拣</span>'
}
</script>

<style scoped lang="scss">
.lims-splib-blood-container {
  padding: 16px;
  background-color: #f5f7fa;
  height: 100%;
  box-sizing: border-box;
}
.layout-container {
  height: 100%;
  width: 100%;
}
/* 顶部操作栏样式 */
.header-bar {
  margin-bottom: 15px;
  background-color: #fff;
  // padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.barcode-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  // margin-left: 16px;
}
.codetype-select {
  width: 130px;
}
.barcode-input {
  width: 180px;
}
/* 左侧样本信息面板 - 占比约20% */
.splitblood-panel {
}

.el-form-item {
  margin-bottom: 12px;
}

.el-form-item__label {
  font-weight: 500;
  color: #4e5969;
}
.main-panel {
  // background-color: lightcyan;
}
.table {
  height: 100%;
  width: 100%;
  flex: 1;
}
</style>

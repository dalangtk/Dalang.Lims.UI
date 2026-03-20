<template>
  <div class="lims-handover-container">
    <el-container class="w100 h100">
      <el-header class="header-bar" style="background-color: lightblue">
        <el-select v-model="state.status" style="width: 150px; display: block" @change="groupChange">
          <el-option key="0" label="未交接" value="0"></el-option>
          <el-option key="1" label="已交接" value="1"></el-option>
        </el-select>
        <el-select v-model="state.groupCode" style="width: 150px; display: block" @change="groupChange">
          <el-option v-for="g in state.groupList" :key="g.groupCode" :label="g.groupName" :value="g.groupCode"></el-option>
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
          @keyup.enter="queryTask('')"
          placeholder="请输入条码"
          clearable
          size="default"
          class="barcode-input"
        />
        <el-button type="primary" size="default" v-if="state.status == '0'" @click="handover" class="operation-btn">交接</el-button>
        <el-button type="primary" size="default" v-if="state.status == '1'" @click="onQuery" class="operation-btn">查询</el-button>
        <el-button type="primary" size="default" v-if="state.status == '1'" @click="printList" class="operation-btn">清单</el-button>
        <el-button type="primary" size="default" v-if="state.status == '1'" class="operation-btn">打印标签</el-button>
      </el-header>
      <el-container class="w100" style="height: calc(100% - 70px)">
        <el-splitter>
          <el-splitter-panel size="15%" style="min-width: 250px" v-if="state.status == '1'">
            <el-aside class="w100 h100">
              <MyTable
                :show-paging="false"
                :data="state.batchNoList"
                class="table"
                border
                :show-toolbox="false"
                highlight-current-row
                @current-change="batchNoChange"
                table-name="splitblood"
                :loading="state.loading"
                stripe
              >
                <el-table-column prop="batchNo" label="批次" show-overflow-tooltip width="140" />
                <el-table-column prop="handoverName" label="交接人" show-overflow-tooltip width="100" resizable />
                <el-table-column prop="handoverTime" label="交接时间" show-overflow-tooltip width="120" resizable :formatter="formatterDateTime" />
                <el-table-column prop="total" label="数量" show-overflow-tooltip width="80" resizable />
              </MyTable>
            </el-aside>
          </el-splitter-panel>
          <el-splitter-panel size="70%" style="min-width: 250px">
            <el-aside class="w100 h100">
              <MyTable
                :show-paging="false"
                :data="state.taskList"
                ref="taskTable"
                class="table"
                border
                :show-toolbox="false"
                highlight-current-row
                @current-change="currentChange"
                table-name="task"
                :loading="state.loading"
                stripe
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="barcode" label="条码" show-overflow-tooltip width="140" />
                <el-table-column prop="sampleNo" label="流水号" show-overflow-tooltip width="140" />
                <el-table-column prop="purCodes" label="目的代码" show-overflow-tooltip width="120" resizable />
                <el-table-column prop="purNames" label="目的名称" show-overflow-tooltip width="120" resizable />
                <el-table-column prop="estimatedTestDate" label="检测日期" show-overflow-tooltip width="120" resizable :formatter="formatterDate" />
                <el-table-column prop="sampleTypeName" label="标本类型" show-overflow-tooltip width="120" resizable />
                <el-table-column prop="entrustHospitalName" label="委托医院" show-overflow-tooltip width="120" resizable />
              </MyTable>
            </el-aside>
          </el-splitter-panel>
          <el-splitter-panel size="25%" :min="200" v-if="state.status == '0'">
            <el-container class="w100 h100">
              <el-aside class="w100 h100">
                <MyTable
                  :show-paging="false"
                  :data="state.purposeList"
                  class="table"
                  border
                  :show-toolbox="false"
                  highlight-current-row
                  table-name="splitblood"
                  :loading="state.loading"
                  stripe
                >
                  <el-table-column prop="purCode" label="目的代码" show-overflow-tooltip width="120" resizable />
                  <el-table-column prop="purName" label="目的名称" show-overflow-tooltip width="120" resizable />
                  <el-table-column prop="sampleTypeName" label="标本类型" show-overflow-tooltip width="120" resizable />
                </MyTable>
              </el-aside>
            </el-container>
          </el-splitter-panel>
        </el-splitter>
      </el-container>
    </el-container>

    <el-dialog v-model="state.selectSampleTypeDialogShow" destroy-on-close title="请选择要交接的标本类型">
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

    <ReportDialog :reportTemplate="state.reportTemplate" :reportData="state.reportData" ref="reportDialogRef"></ReportDialog>
  </div>
</template>

<script setup lang="ts" name="/pretreatment/handover">
import { onMounted, reactive, ref } from 'vue'
import { CodeNameOutput } from '/@/api/admin/data-contracts'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import { QueryHandoverBatchNoOutput } from '/@/api/lims/pretreatment/datacontract/handover-datacontract'
import { ExamTaskApi } from '/@/api/lims/pretreatment/examtask'
import { ReportTemplateOutput } from '/@/api/lims/reporttemplate/datacontract/reporttemplate-datacontract'
import { ReportTemplateApi } from '/@/api/lims/reporttemplate/reporttemplate'
import { ApplyPurposeOutput } from '/@/api/lims/shared/datacontract/applypurpose-datacontract'
import { ExamTaskOutput, ExamTaskQueryListInput } from '/@/api/lims/shared/datacontract/examtask-datacontract'
import ReportDialog from '/@/components/my-report/reportdialog.vue'
import MySelectTable from '/@/components/my-select-table/index.vue'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { formatDate, parseDate } from '/@/utils/formatTime'

const taskTable = ref()
const barcodeInput = ref()
const mySelectTable = ref()
const reportDialogRef = ref()

const state = reactive({
  reportTemplate: {} as ReportTemplateOutput,
  reportData: [],
  loading: false,
  groupList: [] as BaseGroupOutput[],
  barcode: '',
  status: '0',
  groupCode: '',
  selectSampleTypeDialogShow: false,
  sampleTypeCode: '',
  taskList: [] as ExamTaskOutput[],
  purposeList: [] as ApplyPurposeOutput[],
  batchNoList: [] as QueryHandoverBatchNoOutput[],
  tableDataSampleType: [] as CodeNameOutput[],
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<ExamTaskQueryListInput>,
  queryDateRange: [] as Date[],
})

onMounted(async () => {
  await new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.groupList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
  state.queryDateRange[0] = new Date()
  state.queryDateRange[1] = new Date()
})
const formatterDate = (row: any, column: any, cellValue: any, index: number) => {
  return formatDate(parseDate(cellValue), 'YYYY-mm-dd')
}
const formatterDateTime = (row: any, column: any, cellValue: any, index: number) => {
  console.log(cellValue)
  return formatDate(parseDate(cellValue), 'YYYY-mm-dd HH:MM:SS')
}
const groupChange = (value: String) => {
  state.taskList = []
  state.batchNoList = []
  state.purposeList = []
}
const confirmSelectSampleType = () => {
  var selectList = mySelectTable.value.getSelectionRows()
  if (selectList.length > 0) {
    let code = selectList[0].code
    state.selectSampleTypeDialogShow = false
    queryTask(code)
  }
}

const handover = () => {
  var selectList = taskTable.value.getSelectionRows()
  if (!selectList || selectList.length == 0) {
    modal.msgError('请选择要交接的标本！')
    return
  }

  new ExamTaskApi().handover({ taskIds: selectList.map((item: ExamTaskOutput) => item.id) }, { showErrorMessage: true }).then((res) => {
    if (res.success) {
      modal.msgSuccess('操作成功！')
      state.taskList = []
      state.purposeList = []
    } else {
      modal.msgError('交接失败')
    }
  })
}

const batchNoChange = (value: QueryHandoverBatchNoOutput) => {
  if (value) onQueryDetail(value.batchNo)
}
const currentChange = (row: ExamTaskOutput) => {
  // if (row != null && row?.id > 0) {
  //   onQueryDetail(row.id)
  // }
}
const onQueryDetail = (masterId: number) => {
  new ExamTaskApi().getDetail({ batchNo: masterId }, { showErrorMessage: true }).then((res) => {
    if (res.success) {
      state.taskList = res?.data ?? []
    }
  })
}
const onQuery = async () => {
  if (!state.queryDateRange && !state.barcode) {
    modal.msgError('请选择查询时间或输入条码！')
    return
  }
  state.pageInput.filter!.barcode = state.barcode
  state.pageInput.filter!.beginDate = state.queryDateRange[0]
  state.pageInput.filter!.endDate = state.queryDateRange[1]
  var param = {
    groupCode: state.groupCode,
    barcode: state.barcode,
    beginDate: state.queryDateRange[0],
    endDate: state.queryDateRange[1],
    status: Number(state.status),
    sampleTypeCode: state.sampleTypeCode,
  } as ExamTaskQueryListInput

  new ExamTaskApi().getBatchList(param, { loading: true, showErrorMessage: true }).then((res) => {
    if (res.success) {
      state.batchNoList = res?.data?.outputList ?? []
      if (state.batchNoList.length > 0) {
        onQueryDetail(state.batchNoList[0].batchNo)
      }
    }
  })
}
const queryTask = (sampleType: string) => {
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

      var param = {
        status: Number(state.status),
        groupCode: state.groupCode,
        barcode: state.barcode,
        beginDate: state.queryDateRange[0],
        sendDate: state.queryDateRange[1],
        sampleTypeCode: sampleType,
      } as ExamTaskQueryListInput

      new ExamTaskApi().getTask(param, { showErrorMessage: true }).then((res) => {
        if (res.success) {
          if (res.data?.status == 1) {
            let tmpTask = res.data?.outputList
            if (tmpTask != null && tmpTask.length > 0) {
              for (let index = 0; index < tmpTask.length; index++) {
                const element = tmpTask[index]
                if (state.taskList.findIndex((item) => item.id == element.id) < 0) {
                  state.taskList.push(element)
                }
              }
            }
          } else if (res.data?.status == 0) {
            state.selectSampleTypeDialogShow = true
            state.tableDataSampleType = res.data?.sampleTypeList
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
const printList = () => {
  var selectList = taskTable.value.getSelectionRows()
  if (!selectList || selectList.length == 0) {
    modal.msgError('请选择要打印的列表！')
    return
  }

  console.log(selectList)

  new ReportTemplateApi().getByCode({ templateCode: 'Handover' }).then((res) => {
    //ReportTemplateOutput
    state.reportTemplate = res.data!
    state.reportData = selectList
    console.log('templateContent', res.data!.templateContent)
    reportDialogRef.value.open()
  })
}
// 状态格式化
const statusFormatter = (row: any) => {
  return row.sampleStatus === '已分拣' ? '<span class="status-tag sorted">已分拣</span>' : '<span class="status-tag pending">未分拣</span>'
}
</script>

<style scoped lang="scss">
.lims-handover-container {
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

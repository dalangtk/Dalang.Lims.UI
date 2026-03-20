<template>
  <div class="my-layout lims-report-query-container">
    <div class="main-content">
      <!-- 查询条件区域 -->
      <el-card class="query-card" shadow="hover">
        <el-form ref="queryFormRef" :model="queryForm" size="small" label-width="80px" label-position="left" class="query-form">
          <el-row :gutter="3">
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="客户名称" prop="customer">
                <el-select
                  v-model="queryForm.customer"
                  placeholder="请选择客户"
                  class="full-width"
                  clearable
                  filterable
                  remote
                  :remote-method="queryCustomer"
                >
                  <el-option v-for="item in state.customerOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="样本条码" prop="barcode">
                <el-input v-model="queryForm.barcode" placeholder="请输入样本条码" clearable class="full-width" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="姓名" prop="patientName">
                <el-input v-model="queryForm.patientName" placeholder="请输入客户姓名" clearable class="full-width" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="8" :lg="6">
              <el-form-item label="报告状态" prop="status">
                <el-select v-model="queryForm.status" placeholder="请选择状态" clearable class="full-width">
                  <el-option label="已审核" value="approved" />
                  <el-option label="待审核" value="pending" />
                  <el-option label="已发布" value="published" />
                  <el-option label="已作废" value="cancelled" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="8" :lg="6">
              <el-form-item label="日期类型" prop="timeType">
                <el-select v-model="queryForm.timeType" placeholder="请选择" clearable class="full-width">
                  <el-option label="报告时间" value="0" />
                  <el-option label="接收时间" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="6">
              <el-form-item label="报告日期" prop="reportDateRange">
                <el-date-picker
                  v-model="queryForm.reportDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  class="full-width"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item label="检验目的" prop="testItem">
                <el-select
                  v-model="queryForm.testItem"
                  placeholder="请选择检验目的"
                  clearable
                  filterable
                  class="full-width"
                  remote
                  :remote-method="queryPurpose"
                >
                  <el-option v-for="item in state.testItemOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="6">
              <el-form-item>
                <el-button :icon="Search" type="primary" @click="handleQuery" :loading="state.queryLoading"> 查询 </el-button>
                <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
                <!-- <el-button :icon="Download" type="success" @click="handleExport" :disabled="false"> 导出数据 </el-button> -->
                <el-button :icon="Printer" @click="handlePrint" :disabled="state.tableData.length === 0"> 打印 </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 查询结果区域 -->
      <div class="report-list">
        <MyTable
          :data="state.tableData"
          v-loading="state.queryLoading"
          class="my-table"
          ref="table"
          stripe
          highlight-current-row
          border
          :show-toolbox="false"
          :show-paging="true"
          v-on:pageOrSizeChange="onTablePageOrSizeChange"
          :row-class-name="tableRowClassName"
          @row-click="refreshReportDetail"
          :total="state.total"
          @row-dblclick="handleRowClick"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="barcode" label="样本条码" width="140" sortable>
            <template #default="scope">
              <el-tag type="primary" size="small">{{ scope.row.barcode }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="customerName" label="客户名称" width="150" sortable />
          <el-table-column prop="patientName" label="姓名" width="120" />
          <el-table-column prop="purNames" label="检验项目" width="180" />
          <el-table-column prop="secondAuditTime" label="报告日期" width="120" sortable>
            <template #default="scope">
              <span class="date-cell">{{ formatDatetime(scope.row.secondAuditTime) }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="sampleStatusName" label="状态" width="100">
            <template #default="scope">
              <el-tag :color="GetStatusColor(SampleStatusUtils.getSampleStatus(scope.row?.sampleStatus))" effect="plain" size="large">
                {{ scope.row.sampleStatusName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="secondAuditName" label="审核人" width="120" />

          <!-- <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" :icon="View" @click.stop="handleViewReport(scope.row)"> 查看 </el-button>
            </template>
          </el-table-column> -->
        </MyTable>

        <el-collapse v-model="state.actived" expand-icon-position="left" accordion @change="moreTabVisableChange">
          <el-collapse-item title="更多" name="1" style="height: 100%; overflow-y: hidden">
            <div class="more-tab">
              <div class="w50">
                <el-table class="detail-table" :data="state.currResultList">
                  <el-table-column prop="itemCode" label="项目代码"></el-table-column>
                  <el-table-column prop="itemName" label="项目名称"></el-table-column>
                  <el-table-column prop="itemResult" label="项目结果"></el-table-column>
                  <el-table-column prop="displayReference" label="参考范围"></el-table-column>
                </el-table>
              </div>
              <div class="w50">
                <el-table class="detail-table" :data="state.currTrackList">
                  <el-table-column prop="trackContent" label="内容"></el-table-column>
                  <el-table-column prop="proTime" label="时间"></el-table-column>
                  <el-table-column prop="proName" label="操作人"></el-table-column>
                </el-table>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 报告详情对话框 -->
      <el-dialog v-model="state.dialogVisible" :title="`检验报告详情 - ${state.currentReport?.barcode || ''}`" width="80%" destroy-on-close>
        <!-- <report-detail :report="currentReport" v-if="currentReport" /> -->
        <div style="height: 70vh">
          <!-- <iframe :src="state.previewUrl" style="height: 100%; width: 100%"></iframe> -->
          <embed :src="state.previewUrl" type="application/pdf" width="100%" height="98%" />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.dialogVisible = false">关闭</el-button>
            <!-- <el-button type="primary" @click="handlePrintReport"> 打印报告 </el-button> -->
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts" name="/statistics/reportquery">
import { Download, Printer, Refresh, Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { LabelValueOutput } from '/@/api/admin/data-contracts'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { SampleTestApi } from '/@/api/lims/exam/sampletest'
import { ExamResultOutput } from '/@/api/lims/shared/datacontract/examresult-datacontract'
import { ExamSampleTrackOutput } from '/@/api/lims/shared/datacontract/sampletrack-datacontract'
import { GetStatusColor, SampleStatus, SampleStatusUtils } from '/@/api/lims/shared/enums/samplestatusenum'
import { BaseOptionsApi } from '/@/api/lims/shared/options'
import { SampleTrackApi } from '/@/api/lims/shared/sampletrack'
import { ReportQureryInput, ReportQureryOutput } from '/@/api/lims/statistics/datacontract/reportquery-datacontract'
import { ReportQueryApi } from '/@/api/lims/statistics/reportquery'
import MyTable from '/@/components/my-table/index.vue'
import { formatDate, formatDatetime, parseDate, subtractDays } from '/@/utils/formatTime'
import modal from '/@/globalProperties/modal'

// 查询表单数据
const queryForm = reactive({
  customer: '',
  patientName: '',
  barcode: '',
  reportDateRange: [] as string[],
  timeType: '0',
  status: '',
  testItem: '',
  paperType: '',
})

// 查询表单引用
const queryFormRef = ref()
const table = ref()

onMounted(() => {
  let curr = new Date()
  let lastDate = subtractDays(curr, 1)
  queryForm.reportDateRange = [formatDate(lastDate, 'YYYY-mm-dd'), formatDate(curr, 'YYYY-mm-dd')]
})

const state = reactive({
  customerOptions: [] as LabelValueOutput[],
  testItemOptions: [] as LabelValueOutput[],
  tableData: [] as ReportQureryOutput[],
  currentReport: {} as ReportQureryOutput,
  queryLoading: false,
  dialogVisible: false,
  paperTypeList: [
    { label: 'A4', value: 'A4' },
    { label: 'A5', value: 'A5' },
  ] as LabelValueOutput[],
  actived: '0',
  total: 0,
  currResultList: [] as ExamResultOutput[],
  currTrackList: [] as ExamSampleTrackOutput[],
  previewUrl: '',
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {} as ReportQureryInput,
  } as GetPageInput<ReportQureryInput>,
})

// 更新时间
const updateTime = ref('')
// 初始化数据

const queryCustomer = (input: string) => {
  if (!input) return
  let param = {
    currentPage: 1,
    pageSize: 20,
    filter: input,
  } as GetPageInput<string>
  new BaseOptionsApi().getCustomerOptions(param).then((res) => {
    state.customerOptions = res.data!
  })
}
const queryPurpose = (input: string) => {
  if (!input) return
  let param = {
    currentPage: 1,
    pageSize: 20,
    filter: input,
  } as GetPageInput<string>
  new BaseOptionsApi().getPurposeOptions(param).then((res) => {
    state.testItemOptions = res.data!
  })
}
const moreTabVisableChange = () => {
  console.log('moreTabVisableChange')
}
const refreshReportDetail = (currentReport: ReportQureryOutput) => {
  if (
    currentReport.sampleStatus == SampleStatus.SecondCheck ||
    currentReport.sampleStatus == SampleStatus.Reported ||
    currentReport.sampleStatus == SampleStatus.Printed
  ) {
    getItemResult(currentReport)
  } else {
    state.currResultList = []
  }
  getSampleTrack(currentReport)
}
const getItemResult = (info: ReportQureryOutput) => {
  new SampleTestApi().getResultList({ examInfoId: info.id }).then((res) => {
    state.currResultList = res.data!
  })
}
const getSampleTrack = (info: ReportQureryOutput) => {
  new SampleTrackApi().getTrackList({ barcode: info.barcode! }).then((res) => {
    state.currTrackList = res.data!
  })
}
const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await handleQuery()
}
// 查询处理
const handleQuery = () => {
  state.queryLoading = true

  var param = {
    patientName: queryForm.patientName,
    customer: queryForm.customer,
    barcode: queryForm.barcode,
    begin: parseDate(queryForm.reportDateRange[0]),
    end: parseDate(queryForm.reportDateRange[1]),
    logisticsRoute: '',
    purCodes: '',
    paperType: queryForm.paperType,
  } as ReportQureryInput

  var input = {
    currentPage: state.pageInput.currentPage,
    pageSize: state.pageInput.pageSize,
    filter: param,
  } as GetPageInput<ReportQureryInput>
  new ReportQueryApi().queryReport(input).then((res) => {
    if (res?.success) {
      state.total = res.data!.total
      state.tableData = res.data!.list!
      state.queryLoading = false
    }
  })

  // 模拟查询延迟
  // setTimeout(() => {
  //   updateTime.value = getCurrentTime()
  //   queryLoading.value = false

  //   // 这里应该是实际的后端查询逻辑
  //   // 现在只是演示，所以显示所有数据
  //   ElMessage.success(`查询完成，共找到 ${tableData.value.length} 条记录`)
  // }, 800)
}

// 重置查询条件
const handleReset = () => {
  queryFormRef.value.resetFields()
  state.pageInput.currentPage = 1
  state.pageInput.pageSize = 20
  handleQuery()
}

// 导出数据
const handleExport = () => {
  ElMessageBox.confirm('确认导出查询结果数据吗？', '导出确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 模拟导出操作
    state.queryLoading = true
    setTimeout(() => {
      state.queryLoading = false
      ElMessage.success('数据导出成功！')
    }, 1000)
  })
}

// 打印预览
const handlePrint = () => {
  let selList = table.value.getSelectionRows()
  if (selList.length <= 0) {
    return
  } else if (selList.length > 1) {
    modal.msgWarning('合并打印功能待开发...')
  } else {
    if (selList[0].sampleStatus == SampleStatus.Reported || selList[0].sampleStatus == SampleStatus.Printed) {
      handleRowClick(selList[0])
      new ReportQueryApi().printReport({ examId: selList[0].id }).then((res) => {})
      selList[0].sampleStatus = SampleStatus.Printed
      selList[0].sampleStatusName = SampleStatusUtils.getDescription(SampleStatus.Printed)
    } else {
      modal.msgWarning('报告未生成...')
    }
  }
}

// 表格行点击
const handleRowClick = (row: ReportQureryOutput) => {
  state.currentReport = row
  state.previewUrl = row.reportUrl!
  state.dialogVisible = true
}

// 表格行类名
const tableRowClassName = (row: ReportQureryOutput) => {
  if (row.sampleStatus === SampleStatus.ReportCancel) {
    return 'cancelled-row'
  } else if (row.sampleStatus === SampleStatus.ReportDelay) {
    return 'pending-row'
  }
  return ''
}
</script>

<style scoped>
.lims-report-query-container {
  min-height: 100%;
  background-color: #f5f7fa;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.app-header {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: white;
  padding: 20px 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
}

.app-header h1 i {
  margin-right: 10px;
  font-size: 28px;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.main-content {
  height: 100%;
}

.query-card {
  border-radius: 8px;
  :deep(.el-card__body) {
    padding-bottom: 0px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.card-header i {
  margin-right: 8px;
}

.query-form {
  margin-top: 10px;
}

.full-width {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.result-card {
  border-radius: 8px;
}

.result-summary {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.highlight {
  color: #409eff;
  font-weight: bold;
  margin: 0 4px;
}

.ml-10 {
  margin-left: 10px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.date-cell {
  color: #666;
  font-size: 14px;
}

.result-cell {
  display: flex;
  align-items: center;
}

.result-normal {
  color: #67c23a;
  font-weight: 600;
}

.result-abnormal {
  color: #f56c6c;
  font-weight: 600;
}

.result-unit {
  color: #909399;
  font-size: 12px;
  margin-left: 4px;
}

.cancelled-row {
  opacity: 0.6;
  background-color: #fef0f0 !important;
}

.cancelled-row:hover > td {
  background-color: #fde2e2 !important;
}

.pending-row {
  background-color: #fdf6ec !important;
}

.pending-row:hover > td {
  background-color: #faecd8 !important;
}

.app-footer {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
  border-top: 1px solid #e4e7ed;
  margin-top: 30px;
}

.footer-tip {
  font-size: 12px;
  margin-top: 8px;
  color: #c0c4cc;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .app-header {
    padding: 15px 20px;
  }

  .app-header h1 {
    font-size: 20px;
  }

  .form-actions {
    flex-wrap: wrap;
  }

  .result-summary {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
  }

  .ml-10 {
    margin-left: 0;
    margin-top: 5px;
  }
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.report-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.my-table {
  height: 100%;
  width: 100%;
  flex: 1;
  overflow: scroll;
}
.more-tab {
  height: 200px;
  display: flex;
  flex-direction: row;
}
.w50 {
  width: 50%;
}
.detail-table {
  height: 100%;
  width: 100%;
  flex: 1;
  overflow: scroll;
}
</style>

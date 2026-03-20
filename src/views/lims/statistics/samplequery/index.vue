<template>
  <div class="my-layout container">
    <div style="display: flex">
      <el-card class="query-card" shadow="hover">
        <el-form ref="queryFormRef" :model="queryForm" size="small" label-width="80px" label-position="left">
          <el-row :gutter="3">
            <el-col :xs="24" :sm="24" :md="8" :lg="8">
              <el-form-item label="接收时间" prop="reportDateRange">
                <el-date-picker
                  v-model="queryForm.reportDateRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  time-format="hh:mm"
                  format="YYYY-MM-DD hh:mm"
                  class="full-width"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8">
              <el-form-item label="样本条码" prop="barcode">
                <el-input v-model="queryForm.barcode" placeholder="请输入样本条码" clearable class="full-width" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8">
              <el-form-item label="姓名" prop="patientName">
                <el-input v-model="queryForm.patientName" placeholder="请输入客户姓名" clearable />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8">
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

            <el-col :xs="24" :sm="12" :md="8" :lg="8">
              <el-form-item label="检验目的" prop="purpose">
                <el-select
                  v-model="queryForm.purpose"
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
                <el-button size="small" :icon="Search" type="primary" @click="handleQuery"> 查询</el-button>
                <el-button size="small" :icon="RefreshRight" type="info" class="ml10" @click="handleQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <splitpanes class="default-theme pane" @resize="paneSize = $event[0].size">
      <pane :size="36">
        <splitpanes :horizontal="true">
          <pane :size="100" style="display: flex">
            <MyTable
              border
              tableName="申请信息"
              class="info-table w100 h100"
              :data="state.applyInfoList"
              ref="applyInfoTable"
              :total="state.total"
              v-on:pageOrSizeChange="onTablePageOrSizeChange"
              :loading="state.loading"
              :show-toolbox="false"
              stripe
              highlight-current-row
              @current-change="onApplyInfoChange"
              row-key="id"
            >
              <el-table-column prop="barcode" label="样本条码" width="140" sortable />
              <el-table-column prop="receiveTime" label="接收时间" width="120" sortable>
                <template #default="scope">
                  <span class="date-cell">{{ formatDatetime(scope.row.receiveTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="customerName" label="客户名称" width="150" sortable />
              <el-table-column prop="patientName" label="姓名" width="120" />
              <el-table-column prop="genderName" label="姓名" width="120" />
              <el-table-column prop="ageDesc" label="姓名" width="120" />
              <el-table-column prop="purCodes" label="项目代码" show-overflow-tooltip width="180" />
              <el-table-column prop="purNames" label="项目名称" show-overflow-tooltip width="180" />
              <el-table-column prop="dataSource" label="数据来源" width="180" />

              <!-- <el-table-column prop="sampleStatusName" label="状态" width="100">
                <template #default="scope">
                  <el-tag :color="GetStatusColor(SampleStatusUtils.getSampleStatus(scope.row?.sampleStatus))" effect="plain" size="large">
                    {{ scope.row.sampleStatusName }}
                  </el-tag>
                </template>
              </el-table-column> -->
            </MyTable>
          </pane>
          <pane :size="100">
            <MyTable
              border
              tableName="检验信息"
              class="w100 h100"
              :data="state.examInfoList"
              ref="examInfoTable"
              :loading="state.loading"
              :show-toolbox="false"
              :show-paging="false"
              stripe
              highlight-current-row
              row-key="id"
            >
              <el-table-column prop="barcode" label="样本条码" width="140" sortable />
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
              <el-table-column fixed="right">
                <template #default="{ row }">
                  <el-button icon="ele-EditPen" size="small" text type="primary" @click="jumpToExam(row)">跳转</el-button>
                </template>
              </el-table-column>
            </MyTable>
          </pane>
        </splitpanes>
      </pane>
      <pane :size="32">
        <MyTable
          border
          tableName="目的信息"
          class="w100 h100"
          :data="state.applyPurposeList"
          ref="applyPurposeTable"
          :loading="state.loading"
          :show-toolbox="false"
          :show-paging="false"
          stripe
          highlight-current-row
          row-key="id"
        >
          <el-table-column prop="groupName" label="组别" />
          <el-table-column prop="purCode" label="目的代码" />
          <el-table-column prop="purName" label="目的名称" />

          <el-table-column prop="sampleStatusName" label="状态">
            <template #default="scope">
              <el-tag :color="GetStatusColor(SampleStatusUtils.getSampleStatus(scope.row?.sampleStatus))" effect="plain" size="large">
                {{ scope.row.sampleStatusName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="addType" label="增退项">
            <template #default="scope">
              <el-tag v-if="scope.row.addType == 1"> 增项 </el-tag>
              <el-tag v-if="scope.row.addType == 2"> 退项 </el-tag>
              <el-tag v-else> 默认 </el-tag>
            </template>
          </el-table-column>
        </MyTable>
      </pane>
    </splitpanes>
  </div>
</template>

<script setup lang="ts" name="/statistics/samplequery">
import { RefreshRight, Search } from '@element-plus/icons-vue'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { reactive, ref, onMounted } from 'vue'
import { LabelValueOutput } from '/@/api/admin/data-contracts'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { ApplyInfoOutput } from '/@/api/lims/shared/datacontract/applyinfo-datacontract'
import { ApplyItemOutput } from '/@/api/lims/shared/datacontract/applyitem-datacontract'
import { ApplyPurposeOutput } from '/@/api/lims/shared/datacontract/applypurpose-datacontract'
import { GetStatusColor, SampleStatusUtils } from '/@/api/lims/shared/enums/samplestatusenum'
import { BaseOptionsApi } from '/@/api/lims/shared/options'
import { SampleQueryInput } from '/@/api/lims/statistics/datacontract/samplequery-datacontract'
import { SampleQueryApi } from '/@/api/lims/statistics/samplequery'
import MyTable from '/@/components/my-table/index.vue'
import { formatDatetime } from '/@/utils/formatTime'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import { BaseUserGroupApi } from '/@/api/lims/basedata/baseusergroup'
import modal from '/@/globalProperties/modal'
import { useRouter } from 'vue-router'

const router = useRouter()

const paneSize = ref(50)
const queryForm = reactive({
  customer: '',
  patientName: '',
  barcode: '',
  reportDateRange: [] as Date[],
  purpose: [],
})

const state = reactive({
  loading: false,
  customerOptions: [] as LabelValueOutput[],
  testItemOptions: [] as LabelValueOutput[],
  applyInfoList: [] as ApplyInfoOutput[],
  total: 0,
  applyPurposeList: [] as ApplyPurposeOutput[],
  applyItemList: [] as ApplyItemOutput[],
  examInfoList: [] as ExamInfoOutput[],
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {} as SampleQueryInput,
  } as GetPageInput<SampleQueryInput>,
})
onMounted(() => {
  const now = new Date()
  const begin = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 59, 59)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 7, 0, 0)
  queryForm.reportDateRange = [end, begin]
})
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
const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await handleQuery()
}
const handleQuery = () => {
  state.pageInput.filter = {
    customerCode: queryForm.customer,
    patientName: queryForm.patientName,
    barcode: queryForm.barcode,
    beginTime: queryForm.reportDateRange[0],
    endTime: queryForm.reportDateRange[1],
    purCodes: queryForm.purpose,
  }

  console.log(state.pageInput)
  // return

  state.loading = true
  new SampleQueryApi().querySample(state.pageInput).then((res) => {
    state.applyInfoList = res.data?.list ?? []
    state.total = res.data?.total ?? 0
    state.loading = false
  })
}

const onApplyInfoChange = (row: ApplyInfoOutput) => {
  console.log(row)
  new SampleQueryApi().getExamList({ barcode: row.barcode }).then((res) => {
    state.examInfoList = res.data ?? []
  })
  new SampleQueryApi().getPurposeList({ barcode: row.barcode }).then((res) => {
    state.applyPurposeList = res.data ?? []
  })
}

const jumpToExam = async (row: ExamInfoOutput) => {
  let checkRet = await new BaseUserGroupApi().checkUserTestPermission({ groupCode: row.groupCode! })
  console.log(checkRet)
  if (!checkRet.success) {
    modal.msgError('无检验权限')
    return
  }
  console.log('row',row)
  router.push({ name: '/sampletest', state: { groupCode: row.groupCode, examId: row.id } })
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.query-card {
  border-radius: 8px;
  :deep(.el-card__body) {
    padding-bottom: 0px;
  }
}
.pane {
  display: flex;
  height: 100%;
  overflow: hidden;
}
.splitpanes__pane {
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;
  font-size: 70px;
  color: var(--el-color-primary-light-5);
  border: 1px solid var(--el-border-color-lighter);
  background-color: white !important;
}
.full-width {
  width: 100%;
}
.info-table {
  flex-grow: 1;
  padding-bottom: 5px;
}
</style>

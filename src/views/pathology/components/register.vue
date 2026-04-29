<template>
  <div class="register-container">
    <div class="register-body">
      <el-splitter direction="horizontal" class="splitter-container">
        <el-splitter-panel :min="250" :max="600" :size="350">
          <div class="splitter-panel">
            <SampleList
              :group-code="state.groupCode"
              :all-sample-status="state.allSampleStatus"
              :all-samples="state.allSamples"
              :filtered-list="state.filteredList"
              :active-id="activeId"
              :query-date-range="state.queryDateRange"
              @update:all-samples="(value) => (state.allSamples = value)"
              @update:filtered-list="(value) => (state.filteredList = value)"
              @update:active-id="(value) => (activeId = value)"
              @switch-sample="switchSample"
              @query-sample-list="querySampleList"
            />
          </div>
        </el-splitter-panel>
        <el-splitter-panel>
          <main class="panel-right">
            <div class="panel-right-top">
              <el-form :inline="true">
                <el-form-item label="条码" prop="barcode">
                  <el-input v-model="form.barcode" placeholder="请输入条码" @keyup.enter="handleBarcodeEnter" clearable />
                </el-form-item>
                <el-form-item label="病理号" prop="sampleNo">
                  <el-input v-model="form.sampleNo" placeholder="请输入病理号" clearable />
                </el-form-item>
              </el-form>
            </div>

            <div class="panel-right-bottom">
              <el-card shadow="never" class="info-card">
                <template #header>
                  <span>基本信息</span>
                </template>
                <el-form :model="basicInfo" label-width="100px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="姓名">
                        <el-input v-model="basicInfo.patientName" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="性别">
                        <el-input v-model="basicInfo.genderName" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="年龄">
                        <el-input v-model="basicInfo.ageDisplay" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="送检单位">
                        <el-input v-model="basicInfo.deptName" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="标本类型">
                        <el-input v-model="basicInfo.sampleTypeName" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="采样日期">
                        <el-input v-model="basicInfo.collectTimeDisplay" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="临床诊断">
                        <el-input v-model="basicInfo.clinicalDiagnosis" type="textarea" :rows="2" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-card>
            </div>
          </main>
        </el-splitter-panel>
      </el-splitter>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import SampleList from '/@/views/lims/exam/sampletest/components/samplelist.vue'
import { SampleStatusUtils } from '/@/api/lims/shared/enums/samplestatusenum'
import { formatDate, formatDatetime, subtractDays } from '/@/utils/formatTime'
import { SampleTestApi } from '/@/api/lims/exam/sampletest'
import { PathologyExamListQueryInput, PathologyReceiveInput } from '/@/api/lims/pathology/datacontract/pathologytest-datacontract'
import { PathologyTestApi } from '/@/api/lims/pathology/pathologytest'

const props = defineProps({
  wfCode: {
    type: String,
    required: true,
  },
})
const state = reactive({
  groupCode: '9999',
  allSamples: [] as ExamInfoOutput[],
  filteredList: [] as ExamInfoOutput[],
  allSampleStatus: [] as Array<{ code: number; name: string }>,
  queryDateRange: [] as any[],
})

const activeId = ref(-1)
const currentSample = ref<ExamInfoOutput | null>(null)

const form = reactive({
  barcode: '',
  sampleNo: '',
})

const basicInfo = reactive({
  patientName: '',
  genderName: '',
  ageDisplay: '',
  deptName: '',
  sampleTypeName: '',
  collectTimeDisplay: '',
  clinicalDiagnosis: '',
})

onMounted(() => {
  state.allSampleStatus = SampleStatusUtils.getAllOptions()

  nextTick(() => {
    let endDate = new Date()
    let startDate = subtractDays(new Date(), 7)
    state.queryDateRange = [formatDate(startDate, 'YYYY-mm-dd'), formatDate(endDate, 'YYYY-mm-dd')]
    // console.log('初始日期范围:', state.queryDateRange)
    querySampleList()
  })
})

const querySampleList = (examId?: number) => {
  console.log('querySampleList')
  const queryParam: any = {
    groupCode: state.groupCode,
    beginDate: state.queryDateRange[0],
    endDate: state.queryDateRange[1],
    wfCode: props.wfCode,
  } as PathologyExamListQueryInput

  if (examId != undefined && examId > 0) {
    queryParam.examInfoId = examId
  }
  console.log('queryParam', queryParam)
  new PathologyTestApi().getPathologySampleList(queryParam, { showErrorMessage: true }).then((res) => {
    if (res.data && res.data.length > 0) {
      res.data.forEach((item) => {
        item.testDate = new Date(item.testDate)
        if (item.collectTime) item.collectTime = new Date(item.collectTime)
      })

      state.allSamples = res.data ?? []
      if (state.allSamples.length > 0) {
        activeId.value = state.allSamples[0].id
        state.filteredList = state.allSamples
        switchSample(state.allSamples[0])
      }
    } else {
      state.allSamples = []
      activeId.value = -1
      state.filteredList = []
      currentSample.value = null
      clearBasicInfo()
    }
  })
}

const switchSample = (row: ExamInfoOutput) => {
  activeId.value = row.id
  currentSample.value = row
  form.barcode = row.barcode || ''
  form.sampleNo = row.sampleNo || ''
  refreshBasicInfo()
}

const handleBarcodeEnter = () => {
  // alert(form.barcode)
  let param = {
    barcode: form.barcode,
    sampleNo: form.sampleNo,
    wfCode: props.wfCode,
  } as PathologyReceiveInput
  new PathologyTestApi().pathologyReceive(param, { showErrorMessage: true }).then((res) => {
    if (res.data) {
      // switchSample(res.data)
      console.log('res.data', res.data)
    }
  })
}

const refreshBasicInfo = () => {
  if (currentSample.value) {
    basicInfo.patientName = currentSample.value.patientName || ''
    basicInfo.genderName = currentSample.value.genderName || ''
    //basicInfo.ageDisplay = `${currentSample.value.age || ''} ${currentSample.value.ageUnitName || ''}`
    //basicInfo.deptName = currentSample.value.deptName || ''
    basicInfo.sampleTypeName = currentSample.value.sampleTypeName || ''
    basicInfo.collectTimeDisplay = currentSample.value.collectTime ? formatDatetime(currentSample.value.collectTime, 'YYYY-MM-DD HH:mm') : ''
    basicInfo.clinicalDiagnosis = currentSample.value.clinicalDiagnosis || ''
  } else {
    clearBasicInfo()
  }
}

const clearBasicInfo = () => {
  basicInfo.patientName = ''
  basicInfo.genderName = ''
  basicInfo.ageDisplay = ''
  basicInfo.deptName = ''
  basicInfo.sampleTypeName = ''
  basicInfo.collectTimeDisplay = ''
  basicInfo.clinicalDiagnosis = ''
}
</script>

<style scoped>
.register-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.register-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.splitter-container {
  height: 100%;
  width: 100%;
}

.splitter-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.splitter-panel :deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.splitter-panel :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
}

.panel-right {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-right-top {
  padding: 12px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.panel-right-bottom {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.info-card {
  height: 100%;
}

.info-card :deep(.el-card__body) {
  height: calc(100% - 60px);
  overflow-y: auto;
}

h1 {
  color: #333;
}
</style>

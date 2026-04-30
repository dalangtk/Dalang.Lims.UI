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
              ref="sampleListRef"
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
                  <div>
                    <span style="font-size: 16px">基本信息</span>
                    <el-button
                      type="primary"
                      link
                      @click="openEditDialog"
                      :disabled="
                        !currentSample ||
                        (currentSample.sampleStatus != SampleStatus.Testing.toString() &&
                          currentSample.sampleStatus != SampleStatus.ReportDelay.toString())
                      "
                    >
                      <el-icon><Edit /></el-icon>
                    </el-button>
                  </div>
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

    <el-dialog v-model="state.editDialogVisible" title="修改患者信息" width="30%">
      <el-form :model="state.editForm" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="state.editForm.patientName" :class="{ 'is-modified': isModified('patientName') }">
            <template #suffix v-if="isModified('patientName')">
              <el-tooltip content="该字段已修改" placement="top">
                <el-icon color="#E6A23C"><EditPen /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="state.editForm.genderCode" :class="{ 'is-modified-border': isModified('genderCode') }">
            <el-radio v-for="gender in state.genderList" :key="gender.code" :label="gender.name" :value="gender.code">{{ gender.name }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="年龄">
          <div style="display: flex">
            <el-input v-model="state.editForm.age1" :class="{ 'is-modified': isModified('age1') }"></el-input>
            <el-select
              v-model="state.editForm.ageUnit1"
              placeholder="单位"
              style="width: 120px; margin-left: 6px"
              :class="{ 'is-modified-border': isModified('ageUnit1') }"
            >
              <el-option v-for="unit in state.ageUnitList" :key="unit.code" :label="unit.name" :value="unit.code"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="年龄2">
          <div style="display: flex">
            <el-input v-model="state.editForm.age2" :class="{ 'is-modified': isModified('age2') }"></el-input>
            <el-select
              v-model="state.editForm.ageUnit2"
              placeholder="单位2"
              style="width: 120px; margin-left: 6px"
              :class="{ 'is-modified-border': isModified('ageUnit2') }"
            >
              <el-option v-for="unit in state.ageUnitList" :key="unit.code" :label="unit.name" :value="unit.code"></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="标本类型">
          <el-select v-model="state.editForm.sampleTypeCode" placeholder="标本类型" :class="{ 'is-modified-border': isModified('sampleTypeCode') }">
            <el-option v-for="t in state.sampleTypeList" :key="t.sampleTypeCode" :label="t.sampleTypeName" :value="t.sampleTypeCode"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标本性状">
          <el-select
            v-model="state.editForm.samplePropertyCode"
            placeholder="标本性状"
            :class="{ 'is-modified-border': isModified('samplePropertyCode') }"
          >
            <el-option v-for="t in state.samplePropertyList" :key="t.code" :label="t.name" :value="t.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="科室">
          <el-input v-model="state.editForm.department" :class="{ 'is-modified': isModified('department') }"> </el-input>
        </el-form-item>
        <el-form-item label="医生">
          <el-input v-model="state.editForm.doctor" :class="{ 'is-modified': isModified('doctor') }"> </el-input>
        </el-form-item>
        <el-form-item label="床号">
          <el-input v-model="state.editForm.bedNo" :class="{ 'is-modified': isModified('bedNo') }"> </el-input>
        </el-form-item>
        <el-form-item label="病员号">
          <el-input v-model="state.editForm.patientId" :class="{ 'is-modified': isModified('patientId') }"> </el-input>
        </el-form-item>
        <el-form-item label="客户条码">
          <el-input v-model="state.editForm.customerBarcode" :class="{ 'is-modified': isModified('customerBarcode') }"> </el-input>
        </el-form-item>

        <el-form-item label="采样时间">
          <div :class="{ 'is-modified-border': isModified('collectTime') }">
            <el-date-picker
              v-model="state.editForm.collectTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY-MM-DD HH:mm:ss"
              :class="{ 'is-modified-border': isModified('collectTime') }"
            />
          </div>
        </el-form-item>
        <el-form-item label="接收时间">
          <div :class="{ 'is-modified-border': isModified('receiveTime') }">
            <el-date-picker
              v-model="state.editForm.receiveTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY-MM-DD HH:mm:ss"
              :class="{ 'is-modified-border': isModified('receiveTime') }"
            />
          </div>
        </el-form-item>

        <el-form-item label="诊断">
          <el-input
            v-model="state.editForm.clinicalDiagnosis"
            type="textarea"
            :rows="2"
            :class="{ 'is-modified': isModified('clinicalDiagnosis') }"
          />
        </el-form-item>
        <el-form-item label="结果说明">
          <el-input
            v-model="state.editForm.resultDescription"
            type="textarea"
            :rows="2"
            :class="{ 'is-modified': isModified('resultDescription') }"
          />
        </el-form-item>
        <el-form-item label="建议解释">
          <el-input v-model="state.editForm.suggestion" type="textarea" :rows="2" :class="{ 'is-modified': isModified('suggestion') }" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="state.editForm.remark" type="textarea" :rows="2" :class="{ 'is-modified': isModified('remark') }" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="state.editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePatientInfo">保存修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Edit, EditPen, User } from '@element-plus/icons-vue'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { PathologyExamListQueryInput, PathologyReceiveInput } from '/@/api/lims/pathology/datacontract/pathologytest-datacontract'
import { PathologyTestApi } from '/@/api/lims/pathology/pathologytest'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { SampleStatus, SampleStatusUtils } from '/@/api/lims/shared/enums/samplestatusenum'
import { formatDate, formatDatetime, subtractDays } from '/@/utils/formatTime'
import SampleList from '/@/views/lims/exam/sampletest/components/samplelist.vue'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { isDoStatement } from 'typescript'
import DateTimeComparator from '/@/utils/timeCompare'
import modal from '/@/globalProperties/modal'
import { UpdatePatientInfoInput } from '/@/api/lims/exam/datacontract/sampletest-datacontract'
import { SampleTestApi } from '/@/api/lims/exam/sampletest'
import { DictApi } from '/@/api/admin/Dict'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'

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
  editDialogVisible: false,
  editForm: {} as any,
  originalSnapshot: {} as any,
  genderList: [] as DictGetListDto[] | null,
  ageUnitList: [] as DictGetListDto[] | null,
  sampleTypeList: [] as BaseSampleTypeOutput[],
  samplePropertyList: [] as DictGetListDto[] | null,
})

const activeId = ref(-1)
const sampleListRef = ref()
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
  new BaseSampleTypeApi()
    .getAll()
    .then((res) => {
      state.sampleTypeList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
  new DictApi().getList(['Gender', 'AgeUnit', 'SampleProperty']).then((res) => {
    state.genderList = res.data!.gender
    state.ageUnitList = res.data!.ageUnit
    state.samplePropertyList = res.data!.sampleProperty
  })
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
        nextTick(() => {
          sampleListRef.value.expandList()
        })
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
  refreshBasicInfo()
}

const handleBarcodeEnter = () => {
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
const openEditDialog = () => {
  if (!currentSample.value) return
  if (
    currentSample.value?.sampleStatus != SampleStatus.Testing.toString() &&
    currentSample.value?.sampleStatus != SampleStatus.ReportDelay.toString()
  )
    return

  state.originalSnapshot = { ...currentSample.value }

  Object.keys(state.editForm).forEach((k: any) => delete state.editForm[k])
  Object.assign(state.editForm, state.originalSnapshot)

  state.editDialogVisible = true
}
const isModified = (key: string) => {
  let editVal = state.editForm[key]
  let oriVal = state.originalSnapshot[key]
  if (editVal instanceof Date || oriVal instanceof Date) {
    var result = DateTimeComparator.compare(editVal, oriVal, { useUTC: true })
    return !result
  } else {
    return state.editForm[key] !== state.originalSnapshot[key]
  }
}
const savePatientInfo = () => {
  const target = state.allSamples.find((i) => i.id === activeId.value)
  if (!target) return

  const changes = {} as any
  Object.keys(state.editForm).forEach((key) => {
    if (state.editForm[key] !== state.originalSnapshot[key]) {
      changes[key] = state.editForm[key]
    }
  })

  const changedKeys = Object.keys(changes)
  if (changedKeys.length === 0) {
    modal.msg('数据未发生变化')
    state.editDialogVisible = false
    return
  }

  let param = {
    examInfo: { id: target.id, ...changes },
    updateFields: changedKeys,
  } as UpdatePatientInfoInput

  new SampleTestApi().updatePatientInfo(param).then((res) => {
    if (res.success) {
      modal.msgSuccess('保存成功')
      Object.assign(target, changes)
      modal.msgSuccess(`已更新字段: ${changedKeys.join(', ')}`)
      state.editDialogVisible = false
    }
  })
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

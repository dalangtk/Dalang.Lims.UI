<template>
  <el-card shadow="never" class="info-card">
    <template #header>
      <div class="panel-header">
        <span
          ><el-icon><User /></el-icon> 患者信息</span
        >
        <el-tag :color="GetStatusColor(SampleStatusUtils.getSampleStatus(currentSample?.sampleStatus))">{{ currentSample?.sampleStatusName }}</el-tag>
        <el-button
          type="primary"
          link
          @click="openEditDialog"
          :disabled="
            !currentSample ||
            (currentSample.sampleStatus != SampleStatus.Testing.toString() && currentSample.sampleStatus != SampleStatus.ReportDelay.toString())
          "
        >
          <el-icon><Edit /></el-icon>
        </el-button>
      </div>
    </template>

    <div v-if="currentSample" class="info-content">
      <el-descriptions :column="1" border size="small" label-width="100">
        <el-descriptions-item label="检测日期">
          <span>{{ formatDate(currentSample.testDate, 'YYYY-mm-dd') }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="样本号">
          <span>{{ currentSample.sampleNo }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="条码">
          <span class="barcode-text">{{ currentSample.barcode }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="姓名">
          <span>{{ currentSample.patientName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          <span>{{ currentSample.genderName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="年龄">
          <span>{{ currentSample.ageDesc }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="目的">
          <span>{{ currentSample.purNames }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="标本类型">
          <span>{{ currentSample.sampleTypeName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="标本性状">
          <span>{{ currentSample.samplePropertyName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="科室">{{ currentSample.department }}</el-descriptions-item>
        <el-descriptions-item label="医生">{{ currentSample.doctor }}</el-descriptions-item>
        <el-descriptions-item label="床号">{{ currentSample.bedNo }}</el-descriptions-item>
        <el-descriptions-item label="病员号">{{ currentSample.patientId }}</el-descriptions-item>
        <el-descriptions-item label="客户条码">{{ currentSample.customerBarcode }}</el-descriptions-item>
        <el-descriptions-item label="采样时间">{{ formatDatetime(currentSample.collectTime) }}</el-descriptions-item>
        <el-descriptions-item label="接收时间">{{ formatDatetime(currentSample.receiveTime) }}</el-descriptions-item>
        <el-descriptions-item label="检测时间">{{ formatDatetime(currentSample.inTestTime) }}</el-descriptions-item>
        <el-descriptions-item label="临床诊断">
          <div class="text-wrap">{{ currentSample.clinicalDiagnosis }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="结果说明">{{ currentSample.resultDescription }}</el-descriptions-item>
        <el-descriptions-item label="建议解释">{{ currentSample.suggestion }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ currentSample.remarks }}</el-descriptions-item>
        <el-descriptions-item label="初审人">{{ currentSample.firstAuditName }}</el-descriptions-item>
        <el-descriptions-item label="初审时间">{{ formatDatetime(currentSample.firstAuditTime) }}</el-descriptions-item>
        <el-descriptions-item label="复审人">{{ currentSample.secondAuditName }}</el-descriptions-item>
        <el-descriptions-item label="复审时间">{{ formatDatetime(currentSample.secondAuditTime) }}</el-descriptions-item>
        <el-descriptions-item label="Id">{{ currentSample.id }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-else class="empty-state">
      <el-empty description="请选择标本" :image-size="60" />
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="修改患者信息" width="30%">
      <el-form :model="editForm" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.patientName" :class="{ 'is-modified': isModified('patientName') }">
            <template #suffix v-if="isModified('patientName')">
              <el-tooltip content="该字段已修改" placement="top">
                <el-icon color="#E6A23C"><EditPen /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="editForm.genderCode" :class="{ 'is-modified-border': isModified('genderCode') }">
            <el-radio v-for="gender in genderList" :key="gender.code" :label="gender.name" :value="gender.code">{{ gender.name }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="年龄">
          <div style="display: flex">
            <el-input v-model="editForm.age1" :class="{ 'is-modified': isModified('age1') }"></el-input>
            <el-select
              v-model="editForm.ageUnit1"
              placeholder="单位"
              style="width: 120px; margin-left: 6px"
              :class="{ 'is-modified-border': isModified('ageUnit1') }"
            >
              <el-option v-for="unit in ageUnitList" :key="unit.code" :label="unit.name" :value="unit.code"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="年龄2">
          <div style="display: flex">
            <el-input v-model="editForm.age2" :class="{ 'is-modified': isModified('age2') }"></el-input>
            <el-select
              v-model="editForm.ageUnit2"
              placeholder="单位2"
              style="width: 120px; margin-left: 6px"
              :class="{ 'is-modified-border': isModified('ageUnit2') }"
            >
              <el-option v-for="unit in ageUnitList" :key="unit.code" :label="unit.name" :value="unit.code"></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="标本类型">
          <el-select v-model="editForm.sampleTypeCode" placeholder="标本类型" :class="{ 'is-modified-border': isModified('sampleTypeCode') }">
            <el-option v-for="t in sampleTypeList" :key="t.sampleTypeCode" :label="t.sampleTypeName" :value="t.sampleTypeCode"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标本性状">
          <el-select v-model="editForm.samplePropertyCode" placeholder="标本性状" :class="{ 'is-modified-border': isModified('samplePropertyCode') }">
            <el-option v-for="t in samplePropertyList" :key="t.code" :label="t.name" :value="t.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="科室">
          <el-input v-model="editForm.department" :class="{ 'is-modified': isModified('department') }"> </el-input>
        </el-form-item>
        <el-form-item label="医生">
          <el-input v-model="editForm.doctor" :class="{ 'is-modified': isModified('doctor') }"> </el-input>
        </el-form-item>
        <el-form-item label="床号">
          <el-input v-model="editForm.bedNo" :class="{ 'is-modified': isModified('bedNo') }"> </el-input>
        </el-form-item>
        <el-form-item label="病员号">
          <el-input v-model="editForm.patientId" :class="{ 'is-modified': isModified('patientId') }"> </el-input>
        </el-form-item>
        <el-form-item label="客户条码">
          <el-input v-model="editForm.customerBarcode" :class="{ 'is-modified': isModified('customerBarcode') }"> </el-input>
        </el-form-item>

        <el-form-item label="采样时间">
          <div :class="{ 'is-modified-border': isModified('collectTime') }">
            <el-date-picker
              v-model="editForm.collectTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY-MM-DD HH:mm:ss"
              :class="{ 'is-modified-border': isModified('collectTime') }"
            />
          </div>
        </el-form-item>
        <el-form-item label="接收时间">
          <div :class="{ 'is-modified-border': isModified('collectTime') }">
            <el-date-picker
              v-model="editForm.receiveTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY-MM-DD HH:mm:ss"
              :class="{ 'is-modified-border': isModified('receiveTime') }"
            />
          </div>
        </el-form-item>

        <el-form-item label="诊断">
          <el-input v-model="editForm.clinicalDiagnosis" type="textarea" :rows="2" :class="{ 'is-modified': isModified('clinicalDiagnosis') }" />
        </el-form-item>
        <el-form-item label="结果说明">
          <el-input v-model="editForm.resultDescription" type="textarea" :rows="2" :class="{ 'is-modified': isModified('resultDescription') }" />
        </el-form-item>
        <el-form-item label="建议解释">
          <el-input v-model="editForm.suggestion" type="textarea" :rows="2" :class="{ 'is-modified': isModified('suggestion') }" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea" :rows="2" :class="{ 'is-modified': isModified('remark') }" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePatientInfo">保存修改</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup name="PatientInfo">
import { Edit, EditPen, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

import { DictGetListDto } from '/@/api/admin/data-contracts'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { UpdatePatientInfoInput } from '/@/api/lims/exam/datacontract/sampletest-datacontract'
import { SampleTestApi } from '/@/api/lims/exam/sampletest'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { GetStatusColor, SampleStatus, SampleStatusUtils } from '/@/api/lims/shared/enums/samplestatusenum'
import modal from '/@/globalProperties/modal'
import { formatDate, formatDatetime } from '/@/utils/formatTime'
import DateTimeComparator from '/@/utils/timeCompare'

// Props
const props = defineProps<{
  currentSample: ExamInfoOutput | null
  genderList: DictGetListDto[] | null
  ageUnitList: DictGetListDto[] | null
  sampleTypeList: BaseSampleTypeOutput[]
  samplePropertyList: DictGetListDto[] | null
  activeId: number
  allSamples: ExamInfoOutput[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:currentSample', value: ExamInfoOutput | null): void
  (e: 'update:allSamples', value: ExamInfoOutput[]): void
  (e: 'refreshFilter'): void
}>()

// 编辑弹窗相关
const editDialogVisible = ref(false)
const editForm = reactive({} as any)
let originalSnapshot = {} as any

const openEditDialog = () => {
  if (!props.currentSample) return
  if (
    props.currentSample?.sampleStatus != SampleStatus.Testing.toString() &&
    props.currentSample?.sampleStatus != SampleStatus.ReportDelay.toString()
  )
    return

  originalSnapshot = { ...props.currentSample }

  Object.keys(editForm).forEach((k: any) => delete editForm[k])
  Object.assign(editForm, originalSnapshot)

  editDialogVisible.value = true
}

const isModified = (key: string) => {
  let editVal = editForm[key]
  let oriVal = originalSnapshot[key]
  if (editVal instanceof Date || oriVal instanceof Date) {
    var result = DateTimeComparator.compare(editVal, oriVal, { useUTC: true })
    return !result
  } else {
    return editForm[key] !== originalSnapshot[key]
  }
}

const savePatientInfo = () => {
  const target = props.allSamples.find((i) => i.id === props.activeId)
  if (!target) return

  const changes = {} as any
  Object.keys(editForm).forEach((key) => {
    if (editForm[key] !== originalSnapshot[key]) {
      changes[key] = editForm[key]
    }
  })

  const changedKeys = Object.keys(changes)
  if (changedKeys.length === 0) {
    ElMessage.info('数据未发生变化')
    editDialogVisible.value = false
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
      emit('update:allSamples', [...props.allSamples])
      emit('refreshFilter')

      ElMessage.success(`已更新字段: ${changedKeys.join(', ')}`)
      editDialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.info-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-content {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.barcode-text {
  font-family: monospace;
  font-size: 14px;
}

.text-wrap {
  word-break: break-word;
  white-space: normal;
}

.is-modified {
  border-color: #e6a23c !important;
}

.is-modified-border {
  border-color: #e6a23c !important;
}
</style>

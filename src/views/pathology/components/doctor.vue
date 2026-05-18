<template>
  <div class="doctor-container">
    <el-form size="small" :model="state.doctor" inline ref="formRef" :disabled="!state.editable">
      <el-row :gutter="1">
        <el-col :span="6">
          <el-form-item class="w90" label="" prop="firstDoctor">
            <el-input class="w100" v-model="state.doctor.firstDoctor" placeholder="初诊医生" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w90" label="" prop="secondDoctor">
            <el-select class="w100" v-model="state.doctor.secondDoctorId" @change="handleChangeSecondDoctor" placeholder="复诊医生">
              <el-option v-for="item in state.secondDoctorOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w90" label="" prop="reportDoctor">
            <el-select class="w100" v-model="state.doctor.reportDoctorId" @change="handleChangeReportDoctor" placeholder="报告医生">
              <el-option v-for="item in state.secondDoctorOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="w90" label="" prop="reportTime">
            <el-date-picker
              class="w100"
              v-model="state.doctor.reportTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="报告日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { formatDate, formatDatetime, parseDate } from '/@/utils/formatTime'
import { PathologyDoctor } from '/@/api/lims/pathology/datacontract/pathologytest-datacontract'
import { PathologyTestApi } from '/@/api/lims/pathology/pathologytest'
import { UserGetOptionOutput } from '/@/api/admin/data-contracts'
import { SampleStatus } from '/@/api/lims/shared/enums/samplestatusenum'

const props = defineProps<{
  wfCode: string
  resultType: number
}>()

const state = reactive({
  secondDoctorOptions: [] as UserGetOptionOutput[],
  doctor: {} as PathologyDoctor,
  editable: true,
})

onMounted(() => {
  new PathologyTestApi().getPathologySecondAuditUsers({ wfCode: props.wfCode }).then((res) => {
    state.secondDoctorOptions = res.data || []
  })
})

const setData = (examInfo: ExamInfoOutput) => {
  state.doctor.firstDoctorId = examInfo.firstAuditId || null
  state.doctor.firstDoctor = examInfo.firstAuditName || ''
  state.doctor.secondDoctorId = examInfo.secondAuditId || null
  state.doctor.secondDoctor = examInfo.secondAuditName || ''
  state.doctor.reportDoctorId = examInfo.approverId || null
  state.doctor.reportDoctor = examInfo.approverName || ''
  if (examInfo.secondAuditTime) {
    state.doctor.reportTime = formatDatetime(examInfo.secondAuditTime!, 'YYYY-MM-DD HH:mm:ss')
  } else {
    state.doctor.reportTime = ''
  }
  setEditable(examInfo)
}
const setEditable = (examInfo: ExamInfoOutput) => {
  if (
    (examInfo.sampleStatus == SampleStatus.FirstCheck ||
      examInfo.sampleStatus == SampleStatus.SecondCheck ||
      examInfo.sampleStatus == SampleStatus.Reported ||
      examInfo.sampleStatus == SampleStatus.Printed) &&
    props.resultType == 1
  ) {
    state.editable = false
  } else if (
    (examInfo.sampleStatus == SampleStatus.SecondCheck ||
      examInfo.sampleStatus == SampleStatus.Reported ||
      examInfo.sampleStatus == SampleStatus.Printed) &&
    props.resultType == 2
  ) {
    state.editable = false
  } else {
    state.editable = true
  }
}

const handleChangeSecondDoctor = (val: any) => {
  state.doctor.secondDoctor = state.secondDoctorOptions.find((item) => item.id === val)?.name || ''
}

const handleChangeReportDoctor = (val: any) => {
  state.doctor.reportDoctor = state.secondDoctorOptions.find((item) => item.id === val)?.name || ''
}

const getDoctor = (): PathologyDoctor => {
  return state.doctor
}

defineExpose({
  setData,
  getDoctor,
})
</script>

<style scoped lang="scss">
.doctor-container {
  padding: 5px;
  // margin-right: 65px;
}
.el-form .el-col {
  margin-bottom: 0 !important; /* 根据需要调整或移除 */
}
.el-form.el-form--inline .el-form-item--default.el-form-item:last-of-type,
.el-form.el-form--inline .el-form-item--small.el-form-item:last-of-type {
  margin-bottom: 0 !important;
}
.w90 {
  width: 90%;
}
.w100 {
  width: 100%;
}
</style>

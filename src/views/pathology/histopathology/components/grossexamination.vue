<template>
  <div class="gross-examination-container">
    <div class="gross-examination">
      <div class="left">
        <div class="table-container">
          <MyTable class="my-table" :show-paging="false" :show-toolbox="false" :data="state.samplingSpotList">
            <template #headerButton>
              <el-button type="primary" :disabled="!state.editable" size="small" @click="onAddSamplingSpotDetail">
                <SvgIcon name="ele-Plus" />
                新增</el-button
              >
            </template>
            <el-table-column label="取材部位" prop="samplingSpotCode">
              <template #default="{ row }">
                <el-select
                  v-model="row.samplingSpotCode"
                  placeholder="请选择"
                  size="small"
                  filterable
                  clearable
                  :disabled="!state.editable"
                  remote
                  :remote-method="querySamplingSpotOptions"
                  style="width: 100%"
                  @change="(val: string) => onSamplingSpotChange(row)"
                >
                  <el-option v-for="item in state.samplingSpotOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="标本类型" prop="sampleTypeCode">
              <template #default="{ row }">
                <el-select
                  v-model="row.sampleTypeCode"
                  placeholder="请选择"
                  size="small"
                  filterable
                  clearable
                  style="width: 100%"
                  @change="(val: string) => onSampleTypeChange(row, val)"
                >
                  <el-option
                    v-for="item in state.sampleTypeOptions"
                    :key="item.sampleTypeCode"
                    :label="item.sampleTypeName"
                    :value="item.sampleTypeCode"
                  />
                </el-select>
              </template>
            </el-table-column>
          </MyTable>
        </div>
        <div class="table-container">
          <MyTable :data="state.templateOptions" class="my-table" :show-paging="false" :show-toolbox="false">
            <el-table-column label="二级标本" prop="sampleTypeName"></el-table-column>
            <el-table-column label="模板名称" prop="templateName"></el-table-column>
            <el-table-column label="操作" fixed="right">
              <template #default="{ row }">
                <el-button size="small" text type="primary" @click="onSelectTemplate(row)">选择模板</el-button>
              </template>
            </el-table-column>
          </MyTable>
        </div>
      </div>
      <div class="center">
        <el-input
          class="gross-input"
          type="textarea"
          :disabled="!state.editable"
          v-model="state.formData.grossExamination"
          ref="grossInputRef"
          @keydown.right.prevent="handleRightKey"
          @keydown.left.prevent="handleLeftKey"
        ></el-input>
      </div>
      <div class="right"></div>
    </div>
    <div class="record">
      <el-form inline size="small" label-width="60px">
        <el-form-item label="记录员">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="取材医生">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { LabelValueOutput } from '/@/api/admin/data-contracts'
import {
  ExamPathologySamplingSpotOutput,
  ExamPathologySamplingSpotUpdateInput,
} from '/@/api/lims/pathology/datacontract/exampathologysamplingspot-datacontract'
import { GrossExaminationResult } from '/@/api/lims/pathology/datacontract/pathologyresult-datacontract'
import { BasePathologySamplingSpotDetailOutput } from '/@/api/lims/pathology/datacontract/pathologysamplingspotdetail-datacontract'
import { GrossExaminationTemplateOutput } from '/@/api/lims/pathology/datacontract/pathologytemplate-datacontract'
import { SaveResultInput } from '/@/api/lims/pathology/datacontract/pathologytest-datacontract'
import { BasePathologySamplingSpotApi } from '/@/api/lims/pathology/pathologysamplingspot'
import { BasePathologyTemplateApi } from '/@/api/lims/pathology/pathologytemplate'
import { PathologyTestApi } from '/@/api/lims/pathology/pathologytest'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { ExamSpecialResultListOutput } from '/@/api/lims/shared/datacontract/examspecialresult-datacontract'
import { PathologyAuditTypeEnum } from '/@/api/lims/shared/enums/pathologyaudittypeenum'
import { SampleStatus } from '/@/api/lims/shared/enums/samplestatusenum'
import { BaseOptionsApi } from '/@/api/lims/shared/options'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { isBlank } from '/@/utils/toolsValidate'

const props = withDefaults(
  defineProps<{
    auditType?: PathologyAuditTypeEnum
    resultType?: number
  }>(),
  {
    auditType: PathologyAuditTypeEnum.FirstAudit,
    resultType: 1,
  }
)

const state = reactive({
  editable: false,
  samplingSpotList: [] as ExamPathologySamplingSpotOutput[],
  samplingSpotOptions: [] as LabelValueOutput[],
  sampleTypeOptions: [] as BasePathologySamplingSpotDetailOutput[],
  formData: {} as GrossExaminationResult,
  examId: -1,
  templateOptions: [] as GrossExaminationTemplateOutput[],
  currSpecialResultList: [] as ExamSpecialResultListOutput[],
  currExamInfo: {} as ExamInfoOutput | null,
})

const onAddSamplingSpotDetail = () => {
  if (state.examId <= 0) {
    return
  }
  state.samplingSpotList.push({
    id: 0,
    examInfoId: state.examId,
    samplingSpotCode: null,
    sampleTypeCode: null,
    samplingSpotName: null,
    sampleTypeName: null,
    sort: 0,
  })
}
const onSelectTemplate = (row: GrossExaminationTemplateOutput) => {
  console.log('选择模板', row)
  let templateObj = JSON.parse(row.templateContent ?? '{}')
  if (isBlank(state.formData?.grossExamination)) {
    state.formData = {
      grossExamination: templateObj.diagnosis ?? '',
    }
  } else {
    state.formData.grossExamination += '\n' + templateObj.diagnosis
  }
}
const querySamplingSpotOptions = (queryString: string) => {
  if (!queryString) {
    return
  }
  new BaseOptionsApi().getSamplingSpotOptions({ pageSize: 20, currentPage: 1, filter: queryString }).then((res) => {
    if (res.success) {
      state.samplingSpotOptions = res.data ?? []
    }
  })
}
const onSamplingSpotChange = (row: BasePathologySamplingSpotDetailOutput) => {
  if (row.samplingSpotCode) {
    new BasePathologySamplingSpotApi().getSamplingSpotDetails({ samplingSpotCode: row.samplingSpotCode }).then((res) => {
      if (res.success) {
        state.sampleTypeOptions = res.data ?? []
      }
    })
  } else {
    state.sampleTypeOptions = []
    row.sampleTypeCode = ''
  }
}
const onSampleTypeChange = (row: BasePathologySamplingSpotDetailOutput, name: string) => {
  refreshTemplate()
}
const refreshTemplate = () => {
  let sampleTypeCodes = state.samplingSpotList.map((i) => i.sampleTypeCode!)
  console.log(sampleTypeCodes)
  // return
  new BasePathologyTemplateApi().getGrossExaminationTemplate({ sampleTypeCodes: sampleTypeCodes }).then((res) => {
    if (res.success) {
      state.templateOptions = res.data ?? []
    }
  })
}
onMounted(() => {
  new BaseOptionsApi().getSamplingSpotOptions({}).then((res) => {
    if (res.success) {
      state.samplingSpotOptions = res.data ?? []
    }
  })
})

const refreshData = (examInfo: ExamInfoOutput | null) => {
  state.currExamInfo = examInfo
  console.log('gross refreshData', examInfo)
  if (examInfo == null) {
    clearResult()
  } else {
    state.formData = { grossExamination: '' }
    state.examId = examInfo?.id ?? -1
    new PathologyTestApi()
      .getSpecialResultList({ examInfoId: examInfo?.id ?? -1, resultType: props.resultType }, { showErrorMessage: true })
      .then((res) => {
        if (res.data) {
          state.currSpecialResultList = res.data ?? []
          const result = res.data.reduce((acc: Record<string, any>, item) => {
            acc[item.fieldCode!] = item.fieldValue
            return acc
          }, {})
          setResult(result)
        } else {
          state.currSpecialResultList = []
          setResult([])
        }
      })

    new PathologyTestApi().getSamplingSpotDetail({ examInfoId: examInfo?.id ?? -1 }).then((res) => {
      if (res.success) {
        state.samplingSpotList = res.data ?? []
        if (state.samplingSpotList.length > 0) {
          if (state.samplingSpotOptions.findIndex((i) => i.value == state.samplingSpotList[0].samplingSpotCode!) == -1) {
            state.samplingSpotOptions.push({
              label: state.samplingSpotList[0].samplingSpotName!,
              value: state.samplingSpotList[0].samplingSpotCode!,
            })
          }
          if (state.sampleTypeOptions.findIndex((i) => i.sampleTypeCode == state.samplingSpotList[0].sampleTypeCode!) == -1) {
            state.sampleTypeOptions.push({
              id: 0,
              sampleTypeName: state.samplingSpotList[0].sampleTypeName!,
              sampleTypeCode: state.samplingSpotList[0].sampleTypeCode!,
            })
          }
          refreshTemplate()
        }
      }
    })
    var editable = examInfo.sampleStatus == SampleStatus.Testing || (props.resultType == 2 && examInfo.sampleStatus == SampleStatus.FirstCheck)
    setEditable(editable)
  }
}
const clearResult = () => {
  state.formData.grossExamination = ''
  state.examId = 0
  state.currSpecialResultList = []
  state.samplingSpotList = []
  state.templateOptions = []
  state.currExamInfo = null
}
const setResult = (result: any) => {
  console.log('设置结果:', result)
  if (!state.formData.grossExamination) {
    state.formData = {
      grossExamination: result?.grossExamination ?? '',
    }
  }
}
const getResult = () => {
  return state.formData
}
const setEditable = (editable: boolean) => {
  console.log('gross setEditable', editable)
  state.editable = editable
}

const saveResult = (examInfoId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const result = state.formData
    if (!result || Object.keys(result).length === 0) {
      resolve(null)
      return
    }
    let param = {
      examInfoId: examInfoId,
      resultType: props.resultType,
    } as SaveResultInput

    const buildAndSave = (specialResultList: ExamSpecialResultListOutput[]) => {
      if (specialResultList.length > 0) {
        specialResultList.forEach((item) => {
          item.fieldValue = (result as any)[item.fieldCode!] ?? item.fieldValue
        })
      } else {
        for (let key in result) {
          specialResultList.push({
            fieldCode: key,
            fieldValue: (result as any)[key],
            resultType: props.resultType,
            examInfoId: examInfoId,
            barcode: state.currExamInfo?.barcode ?? '',
            groupCode: state.currExamInfo?.groupCode ?? '',
            sampleNo: state.currExamInfo?.sampleNo ?? '',
            testDate: state.currExamInfo?.testDate ?? '',
          } as ExamSpecialResultListOutput)
        }
      }
      param.specialResultList = specialResultList
      new PathologyTestApi()
        .saveResult(param, { showErrorMessage: true })
        .then((res) => {
          if (res.success) {
            state.currSpecialResultList = specialResultList
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch((err) => reject(err))
    }

    if (state.currSpecialResultList?.length > 0) {
      buildAndSave([...state.currSpecialResultList])
    } else {
      new PathologyTestApi()
        .getSpecialResultList({ examInfoId: examInfoId, resultType: props.resultType }, { showErrorMessage: true })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            state.currSpecialResultList = res.data
            buildAndSave([...res.data])
          } else {
            buildAndSave([])
          }
        })
        .catch(() => buildAndSave([]))
    }
    let spotParam = state.samplingSpotList as ExamPathologySamplingSpotUpdateInput[]
    new PathologyTestApi().saveSamplingSpotDetail(spotParam).then((res) => {
      if (!res.success) {
        modal.msgError(res.msg)
      }
    })
  })
}

// #region 【】标记导航
const grossInputRef = ref()

/** 在文本中查找所有【】标记的位置 */
function findBrackets(text: string): { start: number; end: number }[] {
  const result: { start: number; end: number }[] = []
  const regex = /【[^】]*】/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    result.push({ start: match.index, end: match.index + match[0].length })
  }
  console.log('result', result)
  return result
}

function handleRightKey() {
  const ta = grossInputRef.value?.textarea as HTMLTextAreaElement | undefined
  if (!ta) return
  const text = state.formData.grossExamination ?? ''
  const selStart = ta.selectionStart
  const selEnd = ta.selectionEnd
  const brackets = findBrackets(text)

  // 检查当前选区是否正好选中了一个【】标记（即上一次导航选中的）
  const exactMatch = brackets.find((b) => b.start === selStart && b.end === selEnd)

  if (exactMatch) {
    // 去掉当前【】，保留内部文本
    const inner = text.slice(exactMatch.start + 1, exactMatch.end - 1)
    const newText = text.slice(0, exactMatch.start) + inner + text.slice(exactMatch.end)
    state.formData.grossExamination = newText

    // 定位到下一个【】
    nextTick(() => {
      const newTa = grossInputRef.value?.textarea as HTMLTextAreaElement | undefined
      if (!newTa) return
      const newBrackets = findBrackets(newText)
      const next = newBrackets.find((b) => b.start > exactMatch.start)
      if (next) {
        newTa.setSelectionRange(next.start, next.end)
      } else {
        newTa.setSelectionRange(exactMatch.start, exactMatch.start)
      }
    })
  } else {
    // 从光标当前位置往后找下一个【】
    const next = brackets.find((b) => b.start > Math.max(selStart, selEnd === selStart ? selStart : selEnd))
    if (next) {
      ta.setSelectionRange(next.start, next.end)
    }
  }
}

function handleLeftKey() {
  const ta = grossInputRef.value?.textarea as HTMLTextAreaElement | undefined
  if (!ta) return
  const text = state.formData.grossExamination ?? ''
  const selStart = ta.selectionStart
  const selEnd = ta.selectionEnd
  const brackets = findBrackets(text)

  // 检查当前选区是否正好选中了一个【】标记（即上一次导航选中的）
  const exactMatch = brackets.find((b) => b.start === selStart && b.end === selEnd)

  if (exactMatch) {
    // 去掉当前【】，保留内部文本
    const inner = text.slice(exactMatch.start + 1, exactMatch.end - 1)
    const newText = text.slice(0, exactMatch.start) + inner + text.slice(exactMatch.end)
    state.formData.grossExamination = newText

    // 定位到上一个【】
    nextTick(() => {
      const newTa = grossInputRef.value?.textarea as HTMLTextAreaElement | undefined
      if (!newTa) return
      const newBrackets = findBrackets(newText)
      const prev = [...newBrackets].reverse().find((b) => b.end <= exactMatch.start)
      if (prev) {
        newTa.setSelectionRange(prev.start, prev.end)
      } else {
        newTa.setSelectionRange(exactMatch.start, exactMatch.start)
      }
    })
  } else {
    // 从光标当前位置往前找上一个【】
    const prev = [...brackets].reverse().find((b) => b.end < selStart)
    if (prev) {
      ta.setSelectionRange(prev.start, prev.end)
    }
  }
}
// #endregion

defineExpose({
  refreshData,
  setEditable,
  getResult,
  saveResult,
})
</script>

<style scoped lang="scss">
.gross-examination-container {
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
}
.gross-examination {
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 0;
}
.left {
  width: 30%;
}
.table-container {
  height: 50%;
  display: flex;
  flex-direction: column;
}
.my-table {
  flex: 1;
}
.center {
  width: 40%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.right {
  width: 30%;
  background-color: #eeeeee;
}
.record {
  width: 100%;
  height: 35px;
  line-height: 35px;
  // text-align: center;
}
.el-form .el-col {
  margin-bottom: 0 !important;
}
.el-form.el-form--inline .el-form-item--small.el-form-item {
  margin-bottom: 0 !important;
}
.gross-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  :deep(.el-textarea__inner) {
    flex: 1;
    height: auto;
    border: none;
    border-radius: 0;
    resize: none;
  }
}
</style>

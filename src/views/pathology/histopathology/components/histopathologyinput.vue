<template>
  <div class="resultinput-container">
    <div class="resultinput">
      <div class="left">
        <div class="table-container">
          <MyTable class="my-table" size="small" :show-paging="false" :show-toolbox="false" :data="state.samplingSpotList">
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
          <MyTable :data="state.sectionList" size="small" class="my-table" :show-paging="false" :show-toolbox="false">
            <el-table-column label="切片号" prop="candleNo"></el-table-column>
            <el-table-column label="部位" prop="position"></el-table-column>
          </MyTable>
        </div>
      </div>
      <div class="center">
        <div class="grid-2x2">
          <div class="grid-item">
            <label>诊断结果</label>
            <el-input type="textarea" :disabled="!state.editable" v-model="state.formData.diagnosis" />
          </div>
          <div class="grid-item">
            <label>镜下所见</label>
            <el-input type="textarea" :disabled="!state.editable" v-model="state.formData.microscopicExamination" />
          </div>
          <div class="grid-item">
            <label>大体所见</label>
            <el-input type="textarea" :disabled="!state.editable" v-model="state.formData.grossExamination" />
          </div>
          <div class="grid-item">
            <label>备注</label>
            <el-input type="textarea" :disabled="!state.editable" v-model="state.formData.remarks" />
          </div>
        </div>
      </div>
      <div class="right">
        <el-tabs v-model="state.activeTab">
          <el-tab-pane label="图片" name="image">
            <PathologyImages ref="imagesRef" :editable="state.editable" :is-gross-examination="true" />
          </el-tab-pane>
          <el-tab-pane label="蜡块" name="candle">
            <MyTable :data="state.candleList" size="small" class="my-table" :show-paging="false" :show-toolbox="false">
              <template #headerButton>
                <el-button type="primary" :disabled="!state.editable" size="small" @click="addCandle">
                  <SvgIcon name="ele-Plus" />
                  新增</el-button
                >
              </template>
              <el-table-column label="蜡块编号" prop="candleNo">
                <template #default="{ row }">
                  <el-input v-model="row.candleNo" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="部位" prop="position">
                <template #default="{ row }">
                  <el-input v-model="row.position" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="amount">
                <template #default="{ row }">
                  <el-input v-model="row.amount" size="small" />
                </template>
              </el-table-column>
              <el-table-column width="60" label="操作" fixed="right">
                <template #default="{ row }">
                  <el-button size="small" text type="primary" @click="deleteCandle(row)">删除</el-button>
                </template>
              </el-table-column>
            </MyTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { LabelValueOutput } from '/@/api/admin/data-contracts'
import {
  ExamPathologySamplingSpotOutput,
  ExamPathologySamplingSpotUpdateInput,
} from '/@/api/lims/pathology/datacontract/exampathologysamplingspot-datacontract'
import { HistopathologyResult } from '/@/api/lims/pathology/datacontract/pathologyresult-datacontract'
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
import PathologyImages from '/@/views/pathology/components/pathologyimages.vue'
import { ExamPathologyCandleOutput } from '/@/api/lims/pathology/datacontract/exampathologycandle-datacontract'
import { ExamPathologyCandleApi } from '/@/api/lims/pathology/exampathologycandle'
import { ExamPathologySectionOutput } from '/@/api/lims/pathology/datacontract/exampathologysection-datacontract'
import { ExamPathologySectionApi } from '/@/api/lims/pathology/exampathologysection'

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
  activeTab: 'image',
  editable: false,
  samplingSpotList: [] as ExamPathologySamplingSpotOutput[],
  samplingSpotOptions: [] as LabelValueOutput[],
  sampleTypeOptions: [] as BasePathologySamplingSpotDetailOutput[],
  formData: {} as HistopathologyResult,
  examId: -1,
  templateOptions: [] as GrossExaminationTemplateOutput[],
  currSpecialResultList: [] as ExamSpecialResultListOutput[],
  currExamInfo: {} as ExamInfoOutput | null,
  candleList: [] as ExamPathologyCandleOutput[],
  sectionList: [] as ExamPathologySectionOutput[],
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
  let templateObj = JSON.parse(row.templateContent ?? '{}')
  if (isBlank(state.formData?.diagnosis)) {
    state.formData.diagnosis = templateObj.diagnosis ?? ''
  } else {
    state.formData.diagnosis += '\n' + templateObj.diagnosis
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
  if (examInfo == null) {
    clearResult()
  } else {
    state.formData = { diagnosis: '', grossExamination: '', microscopicExamination: '', remarks: '' }
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
    new ExamPathologySectionApi().getSections({ examInfoId: examInfo?.id ?? -1 }).then((res) => {
      if (res.success) {
        state.sectionList = res.data ?? []
      }
    })
    imagesRef.value?.refreshData(examInfo?.id ?? -1)
    var editable = examInfo.sampleStatus == SampleStatus.Testing || (props.resultType == 2 && examInfo.sampleStatus == SampleStatus.FirstCheck)
    setEditable(editable)
  }
  refreshCandle()
}

const refreshCandle = () => {
  if (state.examId <= 0) {
    state.candleList = []
    return
  }
  new ExamPathologyCandleApi().getCandles({ examInfoId: state.examId }).then((res) => {
    if (res.success) {
      state.candleList = res.data ?? []
    }
  })
}

const clearResult = () => {
  state.formData = {} as HistopathologyResult
  state.examId = 0
  state.currSpecialResultList = []
  state.samplingSpotList = []
  state.templateOptions = []
  state.candleList = []
  state.currExamInfo = null
  imagesRef.value?.refreshData(-1)
}
const setResult = (result: any) => {
  state.formData.diagnosis = result?.diagnosis ?? ''
  state.formData.grossExamination = result?.grossExamination ?? ''
  state.formData.microscopicExamination = result?.microscopicExamination ?? ''
  state.formData.remarks = result?.remarks ?? ''
}
const getResult = () => {
  return state.formData
}
const setEditable = (editable: boolean) => {
  state.editable = editable
}

const saveResult = (examInfoId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const result = state.formData
    if (!result || Object.keys(result).length === 0) {
      resolve(null)
      return
    }
    //判断蜡块号有没有重复，有重复不让保存
    const seen = new Set<number>()
    let firstDuplicate: number | null = null
    for (const item of state.candleList) {
      if (!item.candleNo) {
        modal.alertError('蜡块号不能为空!')
        resolve(null)
        return
      }
      if (seen.has(item.candleNo!)) {
        firstDuplicate = item.candleNo
        break
      }
      seen.add(item.candleNo!)
    }
    if (firstDuplicate) {
      modal.alertError(`蜡块号${firstDuplicate}重复!`)
      resolve(null)
      return
    }

    let param = {
      examInfoId: examInfoId,
      resultType: props.resultType,
    } as SaveResultInput

    const buildAndSave = (specialResultList: ExamSpecialResultListOutput[]) => {
      for (let key in result) {
        if (specialResultList.findIndex((i) => i.fieldCode == key) > -1) {
          specialResultList.find((i) => i.fieldCode == key)!.fieldValue = (result as any)[key]
        } else {
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

      console.log('specialResultList', param.specialResultList)

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

    new ExamPathologyCandleApi().saveCandles(state.candleList).then((res) => {
      if (!res.success) {
        modal.msgError(res.msg)
      }
    })
  })
}

const addCandle = () => {
  //candleNo取当前列表最大candleNo+1
  let maxCandleNo = state.candleList.reduce((max, item) => Math.max(max, item.candleNo ?? 0), 0)
  let candleNo = maxCandleNo + 1
  state.candleList.push({
    id: 0,
    examInfoId: state.examId,
    candleNo: candleNo,
    originalCandleNo: '',
    position: '',
    amount: 1,
    operationType: 0,
    estimatedSamplingDate: new Date(),
  })
}

const deleteCandle = (row: ExamPathologyCandleOutput) => {
  if (row.id <= 0) {
    const index = state.candleList.indexOf(row)
    if (index > -1) {
      state.candleList.splice(index, 1)
    }
    return
  }
  modal
    .confirmDelete(`确定要删除蜡块【${row.candleNo}】?`, null)
    .then(async () => {
      new ExamPathologyCandleApi().delete({ id: row.id }).then((res) => {
        if (res.success) {
          refreshCandle()
        }
      })
    })
    .catch(() => {})
}

const imagesRef = ref()

defineExpose({
  refreshData,
  setEditable,
  getResult,
  saveResult,
})
</script>

<style scoped lang="scss">
.resultinput-container {
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
}
.resultinput {
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 0;
}
.left {
  width: 22%;
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
  width: 48%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 4px;
  box-sizing: border-box;
}

.grid-2x2 {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  min-height: 0;
}

.grid-item {
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;

  label {
    font-weight: bold;
    font-size: 13px;
    color: #303133;
    padding: 6px 8px;
    border-bottom: 1px solid #ebeef5;
    flex-shrink: 0;
  }

  :deep(.el-textarea) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  :deep(.el-textarea__inner) {
    flex: 1;
    border: none;
    border-radius: 0;
    resize: none;
  }
}

.right {
  width: 30%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 4px;
  box-sizing: border-box;

  :deep(.el-tabs) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  :deep(.el-tabs__content) {
    flex: 1;
    min-height: 0;
  }
  :deep(.el-tab-pane) {
    height: 100%;
    overflow: hidden;
  }
}
.el-form .el-col {
  margin-bottom: 0 !important;
}
.el-form.el-form--inline .el-form-item--small.el-form-item {
  margin-bottom: 0 !important;
}
</style>

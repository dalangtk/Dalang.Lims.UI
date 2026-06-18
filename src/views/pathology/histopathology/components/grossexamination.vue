<template>
  <div class="gross-examination-container">
    <div class="gross-examination">
      <div class="left">
        <div class="table-container">
          <MyTable class="my-table" :show-paging="false" :show-toolbox="false" :data="state.samplingSpotList">
            <template #headerButton>
              <el-button type="primary" size="small" @click="onAddSamplingSpotDetail">
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
        <el-input class="gross-input" type="textarea" :disabled="!state.editable" v-model="state.formData.grossExamination"></el-input>
      </div>
      <div class="right">
      
      </div>
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
import { reactive, ref, onMounted } from 'vue'
import MyTable from '/@/components/my-table/index.vue'
import { PathologyTestApi } from '/@/api/lims/pathology/pathologytest'
import { PathologyAuditTypeEnum } from '/@/api/lims/shared/enums/pathologyaudittypeenum'
import { GrossExaminationResult } from '/@/api/lims/pathology/datacontract/pathologyresult-datacontract'
import { BasePathologySamplingSpotDetailOutput } from '/@/api/lims/pathology/datacontract/pathologysamplingspotdetail-datacontract'
import { GrossExaminationTemplateOutput } from '/@/api/lims/pathology/datacontract/pathologytemplate-datacontract'
import { BasePathologySamplingSpotApi } from '/@/api/lims/pathology/pathologysamplingspot'
import { BasePathologySampleTypeApi } from '/@/api/lims/pathology/pathologysampletype'
import { BasePathologySamplingSpotOutput } from '/@/api/lims/pathology/datacontract/pathologysamplingspot-datacontract'
import { BasePathologySampleTypeOutput } from '/@/api/lims/pathology/datacontract/pathologysampletype-datacontract'
import { BaseOptionsApi } from '/@/api/lims/shared/options'
import { LabelValueOutput } from '/@/api/admin/data-contracts'
import { BasePathologyTemplateApi } from '/@/api/lims/pathology/pathologytemplate'

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
  samplingSpotList: [] as BasePathologySamplingSpotDetailOutput[],
  samplingSpotOptions: [] as LabelValueOutput[],
  sampleTypeOptions: [] as BasePathologySamplingSpotDetailOutput[],
  formData: {} as GrossExaminationResult,
  examId: -1,
  templateOptions: [] as GrossExaminationTemplateOutput[],
})

const onAddSamplingSpotDetail = () => {
  state.samplingSpotList.push({
    id: 0,
    samplingSpotCode: null,
    sampleTypeCode: null,
    samplingSpotName: null,
    sampleTypeName: null,
    sort: 0,
    isValid: true,
  })
}
const onSelectTemplate = (row: GrossExaminationTemplateOutput) => {
  console.log('选择模板', row)
  let templateObj = JSON.parse(row.templateContent ?? '{}')
  state.formData.grossExamination = templateObj.diagnosis ?? ''
}
const querySamplingSpotOptions = (queryString: string) => {
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

const refreshData = (examInfoId: number) => {
  console.log('gross refreshData', examInfoId)
  state.examId = examInfoId
  new PathologyTestApi().getSpecialResultList({ examInfoId: examInfoId, resultType: props.resultType }, { showErrorMessage: true }).then((res) => {
    if (res.data) {
      const result = res.data.reduce((acc: Record<string, any>, item) => {
        acc[item.fieldCode!] = item.fieldValue
        return acc
      }, {})
      setResult(result)
      return res.data ?? []
    }
  })
}
const setResult = (result: any) => {
  console.log('设置结果:', result)
  state.formData = {
    grossExamination: result?.grossExamination ?? '',
  }
}
const getResult = () => {
  return state.formData
}
const setEditable = (editable: boolean) => {
  console.log('gross setEditable', editable)
  state.editable = editable
}

defineExpose({
  refreshData,
  setEditable,
  getResult,
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

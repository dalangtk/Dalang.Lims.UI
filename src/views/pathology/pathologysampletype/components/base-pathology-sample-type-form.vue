<template>
  <div>
    <el-dialog
      v-model="state.showDialog"
      :title="title"
      draggable
      destroy-on-close
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="my-dialog-form"
    >
      <el-form ref="formRef" :model="form" size="default" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标本类型代码" prop="sampleTypeCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sampleTypeCode" placeholder="标本类型代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标本类型名称" prop="sampleTypeName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sampleTypeName" placeholder="标本类型名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级标本" prop="parentCode" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.parentCode" placeholder="上级标本" filterable remote clearable :remote-method="querySampleTypeList">
                <el-option v-for="item in state.sampleTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="级别" prop="typeGrade" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.typeGrade" placeholder="级别"> </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="拼音" prop="pinYin" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.pinYin" placeholder="拼音"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="state.form.typeGrade === 1">
            <el-form-item label="疾病" prop="diseaseCodeList" v-show="editItemIsShow(true, true)">
              <el-select
                v-model="state.form.diseaseCodeList"
                placeholder="疾病"
                filterable
                remote
                clearable
                multiple
                :remote-method="queryDiseaseList"
              >
                <el-option v-for="item in state.diseaseList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板" prop="templateCodeList" v-show="editItemIsShow(true, true)">
              <!-- <el-input v-model="state.form.templateCode" placeholder="模板"> </el-input> -->
              <el-select
                v-model="state.form.templateCodeList"
                placeholder="模板"
                filterable
                remote
                clearable
                multiple
                :remote-method="queryTemplateList"
              >
                <el-option v-for="item in state.templateList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.sort" placeholder="排序"> </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用" prop="isValid" v-show="editItemIsShow(true, true)">
              <el-switch v-model="state.form.isValid" placeholder="启用"> </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import {
  BasePathologySampleTypeAddInput,
  BasePathologySampleTypeOutput,
  BasePathologySampleTypeUpdateInput,
} from '/@/api/lims/pathology/datacontract/pathologysampletype-datacontract'
import { BasePathologySampleTypeApi } from '/@/api/lims/pathology/pathologysampletype'

import { LabelValueOutput } from '/@/api/admin/data-contracts'
import { BasePathologyDiseaseApi } from '/@/api/lims/pathology/pathologydisease'
import { BasePathologyTemplateApi } from '/@/api/lims/pathology/pathologytemplate'
import { BaseOptionsApi } from '/@/api/lims/shared/options'
import modal from '/@/globalProperties/modal'
import eventBus from '/@/utils/mitt'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const formRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as BasePathologySampleTypeAddInput | BasePathologySampleTypeUpdateInput | any,
  sampleTypeList: [] as Array<LabelValueOutput>,
  diseaseList: [] as Array<LabelValueOutput>,
  templateList: [] as Array<LabelValueOutput>,
})
const { form } = toRefs(state)

onMounted(() => {})

const querySampleTypeList = async (query?: string) => {
  if (!query) return
  new BaseOptionsApi().getPathologySampleTypeOptions({ currentPage: 1, pageSize: 20, filter: query }).then((res) => {
    if (res?.success) {
      state.sampleTypeList = res.data as Array<LabelValueOutput>
    }
  })
}
const queryTemplateList = (query?: string) => {
  if (!query) return
  if (state.form.typeGrade === 1) {
    new BaseOptionsApi().getPathologyGrossExaminationTemplateOptions({ currentPage: 1, pageSize: 20, filter: query }).then((res) => {
      if (res?.success) {
        state.templateList = res.data as Array<LabelValueOutput>
      }
    })
  } else {
    new BaseOptionsApi().getPathologyDiagnosisTemplateOptions({ currentPage: 1, pageSize: 20, filter: query }).then((res) => {
      if (res?.success) {
        state.templateList = res.data as Array<LabelValueOutput>
      }
    })
  }
}
const queryDiseaseList = (query?: string) => {
  if (!query) return
  new BaseOptionsApi()
    .getDiseaseOptions({ currentPage: 1, pageSize: 20, filter: query })
    .then((res) => {
      if (res?.success) {
        state.diseaseList = res.data as Array<LabelValueOutput>
      }
    })
    .catch(() => {
      modal.closeLoading()
    })
}
const getSampleTypeList = async (query: string[]) => {
  const res = await new BasePathologySampleTypeApi().getSampleTypeList({ typeGrade: 1 }).catch(() => {
    modal.closeLoading()
  })
  if (res?.success) {
    if (res.data) {
      state.sampleTypeList = res.data.map((item: any) => {
        return {
          label: item.sampleTypeName,
          value: item.sampleTypeCode,
        }
      })
    }
  }
}

// 获取疾病列表
const getDiseaseList = async (query: string[]) => {
  const res = await new BasePathologyDiseaseApi().getDiseaseList(query).catch(() => {
    modal.closeLoading()
  })
  if (res?.success) {
    if (res.data) {
      state.diseaseList = res.data.map((item: any) => {
        return {
          label: item.diseaseName,
          value: item.diseaseCode,
        }
      })
    }
  }
}

// 获取诊断模板列表
const getPathologyTemplateList = async (query: string[]) => {
  const res = await new BasePathologyTemplateApi().getPathologyTemplateList(query).catch(() => {
    modal.closeLoading()
  })
  if (res?.success) {
    if (res.data) {
      state.templateList = res.data
    }
  }
}

// 打开对话框
const open = async (row: any = {}) => {
  state.sampleTypeList = []
  state.diseaseList = []
  state.templateList = []

  if (row.id > 0) {
    let diseaseCodes = []
    if (row.diseaseCode) {
      diseaseCodes = row.diseaseCode.split(',')
      await getDiseaseList(diseaseCodes)
    }

    let sampleTypeCodes = []
    if (row.parentCode) {
      sampleTypeCodes = row.parentCode.split(',')
      await getSampleTypeList(sampleTypeCodes)
    }
    let templateCodes = []
    if (row.templateCode) {
      templateCodes = row.templateCode.split(',')
      await getPathologyTemplateList(templateCodes)
    }
    const res = await new BasePathologySampleTypeApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BasePathologySampleTypeOutput
    }
  } else {
    state.form = defaultToAdd()
    if (row != null && row.typeGrade > 1) {
      state.form.typeGrade = row.typeGrade
      state.form.parentCode = row.sampleTypeCode
      await querySampleTypeList(row.sampleTypeCode)
    }
  }
  state.showDialog = true
}

const defaultToAdd = (): BasePathologySampleTypeAddInput => {
  return {
    sampleTypeCode: null,
    sampleTypeName: null,
    parentCode: null,
    typeGrade: 1,
    diseaseCode: null,
    diseaseCodeList: [],
    templateCode: null,
    templateCodeList: [],
    pinYin: null,
    sort: 0,
    isValid: true,
  } as BasePathologySampleTypeAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    if (state.form.diseaseCodeList) {
      state.form.diseaseCode = state.form.diseaseCodeList.join(',')
    }
    if (state.form.templateCodeList) {
      state.form.templateCode = state.form.templateCodeList.join(',')
    }
    if (state.form.typeGrade != 1) {
      state.form.diseaseCode = null
    }
    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BasePathologySampleTypeApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BasePathologySampleTypeApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBasePathologySampleType')
      state.showDialog = false
    }
  })
}

const editItemIsShow = (add: Boolean, edit: Boolean): Boolean => {
  if (add && edit) return true
  let isEdit = state.form.id != undefined && state.form.id > 0
  if (add && !isEdit) return true
  if (edit && isEdit) return true
  return false
}

defineExpose({
  open,
})
</script>

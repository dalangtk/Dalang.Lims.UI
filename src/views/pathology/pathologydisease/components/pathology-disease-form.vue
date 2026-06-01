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
            <el-form-item label="疾病代码" prop="diseaseCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.diseaseCode" placeholder="疾病代码" disabled> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="疾病名称" prop="diseaseName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.diseaseName" placeholder="疾病名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="恶性肿瘤" prop="isMalignantTumor" v-show="editItemIsShow(true, true)">
              <el-switch v-model="state.form.isMalignantTumor" placeholder="恶性肿瘤"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="非浸润性肿瘤" prop="isNonInvasiveTumor" v-show="editItemIsShow(true, true)">
              <el-switch v-model="state.form.isNonInvasiveTumor" placeholder="非浸润性肿瘤"> </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织学分级" prop="histologicalLevel" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.histologicalLevel" placeholder="组织学分级"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="免疫标记评估" prop="lmmuneMarkerEvaluation" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.lmmuneMarkerEvaluation" placeholder="免疫标记评估"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="化疗反应" prop="chemotherapyReaction" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.chemotherapyReaction" placeholder="化疗反应"> </el-input>
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

<script lang="ts" setup name="lims/base-pathology-disease/form">
import { getCurrentInstance, reactive, ref, toRefs } from 'vue'
import { BasePathologyDiseaseAddInput, BasePathologyDiseaseUpdateInput } from '/@/api/lims/pathology/datacontract/pathologydisease-datacontract'
import { BasePathologyDiseaseApi } from '/@/api/lims/pathology/pathologydisease'

import { makePy, makeWb } from '/@/utils/cuscode'
import eventBus from '/@/utils/mitt'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const { proxy } = getCurrentInstance() as any

const formRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as BasePathologyDiseaseAddInput | BasePathologyDiseaseUpdateInput | any,
})
const { form } = toRefs(state)

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BasePathologyDiseaseApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BasePathologyDiseaseUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const onNameChange = (val: string) => {
  state.form.pinYin = makePy(state.form.instrumentName)
  state.form.wuBi = makeWb(state.form.instrumentName)
}

const defaultToAdd = (): BasePathologyDiseaseAddInput => {
  return {
    diseaseCode: null,
    diseaseName: null,
    isMalignantTumor: null,
    isNonInvasiveTumor: null,
    histologicalLevel: null,
    lmmuneMarkerEvaluation: null,
    chemotherapyReaction: null,
    sort: 0,
    isValid: true,
  } as BasePathologyDiseaseAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BasePathologyDiseaseApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BasePathologyDiseaseApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBasePathologyDisease')
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

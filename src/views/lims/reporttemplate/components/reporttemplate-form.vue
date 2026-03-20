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
            <el-form-item label="模板代码" prop="templateCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.templateCode" placeholder="模板代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称" prop="templateName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.templateName" placeholder="模板名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="templateDescription" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.templateDescription" placeholder="描述"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组别代码" prop="groupCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.groupCode" placeholder="组别代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户代码" prop="hospitalCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.hospitalCode" placeholder="客户代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目代码" prop="itemCodes" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.itemCodes" placeholder="项目代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的代码" prop="purCodes" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.purCodes" placeholder="目的代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样本号" prop="sampleNoSymbols" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sampleNoSymbols" placeholder="样本号"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别代码" prop="genderCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.genderCode" placeholder="性别代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起始时间" prop="beginTime" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.beginTime" placeholder="起始时间"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止时间" prop="endTime" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.endTime" placeholder="截止时间"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子报表" prop="isSubTemplate" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.isSubTemplate" placeholder="子报表"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板类型" prop="templateType" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.templateType" placeholder="模板类型"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板类型" prop="templateDataSource" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.templateDataSource" placeholder="数据源"> </el-input>
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

<script lang="ts" setup name="lims/report-template/form">
import { reactive, toRefs, getCurrentInstance, ref, defineAsyncComponent } from 'vue'
import { ReportTemplateAddInput, ReportTemplateUpdateInput } from '/@/api/lims/reporttemplate/datacontract/reporttemplate-datacontract'
import { ReportTemplateApi } from '/@/api/lims/reporttemplate/reporttemplate'
import { auth, auths, authAll } from '/@/utils/authFunction'

import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'

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
  form: {} as ReportTemplateAddInput | ReportTemplateUpdateInput | any,
})
const { form } = toRefs(state)

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new ReportTemplateApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as ReportTemplateUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const defaultToAdd = (): ReportTemplateAddInput => {
  return {
    tenantId: 0,
    templateCode: '',
    templateName: '',
    templateDescription: null,
    groupCode: null,
    hospitalCode: null,
    itemCodes: null,
    purCodes: null,
    sampleNoSymbols: null,
    genderCode: null,
    beginTime: null,
    endTime: null,
    isSubTemplate: null,
    templateType: null,
    templateDataSource: null,
    isValid: true,
  } as ReportTemplateAddInput
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
      res = await new ReportTemplateApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new ReportTemplateApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshReportTemplate')
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

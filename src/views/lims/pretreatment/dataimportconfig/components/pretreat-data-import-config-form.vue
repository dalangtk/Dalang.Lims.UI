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
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="客户代码" prop="customerCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.customerCode" placeholder="客户代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="列名" prop="cellName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.cellName" placeholder="列名"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="字段名" prop="fieldName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.fieldName" placeholder="字段名"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="转换函数" prop="translateFunction" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.translateFunction" placeholder="转换函数"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="必须存在" prop="isMustExists" v-show="editItemIsShow(true, true)">
              <el-switch v-model="state.form.isMustExists" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="启用" prop="isValid" v-show="editItemIsShow(true, true)">
              <el-switch v-model="state.form.isValid" />
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

<script lang="ts" setup name="lims/pretreat-data-import-config/form">
import { reactive, toRefs, getCurrentInstance, ref } from 'vue'
import {
  PretreatDataImportConfigAddInput,
  PretreatDataImportConfigUpdateInput,
} from '/@/api/lims/pretreatment/datacontract/dataimportconfig-datacontract'
import { PretreatDataImportConfigApi } from '/@/api/lims/pretreatment/pretreatmentdataimportconfig'

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
  form: {} as PretreatDataImportConfigAddInput | PretreatDataImportConfigUpdateInput | any,
})
const { form } = toRefs(state)

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new PretreatDataImportConfigApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as PretreatDataImportConfigUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const defaultToAdd = (): PretreatDataImportConfigAddInput => {
  return {
    customerCode: null,
    cellName: null,
    fieldName: null,
    translateFunction: null,
    isMustExists: null,
    sort: 0,
    isValid: true,
  } as PretreatDataImportConfigAddInput
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
      res = await new PretreatDataImportConfigApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new PretreatDataImportConfigApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshPretreatDataImportConfig')
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

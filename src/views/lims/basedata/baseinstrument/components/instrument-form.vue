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
            <el-form-item label="仪器代码" prop="instrumentCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.instrumentCode" placeholder="仪器代码" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器名称" @change="onNameChange" prop="instrumentName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.instrumentName" placeholder="仪器名称" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="PinYin" prop="pinYin" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.pinYin" placeholder="PinYin" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="五笔" prop="wuBi" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.wuBi" placeholder="五笔" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义码" prop="customCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.customCode" placeholder="自定义码" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.remark" placeholder="备注" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sort" placeholder="" clearable> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用">
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

<script lang="ts" setup>
import { reactive, toRefs, ref } from 'vue'
import { BaseInstrumentAddInput, BaseInstrumentUpdateInput } from '/@/api/lims/basedata/datacontract/instrument-datacontract'
import { BaseInstrumentApi } from '/@/api/lims/basedata/baseinstrument'
import { makePy, makeWb } from '/@/utils/cuscode'

import eventBus from '/@/utils/mitt'
import modal from '/@/globalProperties/modal'

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
  form: {} as BaseInstrumentAddInput | BaseInstrumentUpdateInput | any,
})
const { form } = toRefs(state)

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseInstrumentApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseInstrumentUpdateInput
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

const defaultToAdd = (): BaseInstrumentAddInput => {
  return {
    instrumentCode: null,
    instrumentName: null,
    pinYin: null,
    wuBi: null,
    customCode: null,
    remark: null,
    sort: 0,
    isValid: true,
    proId: null,
    proName: null,
    proTime: new Date(),
    modId: null,
    modName: null,
    modTime: null,
    isModified: false,
  } as BaseInstrumentAddInput
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
      res = await new BaseInstrumentApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseInstrumentApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseInstrument')
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

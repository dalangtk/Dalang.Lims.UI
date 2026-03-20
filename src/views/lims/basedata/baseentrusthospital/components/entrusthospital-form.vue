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
            <el-form-item label="委托医院代码" prop="entrustHospitalCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.entrustHospitalCode" placeholder="委托医院代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="委托医院名称" prop="entrustHospitalName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.entrustHospitalName" @change="onNameChange" placeholder="委托医院名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contacts" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.contacts" placeholder="联系人"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.contactPhone" placeholder="联系电话"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拼音" prop="pinYin" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.pinYin" placeholder="拼音"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="五笔" prop="wuBi" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.wuBi" placeholder="五笔"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义码" prop="customCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.customCode" placeholder="自定义码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.remark" placeholder="备注"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sort" placeholder="排序"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用" v-show="editItemIsShow(true, true)">
              <el-switch v-model="form.isValid" />
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
import { reactive, toRefs, getCurrentInstance, ref } from 'vue'
import { BaseEntrustHospitalAddInput, BaseEntrustHospitalUpdateInput } from '/@/api/lims/basedata/datacontract/entrusthospital-datacontract'
import { BaseEntrustHospitalApi } from '/@/api/lims/basedata/baseentrusthospital'
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
  form: {} as BaseEntrustHospitalUpdateInput | BaseEntrustHospitalAddInput | any,
})
const { form } = toRefs(state)

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseEntrustHospitalApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })
    if (res?.success) {
      state.form = res.data as BaseEntrustHospitalUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const onNameChange = (val: string) => {
  state.form.pinYin = makePy(state.form.entrustHospitalName)
  state.form.wuBi = makeWb(state.form.entrustHospitalName)
}

const defaultToAdd = (): BaseEntrustHospitalAddInput => {
  return {
    entrustHospitalCode: null,
    entrustHospitalName: null,
    contacts: null,
    contactPhone: null,
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
  } as BaseEntrustHospitalAddInput
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
      res = await new BaseEntrustHospitalApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseEntrustHospitalApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseEntrustHospital')
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

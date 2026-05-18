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
            <el-form-item label="工作流" prop="wfCode" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.wfCode" placeholder="工作流" filterable remote clearable>
                <el-option v-for="item in state.wfOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核模式" prop="auditType" v-show="editItemIsShow(true, true)">
              <el-radio-group v-model="state.form.auditType">
                <el-radio :label="1">初复诊</el-radio>
                <el-radio :label="2">复诊</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="前缀" prop="sampleNoSymbol" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sampleNoSymbol" placeholder="前缀"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核人" prop="reviewUserId" v-show="editItemIsShow(true, true)">
              <el-select
                @change="userChange"
                v-model="state.form.reviewUserId"
                placeholder="审核人"
                filterable
                remote
                clearable
                :remote-method="queryUser"
              >
                <el-option v-for="item in state.userOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报告周期" prop="reportCycle" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.reportCycle" placeholder="报告周期" type="number"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="同用户报告" prop="canSameUserReport" v-show="editItemIsShow(true, true)">
              <el-switch v-model="state.form.canSameUserReport" placeholder="是否允许同用户报告"> </el-switch>
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

<script lang="ts" setup name="lims/base-pathology-setting/form">
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'
import { BasePathologySettingAddInput, BasePathologySettingUpdateInput } from '/@/api/lims/pathology/datacontract/pathologysetting-datacontract'
import { BasePathologySettingApi } from '/@/api/lims/pathology/pathologysetting'
import { BaseOptionsApi } from '/@/api/lims/shared/options'

import { LabelValueOutput } from '/@/api/admin/data-contracts'
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
  form: {} as BasePathologySettingAddInput | BasePathologySettingUpdateInput | any,
  userOptions: [] as LabelValueOutput[],
  wfOptions: [] as LabelValueOutput[],
})
const { userOptions, wfOptions } = toRefs(state)
const { form } = toRefs(state)

onMounted(() => {
  new BasePathologySettingApi().getPathologyWfCodes().then((res) => {
    state.wfOptions = res.data ?? []
  })
})
const queryUser = async (query: string) => {
  if (!query) return
  await new BaseOptionsApi().getUserOptions({ currentPage: 1, pageSize: 20, filter: query }).then((res) => {
    state.userOptions = res.data ?? []
  })
}
// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    state.userOptions = []
    state.userOptions.push({
      label: row.reviewUserName,
      value: row.reviewUserId,
    })
    const res = await new BasePathologySettingApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BasePathologySettingUpdateInput
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
const userChange = (val: string) => {
  state.form.reviewUserName = state.userOptions!.find((item: LabelValueOutput) => item.value == val)?.label
}

const defaultToAdd = (): BasePathologySettingAddInput => {
  return {
    wfCode: null,
    auditType: 1,
    sampleNoSymbol: null,
    reviewUserId: null,
    reviewUserName: null,
    reportCycle: null,
    canSameUserReport: false,
    sort: 0,
    isValid: true,
  } as BasePathologySettingAddInput
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
      res = await new BasePathologySettingApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BasePathologySettingApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBasePathologySetting')
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

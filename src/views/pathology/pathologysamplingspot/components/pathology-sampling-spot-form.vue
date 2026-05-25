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
            <el-form-item label="取材部位代码" prop="samplingSpotCode">
              <el-input v-model="state.form.samplingSpotCode" placeholder="取材部位代码" :disabled="editItemIsShow(false, true)"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="取材部位名称" @change="onNameChange" prop="samplingSpotName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.samplingSpotName" placeholder="取材部位名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.gender" placeholder="性别">
                <el-option v-for="item in state.genderList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拼音" prop="pinYin" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.pinYin" placeholder="拼音"> </el-input>
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

<script lang="ts" setup name="lims/base-pathology-sampling-spot/form">
import { getCurrentInstance, reactive, ref, toRefs, onMounted } from 'vue'
import {
  BasePathologySamplingSpotAddInput,
  BasePathologySamplingSpotUpdateInput,
} from '/@/api/lims/pathology/datacontract/pathologysamplingspot-datacontract'
import { BasePathologySamplingSpotApi } from '/@/api/lims/pathology/pathologysamplingspot'

import { makePy } from '/@/utils/cuscode'
import eventBus from '/@/utils/mitt'
import { LabelValueOutput } from '/@/api/admin/data-contracts'
import { BaseOptionsApi } from '/@/api/lims/shared/options'

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
  genderList: [] as LabelValueOutput[],
  form: {} as BasePathologySamplingSpotAddInput | BasePathologySamplingSpotUpdateInput | any,
})
const { form } = toRefs(state)

onMounted(() => {
  new BaseOptionsApi().getDictOptions({ currentPage: 1, pageSize: 20, filter: 'Gender' }, { loading: true }).then((res) => {
    if (res?.success) {
      state.genderList = res.data || []
    }
  })
})

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BasePathologySamplingSpotApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BasePathologySamplingSpotUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const onNameChange = (val: string) => {
  console.log
  state.form.pinYin = makePy(state.form.samplingSpotName)
}

const defaultToAdd = (): BasePathologySamplingSpotAddInput => {
  return {
    samplingSpotCode: null,
    samplingSpotName: null,
    gender: '103',
    pinYin: null,
    sort: 0,
    isValid: true,
  } as BasePathologySamplingSpotAddInput
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
      res = await new BasePathologySamplingSpotApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BasePathologySamplingSpotApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshPathologySamplingSpot')
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

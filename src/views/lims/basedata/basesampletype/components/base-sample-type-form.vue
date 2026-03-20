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
            <el-form-item label="标本类型名称" @change="onNameChange" prop="sampleTypeName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sampleTypeName" placeholder="标本类型名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.gender" filterable clearable placeholder="性别">
                <el-option v-for="item in state.genderList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
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
              <el-input-number v-model="state.form.sort" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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

<script lang="ts" setup name="lims/base-sample-type/form">
import { reactive, toRefs, getCurrentInstance, ref, onMounted } from 'vue'
import { BaseSampleTypeAddInput, BaseSampleTypeUpdateInput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'
import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'

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
  genderList: [] as DictGetListDto[] | null,
  form: {} as BaseSampleTypeAddInput | BaseSampleTypeUpdateInput | any,
})
const { form } = toRefs(state)

onMounted(() => {
  new DictApi().getList(['Gender']).then((res) => {
    state.genderList = res.data!.gender
  })
})

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseSampleTypeApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseSampleTypeUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const onNameChange = (val: string) => {
  state.form.pinYin = makePy(state.form.sampleTypeName)
  state.form.wuBi = makeWb(state.form.sampleTypeName)
}

const defaultToAdd = (): BaseSampleTypeAddInput => {
  return {
    sampleTypeCode: null,
    sampleTypeName: null,
    gender: '103',
    pinYin: null,
    wuBi: null,
    customCode: null,
    remark: null,
    sort: 0,
    isValid: true,
  } as BaseSampleTypeAddInput
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
      res = await new BaseSampleTypeApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseSampleTypeApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseSampleType')
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

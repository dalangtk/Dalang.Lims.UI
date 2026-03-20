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
            <el-form-item label="个性名称" prop="purNamePersonalize" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.purNamePersonalize" placeholder="个性名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户代码" prop="customerCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.customerCode" placeholder="客户代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标本类型" prop="sampleTypeCode" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.sampleTypeCode" multiple filterable clearable placeholder="标本类型">
                <el-option
                  v-for="item in state.sampleTypeList"
                  :key="item.sampleTypeCode"
                  :label="item.sampleTypeName"
                  :value="item.sampleTypeCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="form.sort" />
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

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted } from 'vue'
import modal from '/@/globalProperties/modal'
import { BasePurposePersonalizeApi } from '/@/api/lims/basedata/basepurpose'
import { BasePurposePersonalizeAddInput, BasePurposePersonalizeUpdateInput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'
const emit = defineEmits(['personalizeConfirm'])

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
  form: {} as BasePurposePersonalizeAddInput | BasePurposePersonalizeUpdateInput | any,
  sampleTypeList: [] as BaseSampleTypeOutput[],
})
const { form } = toRefs(state)

onMounted(async () => {
  await new BaseSampleTypeApi()
    .getAll()
    .then((res) => {
      state.sampleTypeList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
})
// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BasePurposePersonalizeApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BasePurposePersonalizeUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}
const defaultToAdd = (): BasePurposePersonalizeAddInput => {
  return {
    id: 0,
    purCode: '',
    sampleTypeCode: [],
    purNamePersonalize: null,
    customerCode: null,
    sort: 0,
    isValid: true,
    sampleTypeName: '',
  } as BasePurposePersonalizeAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    if (state.form.sampleTypeCode.length > 0) {
      const filteredItems = state.sampleTypeList.filter((item) => state.form.sampleTypeCode.includes(item.sampleTypeCode))
      // 提取 sampleTypeName 并拼接成字符串
      state.form.sampleTypeName = filteredItems.map((item) => item.sampleTypeName).join(',')
    }

    emit('personalizeConfirm', state.form)
    state.showDialog = false
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

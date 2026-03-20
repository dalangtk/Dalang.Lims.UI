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
            <el-form-item label="序列代码" prop="sequenceCode" v-show="editItemIsShow(true, false)">
              <el-input v-model="state.form.sequenceCode" placeholder="序列代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序列名称" prop="sequenceName" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sequenceName" placeholder="序列名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序列标识" prop="identifier" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.identifier" placeholder="序列标识"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="前缀" prop="perfix" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.perfix" placeholder="前缀"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="序列内容" prop="sequenceValue" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sequenceValue" placeholder="序列内容"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起始号" prop="startNo" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.startNo" placeholder="起始号"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="步长" prop="sequenceStep" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.sequenceStep" placeholder="步长"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补齐长度" prop="completionLength" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.completionLength" placeholder="补齐长度"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补齐字符" prop="completionChar" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.completionChar" placeholder="补齐字符"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="后缀" prop="suffix" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.suffix" placeholder="后缀"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="重置类型"
              prop="resetType"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择重置类型', trigger: ['blur', 'change'] }]"
            >
              <el-select v-model="state.form.resetType" placeholder="请选择重置类型" clearable filterable>
                <el-option v-for="r in state.seqResetTimeTypeList" :key="r.id" :label="r.name" :value="r.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重置时间" prop="resetTime" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.resetTime" placeholder="重置时间"> </el-input>
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

<script lang="ts" setup name="lims/base-sequence/form">
import { reactive, toRefs, getCurrentInstance, ref, onMounted } from 'vue'
import { BaseSequenceAddInput, BaseSequenceUpdateInput } from '/@/api/lims/basedata/datacontract/sequence-datacontract'
import { BaseSequenceApi } from '/@/api/lims/basedata/basesequence'
import eventBus from '/@/utils/mitt'
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
  form: {} as BaseSequenceAddInput | BaseSequenceUpdateInput | any,
  seqResetTimeTypeList: [] as DictGetListDto[] | null,
})
const { form } = toRefs(state)

onMounted(() => {
  new DictApi().getList(['SeqResetTimeType']).then((res) => {
    state.seqResetTimeTypeList = res.data!.seqResetTimeType
  })
})

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseSequenceApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseSequenceUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const defaultToAdd = (): BaseSequenceAddInput => {
  return {
    sequenceCode: null,
    sequenceName: null,
    identifier: null,
    perfix: null,
    sequenceValue: null,
    startNo: 1,
    sequenceStep: 1,
    completionLength: 4,
    completionChar: '0',
    suffix: null,
    resetType: null,
    resetTime: null,
    sort: 0,
    isValid: true,
    proId: null,
    proName: null,
    proTime: new Date(),
    modId: null,
    modName: null,
    modTime: null,
    isModified: false,
  } as BaseSequenceAddInput
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
      res = await new BaseSequenceApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseSequenceApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseSequence')
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

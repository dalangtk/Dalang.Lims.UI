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
        <el-row :gutter="10">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item
              label="委托周期"
              prop="entrustCycleList"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择周日', trigger: ['blur', 'change'] }]"
            >
              <el-select v-model="state.form.entrustCycleList" filterable clearable multiple :max-collapse-tags="6">
                <el-option v-for="item in state.entrustCycleList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="问询日期" prop="askDay" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.askDay" placeholder="问询日期" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="问询时间" prop="askTime" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.askTime" placeholder="问询时间"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item label="包含节假日" prop="isIncludeHoliday" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.isIncludeHoliday" clearable>
                <el-option v-for="item in state.yesOrNoList" :key="item.code" :label="item.name" :value="item.code === '1' ? true : false">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.sort" placeholder="排序" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
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
import { onMounted, reactive, ref, toRefs } from 'vue'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseAskRuleDetailApi } from '/@/api/lims/basedata/baseaskrule'
import { BaseAskRuleDetailAddInput, BaseAskRuleDetailUpdateInput } from '/@/api/lims/basedata/datacontract/askrule-datacontract'
import modal from '/@/globalProperties/modal'
import eventBus from '/@/utils/mitt'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  currAskRuleCode: {
    type: String,
    default: '',
  },
})

const formRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  entrustCycleList: [] as DictGetListDto[] | null,
  yesOrNoList: [] as DictGetListDto[] | null,
  form: {} as BaseAskRuleDetailAddInput | BaseAskRuleDetailUpdateInput | any,
})
const { form } = toRefs(state)

onMounted(async () => {
  await new DictApi().getList(['ExamPlanCycle', 'YesOrNoDict']).then((res) => {
    state.entrustCycleList = res.data!.examPlanCycle
    state.yesOrNoList = res.data!.yesOrNoDict
  })
})
// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseAskRuleDetailApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseAskRuleDetailUpdateInput
      state.form.entrustCycleList = state.form.entrustCycle.split(',')
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const defaultToAdd = (): BaseAskRuleDetailAddInput => {
  return {
    askRuleCode: props.currAskRuleCode,
    entrustCycle: null,
    entrustCycleList: ['1', '2', '3', '4', '5', '6', '7'],
    askDay: 1,
    askTime: '08:00:00',
    isIncludeHoliday: false,
    sort: 0,
    isValid: true,
  } as BaseAskRuleDetailAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    state.form.entrustCycle = state.form.entrustCycleList.join(',')
    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BaseAskRuleDetailApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseAskRuleDetailApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseAskRuleDetail')
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

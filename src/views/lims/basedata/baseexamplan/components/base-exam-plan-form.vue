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
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item
              label="检测计划代码"
              prop="examPlanCode"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请输入代码', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="state.form.examPlanCode" placeholder="检测计划代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item
              label="检测计划名称"
              prop="examPlanName"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请输入名称', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="state.form.examPlanName" placeholder="检测计划名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item
              label="计划类型"
              prop="planType"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择类型', trigger: ['blur', 'change'] }]"
            >
              <el-select v-model="state.form.planType" filterable clearable>
                <el-option v-for="item in state.examPlanTypeList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item
              label="检测周期"
              prop="planCycleList"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择周日', trigger: ['blur', 'change'] }]"
            >
              <el-select v-model="state.form.planCycleList" filterable clearable multiple :max-collapse-tags="6">
                <el-option v-for="item in state.examPlanCycleList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item label="包含节假日" prop="isIncludeHoliday" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.isIncludeHoliday" filterable clearable :max-collapse-tags="6">
                <el-option v-for="item in state.yesOrNoList" :key="item.code" :label="item.name" :value="item.code === '1' ? true : false">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.remark" placeholder="备注"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.sort" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
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
import { BaseExamPlanAddInput, BaseExamPlanUpdateInput } from '/@/api/lims/basedata/datacontract/examplan-datacontract'
import { BaseExamPlanApi } from '/@/api/lims/basedata/baseexamplan'
import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'
import modal from '/@/globalProperties/modal'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'

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
  form: {} as BaseExamPlanAddInput | BaseExamPlanUpdateInput | any,
  examPlanTypeList: [] as DictGetListDto[] | null,
  examPlanCycleList: [] as DictGetListDto[] | null,
  yesOrNoList: [] as DictGetListDto[] | null,
})
const { form } = toRefs(state)

onMounted(async () => {
  await new DictApi().getList(['ExamPlanType', 'ExamPlanCycle', 'YesOrNoDict']).then((res) => {
    state.examPlanTypeList = res.data!.examPlanType
    state.examPlanCycleList = res.data!.examPlanCycle
    state.yesOrNoList = res.data!.yesOrNoDict
  })
})

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseExamPlanApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseExamPlanUpdateInput
      state.form.planCycleList = state.form.planCycle.split(',')
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

const defaultToAdd = (): BaseExamPlanAddInput => {
  return {
    examPlanCode: '',
    examPlanName: '',
    planType: '',
    planCycle: null,
    isIncludeHoliday: false,
    remark: null,
    sort: 0,
    isValid: true,
  } as BaseExamPlanAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    //planTypeList
    state.form.planCycle = state.form.planCycleList.join(',')

    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BaseExamPlanApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseExamPlanApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseExamPlan')
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

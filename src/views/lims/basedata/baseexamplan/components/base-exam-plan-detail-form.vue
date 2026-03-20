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
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item
              label="接收时间"
              prop="receiveTime"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择接收时间', trigger: ['blur', 'change'] }]"
            >
              <el-time-picker v-model="state.form.receiveTime" placeholder="接收时间" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="检测间隔" prop="testInterval" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.testInterval" placeholder="检测间隔" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="报告间隔" prop="reportInterval" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.reportInterval" placeholder="报告间隔" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="报告时间" prop="reportTimePoint" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.reportTimePoint" placeholder="报告时间"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
            <el-form-item label="时间类型" prop="timePointType" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.timePointType" filterable clearable :max-collapse-tags="6">
                <el-option v-for="item in state.timePointTypeList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
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
import { reactive, toRefs, ref, onMounted } from 'vue'
import { BaseExamPlanDetailAddInput, BaseExamPlanDetailUpdateInput } from '/@/api/lims/basedata/datacontract/examplan-datacontract'
import { BaseExamPlanDetailApi } from '/@/api/lims/basedata/baseexamplan'
import eventBus from '/@/utils/mitt'
import modal from '/@/globalProperties/modal'
import { getTodayEnd } from '/@/utils/formatTime'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  currExamPlatCode: {
    type: String,
    default: '',
  },
})

const formRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as BaseExamPlanDetailAddInput | BaseExamPlanDetailUpdateInput | any,
  timePointTypeList: [] as DictGetListDto[] | null,
})
const { form } = toRefs(state)

onMounted(async () => {
  await new DictApi().getList(['ExamPlanTimeType']).then((res) => {
    state.timePointTypeList = res.data!.examPlanTimeType
  })
})
// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseExamPlanDetailApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseExamPlanDetailUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const defaultToAdd = (): BaseExamPlanDetailAddInput => {
  return {
    tenantId: 0,
    examPlanCode: props.currExamPlatCode,
    receiveTime: getTodayEnd(),
    testInterval: null,
    reportInterval: null,
    reportTimePoint: '08:00',
    timePointType: '101',
    sort: 0,
    isValid: true,
  } as BaseExamPlanDetailAddInput
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
      res = await new BaseExamPlanDetailApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseExamPlanDetailApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseExamPlanDetail')
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

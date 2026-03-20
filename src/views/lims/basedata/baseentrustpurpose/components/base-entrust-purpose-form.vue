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
            <el-form-item
              label="目的"
              prop="purCode"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择目的', trigger: ['blur', 'change'] }]"
            >
              <el-select
                v-model="state.form.purCode"
                placeholder="请选择目的"
                filterable
                remote
                :remote-method="queryPurpose"
                @change="purposeChange"
              >
                <el-option v-for="item in state.purposeOptions" :key="item.purCode" :label="item.purName" :value="item.purCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="委托医院" prop="entrustHospitalCode" v-show="editItemIsShow(true, true)">
              <el-select
                v-model="state.form.entrustHospitalCode"
                placeholder="请选择委托医院"
                filterable
                remote
                :remote-method="queryEntrustHospital"
                @change="entrustHospitalChange"
              >
                <el-option v-for="item in state.entrustHospitalOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="问询规则"
              prop="askRuleCode"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择问询规则', trigger: ['blur', 'change'] }]"
            >
              <el-select v-model="state.form.askRuleCode" placeholder="请选择问询规则" clearable filterable remote :remote-method="queryAskRule">
                <el-option v-for="item in state.askRuleOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="起始时间"
              prop="beginTime"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择起始时间', trigger: ['blur', 'change'] }]"
            >
              <!-- <el-input v-model="state.form.beginTime" placeholder="起始时间"> </el-input> -->
              <el-date-picker style="width: 100%" v-model="state.form.beginTime" type="datetime" placeholder="起始时间" format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="截止时间"
              prop="endTime"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择截止时间', trigger: ['blur', 'change'] }]"
            >
              <!-- <el-input v-model="state.form.endTime" placeholder="截止时间"> </el-input> -->
              <el-date-picker style="width: 100%" v-model="state.form.endTime" type="datetime" placeholder="起始时间" format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="接收周期"
              prop="receiveDaysList"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请选择接收周期', trigger: ['blur', 'change'] }]"
            >
              <el-select v-model="state.form.receiveDaysList" filterable clearable multiple :max-collapse-tags="6">
                <el-option v-for="item in state.receiveCycleList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收时间" prop="receiveTime" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.receiveTime" placeholder="接收时间"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户代码" prop="customerCode" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.customerCode" placeholder="请选择客户" clearable filterable remote :remote-method="queryCustomer">
                <el-option v-for="item in state.customerOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标本类型" prop="sampleTypeCodeList" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.sampleTypeCodeList" multiple filterable clearable placeholder="标本类型">
                <el-option v-for="item in sampleTypeList" :key="item.sampleTypeCode" :label="item.sampleTypeName" :value="item.sampleTypeCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户反向判定" prop="isCustomerReverse" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.isCustomerReverse" clearable placeholder="客户反向判定">
                <el-option v-for="item in state.yesOrNoList" :key="item.code" :label="item.name" :value="item.code === '1' ? true : false">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.remark" placeholder="备注"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.sort" placeholder="排序" />
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

<script lang="ts" setup name="lims/base-entrust-purpose/form">
import { computed, getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'
import { BaseEntrustPurposeApi } from '/@/api/lims/basedata/baseentrustpurpose'
import { BaseEntrustPurposeAddInput, BaseEntrustPurposeUpdateInput } from '/@/api/lims/basedata/datacontract/entrustpurpose-datacontract'

import { DictGetListDto, LabelValueOutput } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { BaseOptionsApi } from '/@/api/lims/shared/options'
import modal from '/@/globalProperties/modal'
import { makePy, makeWb } from '/@/utils/cuscode'
import eventBus from '/@/utils/mitt'
import { BasePurposeApi } from '/@/api/lims/basedata/basepurpose'
import { BasePurposeListOutput, BasePurposeOutput, BasePurposeQueryListInput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import { getTodayStart } from '/@/utils/formatTime'

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
  entrustHospitalOptions: [] as LabelValueOutput[],
  customerOptions: [] as LabelValueOutput[],
  purposeOptions: [] as BasePurposeListOutput[],
  askRuleOptions: [] as LabelValueOutput[],
  sampleTypeList: [] as BaseSampleTypeOutput[],
  displaySampleTypeList: [] as BaseSampleTypeOutput[],
  receiveCycleList: [] as DictGetListDto[] | null,
  yesOrNoList: [] as DictGetListDto[] | null,
  form: {} as BaseEntrustPurposeAddInput | BaseEntrustPurposeUpdateInput | any,
})
const { form } = toRefs(state)

onMounted(async () => {
  await new DictApi().getList(['ExamPlanCycle', 'YesOrNoDict']).then((res) => {
    state.receiveCycleList = res.data!.examPlanCycle
    state.yesOrNoList = res.data!.yesOrNoDict
  })

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
    const res = await new BaseEntrustPurposeApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseEntrustPurposeUpdateInput
      state.form.receiveDaysList = state.form.receiveDays.split(',')
      state.form.sampleTypeCodeList = state.form.sampleTypeCode ? state.form.sampleTypeCode.split(',') : []
      queryPurpose(state.form.purCode)
      queryAskRule(state.form.askRuleCode)
      queryEntrustHospital(state.form.entrustHospitalCode)
      queryCustomer(state.form.customerCode)
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const sampleTypeList = computed(() => {
  if (!state.form.purCode || state.purposeOptions.length === 0) return []

  var currPurpose = state.purposeOptions.find((x) => x.purCode == state.form.purCode)
  var purSampleTypeList = currPurpose!.sampleTypeCode!.split(',')
  return state.sampleTypeList.filter((x) => purSampleTypeList.includes(x.sampleTypeCode!))
})
const purposeChange = (val: string) => {
  state.displaySampleTypeList = []
  state.form.sampleTypeCode = ''
  state.form.sampleTypeCodeList = []
  // if (!val) return

  // var currPurpose = state.purposeOptions.find((x) => x.purCode == val)
  // var purSampleTypeList = currPurpose!.sampleTypeCode!.split(',')
  // state.displaySampleTypeList = state.sampleTypeList.filter((x) => purSampleTypeList.includes(x.sampleTypeCode!))
}
const queryEntrustHospital = (input: string) => {
  if (!input && state.form.id <= 0) return
  let param = {
    currentPage: 1,
    pageSize: 20,
    filter: input,
  } as GetPageInput<string>
  new BaseOptionsApi().getEntrustHospitalOptions(param).then((res) => {
    state.entrustHospitalOptions = res.data!
  })
}
const queryCustomer = (input: string) => {
  if (!input && state.form.id <= 0) return
  let param = {
    currentPage: 1,
    pageSize: 20,
    filter: input,
  } as GetPageInput<string>
  new BaseOptionsApi().getCustomerOptions(param).then((res) => {
    state.customerOptions = res.data!
  })
}
const queryPurpose = (input: string) => {
  if (!input && state.form.id <= 0) return
  let param = {
    currentPage: 1,
    pageSize: 20,
    filter: {
      purCodes: [input],
    } as BasePurposeQueryListInput,
  } as GetPageInput<BasePurposeQueryListInput>
  new BasePurposeApi().getPage(param).then((res) => {
    state.purposeOptions = res.data!.list!
  })
}
const queryAskRule = (input: string) => {
  if (!input && state.form.id <= 0) return
  let param = {
    currentPage: 1,
    pageSize: 20,
    filter: input,
  } as GetPageInput<string>
  new BaseOptionsApi().getAskRuleOptions(param).then((res) => {
    state.askRuleOptions = res.data!
  })
}
const entrustHospitalChange = (val: string) => {
  if (!val) state.form.entrustHospitalName = ''

  var currHospital = state.entrustHospitalOptions.find((x) => x.value == val)
  state.form.entrustHospitalName = currHospital!.value
}
const onNameChange = (val: string) => {
  state.form.pinYin = makePy(state.form.instrumentName)
  state.form.wuBi = makeWb(state.form.instrumentName)
}

const defaultToAdd = (): BaseEntrustPurposeAddInput => {
  return {
    purCode: '',
    entrustHospitalCode: '',
    entrustHospitalName: '',
    askRuleCode: '',
    beginTime: getTodayStart(),
    endTime: new Date(2099, 11, 31),
    receiveDays: '',
    receiveDaysList: ['1', '2', '3', '4', '5', '6', '7'],
    receiveTime: '23:59:59',
    customerCode: null,
    sampleTypeCode: null,
    sampleTypeCodeList: [],
    isCustomerReverse: false,
    remark: null,
    sort: 0,
    isValid: true,
  } as BaseEntrustPurposeAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    state.form.receiveDays = state.form.receiveDaysList.join(',')
    state.form.sampleTypeCode = state.form.sampleTypeCodeList.join(',')
    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BaseEntrustPurposeApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseEntrustPurposeApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseEntrustPurpose')
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

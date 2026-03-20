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
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form ref="formRef" :model="state.form.combo" size="small" label-width="auto" class="comboeditform">
            <el-form-item label="套餐代码" prop="comboCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.combo.comboCode" placeholder="套餐代码" disabled> </el-input>
            </el-form-item>
            <el-form-item
              label="套餐名称"
              prop="comboName"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请输入套餐名称', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="state.form.combo.comboName" placeholder="套餐名称"> </el-input>
            </el-form-item>
            <el-form-item label="客户" prop="customerCode" v-show="editItemIsShow(true, true)">
              <!-- <el-input v-model="state.form.customerCode" placeholder="客户"> </el-input> -->
              <el-select
                v-model="state.form.combo.customerCode"
                placeholder="客户"
                filterable
                remote
                clearable
                :remote-method="queryCustomer"
                @change="onNameChange"
              >
                <el-option v-for="item in state.customerList" :key="item.customerCode" :label="item.customerName" :value="item.customerCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="起始时间" prop="beginDate" v-show="editItemIsShow(true, true)">
              <!-- <el-input v-model="state.form.beginDate" placeholder="起始时间"> </el-input> -->
              <el-date-picker
                style="width: 100%"
                v-model="state.form.combo.beginDate"
                type="datetime"
                placeholder="起始时间"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="截止时间" prop="endDate" v-show="editItemIsShow(true, true)">
              <!-- <el-input v-model="state.form.endDate" placeholder="截至时间"> </el-input> -->
              <el-date-picker
                style="width: 100%"
                v-model="state.form.combo.endDate"
                type="datetime"
                placeholder="截止时间"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="标本类型" prop="sampleTypeCode" v-show="editItemIsShow(true, true)">
              <!-- <el-input v-model="state.form.sampleTypeCode" placeholder="标本类型"> </el-input> -->
              <el-select
                v-model="state.form.combo.sampleTypeCode"
                placeholder="标本类型"
                filterable
                remote
                clearable
                :remote-method="querySampleType"
              >
                <el-option v-for="item in state.sampleTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.combo.remark" placeholder="备注"> </el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.combo.sort" placeholder="排序"> </el-input-number>
            </el-form-item>
            <el-form-item label="启用" prop="isValid" v-show="editItemIsShow(true, true)">
              <el-switch v-model="state.form.combo.isValid" placeholder="启用"> </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <ComboDetail ref="comboDetailRef" :readonly="false"></ComboDetail>
        </el-col>
      </el-row>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="lims/base-combo/form">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { BaseComboApi } from '/@/api/lims/basedata/basecombo'
import { BaseCustomerApi } from '/@/api/lims/basedata/basecustomer'
import {
  BaseComboDetailOutput,
  BaseComboUpdateInput,
  ComboAddOrUpdateInput
} from '/@/api/lims/basedata/datacontract/combo-datacontract'
import ComboDetail from '/@/views/lims/basedata/basecombo/components/combodetail.vue'

import { LabelValueOutput } from '/@/api/admin/data-contracts'
import { BaseCustomerOutput } from '/@/api/lims/basedata/datacontract/customer-datacontract'
import { BaseOptionsApi } from '/@/api/lims/shared/options'
import modal from '/@/globalProperties/modal'
import { getTodayStart, parseDate } from '/@/utils/formatTime'
import eventBus from '/@/utils/mitt'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const formRef = ref()
let comboDetailRef = ref()

const state = reactive({
  showDialog: false,
  sureLoading: false,
  customerList: [] as BaseCustomerOutput[],
  sampleTypeList: [] as LabelValueOutput[],

  form: {} as ComboAddOrUpdateInput,
})
const { form } = toRefs(state)

onMounted(() => {
  // new BaseOptionsApi().getSampleTypeOptions({ currentPage: 1, pageSize: 20 }).then((res) => {
  //   state.sampleTypeList = res.data ?? []
  // })
})
// 打开对话框
const open = async (row: any = {}) => {
  console.log('open')
  if (row.id > 0) {
    const res = await new BaseComboApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form.combo = res.data as BaseComboUpdateInput
      querySampleType(state.form.combo.sampleTypeCode!, false)
    }
  } else {
    state.form = defaultToAdd()
    querySampleType(state.form.combo.sampleTypeCode!, true)
  }
  state.showDialog = true
}
const queryCustomer = async (query: string) => {
  if (!query) return
  await new BaseCustomerApi()
    .getPage(
      {
        currentPage: 1,
        pageSize: 10,
        filter: {
          customerCode: query,
        },
      },
      { showErrorMessage: true }
    )
    .then((res) => {
      state.customerList = res.data!.list ?? []
    })
}

const querySampleType = async (query: string, isAdd: boolean) => {
  if (!query && !isAdd) return
  new BaseOptionsApi().getSampleTypeOptions({ currentPage: 1, pageSize: 20, filter: query }).then((res) => {
    state.sampleTypeList = res.data ?? []
  })
}
const onNameChange = (val: string) => {
  // state.form.pinYin = makePy(state.form.instrumentName)
  // state.form.wuBi = makeWb(state.form.instrumentName)
}
const refreshComboDetail = (comboCode: string) => {
  // nextTick(() => {
  //   console.log(comboDetailRef.value.refreshDetail)
  //   comboDetailRef.value.refreshDetail(comboId)
  // })
  setTimeout(() => {
    comboDetailRef.value.refreshDetail(comboCode)
  }, 200)
  // comboDetailRef.value.refreshDetail(comboId)
}
const defaultToAdd = (): ComboAddOrUpdateInput => {
  let obj = {
    combo: {
      comboCode: '',
      comboName: '',
      customerCode: null,
      beginDate: getTodayStart(),
      endDate: parseDate('2099-12-31'),
      sampleTypeCode: null,
      remark: null,
      sort: 0,
      isValid: true,
    } as BaseComboUpdateInput,
    comboDetail: [],
  }
  return obj
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    var selectPurposes = comboDetailRef.value.getComboDetail() as BaseComboDetailOutput[]
    if (!selectPurposes || selectPurposes.length == 0) {
      modal.msgError('请选择目的')
      return
    }

    state.form.comboDetail = selectPurposes.map((item) => item.purCode!)

    console.log(state.form)

    state.sureLoading = true
    let res = {} as any
    if (state.form.combo.id != undefined && state.form.combo.id > 0) {
      res = await new BaseComboApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseComboApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseCombo')
      state.showDialog = false
    }
  })
}

const editItemIsShow = (add: Boolean, edit: Boolean): Boolean => {
  if (add && edit) return true
  let isEdit = state.form.combo.id != undefined && state.form.combo.id > 0
  if (add && !isEdit) return true
  if (edit && isEdit) return true
  return false
}

defineExpose({
  open,
  refreshComboDetail,
})
</script>
<style scoped lang="scss">
.comboedit {
  display: flex;
  flex-direction: row;

  .comboeditform {
    width: 30%;
  }
}

.datepicker {
  width: 100%;
}
</style>

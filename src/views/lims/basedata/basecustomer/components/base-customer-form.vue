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
      <el-tabs v-model="state.activeTab" class="tabclass" :default-value="state.activeTab">
        <el-tab-pane label="客户信息" name="customer">
          <el-form ref="formRef" :model="state.form" size="default" label-width="auto" class="formclass">
            <el-row :gutter="5">
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="客户代码" prop="customerCode" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.customerCode" placeholder="客户代码"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="客户名称" prop="customerName" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.customerName" placeholder="客户名称"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="客户简称" prop="customerNameAB" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.customerNameAB" placeholder="客户简称"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="区域" prop="area" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.area" placeholder="区域"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="详细地址" prop="address" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.address" placeholder="详细地址"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="客户等级" prop="customerLevel" v-show="editItemIsShow(true, true)">
                  <el-select v-model="state.form.customerLevel" placeholder="请选择客户等级">
                    <el-option v-for="item in state.customerLevelList" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="客户类型" prop="customerType" v-show="editItemIsShow(true, true)">
                  <el-select v-model="state.form.customerType" placeholder="请选择客户类型">
                    <el-option v-for="item in state.customerTypeList" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="客户性质" prop="customerNature" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.customerNature" placeholder="客户性质"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="合作模式" prop="collaborationMode" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.collaborationMode" placeholder="合作模式"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="联系人" prop="contacts" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.contacts" placeholder="联系人"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="联系电话" prop="contactPhone" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.contactPhone" placeholder="联系电话"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="危急值联系人" prop="criticalContacts" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.criticalContacts" placeholder="危急值联系人"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="危急值电话" prop="criticalContactPhone" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.criticalContactPhone" placeholder="危急值联系电话"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="录入方式" prop="doubleInputType" v-show="editItemIsShow(true, true)">
                  <!-- <el-input v-model="state.form.doubleInputType" placeholder="信息录入方式"> </el-input> -->
                  <el-select v-model="state.form.doubleInputType" placeholder="请选择录入方式">
                    <el-option v-for="item in state.inputTypeList" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="合作方式" prop="cooperateType" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.cooperateType" placeholder="合作方式"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="首次合作" prop="firstCooperateTime" v-show="editItemIsShow(true, true)">
                  <el-date-picker v-model="state.form.firstCooperateTime" type="date" placeholder="首次合作时间" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="客户分类" prop="customerClassification" v-show="editItemIsShow(true, true)">
                  <el-select v-model="state.form.customerClassification" placeholder="请选择客户分类">
                    <el-option v-for="item in state.customerClassificationList" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.remark" placeholder="备注"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.sort" placeholder="排序"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="启用" prop="isValid" v-show="editItemIsShow(true, true)">
                  <el-switch v-model="state.form.isValid" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="报告扩展" name="customerReportExtend">
          <el-form ref="formRef" :model="state.reportExtend" size="default" label-width="auto" class="formclass">
            <el-row :gutter="5">
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="logo" prop="customerLogo" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.customerLogo" placeholder="logo"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="签章" prop="customerSignature" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.customerSignature" placeholder="签章"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="生成报告" prop="isGenerateReport" v-show="editItemIsShow(true, true)">
                  <el-checkbox v-model="state.reportExtend.isGenerateReport" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="优先级" prop="reportPriority" v-show="editItemIsShow(true, true)">
                  <el-input type="number" v-model="state.reportExtend.reportPriority" placeholder="优先级"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="DPI" prop="imageDpi" v-show="editItemIsShow(true, true)">
                  <el-input type="number" v-model="state.reportExtend.imageDpi" placeholder="DPI"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="语言类型" prop="languageType" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.languageType" placeholder="语言类型"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="主标题" prop="reportMainTitle" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.reportMainTitle" placeholder="主标题"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="子标题" prop="reportSubTitle" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.reportSubTitle" placeholder="子标题"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="地址" prop="address" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.address" placeholder="地址"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="电话" prop="telephone" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.telephone" placeholder="电话"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="抬头类型" prop="generateTitleType" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.generateTitleType" placeholder="抬头类型"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-form-item label="报告查询" prop="canSearchReportChannel" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.reportExtend.canSearchReportChannel" placeholder="报告查询"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="财务扩展" name="third">财务扩展</el-tab-pane>
        <el-tab-pane label="业务员" name="fourth">业务员</el-tab-pane>
      </el-tabs>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="lims/base-customer/form">
import { reactive, toRefs, ref, defineAsyncComponent, onMounted } from 'vue'
import {
  AddCustomerInput,
  BaseCustomerAddInput,
  BaseCustomerUpdateInput,
  UpdateCustomerInput,
} from '/@/api/lims/basedata/datacontract/customer-datacontract'
import { BaseCustomerApi } from '/@/api/lims/basedata/basecustomer'
import { auth, auths, authAll } from '/@/utils/authFunction'

import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'
import modal from '/@/globalProperties/modal'
import {
  BaseCustomerReportExtendAddInput,
  BaseCustomerReportExtendUpdateInput,
} from '/@/api/lims/basedata/datacontract/customerreportextend-datacontract'
import { DictGetListDto, LabelValueOutput } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'

defineProps({
  title: {
    type: String,
    default: '',
  },
})
const formRef = ref()

onMounted(() => {
  new DictApi().getList(['CustomerLevel', 'CustomerType', 'CustomerClassification', 'InputType']).then((res) => {
    if (res.success) {
      state.customerLevelList = res.data!.customerLevel!
      state.customerTypeList = res.data!.customerType!
      state.customerClassificationList = res.data!.customerClassification!
      state.inputTypeList = res.data!.inputType!
    }
  })
})

const state = reactive({
  activeTab: 'customer',
  showDialog: false,
  sureLoading: false,
  form: {} as BaseCustomerAddInput | BaseCustomerUpdateInput | any,
  reportExtend: {} as BaseCustomerReportExtendAddInput | BaseCustomerReportExtendUpdateInput,
  customerTypeList: [] as DictGetListDto[],
  customerLevelList: [] as DictGetListDto[],
  customerClassificationList: [] as DictGetListDto[],
  inputTypeList: [] as DictGetListDto[],
})

// 打开对话框
const open = async (row: any = {}) => {
  state.activeTab = 'customer'
  if (row.id > 0) {
    const res = await new BaseCustomerApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data?.customer as BaseCustomerUpdateInput
      state.reportExtend = (res.data?.reportExtend as BaseCustomerReportExtendUpdateInput) ?? {}
    }
  } else {
    defaultToAdd()
  }
  state.showDialog = true
}

const defaultToAdd = () => {
  state.form = {
    tenantId: 0,
    customerCode: null,
    customerName: null,
    customerNameAB: null,
    area: null,
    address: null,
    longitude: null,
    latitude: null,
    customerLevel: '',
    customerType: '0',
    customerNature: null,
    collaborationMode: null,
    contacts: null,
    contactPhone: null,
    criticalContacts: null,
    criticalContactPhone: null,
    doubleInputType: null,
    cooperateType: null,
    firstCooperateTime: new Date(),
    customerClassification: null,
    remark: null,
    sort: 0,
    isValid: true,
  } as BaseCustomerAddInput

  state.reportExtend = {
    customerCode: null,
    customerLogo: null,
    customerSignature: null,
    isGenerateReport: true,
    reportPriority: 70,
    imageDpi: null,
    languageType: null,
    reportMainTitle: null,
    reportSubTitle: null,
    address: null,
    telephone: null,
    generateTitleType: null,
    canSearchReportChannel: null,
  } as BaseCustomerReportExtendAddInput
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
      let param = {
        customer: state.form,
        reportExtend: state.reportExtend,
      } as UpdateCustomerInput
      res = await new BaseCustomerApi().update(param, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      let param = {
        customer: state.form,
        reportExtend: state.reportExtend,
      } as AddCustomerInput
      res = await new BaseCustomerApi().add(param, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseCustomer')
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
<style scoped>
/* :deep(.el-dialog__body) {
  overflow: scroll !important;
  display: flex !important;
  flex: 1 !important;
  padding: 0 !important;
} */
:deep(.el-tabs__content) {
  overflow-y: scroll;
}
.tabclass {
  height: 100%;
  margin: 0 auto;
}
.formclass {
  width: 98%;
}
</style>

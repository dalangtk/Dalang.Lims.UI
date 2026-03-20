<template>
  <el-dialog
    v-model="state.showDialog"
    :title="title"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="my-dialog-form"
  >
    <el-row :gutter="12">
      <el-col :span="12">
        <MyTable
          border
          tableName="customerPurpose"
          class="my-table"
          :data="state.customerPurMatchMain"
          ref="sampleInfoRef"
          :total="state.total"
          v-on:pageOrSizeChange="onTablePageOrSizeChange"
          @current-change="currentRowChange"
          :loading="state.loading"
          :showToolbox="false"
          :show-paging="false"
          stripe
        >
          <el-table-column prop="customerPurCode" label="客户目的代码" show-overflow-tooltip width />
          <el-table-column prop="customerPurName" label="客户目的名称" show-overflow-tooltip width />
        </MyTable>
      </el-col>
      <el-col :span="12">
        <MyTable border tableName="centralPurpose" :showToolbox="false" :show-paging="false">
          <template #headerButton>
            <el-button type="primary" size="small" @click="addPurMatch">
              <SvgIcon name="ele-Plus" />
              新增</el-button
            >
          </template>
          <el-table-column prop="centralPurCode" label="目的代码" show-overflow-tooltip width />
          <el-table-column prop="centralPurName" label="目的名称" show-overflow-tooltip width />
          <el-table-column prop="isCombo" label="套餐" show-overflow-tooltip width />
        </MyTable>
      </el-col>
    </el-row>
  </el-dialog>

  <purpose-select ref="purposeSelectRef" @confirm="purposeSelectConfirm"> </purpose-select>
</template>

<script lang="ts" setup name="customerpurposematchdetail">
import { reactive, toRefs, getCurrentInstance, ref, defineAsyncComponent } from 'vue'
import MyTable from '/@/components/my-table/index.vue'
import {
  CustomerPurMatchDetailDto,
  CustomerPurMatchMainDto,
  PurposeMatchAddInput,
  PurposeMatchQueryListInput,
  PurposeMatchUpdateInput,
} from '/@/api/lims/pretreatment/datacontract/pretreatcustomerpurposematch-datacontract'
import { PretreatCustomerPurposeMatchApi } from '/@/api/lims/pretreatment/pretreatcustomerpurposematch'
import { auth, auths, authAll } from '/@/utils/authFunction'

import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { PurposeAndComboOutput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'
const PurposeSelect = defineAsyncComponent(() => import('/@/views/lims/basedata/basepurpose/components/purpose-select.vue'))

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  customerCode: {
    type: String,
    default: '',
  },
})

const purposeSelectRef = ref()
const { proxy } = getCurrentInstance() as any

// const formRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  // form: {} as PretreatCustomerPurposeMatchAddInput | PretreatCustomerPurposeMatchUpdateInput | any,
  customerPurMatchMain: [] as CustomerPurMatchMainDto[],
  customerPurMatchDetail: [] as CustomerPurMatchDetailDto[],
  total: 0,
  loading: false,
  isAuditAdded: false, //审核失败进来的，不从数据库取对照，只让增加
  pageInput: {
    currentPage: 1,
    pageSize: 10,
    filter: {
      customerCode: '',
      customerPurCode: '',
    } as PurposeMatchQueryListInput,
  } as GetPageInput<PurposeMatchQueryListInput>,
})

// 打开对话框
const open = async (row: any = {}) => {}

const auditOpen = async (needAddList: CustomerPurMatchMainDto[]) => {
  state.customerPurMatchMain = needAddList
  console.log('needAddList', needAddList)
  state.showDialog = true
}
const addPurMatch = async () => {
  purposeSelectRef.value.open(props.customerCode)
}
const purposeSelectConfirm = async (selectItems: PurposeAndComboOutput[]) => {
  console.log(selectItems)
  
}
const currentRowChange = (row: any) => {
  console.log('currentRowChange', row)
}
const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  //await queryImportedSampleInfo()
}
const onNameChange = (val: string) => {
  // state.form.pinYin = makePy(state.form.instrumentName)
  // state.form.wuBi = makeWb(state.form.instrumentName)
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  // formRef.value.validate(async (valid: boolean) => {
  //   if (!valid) return
  //   state.sureLoading = true
  //   let res = {} as any
  //   if (state.form.id != undefined && state.form.id > 0) {
  //     res = await new PretreatCustomerPurposeMatchApi().update(state.form, { showSuccessMessage: true }).catch(() => {
  //       state.sureLoading = false
  //     })
  //   } else {
  //     res = await new PretreatCustomerPurposeMatchApi().add(state.form, { showSuccessMessage: true }).catch(() => {
  //       state.sureLoading = false
  //     })
  //   }
  //   state.sureLoading = false
  //   if (res?.success) {
  //     eventBus.emit('refreshPretreatCustomerPurposeMatch')
  //     state.showDialog = false
  //   }
  // })
}

const editItemIsShow = (add: Boolean, edit: Boolean): Boolean => {
  // if (add && edit) return true
  // let isEdit = state.form.id != undefined && state.form.id > 0
  // if (add && !isEdit) return true
  // if (edit && isEdit) return true
  return false
}

defineExpose({
  open,
  auditOpen,
})
</script>

<style scoped lang="scss">
.my-table {
  flex: 1;
}
</style>

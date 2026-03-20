<template>
  <el-dialog
    v-model="state.showDialog"
    :title="title"
    draggable
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="my-dialog-form"
  >
    <el-row>
      <el-col :span="24">
        <MyTable
          border
          tableName="customerPurpose"
          class="my-table"
          :data="state.customerPurMatch"
          ref="sampleInfoRef"
          :total="state.total"
          :loading="state.loading"
          :showToolbox="false"
          :show-paging="false"
          stripe
        >
          <el-table-column prop="customerPurCode" label="客户目的代码" show-overflow-tooltip width />
          <el-table-column prop="customerPurName" label="客户目的名称" show-overflow-tooltip width />
          <el-table-column prop="centralPurCode" label="中心目的" width="180">
            <template #default="scope">
              <el-select
                v-model="scope.row.centralPurCodes"
                ref="purposeSelectRef"
                filterable
                remote
                clearable
                :reserve-keyword="false"
                multiple
                :remote-method="queryPurpose"
                @change="
                  (val: Array<string>) => {
                    selectPurposeChange(scope.row, val)
                  }
                "
              >
                <el-option v-for="item in state.purposes" :key="item.purCode" :label="item.purName" :value="item.purCode" />
              </el-select>
            </template>
          </el-table-column>
        </MyTable>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel" size="default">取 消</el-button>
        <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="customerpurposematchdetail">
import { reactive, ref } from 'vue'
import MyTable from '/@/components/my-table/index.vue'
import {
  CustomerPurMatchDetailDto,
  PurMatchCentralPurposeDto,
  PurposeMatchMutilQueryInput,
  QuickPurmatchDto,
} from '/@/api/lims/pretreatment/datacontract/pretreatcustomerpurposematch-datacontract'
import { PretreatCustomerPurposeMatchApi } from '/@/api/lims/pretreatment/pretreatcustomerpurposematch'
import { auth, auths, authAll } from '/@/utils/authFunction'

import eventBus from '/@/utils/mitt'
import { PurposeAndComboOutput, PurposeAndComboQueryInput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import { BasePurposeApi } from '/@/api/lims/basedata/basepurpose'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
})

const purposeSelectRef = ref()

const state = reactive({
  showDialog: false,
  sureLoading: false,
  customerPurMatch: [] as QuickPurmatchDto[],
  total: 0,
  customerCode: '' as string | null | undefined,
  purposes: [] as PurposeAndComboOutput[],
  selPurpose: [] as PurposeAndComboOutput[],
  loading: false,
})

const auditOpen = async (needAddList: CustomerPurMatchDetailDto[]) => {
  state.selPurpose = []
  state.customerPurMatch = JSON.parse(JSON.stringify(needAddList))
  let param = {
    customerCode: needAddList[0].customerCode ?? '',
    customerPurCodes: needAddList.map((item) => item.customerPurCode),
  } as PurposeMatchMutilQueryInput
  new PretreatCustomerPurposeMatchApi().getPurMatchDetail(param).then((res) => {
    console.log('getPurMatchDetail', res)
    state.customerPurMatch.forEach((v) => {
      let currpurCodes = [] as Array<string>
      let curr = res.data!.filter((item) => item.customerPurCode == v.customerPurCode)
      if (curr) {
        curr.forEach((c) => {
          currpurCodes.push(`${c!.centralPurCode}${c?.centralPurName}`)
        })
      }
      v.centralPurCodes = currpurCodes
    })
    console.log('customerPurMatch', state.customerPurMatch)
    //state.customerPurMatch = res.data as QuickPurmatchDto[]
  })

  state.customerCode = needAddList[0].customerCode
  console.log('needAddList', needAddList)
  state.showDialog = true
}
const selectPurposeChange = (row: QuickPurmatchDto, value: Array<string>) => {
  console.log('row', row)
  console.log('selectPurposeChange', value)

  row.centralPurList = []
  value.forEach((v) => {
    let tmp = v.split('-')
    let tmpMatch = {
      centralPurCode: tmp[0],
      isCombo: tmp[1] == '1',
    } as PurMatchCentralPurposeDto
    row.centralPurList!.push(tmpMatch)
  })
}
const queryPurpose = (query: string) => {
  if (!query) return
  let param = {
    customerCode: state.customerCode,
    purCode: query,
    queryCombo: true,
  } as PurposeAndComboQueryInput

  new BasePurposeApi().getPurposeAndCombo(param).then((res) => {
    console.log('handleSearch', res.data)
    if (res?.data != null && res?.data?.length > 0) {
      res.data?.forEach((v) => {
        if (v.isCombo) {
          v.purCode = v.purCode + '-1'
        } else {
          v.purCode = v.purCode + '-0'
        }
      })
    }
    state.purposes = res.data as any[]
  })
}

// 取消
const onCancel = () => {
  state.customerPurMatch = []
  state.purposes = []
  state.showDialog = false
}

// 确定
const onSure = () => {
  console.log(state.customerPurMatch)
  new PretreatCustomerPurposeMatchApi().quickMatch(state.customerPurMatch).then((res) => {
    console.log('quickMatch', res)
    if (res.data) {
      state.customerPurMatch = []
      state.purposes = []
      state.showDialog = false
    }
  })
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

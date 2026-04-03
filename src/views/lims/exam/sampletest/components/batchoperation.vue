<template>
  <div class="my-layout container">
    <div style="display: flex">
      <el-card class="query-card" shadow="hover">
        <el-form ref="queryFormRef" :model="queryForm" size="small" label-width="80px" label-position="left">
          <el-row :gutter="3">
            <el-col :xs="24" :sm="24" :md="8" :lg="8">
              <el-form-item label="接收时间" prop="reportDateRange">
                <el-date-picker v-model="queryForm.testDate" type="date" format="YYYY-MM-DD" class="full-width" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8">
              <el-form-item label="样本条码" prop="barcode">
                <el-input v-model="queryForm.barcode" placeholder="请输入样本条码" clearable class="full-width" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8">
              <el-form-item label="姓名" prop="patientName">
                <el-input v-model="queryForm.patientName" placeholder="请输入客户姓名" clearable />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8">
              <el-form-item label="客户名称" prop="customer">
                <el-select
                  v-model="queryForm.customer"
                  placeholder="请选择客户"
                  class="full-width"
                  clearable
                  filterable
                  remote
                  :remote-method="queryCustomer"
                >
                  <el-option v-for="item in state.customerOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8">
              <el-form-item label="检验目的" prop="purpose">
                <el-select
                  v-model="queryForm.purpose"
                  placeholder="请选择检验目的"
                  clearable
                  filterable
                  class="full-width"
                  remote
                  :remote-method="queryPurpose"
                >
                  <el-option v-for="item in state.testItemOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="8" :lg="6">
              <el-form-item>
                <el-button size="small" :icon="Search" type="primary" @click="handleQuery"> 查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
    <MyTable></MyTable>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { LabelValueOutput } from '/@/api/admin/data-contracts'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseOptionsApi } from '/@/api/lims/shared/options'
import MyTable from '/@/components/my-table/index.vue'

const props = defineProps({
  groupCode: {
    type: String,
  },
  sampleNo: {
    type: String,
  },
  testDate: {
    type: Date,
    default: new Date(),
  },
})

const queryForm = reactive({
  groupCode: '',
  customer: '',
  patientName: '',
  barcode: '',
  testDate: props.testDate,
  purpose: [],
})

const state = reactive({
  customerOptions: [] as LabelValueOutput[],
  testItemOptions: [] as LabelValueOutput[],
})

const queryCustomer = (input: string) => {
  if (!input) return
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
  if (!input) return
  let param = {
    currentPage: 1,
    pageSize: 20,
    filter: input,
  } as GetPageInput<string>
  new BaseOptionsApi().getPurposeOptions(param).then((res) => {
    state.testItemOptions = res.data!
  })
}

const handleQuery = () => {}
</script>

<style scoped lang="scss"></style>

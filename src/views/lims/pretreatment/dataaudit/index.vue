<template>
  <div class="my-layout">
    <div class="mt8" style="position: relative">
      <el-card shadow="never" :body-style="{ paddingBottom: '0' }">
        <el-form :inline="true" @submit.stop.prevent>
          <el-form-item label="">
            <el-date-picker
              v-model="state.queryDateRange"
              type="daterange"
              size="default"
              range-separator="-"
              start-placeholder="起始日期"
              end-placeholder="截止日期"
            />
          </el-form-item>
          <el-form-item label="客户">
            <!-- <el-input v-model="state.pageInput.filter!.customerCode" placeholder="客户" clearable> </el-input> -->
            <el-select
              style="width: 200px; display: block"
              v-model="state.pageInput.filter!.customerCode"
              remote
              :remote-method="customerSearch"
              :loading="state.loading"
              filterable
              clearable
            >
              <el-option v-for="item in state.customerList" :key="item.customerCode" :label="item.customerName" :value="item.customerCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="条码">
            <el-input v-model="state.pageInput.filter!.barcode" placeholder="条码" clearable />
          </el-form-item>
          <el-form-item> </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="ele-Search" @click="queryImportedSampleInfo"> 查询 </el-button>
            <el-button v-auths="[perms.audit]" type="primary" icon="ele-CircleCheck" @click="dataAudit"> 审核 </el-button>
            <el-button v-auths="[perms.delete]" type="primary" icon="ele-Delete" @click="deleteSampleInfo"> 删除 </el-button>
          </el-form-item>
          <el-form-item label=""> </el-form-item>
        </el-form>
      </el-card>
      <!-- <el-card shadow="never" :body-style="{ paddingBottom: '0' }">
        <el-form>
          <el-form-item label="111">
            <span>123</span>
          </el-form-item>
        </el-form>
      </el-card> -->
    </div>

    <el-card class="my-fill mt8 el-card-table" shadow="never">
      <MyTable
        border
        tableName="dataAudit"
        class="my-table"
        :data="state.importedList"
        ref="sampleInfoRef"
        :total="state.total"
        v-on:pageOrSizeChange="onTablePageOrSizeChange"
        :loading="state.loading"
        stripe
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="auditStatus" label="状态" show-overflow-tooltip width="90">
          <template #default="{ row }">
            <el-tag :type="row.auditStatus === 1 ? 'success' : 'warning'">
              {{ row.auditStatus === 1 ? '已审核' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="barcode" label="条码" show-overflow-tooltip width="160" />
        <el-table-column prop="patientName" label="姓名" show-overflow-tooltip width />
        <el-table-column prop="purCodes" label="目的代码" show-overflow-tooltip width="160" />
        <el-table-column prop="purNames" label="目的名称" show-overflow-tooltip width="160" />
        <el-table-column prop="genderName" label="性别" show-overflow-tooltip width />
        <el-table-column prop="age1" label="年龄" show-overflow-tooltip width />
        <el-table-column prop="ageUnitName1" label="年龄单位" show-overflow-tooltip width />
        <el-table-column prop="patientTypeName" label="病人类别" show-overflow-tooltip width />
        <el-table-column prop="birthDay" label="生日" show-overflow-tooltip width />
        <el-table-column prop="collectTime" label="采集时间" show-overflow-tooltip width />
        <el-table-column prop="customerBarcode" label="客户条码" show-overflow-tooltip width="160" />
        <el-table-column prop="birthDay" label="生日" show-overflow-tooltip width />
        <el-table-column prop="patientId" label="门诊住院号" show-overflow-tooltip width />
        <el-table-column prop="phone" label="联系电话" show-overflow-tooltip width />
        <el-table-column prop="deprtment" label="科室" show-overflow-tooltip width />
        <el-table-column prop="waard" label="病区" show-overflow-tooltip width />
        <el-table-column prop="bedNo" label="床号" show-overflow-tooltip width />
        <el-table-column prop="doctor" label="送检医生" show-overflow-tooltip width />
      </MyTable>
    </el-card>

    <el-dialog v-model="state.showDialog" title="目的对照" width="50%" append-to-body>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-table :data="state.auditResult">
          <el-table-column prop="barcode" label="条码"> </el-table-column>
          <el-table-column prop="patientName" label="姓名" />
          <el-table-column prop="errMsg" label="失败原因"> </el-table-column>
          <el-table-column label="操作" :width="70" fixed="right">
            <template #default="{ row }">
              <el-button v-if="row.auditFailedType == 0" icon="ele-EditPen" size="small" text type="primary" @click="purMatch(row.needMatchPurList)"
                >对照</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-dialog>

    <customer-purpose-match-detail ref="pretreatCustomerPurposeMatchDetailRef"></customer-purpose-match-detail>
  </div>
</template>

<script lang="ts" setup name="/pretreatment/dataaudit">
import { TableInstance } from 'element-plus'
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue'
import { BaseCustomerApi } from '/@/api/lims/basedata/basecustomer'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseCustomerOutput, BaseCustomerQueryListInput } from '/@/api/lims/basedata/datacontract/customer-datacontract'
import { CustomerPurMatchMainDto } from '/@/api/lims/pretreatment/datacontract/pretreatcustomerpurposematch-datacontract'
import { DataAuditOutput } from '/@/api/lims/pretreatment/datacontract/pretreatdataaudit-datacontract'
import { PretreatSampleInfoListOutput, PretreatSampleInfoQueryListInput } from '/@/api/lims/pretreatment/datacontract/pretreatsampleinfo-datacontract'
import { PretreatDataAuditApi } from '/@/api/lims/pretreatment/pretreatdataaudit'
import { PretreatDataImportApi } from '/@/api/lims/pretreatment/pretreatmentdataimport'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { useUserInfo } from '/@/stores/userInfo'
import { getTodayEnd, getTodayStart } from '/@/utils/formatTime'
const CustomerPurposeMatchDetail = defineAsyncComponent(
  () => import('/@/views/lims/pretreatment/customerpurposematch/components/customer-purpose-match-detail.vue')
)

const sampleInfoRef = ref<TableInstance>()
const pretreatCustomerPurposeMatchDetailRef = ref()

//权限配置
const perms = {
  audit: 'api:lims:pretreat-data-check:audit',
  delete: 'api:lims:pretreat-data-check:delete',
}

const storesUserInfo = useUserInfo()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  fileDirectory: '',
  loading: false,
  total: 0,
  fileReName: true,
  file: null as any,
  customerList: [] as BaseCustomerOutput[],
  token: storesUserInfo.getToken(),
  auditResult: [] as DataAuditOutput[],
  isPreLoad: false,
  importedList: [] as PretreatSampleInfoListOutput[],
  pageInput: {
    currentPage: 1,
    pageSize: 10,
    filter: {
      customerCode: '',
      barcode: '',
      begin: getTodayStart(),
      end: getTodayEnd(),
      OnlyMySelf: true,
    } as PretreatSampleInfoQueryListInput,
  } as GetPageInput<PretreatSampleInfoQueryListInput>,
  queryDateRange: [] as Date[],
})

onMounted(async () => {
  await new BaseCustomerApi().getPage({ currentPage: 1, pageSize: 10 }).then((res) => {
    state.customerList = res.data!.list ?? []
  })
  state.queryDateRange[0] = new Date()
  state.queryDateRange[1] = new Date()
})
const customerSearch = async (query: string) => {
  if (query) {
    let filter = {
      currentPage: 1,
      pageSize: 10,
      filter: {
        customerCode: query,
      },
    } as GetPageInput<BaseCustomerQueryListInput>
    await new BaseCustomerApi().getPage(filter).then((res) => {
      state.customerList = res.data!.list ?? []
    })
  }
}
const purMatch = (needMatchList: CustomerPurMatchMainDto[]) => {
  // console.log('needMatchList', needMatchList[0])
  console.log('pretreatCustomerPurposeMatchDetailRef', pretreatCustomerPurposeMatchDetailRef.value)
  pretreatCustomerPurposeMatchDetailRef.value.auditOpen(needMatchList)
}
const onConfirm = (selectedItems: any[]) => {
  console.log('selectedItems', selectedItems)
}
const queryImportedSampleInfo = () => {
  if (state.queryDateRange.length == 0) {
    modal.msgError('请选择日期范围')
    return
  }
  state.pageInput.filter!.begin = state.queryDateRange[0]
  state.pageInput.filter!.end = state.queryDateRange[1]
  new PretreatDataImportApi().getImportedData(state.pageInput).then((res) => {
    state.importedList = res?.data?.list ?? []
    state.total = res?.data?.total ?? 0
    state.loading = false
  })
}

const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await queryImportedSampleInfo()
}

const deleteSampleInfo = () => {
  var selectRows = (sampleInfoRef.value?.getSelectionRows() as PretreatSampleInfoListOutput[]) ?? []
  var selIds = selectRows.map((v) => v.id)
  if (selIds.length == 0) {
    modal.msgError('请选择要删除的数据')
    return
  }
  new PretreatDataImportApi().deleteInfo(selIds).then((res) => {
    if (res.success) {
      modal.msgSuccess('删除成功')
      queryImportedSampleInfo()
    }
  })
}
const dataAudit = () => {
  var selectRows = (sampleInfoRef.value?.getSelectionRows() as PretreatSampleInfoListOutput[]) ?? []
  var selIds = selectRows.map((v) => v.id)
  if (selIds.length == 0) {
    modal.msgError('请选择要审核的数据')
    return
  }
  new PretreatDataAuditApi().dataAudit(selIds).then((res) => {
    console.log(res)
    if (res.data != undefined && res.data.length > 0) {
      state.showDialog = true
      state.auditResult = res.data ?? []
    } else {
      modal.msgSuccess('审核成功')
      queryImportedSampleInfo()
    }
  })
}
</script>

<style scoped lang="scss">
.my-container {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.upload {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .impconfig {
    width: 30%;
  }
  .impresult {
    width: 69%;
  }
}
.my-table {
  flex: 1;
}
:deep(.el-input__wrapper) {
  position: relative;
  .el-input__inner {
    padding-right: 18px;
  }
  .el-input__suffix {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

<template>
  <div class="lims-sort-container">
    <el-container class="w100 h100">
      <!-- <el-header style="height: 50px">123123</el-header> -->
      <el-header class="header-bar" style="background-color: lightblue">
        <el-select v-model="state.sorterCode" style="width: 150px; display: block" :disabled="state.isStartSorting">
          <el-option v-for="item in state.sorterList" :key="item.sorterCode" :label="item.sorterName" :value="item.sorterCode"></el-option>
        </el-select>
        <el-button
          icon="ele-VideoPlay"
          type="primary"
          size="default"
          @click="startSorting"
          :disabled="state.isStartSorting"
          class="operation-btn"
        ></el-button>
        <el-select v-model="state.sampleTypeCode" style="width: 150px; display: block" placeholder="标本类型" clearable filterable>
          <el-option
            v-for="item in state.sampleTypeList"
            :key="item.sampleTypeCode"
            :label="item.sampleTypeName"
            :value="item.sampleTypeCode"
          ></el-option>
        </el-select>

        <div class="barcode-input-group">
          <el-select v-model="state.codeType" size="default" class="codetype-select">
            <el-option label="条码" value="Barcode" />
          </el-select>
          <el-input
            ref="barcodeInput"
            v-model="state.barcode"
            @keyup.enter="sorting('')"
            placeholder="请输入条码"
            clearable
            size="default"
            class="barcode-input"
          />
          <el-tag size="large" style="font-size: 18px" type="primary">{{ state.shelfName }}</el-tag>
        </div>
      </el-header>
      <el-container class="w100" style="height: calc(100% - 70px)">
        <el-splitter>
          <el-splitter-panel size="12%" style="min-width: 250px">
            <el-aside class="info-panel w100 h100">
              <div style="overflow-y: scroll; height: 80%">
                <el-divider content-position="center">申请信息</el-divider>
                <el-form :model="state.applyInfo" class="sample-form" layout="vertical" label-width="70px">
                  <el-form-item label="条码">
                    <el-input v-model="state.applyInfo.barcode" disabled />
                  </el-form-item>
                  <el-form-item label="客户名称">
                    <el-input v-model="state.applyInfo.customerName" disabled />
                  </el-form-item>
                  <el-form-item label="客户条码">
                    <el-input v-model="state.applyInfo.customerBarcode" disabled />
                  </el-form-item>
                  <el-form-item label="病人类别">
                    <el-input v-model="state.applyInfo.patientTypeName" disabled />
                  </el-form-item>
                  <el-form-item label="病人ID">
                    <el-input v-model="state.applyInfo.patientId" disabled />
                  </el-form-item>
                  <el-form-item label="病人姓名">
                    <el-row :gutter="0">
                      <el-col :span="16">
                        <el-input v-model="state.applyInfo.patientName" disabled />
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="state.applyInfo.genderName" disabled />
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item label="年龄">
                    <el-input v-model="state.applyInfo.ageDesc" disabled />
                  </el-form-item>
                  <el-form-item label="出生日期">
                    <el-input v-model="state.applyInfo.birthDay" disabled />
                  </el-form-item>
                  <el-form-item label="电话">
                    <el-input v-model="state.applyInfo.phone" disabled />
                  </el-form-item>
                  <el-form-item label="地址">
                    <el-input v-model="state.applyInfo.homeAddress" disabled />
                  </el-form-item>
                  <el-form-item label="医生">
                    <el-input v-model="state.applyInfo.doctor" disabled />
                  </el-form-item>
                  <el-form-item label="科室">
                    <el-input v-model="state.applyInfo.department" disabled />
                  </el-form-item>
                  <el-form-item label="病区">
                    <el-input v-model="state.applyInfo.ward" disabled />
                  </el-form-item>
                  <el-form-item label="床号">
                    <el-input v-model="state.applyInfo.bedNo" disabled />
                  </el-form-item>
                  <el-form-item label="诊断">
                    <el-input v-model="state.applyInfo.clinicalDiagnosis" disabled />
                  </el-form-item>
                  <el-form-item label="项目代码">
                    <el-input v-model="state.applyInfo.purCodes" disabled />
                  </el-form-item>
                  <el-form-item label="项目名称">
                    <el-input v-model="state.applyInfo.purNames" disabled />
                  </el-form-item>
                </el-form>
              </div>
              <div style="height: 10%">
                <el-divider content-position="center">提示</el-divider>
                <el-input v-model="tipMsg" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" disabled />
              </div>
            </el-aside>
          </el-splitter-panel>
          <el-splitter-panel :min="200">
            <el-container class="w100 h100">
              <el-main class="main-panel" style="height: 75%">
                <el-table :data="state.purposeList" class="table" border>
                  <el-table-column prop="sampleStatusName" label="状态" show-overflow-tooltip width="100">
                    <template #default="scope">
                      <el-tag v-if="scope.row.sampleStatus == '1041'" type="success">{{ scope.row.sampleStatusName }}</el-tag>
                      <el-tag v-else type="info">{{ scope.row.sampleStatusName }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="barcode" label="条码" show-overflow-tooltip width="140" />
                  <el-table-column prop="purCode" label="目的代码" show-overflow-tooltip width="120" resizable />
                  <el-table-column prop="purName" label="目的名称" show-overflow-tooltip width="120" resizable />
                  <el-table-column prop="sampleTypeName" label="标本类型" show-overflow-tooltip width="120" resizable />
                  <el-table-column prop="groupName" label="组别" show-overflow-tooltip width="120" resizable />
                </el-table>
              </el-main>
              <el-footer style="height: 25%">
                <el-table :data="state.examTaskList" class="table" border>
                  <el-table-column prop="barcode" label="条码" show-overflow-tooltip width="140" resizable />
                  <el-table-column prop="sortRuleName" label="规则名称" show-overflow-tooltip width="100" resizable />
                  <el-table-column prop="sequenceName" label="序列名称" show-overflow-tooltip width="100" resizable />
                  <el-table-column prop="purNames" label="目的" show-overflow-tooltip width="250" resizable />
                  <el-table-column prop="sampleTypeName" label="标本类型" show-overflow-tooltip width="250" resizable />
                </el-table>
              </el-footer>
            </el-container>
          </el-splitter-panel>
          <el-splitter-panel size="15%">
            <el-aside class="infolist-panel w100 h100">
              <el-table :data="state.applyInfoList" class="table" border>
                <el-table-column prop="barcode" label="条码" show-overflow-tooltip width="140" resizable />
                <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip width="160" resizable />
                <el-table-column prop="patientName" label="姓名" show-overflow-tooltip width="80" resizable />
              </el-table>
            </el-aside>
          </el-splitter-panel>
        </el-splitter>
      </el-container>
    </el-container>

    <el-dialog v-model="state.selectSampleTypeDialogShow" destroy-on-close title="请选择要分拣的标本类型">
      <MySelectTable ref="mySelectTable" :data="state.tableDataSampleType" :mutil-select="false" style="width: 100%">
        <el-table-column prop="code" label="类型名称" show-overflow-tooltip resizable />
        <el-table-column prop="name" label="类型代码" show-overflow-tooltip resizable />
      </MySelectTable>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.selectSampleTypeDialogShow = false">取消</el-button>
          <el-button type="primary" @click="confirmSelectSampleType">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="/pretreatment/sorting">
import { reactive, ref, onMounted } from 'vue'
import { BaseSorterOutput } from '/@/api/lims/pretreatment/datacontract/basesorter-datacontract'
import { BaseSorterApi } from '/@/api/lims/pretreatment/basesorter'
import { SortingApi } from '/@/api/lims/pretreatment/sorting'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'
import modal from '/@/globalProperties/modal'
import { SortingStatusEnum } from '/@/api/lims/pretreatment/datacontract/sorting-datacontract'
import { ApplyPurposeOutput } from '/@/api/lims/shared/datacontract/applypurpose-datacontract'
import { ApplyInfoOutput } from '/@/api/lims/shared/datacontract/applyinfo-datacontract'
import { ExamTaskOutput } from '/@/api/lims/shared/datacontract/examtask-datacontract'
import MySelectTable from '/@/components/my-select-table/index.vue'
import { CodeNameOutput } from '/@/api/admin/data-contracts'

const barcodeInput = ref()
const mySelectTable = ref()

const tipMsg = ref(
  '测试的啊测试的啊测试的啊测试的啊测试的啊测试' +
    '测试的啊测试的啊测试的啊测试的啊测试的啊测试' +
    '测试的啊测试的啊测试的啊测试的啊测试的啊测试' +
    '测试的啊测试的啊测试的啊测试的啊测试的啊测试' +
    '测试的啊测试的啊测试的啊测试的啊测试的啊测试' +
    '测试的啊测试的啊测试的啊测试的啊测试的啊测试' +
    '测试的啊测试的啊测试的啊测试的啊测试的啊测试' +
    '的啊测试的啊测试的啊测试的啊测试的啊测试的啊' +
    '的啊测试的啊测试的啊测试的啊测试的啊测试的啊' +
    '的啊测试的啊测试的啊测试的啊测试的啊测试的啊'
)

const state = reactive({
  sorterCode: '',
  sorterList: [] as BaseSorterOutput[],
  sortInfoCode: '',
  barcode: '',
  codeType: 'Barcode',
  sampleTypeCode: '',
  isStartSorting: false,
  sampleTypeList: [] as BaseSampleTypeOutput[],
  shelfName: '架子',
  purposeList: [] as ApplyPurposeOutput[],
  applyInfo: {} as ApplyInfoOutput,
  applyInfoList: [] as ApplyInfoOutput[],
  examTaskList: [] as ExamTaskOutput[],
  selectSampleTypeDialogShow: false,
  tableDataSampleType: [] as CodeNameOutput[],
})

onMounted(async () => {
  await new BaseSorterApi().getAll().then((res) => {
    state.sorterList = res.data!
    if (state.sorterList) state.sorterCode = state.sorterList[0].sorterCode!
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

const startSorting = () => {
  new SortingApi().startSorting({ sorterCode: state.sorterCode }, { loading: true, showErrorMessage: true }).then((res) => {
    if (res.success) {
      state.sortInfoCode = res.data!
      state.isStartSorting = true
    }
  })
}
const confirmSelectSampleType = () => {
  var selectList = mySelectTable.value.getSelectionRows()
  if (selectList.length > 0) {
    let code = selectList[0].code
    state.selectSampleTypeDialogShow = false
    sorting(code)
  }
}
const sorting = (sampleType: string) => {
  try {
    if (!state.sortInfoCode) {
      modal.msgError('请先开始分拣')
      return
    }
    if (!state.barcode) {
      modal.msgError('请输入条码！')
      return
    }
    if (state.barcode.length != 12) {
      modal.msgError('条码位数有误')
      return
    }

    if (!sampleType) {
      sampleType = state.sampleTypeCode
    }
    new SortingApi()
      .sorting({ sortInfoCode: state.sortInfoCode, barcode: state.barcode, sampletypeCode: sampleType }, { loading: true, showErrorMessage: true })
      .then((res) => {
        if (res.success) {
          if (res.data!.status == SortingStatusEnum.SettingExamPlan) {
            modal.msgWarning('SettingExamPlan')
            modal.msgError('分拣失败!' + res.msg)
          } else if (res.data!.status == SortingStatusEnum.SelectPurposeSampleType) {
            modal.msgWarning('SelectPurposeSampleType')
          } else if (res.data!.status == SortingStatusEnum.SelectSortSampleType) {
            state.tableDataSampleType = res.data!.sampleTypeList!
            state.selectSampleTypeDialogShow = true
          } else if (res.data!.status == SortingStatusEnum.SplitBlood) {
            state.shelfName = '分血'
          } else if (res.data!.status == SortingStatusEnum.SortSuccess) {
            state.shelfName = res.data!.shelfName!
            if (state.applyInfoList.findIndex((x) => x.barcode == res.data!.applyInfo!.barcode) < 0) {
              state.applyInfoList.push(res.data!.applyInfo!)
            }
          } else if (res.data!.status == SortingStatusEnum.SortFailed) {
            modal.msgError('分拣失败!' + res.data?.message)
          }
          if (res.data!.applyPurposeList) state.purposeList = res.data!.applyPurposeList!
          if (res.data!.applyInfo) state.applyInfo = res.data!.applyInfo!
          if (res.data!.examTaskList) state.examTaskList = res.data!.examTaskList!
        }
      })
  } finally {
    barcodeInput.value.select()
  }
}

// 状态格式化
const statusFormatter = (row: any) => {
  return row.sampleStatus === '已分拣' ? '<span class="status-tag sorted">已分拣</span>' : '<span class="status-tag pending">未分拣</span>'
}
</script>

<style scoped lang="scss">
.lims-sort-container {
  padding: 16px;
  background-color: #f5f7fa;
  height: 100%;
  box-sizing: border-box;
}
.layout-container {
  height: 100%;
  width: 100%;
}
/* 顶部操作栏样式 */
.header-bar {
  margin-bottom: 15px;
  background-color: #fff;
  // padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.barcode-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  // margin-left: 16px;
}
.codetype-select {
  width: 130px;
}
.barcode-input {
  width: 180px;
}
/* 左侧样本信息面板 - 占比约20% */
.info-panel {
}
/* 表单样式 */
.sample-form {
  //padding: 12px;
  overflow-y: auto;
  flex: 1;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-form-item__label {
  font-weight: 500;
  color: #4e5969;
}
.main-panel {
  // background-color: lightcyan;
}
.infolist-panel {
  // background-color: lightgray;
}
.table {
  height: 100%;
  width: 100%;
  flex: 1;
}
</style>

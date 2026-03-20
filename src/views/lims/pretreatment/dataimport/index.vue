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
            <el-button v-auth="'api:admin:task:add'" type="primary" icon="ele-Search" @click="queryImportedSampleInfo"> 查询 </el-button>
            <el-upload
              class="el-button el-button--primary el-button--default"
              style="width: 79px"
              ref="uploadRef"
              :action="uploadAction"
              multiple
              :show-file-list="false"
              :on-preview="handlePreview"
              :data="{ fileDirectory: state.fileDirectory, fileReName: state.fileReName }"
              :headers="uploadHeaders"
              :limit="3"
              :before-upload="
                () => {
                  state.token = storesUserInfo.getToken()
                }
              "
              :on-success="onSuccess"
              :on-error="onError"
            >
              <el-button class="upload_btn" v-auths="[perms.add]" size="small" type="primary" icon="ele-UploadFilled"> 导入 </el-button>
            </el-upload>
            <el-button v-auths="[perms.delete]" type="primary" icon="ele-Search" @click="deleteSampleInfo"> 删除 </el-button>
          </el-form-item>
          <el-form-item label=""> </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card class="my-fill mt8 el-card-table" shadow="never">
      <MyTable
        border
        tableName="dataImport"
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

    <el-dialog v-model="state.showDialog" title="导入配置" width="50%" append-to-body>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-table :data="state.currFileConfigs">
          <el-table-column prop="cellName" label="列名"> </el-table-column>
          <el-table-column prop="fieldName" label="字段名">
            <template #default="scope">
              <el-select v-model="scope.row.fieldName" placeholder="Select" size="small" @change="configValueChange(scope.row)">
                <el-option v-for="item in state.generalConfigs" :key="item.cellName" :label="item.cellName" :value="item.fieldName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="isSystemCompare" label="">
            <template #default="scope">
              <el-tag
                v-if="scope.row.isSystemCompare === true"
                :type="scope.row.isSystemCompare === true ? 'primary' : 'success'"
                disable-transitions
              >
                系</el-tag
              >
              <el-tag
                v-if="scope.row.isSystemCompare === false"
                :type="scope.row.isSystemCompare === true ? 'primary' : 'success'"
                disable-transitions
              >
                人</el-tag
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelImport" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="/pretreatment/dataimport">
import type { UploadFile, UploadFiles, UploadInstance, UploadProps } from 'element-plus'
import { TableInstance } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { BaseCustomerApi } from '/@/api/lims/basedata/basecustomer'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseCustomerOutput, BaseCustomerQueryListInput } from '/@/api/lims/basedata/datacontract/customer-datacontract'
import { PretreatDataImportConfigOutput } from '/@/api/lims/pretreatment/datacontract/dataimportconfig-datacontract'
import { PretreatSampleInfoListOutput, PretreatSampleInfoQueryListInput } from '/@/api/lims/pretreatment/datacontract/pretreatsampleinfo-datacontract'
import { PretreatDataImportApi } from '/@/api/lims/pretreatment/pretreatmentdataimport'
import { PretreatDataImportConfigApi } from '/@/api/lims/pretreatment/pretreatmentdataimportconfig'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { useUserInfo } from '/@/stores/userInfo'
import { getTodayEnd, getTodayStart } from '/@/utils/formatTime'

const uploadRef = ref<UploadInstance>()
const sampleInfoRef = ref<TableInstance>()

//权限配置
const perms = {
  add: 'api:lims:pretreat-data-import:add',
  delete: 'api:lims:pretreat-data-import:delete',
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
  generalConfigs: [] as PretreatDataImportConfigOutput[],
  currFileConfigs: [] as PretreatDataImportConfigOutput[],
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
  // queryInput: {
  //   customerCode: '',
  //   barcode: '',
  //   begin: getTodayStart(),
  //   end: getTodayEnd(),
  //   OnlyMySelf: true,
  // } as PretreatSampleInfoQueryListInput,
  queryDateRange: [] as Date[],
})

onMounted(async () => {
  await new PretreatDataImportConfigApi().getGeneralImportConfig().then((res) => {
    state.generalConfigs = res.data ?? []
  })
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
//const handleExceed: UploadProps['onExceed'] = (files) => {
// let file = files[0] as UploadRawFile
// file.uid = genFileId()
// uploadRef.value!.handleStart(file)
// uploadRef.value!.submit()
//}
const resetUploader = () => {
  state.currFileConfigs = []
  uploadRef.value!.clearFiles()
  state.isPreLoad = true
}
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}
const uploadAction = computed(() => {
  return import.meta.env.VITE_API_URL + '/api/pretreatment/data-import/data-pre-import'
})

const uploadHeaders = computed(() => {
  return { Authorization: 'Bearer ' + state.token }
})

const checkDisable = (val: string) => {
  return state.currFileConfigs.some((item) => item.fieldName === val)
}

//上传失败
const onError: UploadProps['onError'] = (error) => {
  let message = ''
  if (error.message) {
    try {
      message = JSON.parse(error.message)?.msg
    } catch (err) {
      message = error.message || ''
    }
  }
  if (message) modal.msgError(message)
}

// 上传成功
const onSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response?.success) {
    console.log('onSuccess', response.data)
    state.currFileConfigs = response.data ?? []
    state.file = uploadFiles[0].raw
    state.isPreLoad = false
    state.showDialog = true
  } else {
    modal.msgError(response?.msg)
  }
}
const comfirmImport = () => {
  onSure()
}
const cancelImport = () => {
  state.showDialog = false
  resetUploader()
}
// 确定
const onSure = async () => {
  if (state.currFileConfigs.length <= 0) return
  let changedConfig = state.currFileConfigs.filter((v) => v.isSystemCompare == false)
  new PretreatDataImportApi().dataImport({ file: state.file, importConfigsJson: JSON.stringify(changedConfig) }).then((res) => {
    console.log('onSure', res)
    state.importedList = res.data ?? []
    if (res.success) {
      modal.msgSuccess(`导入成功${res.data?.length ?? 0}条`)
      resetUploader()
      state.showDialog = false
    }
  })
}
const configValueChange = (row: PretreatDataImportConfigOutput) => {
  row.isSystemCompare = false
}
const queryImportedSampleInfo = () => {
  // state.showDialog = true
  // return
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
  console.log('selIds', selIds)
  new PretreatDataImportApi().deleteInfo(selIds).then((res) => {
    if (res.success) {
      modal.msgSuccess('删除成功')
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

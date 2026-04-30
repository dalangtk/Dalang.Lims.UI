<template>
  <div class="lis-layout" @mouseup="stopResize" @mousemove="onResize">
    <!-- 顶部 Header -->
    <header class="lis-header">
      <AuditToolBar :show-mutil-audit="true"></AuditToolBar>
      <el-tag effect="dark" type="success">显示: {{ state.filteredList.length }} / 总量: {{ state.totalCount }}</el-tag>
    </header>

    <div class="lis-body">
      <!-- 1. 左侧：患者信息 -->
      <aside class="panel-left" :style="{ width: leftWidth + 'px' }">
        <PatientInfo
          :current-sample="currentSample"
          :gender-list="state.genderList"
          :age-unit-list="state.ageUnitList"
          :sample-type-list="state.sampleTypeList"
          :sample-property-list="state.samplePropertyList"
          :active-id="activeId"
          :all-samples="state.allSamples"
          @update:current-sample="(value) => (currentSample = value)"
          @update:all-samples="(value) => (state.allSamples = value)"
          @refresh-filter="handleFilter"
        />
      </aside>

      <!-- Resizer Left -->
      <div class="resizer" @mousedown="startResize($event, 'left')">
        <div class="resizer-grip"></div>
      </div>

      <!-- 2. 中间：检验结果 -->
      <main class="panel-center">
        <el-card shadow="never" class="result-card">
          <component :is="pathologyInputComponent" style="flex: 1; height: 100%"></component>
          <el-collapse v-model="state.actived" expand-icon-position="left" accordion @change="moreTabVisableChange">
            <el-collapse-item title="更多" name="1" style="height: 100%; overflow-y: hidden">
              <tracktab
                :mystyle="{ height: '300px' }"
                ref="moreTab"
                :barcode="currentSample?.barcode"
                :exam-info-id="currentSample?.id"
                :current-sample="currentSample"
              ></tracktab>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </main>

      <!-- Resizer Right -->
      <div class="resizer" @mousedown="startResize($event, 'right')">
        <div class="resizer-grip"></div>
      </div>

      <!-- 3. 右侧：列表 + 综合筛选 -->
      <aside class="panel-right" :style="{ width: rightWidth + 'px' }">
        <SampleList
          ref="sampleListRef"
          :group-code="state.groupCode"
          :all-sample-status="state.allSampleStatus"
          :all-samples="state.allSamples"
          :filtered-list="state.filteredList"
          :active-id="activeId"
          v-model:query-date-range="state.queryDateRange"
          @update:all-samples="(value) => (state.allSamples = value)"
          @update:filtered-list="(value) => (state.filteredList = value)"
          @update:active-id="(value) => (activeId = value)"
          @switch-sample="switchSample"
          @query-sample-list="querySampleList"
        />
      </aside>
    </div>

    <PurposeSelect :group-code="state.groupCode" ref="purposeSelectRef" @confirm="confirmSelectItem"></PurposeSelect>

    <el-dialog v-model="state.delItemDialogShow">
      <template #header>
        <span>请选择需要退项的目的</span>
      </template>
      <MySelectTable :data="state.delItemDataList" ref="delItemSelectRef" :mutil-select="true">
        <el-table-column prop="purCode" label="目的代码" show-overflow-tooltip width />
        <el-table-column prop="purName" label="目的名称" show-overflow-tooltip width />
      </MySelectTable>
      <template #footer>
        <el-button @click="state.delItemDialogShow = false">取消</el-button>
        <el-button type="primary" @click="onConfirmSelectDelItem">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="state.historyResultShow" style="width: 100vw; height: 100vh">
      <HistoryResult></HistoryResult>
    </el-dialog>

    <RptPreview ref="previewRef" :exam-info-id="activeId"></RptPreview>
  </div>
</template>

<script lang="ts" setup name="/exam/sampletest">
import 'element-plus/theme-chalk/el-table-v2.css'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

import { useRoute } from 'vue-router'
import { VxeTablePropTypes } from 'vxe-table'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'
import { BasePurposeOutput, PurposeAndComboOutput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { AddOrDeletePurposeInput, AuditInput, CancelTestInput, UnAuditInput } from '/@/api/lims/exam/datacontract/sampletest-datacontract'
import { SampleTestApi } from '/@/api/lims/exam/sampletest'
import { PathologyExamListQueryInput } from '/@/api/lims/pathology/datacontract/pathologytest-datacontract'
import { ExamInfoOutput, ExamListQueryInput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { ExamResultOutput } from '/@/api/lims/shared/datacontract/examresult-datacontract'
import { ExecuteTypeEnum, OperationTypeEnum } from '/@/api/lims/shared/enums/operationtypeenum'
import { SampleStatus, SampleStatusUtils } from '/@/api/lims/shared/enums/samplestatusenum'
import MySelectTable from '/@/components/my-select-table/index.vue'
import modal from '/@/globalProperties/modal'
import { formatDate, formatDatetime, parseDate, subtractDays } from '/@/utils/formatTime'
import PurposeSelect from '/@/views/lims/basedata/basepurpose/components/purpose-select.vue'
import HistoryResult from '/@/views/lims/exam/sampletest/components/historyresult.vue'
import PatientInfo from '/@/views/lims/exam/sampletest/components/PatientInfo.vue'
import RptPreview from '/@/views/lims/exam/sampletest/components/reportpreview.vue'
import SampleList from '/@/views/lims/exam/sampletest/components/samplelist.vue'
import tracktab from '/@/views/lims/exam/sampletest/components/tracktab.vue'
import AuditToolBar from '/@/views/pathology/components/audittoolbar.vue'

const props = defineProps({
  firstCheckComponent: {
    type: Object, // 组件定义的类型
    required: true,
  },
  secondCheckComponent: {
    type: Object, // 组件定义的类型
    required: true,
  },
  pathologyInputComponent: {
    type: Object, // 组件定义的类型
    required: true,
  },
  wfCode: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const examId = history.state.examId

console.log('examId', history.state.examId)

interface ExamListTreeData extends ExamInfoOutput {
  parent: ''
  children: ExamInfoOutput[]
}
const moreTab = ref()
const purposeSelectRef = ref()
const delItemSelectRef = ref()
const previewRef = ref()
const sampleListRef = ref()

const aggregateConfig = reactive<VxeTablePropTypes.AggregateConfig<ExamInfoOutput>>({
  groupFields: ['testDate'],
  showTotal: true,
  expandAll: true,
  contentMethod({ groupValue }) {
    return `${formatDatetime(parseDate(groupValue), 'YY/MM/DD')}`
  },
})

const state = reactive({
  totalCount: 0,
  groupCode: '9999',
  allSamples: [] as ExamInfoOutput[],
  filteredList: [] as ExamInfoOutput[],
  resultList: [] as ExamResultOutput[],
  allSampleStatus: [] as Array<{ code: number; name: string }>,
  genderList: [] as DictGetListDto[] | null,
  ageUnitList: [] as DictGetListDto[] | null,
  sampleTypeList: [] as BaseSampleTypeOutput[],
  samplePropertyList: [] as DictGetListDto[] | null,
  actived: '1',
  addOrRemoveItemInput: {} as AddOrDeletePurposeInput,
  delItemDialogShow: false,
  delItemDataList: [] as BasePurposeOutput[],
  historyResultShow: false,
  queryDateRange: [] as any,
})
const activeId = ref(-1)

onMounted(async () => {
  state.allSampleStatus = SampleStatusUtils.getAllOptions()

  let endDate = new Date()
  let startDate = subtractDays(new Date(), 7)
  state.queryDateRange = [formatDate(startDate, 'YYYY-mm-dd'), formatDate(endDate, 'YYYY-mm-dd')]

  await new BaseSampleTypeApi()
    .getAll()
    .then((res) => {
      state.sampleTypeList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
  new DictApi().getList(['Gender', 'AgeUnit', 'SampleProperty']).then((res) => {
    state.genderList = res.data!.gender
    state.ageUnitList = res.data!.ageUnit
    state.samplePropertyList = res.data!.sampleProperty
  })

  if (examId != undefined && examId > 0) {
    querySampleList(examId)
  }
})

//#region 筛选逻辑

const handleFilter = () => {
  // 筛选逻辑已移至 SampleList 组件
}

//#endregion 1. 筛选逻辑

//#region 拖拽布局
const leftWidth = ref(280)
const rightWidth = ref(300)
const isResizing = ref(false)
const resizeTarget = ref('')
const startX = ref(0)
const startWidth = ref(0)

const startResize = (e: any, target: string) => {
  isResizing.value = true
  resizeTarget.value = target
  startX.value = e.clientX
  startWidth.value = target === 'left' ? leftWidth.value : rightWidth.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}
const onResize = (e: any) => {
  if (!isResizing.value) return
  const offset = e.clientX - startX.value
  if (resizeTarget.value === 'left') {
    const w = startWidth.value + offset
    if (w > 200 && w < 500) leftWidth.value = w
  } else {
    const w = startWidth.value - offset
    if (w > 220 && w < 600) rightWidth.value = w
  }
}
const stopResize = () => {
  isResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}
//#endregion 拖拽布局

//#region 业务逻辑
const groupChange = (value: String) => {
  state.allSamples = []
  state.filteredList = []
  state.resultList = []
  currentSample.value = null
}
const querySampleList = (examId?: number) => {
  var queryParam = {}

  if (examId != undefined && examId > 0) {
    queryParam = {
      examInfoId: examId,
    } as ExamListQueryInput
  } else {
    queryParam = {
      wfCode: props.wfCode,
      groupCode: state.groupCode,
      beginDate: state.queryDateRange[0],
      endDate: state.queryDateRange[1],
    } as PathologyExamListQueryInput
  }
  console.log(queryParam)
  new SampleTestApi().getSampleList(queryParam, { showErrorMessage: true }).then((res) => {
    if (res.data && res.data.length > 0) {
      res.data.forEach((item) => {
        item.testDate = new Date(item.testDate)
        if (item.collectTime) item.collectTime = new Date(item.collectTime)
      })

      if (examId != undefined && examId > 0) {
        state.queryDateRange = [formatDate(res.data![0].testDate, 'YYYY-mm-dd'), formatDate(res.data![0].testDate, 'YYYY-mm-dd')]
        state.groupCode = res.data![0].groupCode!
        history.state.examId = null
      }

      state.allSamples = res.data ?? []
      state.totalCount = state.allSamples.length
      if (state.allSamples.length > 0) {
        activeId.value = state.allSamples[0].id
        let filterData = state.allSamples
        state.filteredList = filterData
        nextTick(() => {
          sampleListRef.value.expandList()
        })
        console.log('state.filteredList', state.filteredList)
        switchSample(state.allSamples[0])
      }
    } else {
      console.log('no data')
      state.allSamples = []
      state.totalCount = 0
      activeId.value = -1
      state.filteredList = []
      state.resultList = []
      moreTab.value.clearSelectedTab()
    }
  })
}

// const currentSample = computed(() => state.allSamples.find((i) => i.id === state.activeId))
const currentSample = ref({} as ExamInfoOutput | null)

watch(activeId, (newValue) => {
  let curr = state.allSamples.find((i) => i.id === activeId.value)
  if (curr) {
    currentSample.value = curr
    nextTick(() => {
      moreTab.value.refreshSelectedTab()
    })
  } else currentSample.value = null
  console.log('currentSample', currentSample.value)
})

const switchSample = (row: ExamInfoOutput) => {
  activeId.value = row.id
  console.log('activeId', activeId.value)
  if (activeId.value > 0) {
    new SampleTestApi().getResultList({ examInfoId: row.id }, { showErrorMessage: true }).then((res) => {
      if (res.data) {
        res.data.forEach((item) => {
          item.isEditing = false
          item.originalItemResult = item.itemResult
        })
      }
      state.resultList = res.data!
      console.log(state.resultList)
    })
  }
}
/**
 * 操作
 */
const handleOperation = (command: string | number | object) => {
  console.log(command)
  if (currentSample.value == null || currentSample.value.id == 0) {
    return
  }
  if (command === 'RefreshItemInfo') {
    new SampleTestApi().refreshItemInfo({ examInfoId: currentSample.value!.id, isForce: 0 }, { showErrorMessage: true }).then((res) => {
      if (res.success) {
        modal.msgSuccess('刷新成功')
      }
    })
  } else if (command === 'AddItem') {
    addItem()
  } else if (command === 'DeleteItem') {
    deleteItem()
  } else if (command === 'CancelTest') {
    cancelTest()
  }
}
/**
 * 审核
 * @param type
 */
const audit = (type: OperationTypeEnum, ignoreRuleCodes?: string[]) => {
  if (currentSample.value == null) return
  let param = {
    examInfoId: currentSample.value!.id,
    auditType: type,
    executeType: ExecuteTypeEnum.Single,
    ignoreAuditRuleCodes: ignoreRuleCodes,
  } as AuditInput
  new SampleTestApi().audit(param).then((res) => {
    if (res.success) {
      if (res.data?.triggerRules != null && res.data?.triggerRules.length > 0) {
        if (res.data?.triggerRules.some((item) => item.noticeType == 1)) {
          let forbidendRules = res.data?.triggerRules.filter((item) => item.noticeType == 1)
          modal.msgError('审核失败：' + forbidendRules.map((item) => item.noticeMessage).join('\n'))
        } else if (res.data?.triggerRules.some((item) => item.noticeType == 0)) {
          let warningRules = res.data?.triggerRules.filter((item) => item.noticeType == 0)
          let warningRuleCodes = warningRules.map((item) => item.ruleCode!)
          modal.confirm('审核失败：' + warningRules.map((item) => item.noticeMessage).join('\n'), {}).then(() => {
            audit(type, warningRuleCodes)
          })
        }
        return
      }
      let cur = state.allSamples.find((item) => item.id == currentSample.value!.id)
      if (cur) {
        let exam = res.data?.examInfo
        cur!.sampleStatus = exam?.sampleStatus
        cur!.sampleStatusName = exam?.sampleStatusName
        if (type == OperationTypeEnum.FirstCheck) {
          cur!.firstAuditId = exam?.firstAuditId
          cur!.firstAuditName = exam?.firstAuditName
          cur!.firstAuditTime = exam?.firstAuditTime
          cur!.firstAuditAuthorizedId = exam?.firstAuditAuthorizedId
        } else if (type == OperationTypeEnum.SecondCheck) {
          cur!.secondAuditId = exam?.secondAuditId
          cur!.secondAuditName = exam?.secondAuditName
          cur!.secondAuditTime = exam?.secondAuditTime
          cur!.secondAuditAuthorizedId = exam?.secondAuditAuthorizedId
        }
      }
      modal.msgSuccess('审核成功')
    }
  })
}
/**
 * 反审核
 */
const unAudit = () => {
  if (currentSample.value == null) return

  modal.prompt('请输入反审核原因', null).then(({ value }) => {
    let param = {
      examInfoId: currentSample.value!.id,
      reasonCode: '1001',
      reasonContent: value,
      executeType: ExecuteTypeEnum.Single,
    } as UnAuditInput

    new SampleTestApi().unAudit(param).then((res) => {
      if (res.success) {
        let cur = state.allSamples.find((item) => item.id == currentSample.value!.id)
        if (cur) {
          cur!.sampleStatus = res.data?.sampleStatus
          cur!.sampleStatusName = res.data?.sampleStatusName
          cur!.firstAuditId = res.data?.firstAuditId
          cur!.firstAuditName = res.data?.firstAuditName
          cur!.firstAuditTime = res.data?.firstAuditTime
          cur!.firstAuditAuthorizedId = res.data?.firstAuditAuthorizedId
          cur!.secondAuditId = res.data?.secondAuditId
          cur!.secondAuditName = res.data?.secondAuditName
          cur!.secondAuditTime = res.data?.secondAuditTime
          cur!.secondAuditAuthorizedId = res.data?.secondAuditAuthorizedId
          cur!.printReportTime = res.data?.printReportTime
          cur!.downloadFlag = res.data?.downloadFlag
          cur!.createReportTime = res.data?.createReportTime
        }
        modal.msgSuccess('反审核成功')
      }
    })
  })
}

const preView = () => {
  if (activeId.value <= 0) return
  previewRef.value.preview()
}
/**
 * 增项
 */
const addItem = () => {
  // state.historyResultShow = true
  // return

  if (activeId.value < 0) return
  console.log('purposeSelectRef', purposeSelectRef.value)
  purposeSelectRef.value.open(currentSample.value!.customerCode, '')
}
const confirmSelectItem = (selectItems: PurposeAndComboOutput[]) => {
  if (selectItems && selectItems.findIndex((v) => v.isCombo == false) >= 0) {
    state.addOrRemoveItemInput.purCodes = selectItems.filter((v) => v.isCombo == false).map((v) => v.purCode!)
  } else if (selectItems && selectItems.findIndex((v) => v.isCombo) >= 0) {
    state.addOrRemoveItemInput.comboCodes = selectItems.filter((v) => v.isCombo).map((v) => v.purCode!)
  }
  state.addOrRemoveItemInput.examInfoId = currentSample.value!.id

  new SampleTestApi().addItem(state.addOrRemoveItemInput).then((res) => {
    if (res.success) {
      modal.msgSuccess('增项成功')
      nextTick(() => {
        let curr = state.allSamples.find((i) => i.id === activeId.value)
        if (curr) {
          curr!.purCodes = res.data?.purCodes
          curr!.purNames = res.data?.purNames
          moreTab.value.refreshSelectedTab()
          switchSample(curr)
        }
      })
    }
  })
}
/**
 * 退项
 */
const deleteItem = () => {
  console.log('resultList.length', state.resultList.length)
  if (activeId.value < 0) return
  if (state.resultList.length <= 0) return

  state.delItemDataList = Array.from(
    new Map(state.resultList.map((item) => [item.purCode, { purCode: item.purCode, purName: item.purName } as BasePurposeOutput])).values()
  )
  console.log('state.delItemDataList', state.delItemDataList)
  state.delItemDialogShow = true
}
const onConfirmSelectDelItem = () => {
  let selectItems = (delItemSelectRef.value.getSelectionRows() ?? []) as BasePurposeOutput[]
  console.log('selectItems', selectItems)
  state.delItemDialogShow = false
  if (selectItems.length <= 0) return
  new SampleTestApi().backItem({ examInfoId: currentSample.value!.id, purCodes: selectItems.map((v) => v.purCode!) }).then((res) => {
    if (res.success) {
      modal.msgSuccess('退项成功')
      nextTick(() => {
        let curr = state.allSamples.find((i) => i.id === activeId.value)
        if (curr) {
          curr!.purCodes = res.data?.purCodes
          curr!.purNames = res.data?.purNames
          moreTab.value.refreshSelectedTab()
          switchSample(curr)
        }
      })
    }
  })
}

/**
 * 取消检测
 */
const cancelTest = () => {
  if (activeId.value < 0) return

  modal.prompt('请输入反审核原因', null).then(({ value }) => {
    let param = {
      examInfoId: currentSample.value!.id,
      reasonCode: '1001',
      reasonContent: value,
      executeType: ExecuteTypeEnum.Single,
    } as CancelTestInput

    new SampleTestApi().cancelTest(param).then((res) => {
      if (res.success) {
        modal.msgSuccess('取消检测成功')
        let curr = state.allSamples.find((i) => i.id === activeId.value)
        if (curr) {
          curr!.sampleStatus = res.data?.sampleStatus
          curr!.sampleStatusName = res.data?.sampleStatusName
          // moreTab.value.refreshSelectedTab()
          switchSample(curr)
        }
      }
    })
  })
}

const moreTabVisableChange = (tabName: string) => {
  if (tabName) {
    console.log('tabName', tabName)
    moreTab.value.refreshSelectedTab()
  }
}
//#endregion 业务逻辑

//#region 检验结果编辑
const vFocus = { mounted: (el: any) => el.querySelector('input')?.focus() }
const startEdit = (row: ExamResultOutput) => {
  console.log('currentSample', currentSample.value)
  if (
    currentSample.value?.sampleStatus != SampleStatus.Testing.toString() &&
    currentSample.value?.sampleStatus != SampleStatus.ReportDelay.toString()
  )
    return
  row.isEditing = true
}
const finishEdit = (row: ExamResultOutput) => {
  console.log('row', row)
  row.isEditing = false
  if (row.itemResult !== row.originalItemResult) saveResult(row)
}

const saveResult = (row: ExamResultOutput) => {
  new SampleTestApi().saveItemResult(row).then((res) => {
    if (res.success) {
      state.resultList.forEach((v) => {
        if (v.id == row.id) {
          v.hlFlag = res.data?.hlFlag
          v.itemResult = res.data?.itemResult
          v.originalItemResult = res.data?.itemResult
          console.log('v', v)
          if (v.isCriticalValue) {
            state.allSamples.find((x) => x.id == v.examInfoId)!.hasCritical = true
          }
        }
      })
      modal.msgSuccess('保存成功')
    }
  })
}

//#endregion 检验结果编辑

//#region 基础信息编辑
// 基础信息编辑逻辑已移至 PatientInfo 组件
//#endregion 基础信息编辑

// 样式辅助
const tableRowClassName = (row: ExamResultOutput) => (row.hlFlag === 'H' ? 'row-high' : row.hlFlag === 'L' ? 'row-low' : '')
const getAbnormalClass = (s: string) => (s === 'H' ? 'input-high' : s === 'L' ? 'input-low' : '')
const getAbnormalTextClass = (s: string) => (s === 'H' ? 'text-high' : s === 'L' ? 'text-low' : '')
</script>

<style lang="scss" scoped>
/* 保持之前的 CSS 样式，增加 dot 样式 */
.lis-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
}
.lis-header {
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  // margin-top: 10px;
  flex-shrink: 0;
  z-index: 0;
}
.brand {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  display: flex;
  align-items: center;
}
.lis-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  height: calc(100vh - 48px);
}
.panel-left,
.panel-right {
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;
}
.panel-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  height: 100%;
}
.el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  :deep(.el-card__header) {
    padding: 8px 12px;
    background: #fafafa;
    flex-shrink: 0;
  }
  :deep(.el-card__body) {
    padding: 0;
    flex: 1;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }
}
.virtual-list-container {
  flex: 1;
  width: 100%;
  height: 400px;
  overflow: hidden;
}
.resizer {
  width: 6px;
  background: #f2f2f2;
  cursor: col-resize;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  &:hover {
    background: #e6e6e6;
    .resizer-grip {
      background: #409eff;
    }
  }
}
.resizer-grip {
  width: 2px;
  height: 16px;
  background: #ccc;
}

.virtual-item-card {
  box-sizing: border-box;
  height: 76px;
  width: 100%;
  margin: 4px 8px;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    background: #f9fafc;
  }
  &.is-active {
    background: #ecf5ff;
    border-color: #409eff;
    box-shadow: inset 3px 0 0 #409eff;
  }
  .item-top {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 14px;
  }
  .item-mid {
    font-size: 12px;
    color: #606266;
  }
  .item-bottom {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #909399;
  }
}
.list-header-wrapper {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}
.list-footer {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
  flex-shrink: 0;
}

.cell-viewer {
  width: 100%;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  &:hover {
    background: #f5f7fa;
  }
  .placeholder {
    color: #ccc;
    font-size: 12px;
    font-style: italic;
  }
}
.cell-editor :deep(.el-input__inner) {
  height: 24px;
  padding: 0 5px;
}

.text-high {
  color: #f56c6c;
  font-weight: bold;
}
.text-low {
  color: #409eff;
  font-weight: bold;
}
.flag-high {
  color: #f56c6c;
  margin-left: 3px;
}
.flag-critical {
  color: #f84747;
  margin-left: 3px;
}
.flag-low {
  color: #409eff;
  margin-left: 3px;
}

:deep(.row-high) {
  --el-table-tr-bg-color: #fef0f0;
}
:deep(.row-low) {
  --el-table-tr-bg-color: #ecf5ff;
}
.input-high :deep(.el-input__inner) {
  color: #f56c6c;
  font-weight: bold;
}
.input-low :deep(.el-input__inner) {
  color: #409eff;
  font-weight: bold;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: bold;
}
.info-content {
  padding: 15px;
  overflow-y: auto;
  height: 100%;
}
.empty-state {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-lg {
  font-size: 16px;
  font-weight: bold;
}
.barcode-text {
  color: #409eff;
  font-family: monospace;
  font-weight: 600;
}
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 标记修改样式 */
.is-modified :deep(.el-input__wrapper),
.is-modified :deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #e6a23c inset;
  background-color: #fdf6ec;
}
.dot {
  margin-right: 4px;
  font-weight: bold;
  &.danger {
    color: #f56c6c;
  }
  &.warning {
    color: #e6a23c;
  }
  &.success {
    color: #67c23a;
  }
}
/* 修改后的输入框边框变色 */
.is-modified :deep(.el-input__wrapper),
.is-modified :deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #e6a23c inset; /* 橙色高亮 */
  background-color: #fdf6ec;
}

/* Radio Group 的特殊处理 */
.is-modified-border {
  padding: 5px;
  border: 1px dashed #e6a23c;
  border-radius: 4px;
  background-color: #fdf6ec;
}

.original-value-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
  line-height: 1.2;
}
</style>

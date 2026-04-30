<template>
  <el-card shadow="never" class="list-card">
    <template #header>
      <div class="list-header-wrapper">
        <!-- 日期 -->
        <el-date-picker
          v-model="localDateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始"
          end-placeholder="结束"
          size="small"
          value-format="YYYY-MM-DD"
          style="width: 100%; margin-bottom: 6px"
          @update:modelValue="handleDateUpdate"
          @change="handleDateChange"
        />
        <!-- 状态筛选 -->
        <el-select
          v-model="statusFilter"
          multiple
          collapse-tags
          collapse-tags-tooltip
          clearable
          placeholder="状态 (全部)"
          size="small"
          style="width: 100%; margin-bottom: 6px"
          @change="handleFilter"
        >
          <el-option v-for="s in allSampleStatus" :key="s.code" :label="s.name" :value="s.code">{{ s.name }}</el-option>
        </el-select>
        <!-- 搜索 -->
        <div style="display: flex">
          <el-input v-model="searchText" placeholder="筛选" prefix-icon="Search" size="small" clearable @input="handleFilter" />
          <el-button @click="querySampleList" type="primary">查询</el-button>
        </div>
      </div>
    </template>

    <div class="virtual-list-container">
      <vxe-table
        style="height: 100%"
        max-height="100%"
        min-height="100%"
        border="full"
        ref="sampleListTableRef"
        :data="props.filteredList"
        :row-config="{ isCurrent: true, isHover: true }"
        :aggregate-config="aggregateConfig"
        :virtual-y-config="{ enabled: true, gt: 0 }"
        @current-row-change="({ row }) => switchSample(row)"
      >
        <vxe-column field="sampleNo" title="样本号" width="150" row-group-node>
          <template #default="{ row }">
            <el-badge :is-dot="row.hasCritical" class="item">
              <el-tag size="large" :color="GetStatusColor(SampleStatusUtils.getSampleStatus(row?.sampleStatus))" effect="plain">{{
                row.sampleNo
              }}</el-tag>
            </el-badge>
          </template>
        </vxe-column>
        <vxe-column field="barcode" title="条码" width="120"></vxe-column>
        <vxe-column field="patientName" title="姓名" width="auto"></vxe-column>
        <vxe-column field="purCodes" title="目的代码" width="150"></vxe-column>
        <vxe-column field="purNames" title="目的名称" width="150"></vxe-column>
      </vxe-table>
    </div>
    <div class="list-footer">共 {{ allSamples.length }} 条</div>
  </el-card>
</template>

<script lang="ts" setup name="SampleList">
import { nextTick, reactive, ref, watch } from 'vue'
import { VxeGridInstance, VxeTablePropTypes } from 'vxe-table'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { GetStatusColor, SampleStatusUtils } from '/@/api/lims/shared/enums/samplestatusenum'
import { formatDatetime, parseDate } from '/@/utils/formatTime'

// Props
const props = defineProps<{
  groupCode: string
  allSampleStatus: Array<{ code: number; name: string }>
  allSamples: ExamInfoOutput[]
  filteredList: ExamInfoOutput[]
  activeId: number
  queryDateRange: any[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:allSamples', value: ExamInfoOutput[]): void
  (e: 'update:filteredList', value: ExamInfoOutput[]): void
  (e: 'update:activeId', value: number): void
  (e: 'switchSample', row: ExamInfoOutput): void
  (e: 'querySampleList', examId?: number): void
  (e: 'update:queryDateRange', value: any[]): void
}>()

// 响应式数据
const localDateRange = ref(props.queryDateRange)
const statusFilter = ref([] as any[])
const searchText = ref('')
const sampleListTableRef = ref<VxeGridInstance<ExamInfoOutput>>()

// 监听 queryDateRange 变化
watch(
  () => props.queryDateRange,
  (newValue) => {
    //console.log('SampleList 监听到日期范围变化:', newValue)
    if (newValue && newValue.length === 2) {
      localDateRange.value = newValue
      //console.log('更新 localDateRange:', localDateRange.value)
    }
  },
  { immediate: true }
)

// 聚合配置
const aggregateConfig = reactive<VxeTablePropTypes.AggregateConfig<ExamInfoOutput>>({
  groupFields: ['testDate'],
  showTotal: true,
  expandAll: true,
  contentMethod({ groupValue }) {
    return `${formatDatetime(parseDate(groupValue), 'YY/MM/DD')}`
  },
})

// 日期更新处理
const handleDateUpdate = (value: any[]) => {
  emit('update:queryDateRange', value)
}

// 日期变化处理
const handleDateChange = () => {
  emit('querySampleList')
}

// 筛选处理
const handleFilter = () => {
  let res = props.allSamples
  // 状态筛选
  if (statusFilter.value && statusFilter.value.length > 0) {
    res = res.filter((item) => statusFilter.value.includes(item.sampleStatus))
  }
  // 文本筛选
  if (searchText.value) {
    const lower = searchText.value.toLowerCase()
    res = res.filter((item) => item.barcode?.toLowerCase().includes(lower) == true || item.patientName?.toLowerCase()?.includes(lower) == true)
  }
  emit('update:filteredList', res)

  const $table = sampleListTableRef.value
  if (res && res.length > 0) {
    if (res.findIndex((v) => v.id == props.activeId) < 0) {
      switchSample(res[0])
      $table!.setCurrentRow(res[0])
    }
  }
  nextTick(() => {
    $table!.setAllRowGroupExpand(true)
  })
}

// 监听状态筛选变化
watch(statusFilter, handleFilter)

// 监听过滤列表变化，自动选中第一行数据
watch(
  () => props.filteredList,
  (newList) => {
    const $table = sampleListTableRef.value
    console.log('sampleList 监听到过滤列表变化:', newList)
    if (newList && newList.length > 0) {
      // 总是选中第一行数据
      //switchSample(newList[0])
      // nextTick(() => {
      //   if ($table) {
      //     $table.setCurrentRow(newList[0])
      //     $table.setAllRowGroupExpand(true)
      //   }
      // })
    }
  },
  { deep: true }
)

const expandList = () => {
  console.log('expandList1')
  const $table = sampleListTableRef.value
  if ($table) {
    if (props.filteredList && props.filteredList.length > 0) {
      if ($table) {
        console.log('expandList2')
        $table.setAllRowGroupExpand(true)
        $table.setCurrentRow(props.filteredList[0])
      }
    }
  }
}

// 查询样本列表
const querySampleList = (examId?: number) => {
  emit('querySampleList', examId)
}

// 切换样本
const switchSample = (row: ExamInfoOutput) => {
  const $table = sampleListTableRef.value
  // 确保 row 是有效的数据行（不是聚合记录）
  if (row && row.id && row.id > 0) {
    emit('update:activeId', row.id)
    emit('switchSample', row)
  }
}

defineExpose({
  expandList,
})
</script>

<style scoped>
.list-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header-wrapper {
  width: 100%;
}

.virtual-list-container {
  flex: 1;
  overflow: hidden;
}

.list-footer {
  text-align: right;
  padding-top: 8px;
  font-size: 12px;
  color: #606266;
  border-top: 1px solid #ebeef5;
}

.item {
  margin-right: 4px;
}
</style>

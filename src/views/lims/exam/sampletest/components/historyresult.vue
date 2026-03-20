<template>
  <div class="comparison-container">
    <!-- 1. 顶部筛选栏 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="病人ID">
          <el-input v-model="queryParams.patientId" placeholder="请输入病人ID" />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询对比</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 2. 趋势图表区 -->
    <el-card class="chart-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>指标趋势分析</span>
          <el-select v-model="selectedItem" placeholder="切换展示指标" @change="updateChart">
            <el-option v-for="item in testItems" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </template>
      <div id="trendChart" style="width: 100%; height: 300px;"></div>
    </el-card>

    <!-- 3. 数据对比表 -->
    <el-card class="table-card" v-loading="loading">
      <template #header>
        <span>历史明细对比</span>
      </template>
      <el-table :data="tableData" border stripe style="width: 100%">
        <!-- 固定列：项目信息 -->
        <el-table-column prop="itemName" label="检验项目" width="150" fixed />
        <el-table-column prop="refRange" label="参考范围" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />

        <!-- 动态列：日期列 -->
        <el-table-column 
          v-for="date in historyDates" 
          :key="date" 
          :label="date" 
          min-width="120"
        >
          <template #default="scope">
            <span :class="getResultClass(scope.row.values[date])">
              {{ scope.row.values[date]?.value || '-' }}
              <el-icon v-if="scope.row.values[date]?.flag === 'H'"><Top /></el-icon>
              <el-icon v-if="scope.row.values[date]?.flag === 'L'"><Bottom /></el-icon>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Top, Bottom } from '@element-plus/icons-vue'

// --- 模拟数据 ---
const testItems = ['白细胞(WBC)', '红细胞(RBC)', '血红蛋白(HGB)']
const historyDates = ['2023-10-01', '2023-10-15', '2023-11-01', '2023-11-20']

// --- 状态变量 ---
const loading = ref(false)
const queryParams = reactive({
  patientId: 'P001',
  dateRange: ['2023-10-01', '2023-12-01']
})
const selectedItem = ref('白细胞(WBC)')
const tableData = ref([])
let myChart = null

// --- 方法 ---

// 格式化表格数据：将原始数据转换为以项目为行，日期为列的结构
const formatTableData = () => {
  // 这里模拟从后端获取的数据结构
  const mockData = [
    {
      itemName: '白细胞(WBC)',
      refRange: '4.0-10.0',
      unit: '10^9/L',
      values: {
        '2023-10-01': { value: 6.5, flag: 'N' },
        '2023-10-15': { value: 11.2, flag: 'H' }, // 高于正常值
        '2023-11-01': { value: 8.4, flag: 'N' },
        '2023-11-20': { value: 5.9, flag: 'N' }
      }
    },
    {
      itemName: '血红蛋白(HGB)',
      refRange: '120-160',
      unit: 'g/L',
      values: {
        '2023-10-01': { value: 135, flag: 'N' },
        '2023-10-15': { value: 110, flag: 'L' }, // 低于正常值
        '2023-11-01': { value: 125, flag: 'N' },
        '2023-11-20': { value: 140, flag: 'N' }
      }
    }
  ]
  tableData.value.ref = mockData
}

// 结果样式：高偏红，低偏蓝
const getResultClass = (data) => {
  if (!data) return ''
  if (data.flag === 'H') return 'text-danger'
  if (data.flag === 'L') return 'text-primary'
  return ''
}

// 初始化/更新图表
const updateChart = () => {
  if (!myChart) {
    myChart = echarts.init(document.getElementById('trendChart'))
  }
  
  // 模拟根据 selectedItem 获取的趋势数据
  const seriesData = [6.5, 11.2, 8.4, 5.9] 
  
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: historyDates },
    yAxis: { type: 'value', name: '检测值' },
    series: [{
      name: selectedItem.value,
      type: 'line',
      data: seriesData,
      smooth: true,
      markPoint: {
        data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
      },
      lineStyle: { color: '#409EFF' },
      itemStyle: { color: '#409EFF' }
    }]
  }
  myChart.setOption(option)
}

const handleSearch = () => {
  loading.value = true
  // 模拟请求延迟
  setTimeout(() => {
    formatTableData()
    updateChart()
    loading.value = false
  }, 500)
}

const resetQuery = () => {
  queryParams.patientId = ''
  queryParams.dateRange = []
}

onMounted(() => {
  handleSearch()
  window.addEventListener('resize', () => myChart?.resize())
})
</script>

<style scoped>
.comparison-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.filter-card, .chart-card, .table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-danger {
  color: #f56c6c;
  font-weight: bold;
}

.text-primary {
  color: #409eff;
  font-weight: bold;
}

:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
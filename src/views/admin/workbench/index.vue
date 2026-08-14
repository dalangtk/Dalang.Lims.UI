<template>
  <div class="workbench-container layout-pd">
    <!-- 顶部欢迎横幅 -->
    <div class="welcome-banner mb15">
      <div class="welcome-banner__content">
        <div class="welcome-banner__text">
          <div class="welcome-banner__title">{{ state.greeting }}，{{ state.userName }}</div>
          <div class="welcome-banner__desc">{{ state.today }} · 欢迎使用 LIMS 医学检验工作台</div>
        </div>
        <div class="welcome-banner__stats">
          <div class="welcome-banner__stat">
            <span class="num">{{ state.summary.todayReceived }}</span>
            <span class="label">今日收样</span>
          </div>
          <div class="welcome-banner__divider"></div>
          <div class="welcome-banner__stat">
            <span class="num">{{ state.summary.todayCompleted }}</span>
            <span class="label">今日完成</span>
          </div>
          <div class="welcome-banner__divider"></div>
          <div class="welcome-banner__stat">
            <span class="num">{{ state.summary.criticalValue }}</span>
            <span class="label">危急值</span>
          </div>
        </div>
      </div>
      <div class="welcome-banner__decoration"></div>
    </div>

    <!-- KPI 统计卡片 -->
    <el-row :gutter="15" class="mb15">
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="6"
        :xl="6"
        v-for="(item, k) in state.stats"
        :key="k"
        class="mb15"
      >
        <div class="kpi-card" :class="`kpi-card--${item.key}`">
          <div class="kpi-card__body">
            <div class="kpi-card__info">
              <div class="kpi-card__label">{{ item.label }}</div>
              <div class="kpi-card__value">
                {{ item.value }}<span class="kpi-card__unit">{{ item.unit }}</span>
              </div>
              <div class="kpi-card__trend" :class="item.trend >= 0 ? 'is-up' : 'is-down'">
                <el-icon><CaretTop v-if="item.trend >= 0" /><CaretBottom v-else /></el-icon>
                <span>{{ Math.abs(item.trend) }}%</span>
                <span class="kpi-card__trend-label">较昨日</span>
              </div>
            </div>
            <div class="kpi-card__icon">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
          </div>
          <div class="kpi-card__footer">
            <span>{{ item.subLabel }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表第一行：样本趋势 + 科室分布 -->
    <el-row :gutter="15" class="mb15">
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16" class="mb15">
        <div class="chart-card">
          <div class="chart-card__header">
            <div class="chart-card__title">
              <span class="chart-card__bar"></span>
              样本处理趋势
            </div>
            <div class="chart-card__legend">
              <span class="legend-item"><i class="dot dot--primary"></i>收样数量</span>
              <span class="legend-item"><i class="dot dot--success"></i>完成数量</span>
            </div>
          </div>
          <div class="chart-card__body" ref="trendRef"></div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" class="mb15">
        <div class="chart-card">
          <div class="chart-card__header">
            <div class="chart-card__title">
              <span class="chart-card__bar"></span>
              检验科室分布
            </div>
          </div>
          <div class="chart-card__body" ref="deptRef"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表第二行：阶段统计 + 质控合格率 -->
    <el-row :gutter="15" class="mb15">
      <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16" class="mb15">
        <div class="chart-card">
          <div class="chart-card__header">
            <div class="chart-card__title">
              <span class="chart-card__bar"></span>
              检验阶段统计
            </div>
            <div class="chart-card__legend">
              <span class="legend-item"><i class="dot dot--primary"></i>前处理</span>
              <span class="legend-item"><i class="dot dot--warning"></i>检验中</span>
              <span class="legend-item"><i class="dot dot--success"></i>已报告</span>
            </div>
          </div>
          <div class="chart-card__body" ref="stageRef"></div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" class="mb15">
        <div class="chart-card">
          <div class="chart-card__header">
            <div class="chart-card__title">
              <span class="chart-card__bar"></span>
              质控合格率
            </div>
          </div>
          <div class="chart-card__body" ref="qualityRef"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 底部：快捷导航 + 待办事项 + 最新报告 -->
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" class="mb15">
        <div class="panel-card">
          <div class="panel-card__header">
            <div class="panel-card__title">
              <span class="panel-card__bar"></span>
              快捷导航
            </div>
          </div>
          <div class="panel-card__body">
            <div class="quick-nav">
              <div
                class="quick-nav__item"
                v-for="(item, k) in state.quickNav"
                :key="k"
                @click="handleNavClick(item)"
              >
                <div class="quick-nav__icon" :style="{ background: item.bg, color: item.color }">
                  <el-icon><component :is="item.icon" /></el-icon>
                </div>
                <div class="quick-nav__label">{{ item.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" class="mb15">
        <div class="panel-card">
          <div class="panel-card__header">
            <div class="panel-card__title">
              <span class="panel-card__bar"></span>
              待办事项
            </div>
            <el-tag size="small" type="danger" round>{{ state.todoList.length }}</el-tag>
          </div>
          <div class="panel-card__body panel-card__body--scroll">
            <div class="todo-list">
              <div class="todo-item" v-for="(item, k) in state.todoList" :key="k">
                <div class="todo-item__tag" :class="`todo-item__tag--${item.priority}`">
                  {{ item.type }}
                </div>
                <div class="todo-item__content">
                  <div class="todo-item__title">{{ item.title }}</div>
                  <div class="todo-item__desc">{{ item.desc }}</div>
                </div>
                <div class="todo-item__time">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" class="mb15">
        <div class="panel-card">
          <div class="panel-card__header">
            <div class="panel-card__title">
              <span class="panel-card__bar"></span>
              最新报告
            </div>
          </div>
          <div class="panel-card__body panel-card__body--scroll">
            <div class="report-list">
              <div class="report-item" v-for="(item, k) in state.recentReports" :key="k">
                <div class="report-item__icon" :class="`report-item__icon--${item.status}`">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="report-item__content">
                  <div class="report-item__title">{{ item.title }}</div>
                  <div class="report-item__meta">
                    <span>{{ item.dept }}</span>
                    <span class="report-item__sep">·</span>
                    <span>{{ item.sampleNo }}</span>
                  </div>
                </div>
                <el-tag
                  size="small"
                  :type="reportStatusType(item.status)"
                  effect="light"
                  round
                >
                  {{ reportStatusText(item.status) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="admin/workbench">
import { reactive, onMounted, onBeforeUnmount, ref, watch, nextTick, onActivated, markRaw, computed } from 'vue'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '/@/stores/themeConfig'
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes'
import {
  CaretTop,
  CaretBottom,
  Files,
  Aim,
  Document,
  DocumentChecked,
  WarningFilled,
  DataAnalysis,
  Search,
  Histogram,
  FirstAidKit,
} from '@element-plus/icons-vue'
import { useUserInfo } from '/@/stores/userInfo'
const storesUserInfo = useUserInfo()

// 图表 DOM 引用
const trendRef = ref()
const deptRef = ref()
const stageRef = ref()
const qualityRef = ref()

const storesTagsViewRoutes = useTagsViewRoutes()
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes)

const state = reactive({
  global: {
    trendChart: null,
    deptChart: null,
    stageChart: null,
    qualityChart: null,
    dispose: [null, '', undefined],
  } as any,
  // 主题相关（保留原逻辑：根据 isIsDark 切换图表背景色）
  charts: {
    theme: '',
    bgColor: '',
    color: '#303133',
    axisLine: '#e5e7eb',
    splitLine: '#f0f2f5',
    textColor: '#6b7280',
  },
  // 顶部问候语
  greeting: '上午好',
  userName: storesUserInfo.userInfos.userName,
  today: '',
  // 汇总数据（接口预留：/api/workbench/summary）
  summary: {
    todayReceived: 256,
    todayCompleted: 198,
    criticalValue: 3,
  },
  // KPI 卡片数据（接口预留：/api/workbench/stats）
  stats: [
    {
      key: 'unsorted',
      label: '未分拣样本',
      value: 128,
      unit: '份',
      trend: 12.5,
      subLabel: '前处理 · 待分拣',
      icon: Files,
    },
    {
      key: 'testing',
      label: '检验中样本',
      value: 56,
      unit: '份',
      trend: -5.2,
      subLabel: '检验 · 进行中',
      icon: Aim,
    },
    {
      key: 'pendingReview',
      label: '待审核报告',
      value: 42,
      unit: '份',
      trend: 8.3,
      subLabel: '报告 · 待审核',
      icon: Document,
    },
    {
      key: 'reported',
      label: '已出报告',
      value: 1256,
      unit: '份',
      trend: 15.6,
      subLabel: '报告 · 本月累计',
      icon: DocumentChecked,
    },
  ],
  // 趋势数据（接口预留：/api/workbench/trend）
  trend: {
    dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    received: [180, 220, 195, 256, 240, 168, 132],
    completed: [150, 198, 180, 220, 215, 156, 120],
  },
  // 科室分布（接口预留：/api/workbench/department）
  department: [
    { name: '生化', value: 320 },
    { name: '免疫', value: 280 },
    { name: '微生物', value: 180 },
    { name: '血液', value: 240 },
    { name: '病理', value: 120 },
    { name: '分子生物', value: 160 },
  ],
  // 阶段统计（接口预留：/api/workbench/stage）
  stage: {
    depts: ['生化', '免疫', '微生物', '血液', '病理', '分子生物'],
    preProcess: [45, 38, 22, 30, 18, 25],
    testing: [60, 52, 35, 42, 25, 30],
    reported: [215, 190, 123, 168, 77, 105],
  },
  // 质控合格率（接口预留：/api/workbench/quality）
  quality: [
    { name: '生化', value: 98.5 },
    { name: '免疫', value: 97.8 },
    { name: '微生物', value: 96.2 },
    { name: '血液', value: 99.1 },
    { name: '病理', value: 95.6 },
    { name: '分子生物', value: 98.0 },
  ],
  // 快捷导航
  quickNav: [
    { label: '样本分拣', icon: Files, bg: 'rgba(64,158,255,0.12)', color: '#409EFF', path: '/sample/sort' },
    { label: '前处理', icon: DataAnalysis, bg: 'rgba(103,194,58,0.12)', color: '#67C23A', path: '/preprocess' },
    { label: '检验录入', icon: Aim, bg: 'rgba(230,162,60,0.12)', color: '#E6A23C', path: '/test/entry' },
    { label: '病理诊断', icon: FirstAidKit, bg: 'rgba(245,108,108,0.12)', color: '#F56C6C', path: '/pathology' },
    { label: '报告管理', icon: Document, bg: 'rgba(144,147,153,0.12)', color: '#909399', path: '/report' },
    { label: '报告查询', icon: Search, bg: 'rgba(155,89,238,0.12)', color: '#9B59E8', path: '/report/query' },
    { label: '危急值', icon: WarningFilled, bg: 'rgba(245,108,108,0.12)', color: '#F56C6C', path: '/critical' },
    { label: '质控管理', icon: Histogram, bg: 'rgba(64,158,255,0.12)', color: '#409EFF', path: '/quality' },
  ],
  // 待办事项（接口预留：/api/workbench/todo）
  todoList: [
    { type: '危急值', priority: 'high', title: '血糖危急值待复检', desc: '样本号 S20260811-0032', time: '10分钟前' },
    { type: '审核', priority: 'medium', title: '生化报告待审核', desc: '12 份报告待您审核', time: '30分钟前' },
    { type: '分拣', priority: 'high', title: '128 份样本待分拣', desc: '前处理 · 收样区', time: '1小时前' },
    { type: '质控', priority: 'medium', title: '免疫室质控异常', desc: 'HBsAg 项目超出 ±2SD', time: '2小时前' },
    { type: '病理', priority: 'low', title: '病理切片待签发', desc: '8 份切片待诊断', time: '3小时前' },
  ],
  // 最新报告（接口预留：/api/workbench/recent-reports）
  recentReports: [
    { title: '血常规检验报告', dept: '血液室', sampleNo: 'S20260811-0098', status: 'reported' },
    { title: '肝功能生化报告', dept: '生化室', sampleNo: 'S20260811-0076', status: 'reviewing' },
    { title: '乙肝五项检测', dept: '免疫室', sampleNo: 'S20260811-0065', status: 'reported' },
    { title: '病理诊断报告', dept: '病理室', sampleNo: 'S20260811-0052', status: 'testing' },
    { title: '微生物培养', dept: '微生物室', sampleNo: 'S20260811-0041', status: 'testing' },
    { title: 'PCR 核酸检测', dept: '分子生物', sampleNo: 'S20260811-0028', status: 'reviewing' },
    { title: '尿常规报告', dept: '生化室', sampleNo: 'S20260811-0015', status: 'reported' },
  ],
  myCharts: [] as any[],
})

// 报告状态文案
const reportStatusText = (status: string) => {
  const map: Record<string, string> = {
    testing: '检验中',
    reviewing: '审核中',
    reported: '已报告',
  }
  return map[status] || status
}
// 报告状态 tag 类型
const reportStatusType = (status: string) => {
  const map: Record<string, string> = {
    testing: 'warning',
    reviewing: 'info',
    reported: 'success',
  }
  return map[status] || 'info'
}

// 快捷导航点击
const handleNavClick = (item: any) => {
  // 预留：对接路由跳转
  // router.push(item.path)
  console.log('navigate to:', item.path)
}

// 主题色（根据主题切换）
const themeColors = computed(() => {
  const isDark = themeConfig.value.isIsDark
  return {
    textColor: isDark ? '#dadada' : '#303133',
    subTextColor: isDark ? '#9b9da1' : '#6b7280',
    axisLine: isDark ? '#3a3a3a' : '#e5e7eb',
    splitLine: isDark ? '#2a2a2a' : '#f0f2f5',
    bgColor: isDark ? 'transparent' : '',
    seriesColors: ['#6954f0', '#36c78b', '#fec279', '#968af5', '#e790e8', '#51a3fc'],
  }
})

// 样本处理趋势
const initTrendChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.trendChart)) state.global.trendChart?.dispose()
  state.global.trendChart = markRaw(echarts.init(trendRef.value, state.charts.theme))
  const c = themeColors.value
  const option = {
    backgroundColor: state.charts.bgColor,
    grid: { top: 30, right: 20, bottom: 30, left: 45 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: themeConfig.value.isIsDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: themeConfig.value.isIsDark ? '#3a3a3a' : '#e5e7eb',
      textStyle: { color: c.textColor },
    },
    legend: { show: false },
    xAxis: {
      type: 'category',
      data: state.trend.dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: c.axisLine } },
      axisTick: { show: false },
      axisLabel: { color: c.subTextColor },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { type: 'dashed', color: c.splitLine } },
      axisLabel: { color: c.subTextColor },
    },
    series: [
      {
        name: '收样数量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: state.trend.received,
        lineStyle: { color: '#6954f0', width: 3 },
        itemStyle: { color: '#6954f0', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(105,84,240,0.35)' },
            { offset: 1, color: 'rgba(105,84,240,0.02)' },
          ]),
        },
      },
      {
        name: '完成数量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: state.trend.completed,
        lineStyle: { color: '#36c78b', width: 3 },
        itemStyle: { color: '#36c78b', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(54,199,139,0.35)' },
            { offset: 1, color: 'rgba(54,199,139,0.02)' },
          ]),
        },
      },
    ],
  }
  state.global.trendChart.setOption(option)
  state.myCharts.push(state.global.trendChart)
}

// 检验科室分布
const initDeptChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.deptChart)) state.global.deptChart?.dispose()
  state.global.deptChart = markRaw(echarts.init(deptRef.value, state.charts.theme))
  const c = themeColors.value
  const option = {
    backgroundColor: state.charts.bgColor,
    tooltip: {
      trigger: 'item',
      backgroundColor: themeConfig.value.isIsDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: themeConfig.value.isIsDark ? '#3a3a3a' : '#e5e7eb',
      textStyle: { color: c.textColor },
      formatter: '{b}: {c} 份 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '2%',
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
      textStyle: { color: c.subTextColor, fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['52%', '72%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: themeConfig.value.isIsDark ? '#1f1f1f' : '#fff',
          borderWidth: 3,
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            const total = state.department.reduce((s, i) => s + i.value, 0)
            return `{a|${total}}\n{b|样本总数}`
          },
          rich: {
            a: { fontSize: 26, fontWeight: 'bold', color: c.textColor },
            b: { fontSize: 12, color: c.subTextColor, padding: [8, 0, 0, 0] },
          },
        },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
          scaleSize: 6,
        },
        labelLine: { show: false },
        data: state.department.map((item, idx) => ({
          ...item,
          itemStyle: { color: c.seriesColors[idx % c.seriesColors.length] },
        })),
      },
    ],
  }
  state.global.deptChart.setOption(option)
  state.myCharts.push(state.global.deptChart)
}

// 检验阶段统计
const initStageChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.stageChart)) state.global.stageChart?.dispose()
  state.global.stageChart = markRaw(echarts.init(stageRef.value, state.charts.theme))
  const c = themeColors.value
  const option = {
    backgroundColor: state.charts.bgColor,
    grid: { top: 30, right: 20, bottom: 30, left: 45 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: themeConfig.value.isIsDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: themeConfig.value.isIsDark ? '#3a3a3a' : '#e5e7eb',
      textStyle: { color: c.textColor },
    },
    legend: { show: false },
    xAxis: {
      type: 'category',
      data: state.stage.depts,
      axisLine: { lineStyle: { color: c.axisLine } },
      axisTick: { show: false },
      axisLabel: { color: c.subTextColor },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { type: 'dashed', color: c.splitLine } },
      axisLabel: { color: c.subTextColor },
    },
    series: [
      {
        name: '前处理',
        type: 'bar',
        stack: 'total',
        barWidth: 24,
        itemStyle: { color: '#6954f0', borderRadius: [0, 0, 0, 0] },
        data: state.stage.preProcess,
      },
      {
        name: '检验中',
        type: 'bar',
        stack: 'total',
        barWidth: 24,
        itemStyle: { color: '#fec279' },
        data: state.stage.testing,
      },
      {
        name: '已报告',
        type: 'bar',
        stack: 'total',
        barWidth: 24,
        itemStyle: { color: '#36c78b', borderRadius: [6, 6, 0, 0] },
        data: state.stage.reported,
      },
    ],
  }
  state.global.stageChart.setOption(option)
  state.myCharts.push(state.global.stageChart)
}

// 质控合格率
const initQualityChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.qualityChart)) state.global.qualityChart?.dispose()
  state.global.qualityChart = markRaw(echarts.init(qualityRef.value, state.charts.theme))
  const c = themeColors.value
  const option = {
    backgroundColor: state.charts.bgColor,
    tooltip: {
      backgroundColor: themeConfig.value.isIsDark ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: themeConfig.value.isIsDark ? '#3a3a3a' : '#e5e7eb',
      textStyle: { color: c.textColor },
    },
    radar: {
      indicator: state.quality.map((i) => ({ name: i.name, max: 100 })),
      center: ['50%', '54%'],
      radius: '65%',
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: c.subTextColor, fontSize: 12 },
      splitLine: { lineStyle: { color: c.splitLine } },
      splitArea: {
        areaStyle: {
          color: themeConfig.value.isIsDark
            ? ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)']
            : ['rgba(105,84,240,0.02)', 'rgba(105,84,240,0.05)'],
        },
      },
      axisLine: { lineStyle: { color: c.axisLine } },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#6954f0', width: 2 },
        itemStyle: { color: '#6954f0', borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            { offset: 0, color: 'rgba(105,84,240,0.05)' },
            { offset: 1, color: 'rgba(105,84,240,0.35)' },
          ]),
        },
        data: [
          {
            value: state.quality.map((i) => i.value),
            name: '合格率(%)',
          },
        ],
      },
    ],
  }
  state.global.qualityChart.setOption(option)
  state.myCharts.push(state.global.qualityChart)
}

// 初始化所有图表
const initAllCharts = () => {
  state.myCharts = []
  initTrendChart()
  initDeptChart()
  initStageChart()
  initQualityChart()
}

// 批量 echarts resize
const initEchartsResizeFun = () => {
  nextTick(() => {
    for (let i = 0; i < state.myCharts.length; i++) {
      setTimeout(() => {
        state.myCharts[i]?.resize()
      }, i * 200)
    }
  })
}
const initEchartsResize = () => {
  window.addEventListener('resize', initEchartsResizeFun)
}
const removeEchartsResize = () => {
  window.removeEventListener('resize', initEchartsResizeFun)
}

// 问候语与日期
const initGreeting = () => {
  const h = new Date().getHours()
  state.greeting = h < 6 ? '凌晨好' : h < 9 ? '早上好' : h < 12 ? '上午好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好'
  const d = new Date()
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
  state.today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${week}`
}

onMounted(() => {
  initGreeting()
  initEchartsResize()
})
onBeforeUnmount(() => {
  removeEchartsResize()
  state.myCharts.forEach((c: any) => c?.dispose())
})
onActivated(() => {
  initEchartsResizeFun()
})

// 监听 tagsview 全屏变化，重新 resize 图表
watch(
  () => isTagsViewCurrenFull.value,
  () => {
    initEchartsResizeFun()
  }
)

// 监听 pinia 中是否开启深色主题（保留原逻辑，根据主题更换图表背景色）
watch(
  () => themeConfig.value.isIsDark,
  (isIsDark) => {
    nextTick(() => {
      state.charts.theme = isIsDark ? 'dark' : ''
      state.charts.bgColor = isIsDark ? 'transparent' : ''
      state.charts.color = isIsDark ? '#dadada' : '#303133'
      setTimeout(() => {
        initAllCharts()
      }, 300)
    })
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>

<style scoped lang="scss">
.workbench-container {
  /* 框架 .layout-parent 为 flex 列且高度限定在视口内，页面级 el-scrollbar 无法检测超出视口的内容。
     这里让工作台自身撑满可用高度并内部滚动（与框架其他 h100 页面一致）。
     min-height:0 是 flex 子项允许 overflow 滚动的关键。 */
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 欢迎横幅 */
.welcome-banner {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(135deg, #6954f0 0%, #8b5cf6 50%, #a78bfa 100%);
  color: #fff;
  padding: 24px 28px;
  &__content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }
  &__title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  &__desc {
    font-size: 13px;
    opacity: 0.85;
  }
  &__stats {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    .num {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.2;
    }
    .label {
      font-size: 12px;
      opacity: 0.85;
      margin-top: 4px;
    }
  }
  &__divider {
    width: 1px;
    height: 36px;
    background: rgba(255, 255, 255, 0.3);
  }
  &__decoration {
    position: absolute;
    right: -40px;
    top: -40px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    z-index: 1;
    &::after {
      content: '';
      position: absolute;
      right: 60px;
      top: 60px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
    }
  }
}

/* KPI 卡片 */
.kpi-card {
  position: relative;
  height: 130px;
  border-radius: 10px;
  padding: 18px 20px;
  background: var(--el-color-white);
  border: 1px solid var(--next-border-color-light);
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
  }
  &--unsorted::before {
    background: linear-gradient(180deg, #409eff, #6954f0);
  }
  &--testing::before {
    background: linear-gradient(180deg, #e6a23c, #fec279);
  }
  &--pendingReview::before {
    background: linear-gradient(180deg, #968af5, #6954f0);
  }
  &--reported::before {
    background: linear-gradient(180deg, #67c23a, #36c78b);
  }
  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__label {
    font-size: 13px;
    color: var(--el-text-color-regular);
    margin-bottom: 8px;
  }
  &__value {
    font-size: 30px;
    font-weight: 700;
    color: var(--el-text-color-primary);
    line-height: 1.1;
  }
  &__unit {
    font-size: 13px;
    font-weight: 400;
    color: var(--el-text-color-secondary);
    margin-left: 4px;
  }
  &__trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    margin-top: 8px;
    &.is-up {
      color: #f56c6c;
    }
    &.is-down {
      color: #36c78b;
    }
    &-label {
      color: var(--el-text-color-secondary);
      margin-left: 2px;
    }
  }
  &__icon {
    width: 54px;
    height: 54px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
  }
  &--unsorted .kpi-card__icon {
    background: rgba(64, 158, 255, 0.12);
    color: #409eff;
  }
  &--testing .kpi-card__icon {
    background: rgba(230, 162, 60, 0.12);
    color: #e6a23c;
  }
  &--pendingReview .kpi-card__icon {
    background: rgba(150, 138, 245, 0.12);
    color: #968af5;
  }
  &--reported .kpi-card__icon {
    background: rgba(54, 199, 139, 0.12);
    color: #36c78b;
  }
  &__footer {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    border-top: 1px dashed var(--next-border-color-light);
    padding-top: 8px;
  }
}

/* 图表卡片 */
.chart-card {
  background: var(--el-color-white);
  border: 1px solid var(--next-border-color-light);
  border-radius: 10px;
  padding: 16px 18px;
  height: 380px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  &__title {
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
  &__bar {
    display: inline-block;
    width: 4px;
    height: 14px;
    background: #6954f0;
    border-radius: 2px;
    margin-right: 8px;
  }
  &__legend {
    display: flex;
    gap: 14px;
    .legend-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--el-text-color-secondary);
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 5px;
        &--primary {
          background: #6954f0;
        }
        &--success {
          background: #36c78b;
        }
        &--warning {
          background: #fec279;
        }
      }
    }
  }
  &__body {
    flex: 1;
    min-height: 0;
  }
}

/* 面板卡片 */
.panel-card {
  background: var(--el-color-white);
  border: 1px solid var(--next-border-color-light);
  border-radius: 10px;
  height: 380px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px 10px;
  }
  &__title {
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
  &__bar {
    display: inline-block;
    width: 4px;
    height: 14px;
    background: #6954f0;
    border-radius: 2px;
    margin-right: 8px;
  }
  &__body {
    flex: 1;
    padding: 0 18px 16px;
    overflow: hidden;
    &--scroll {
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: var(--next-border-color-light);
        border-radius: 3px;
      }
    }
  }
}

/* 快捷导航 */
.quick-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 6px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      background: var(--next-bg-color);
      transform: translateY(-2px);
    }
  }
  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 8px;
  }
  &__label {
    font-size: 12px;
    color: var(--el-text-color-primary);
    text-align: center;
  }
}

/* 待办事项 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--next-bg-color);
  transition: all 0.3s ease;
  &:hover {
    transform: translateX(2px);
  }
  &__tag {
    flex-shrink: 0;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 500;
    &--high {
      background: rgba(245, 108, 108, 0.12);
      color: #f56c6c;
    }
    &--medium {
      background: rgba(230, 162, 60, 0.12);
      color: #e6a23c;
    }
    &--low {
      background: rgba(64, 158, 255, 0.12);
      color: #409eff;
    }
  }
  &__content {
    flex: 1;
    min-width: 0;
  }
  &__title {
    font-size: 13px;
    color: var(--el-text-color-primary);
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__desc {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__time {
    font-size: 11px;
    color: var(--el-text-color-placeholder);
    flex-shrink: 0;
  }
}

/* 报告列表 */
.report-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.report-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--next-bg-color);
  transition: all 0.3s ease;
  &:hover {
    transform: translateX(2px);
  }
  &__icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    &--testing {
      background: rgba(230, 162, 60, 0.12);
      color: #e6a23c;
    }
    &--reviewing {
      background: rgba(144, 147, 153, 0.12);
      color: #909399;
    }
    &--reported {
      background: rgba(54, 199, 139, 0.12);
      color: #36c78b;
    }
  }
  &__content {
    flex: 1;
    min-width: 0;
  }
  &__title {
    font-size: 13px;
    color: var(--el-text-color-primary);
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__meta {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__sep {
    margin: 0 4px;
  }
}

/* 响应式 */
@media screen and (max-width: 768px) {
  .welcome-banner__stats {
    gap: 16px;
  }
  .welcome-banner__stat .num {
    font-size: 20px;
  }
  .quick-nav {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 深色模式适配 */
[data-theme='dark'] {
  .kpi-card,
  .chart-card,
  .panel-card {
    background: var(--el-color-white);
  }
  .chart-card:hover,
  .panel-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
}
</style>

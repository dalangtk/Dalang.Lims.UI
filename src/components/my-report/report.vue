<!-- <template>
  <div style="height: 100%; overflow: hidden">
    <div id="designerContent"></div>
    <div class="viewer" id="viewerContent"></div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SimpleList from './js/SimpleList.js'
import { ElLoading } from 'element-plus'

const props = defineProps({
  showDesigner: {
    type: Boolean,
    default() {
      return false
    },
  },
  reportTemplate: {
    type: Object as () => {},
    default() {
      return null
    },
  },
  reportData: {
    type: Object as () => {},
    default() {
      return null
    },
  },
  ondesign: {
    type: Function,
    default: () => {},
  },
})

const selectedReport = ref('SimpleList')
let viewer: any = null
let designer: any = null

// 创建查看器
const createViewer = () => {
  const options = new Stimulsoft.Viewer.StiViewerOptions()
  options.height = '100%'
  options.fullScreenMode = false
  options.appearance.scrollbarsMode = true
  options.toolbar.showDesignButton = props.showDesigner
  options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct
  options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table

  viewer = new Stimulsoft.Viewer.StiViewer(options, 'StiViewer', false)

  // 添加设计按钮事件
  viewer.onDesignReport = function (e) {
    // designerRef.value.open(e.report)
    props.ondesign(e.report)
    // this.visible = false
    // if (!designer) createDesigner()
    // designer.visible = true
    // designer.report = e.report
  }

  viewer.renderHtml('viewerContent')
}

// 创建设计器
const createDesigner = () => {
  const options = new Stimulsoft.Designer.StiDesignerOptions()
  options.appearance.fullScreenMode = true
  options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table
  designer = new Stimulsoft.Designer.StiDesigner(options, 'StiDesigner', false)

  // 添加退出菜单项事件
  designer.onExit = function (e: any) {
    this.visible = false
    viewer.visible = true
  }

  designer.renderHtml('designerContent')
}

// 设置报告
const setReport = (reportObject: any) => {
  // 强制显示进程指示器
  viewer.showProcessIndicator()
  console.log('setReport', props.reportTemplate)
  console.log('setReport2', JSON.stringify(props.reportData))
  // 延迟加载以确保立即显示加载指示器
  setTimeout(() => {
    reportObject = props.reportTemplate.templateContent
    const report = new Stimulsoft.Report.StiReport()
    report.load(reportObject)

    // report.dictionary.databases.clear()

    // var dataSet = new Stimulsoft.System.Data.DataSet('Demo')
    // dataSet.readJson(JSON.stringify(props.reportData))
    // report.regData('Demo', 'Demo', dataSet)

    // viewer.report = report

    var dataSet = new Stimulsoft.System.Data.DataSet('Demo')
    // Load JSON data file from specified URL to the DataSet object
    let obj = [
      { barcode: '1', groupName: 'g1' },
      { barcode: '2', groupName: 'g2' },
    ]
    dataSet.readJson(JSON.stringify(obj))
    console.log('dataSet', dataSet)
    // Remove all connections from the report template
    report.dictionary.databases.clear()
    // Register DataSet object
    report.regData('Demo', 'Demo', dataSet)

    viewer.report = report
  }, 50)
}

// 按钮点击事件
const onButtonClick = (reportKey: any) => {
  selectedReport.value = reportKey
  const reportObject = SimpleList
  if (reportObject) {
    setReport(reportObject)
  } else {
    console.error(`Report ${reportKey} not found`)
  }
}

const loadingInstance = ElLoading.service({
  lock: true,
  text: 'Loading',
})

import chs from './localization/zh-CHS.xml?inline'
onMounted(async () => {
  try {
    console.log('开始加载JS和CSS文件')
    await loadCSS('/@/components/my-report/css/stimulsoft.viewer.office2013.whiteblue.css')
    await loadJS('/@/components/my-report/js/stimulsoft.reports.js')
    await loadJS('/@/components/my-report/js/stimulsoft.viewer.js')

    console.log('JS和CSS文件加载完成')
  } catch (error: any) {
    console.error('文件加载失败:', error.message)
  }
  // 设置Stimulsoft许可证
  Stimulsoft.Base.StiLicense.key = import.meta.env.VITE_STI_LICENSE_KEY
  Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile(chs, true)
  createViewer()
  loadingInstance.close()
  //加载初始报告
  onButtonClick('SimpleList')
})

// 组件销毁前清理
onBeforeUnmount(() => {
  if (viewer) {
    viewer = null
  }
  if (designer) {
    designer = null
  }
})
const loadCSS = (cssPath: string) => {
  return new Promise((resolve, reject) => {
    // 先检查是否已加载，避免重复
    const existingLink = document.querySelector(`link[href="${cssPath}"]`)
    if (existingLink) {
      resolve(() => {})
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = cssPath
    link.onload = () =>
      resolve(() => {
        console.log('load css success')
      })
    link.onerror = (err) => reject(new Error(`加载CSS失败: ${cssPath}`))

    document.head.appendChild(link)
    console.log('append css', cssPath)
  })
}
const loadJS = (jsPath: string) => {
  return new Promise((resolve, reject) => {
    // 先检查是否已加载，避免重复
    const existingScript = document.querySelector(`script[src="${jsPath}"]`)
    if (existingScript) {
      resolve(() => {})
      return
    }

    const script = document.createElement('script')
    script.src = jsPath
    script.onload = () => resolve('load js success')
    script.onerror = (err) => reject(new Error(`加载JS失败: ${jsPath}`))

    document.head.appendChild(script)
    console.log('append js', jsPath)
  })
}
</script>

<style scoped>
.viewer {
  width: 100%;
  height: calc(100vh - 110px);
}
</style> -->

<template>
  <div class="">

  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
</script>

<style scoped lang="scss">
</style>

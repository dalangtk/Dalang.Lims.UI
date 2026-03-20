<template>
  <div>
    <!-- <el-dialog> -->
    <div style="height: 800px; overflow: hidden">
      <div id="designerContent"></div>
    </div>
    <!-- </el-dialog> -->
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { ElLoading } from 'element-plus'

const props = defineProps({
  onSaveReport: {
    type: Function,
    default: () => {},
  },
})

let designer = null
let templateId = -1

// 创建设计器
const createDesigner = (report, dataSource) => {
  const options = new Stimulsoft.Designer.StiDesignerOptions()
  options.appearance.fullScreenMode = false
  options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table

  designer = new Stimulsoft.Designer.StiDesigner(options, 'StiDesigner', false)

  // 添加退出菜单项事件
  designer.onExit = function (e) {
    this.visible = false
    viewer.visible = true
  }
  designer.onSaveReport = function (args) {
    let json = args.report.saveToJsonString()
    props.onSaveReport(templateId, json)
  }
  if (report != null) {
    var dataSet = new Stimulsoft.System.Data.DataSet('ReportData')
    dataSet.readJson(JSON.stringify(dataSource))
    report.dictionary.databases.clear()
    report.regData(dataSet.dataSetName, '', dataSet)
    report.dictionary.synchronize()
    designer.report = report
  } else {
    designer.onCreateReport = function (args) {
      var dataSet = new Stimulsoft.System.Data.DataSet('SimpleDataSet')
      dataSet.readJson(JSON.stringify(dataSource))
      report.dictionary.databases.clear()
      args.report.regData(dataSet.dataSetName, '', dataSet)
      args.report.dictionary.synchronize()
    }
  }
  designer.renderHtml('designerContent')
}

import chs from './localization/zh-CHS.xml?inline'
// import cssPath from '/components/my-report/css/stimulsoft.designer.office2013.whiteblue.css?url'
// import jsReportPath from '/components/my-report/js/stimulsoft.reports.js?url'
// import jsViewerPath from '/components/my-report/js/stimulsoft.viewer.js?url'
// import jsDesignerPath from '/components/my-report/js/stimulsoft.designer.js?url'
const open = async (reportObj, id, dataSource) => {
  try {
    templateId = id
    console.log('开始加载JS和CSS文件')
    // await loadCSS('/@/components/my-report/css/stimulsoft.designer.office2013.whiteblue.css')
    // await loadJS('/@/components/my-report/js/stimulsoft.reports.js')
    // await loadJS('/@/components/my-report/js/stimulsoft.viewer.js')
    // await loadJS('/@/components/my-report/js/stimulsoft.designer.js')

     await loadCSS('/components/my-report/css/stimulsoft.designer.office2013.whiteblue.css')
    await loadJS('/components/my-report/js/stimulsoft.reports.js')
    await loadJS('/components/my-report/js/stimulsoft.viewer.js')
    await loadJS('/components/my-report/js/stimulsoft.designer.js')


    // await loadCSS(cssPath)
    // await loadJS(jsReportPath)
    // await loadJS(jsViewerPath)
    // await loadJS(jsDesignerPath)

    console.log('JS和CSS文件加载完成')
  } catch (error) {
    console.error('文件加载失败:', error.message)
  }
  // 设置Stimulsoft许可证
  Stimulsoft.Base.StiLicense.key = import.meta.env.VITE_STI_LICENSE_KEY
  // Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile('/localization/zh-CHS.xml', true)
  Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile(chs, true)

  let report = new Stimulsoft.Report.StiReport()
  if (reportObj != null) report.load(reportObj)
  else {
    // report.load(SimpleList)
    report = null
  }

  createDesigner(report, dataSource)
  loadingInstance.close()
}

const loadingInstance = ElLoading.service({
  lock: true,
  text: 'Loading',
})

onMounted(async () => {})

// 组件销毁前清理
onBeforeUnmount(() => {
  if (designer) {
    designer = null
  }
})
const loadCSS = (cssPath) => {
  return new Promise((resolve, reject) => {
    // 先检查是否已加载，避免重复
    const existingLink = document.querySelector(`link[href="${cssPath}"]`)
    if (existingLink) {
      resolve()
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
const loadJS = (jsPath) => {
  return new Promise((resolve, reject) => {
    // 先检查是否已加载，避免重复
    const existingScript = document.querySelector(`script[src="${jsPath}"]`)
    if (existingScript) {
      resolve()
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

defineExpose({
  open,
})
</script>

<style scoped>
:deep(.el-dialog__body) {
  max-height: 100vh !important;
  overflow: auto;
  padding: 0 !important;
}
</style>

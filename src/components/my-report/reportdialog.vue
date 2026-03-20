<template>
  <div>
    <el-dialog destroy-on-close fullscreen v-model="state.dialogShow">
      <Report
        :ondesign="onDesign"
        :showDesigner="props.showDesigner"
        :reportTemplate="props.reportTemplate"
        :reportData="props.reportData"
        style="height: 100%; overflow: hidden"
      ></Report>
    </el-dialog>
    <el-dialog fullscreen v-model="state.designerShow">
      <ReportDesigner ref="designerRef"></ReportDesigner>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import Report from './report.vue'
import ReportDesigner from './reportdesigner.vue'

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
})

const designerRef = ref()

const onDesign = (report: any) => {
  console.log('report', report)
  state.dialogShow = false
  state.designerShow = true
  nextTick(() => {
    designerRef.value.open(report)
  })
}

const state = reactive({
  dialogShow: false,
  designerShow: false,
})

const open = () => {
  console.log('import.meta.env.STI_LICENSE_KEY', import.meta.env)
  state.dialogShow = true
}

defineExpose({
  open,
})
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  max-height: 100vh !important;
  overflow: auto;
  padding: 0 !important;
}
</style>

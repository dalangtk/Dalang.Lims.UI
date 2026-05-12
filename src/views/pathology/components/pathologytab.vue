<template>
  <el-tabs v-model="activeName" class="pathology-tabs" @tab-click="handleClick">
    <el-tab-pane label="登记" name="register" class="h100">
      <Register :wf-code="props.wfCode" ref="registerRef"></Register>
    </el-tab-pane>
    <el-tab-pane label="巨检" name="GiantInspection" v-if="props.showGiantInspection">
      <PathologyList
        :first-check-component="firstCheckComponent"
        :second-check-component="secondCheckComponent"
        :pathology-input-component="pathologyInputComponent"
        :wf-code="props.wfCode"
        :result-type="3"
        ref="giantInspectionRef"
      ></PathologyList>
    </el-tab-pane>
    <el-tab-pane label="初诊" name="FirstCheck">
      <PathologyList
        :first-check-component="firstCheckComponent"
        :second-check-component="secondCheckComponent"
        :pathology-input-component="pathologyInputComponent"
        :wf-code="props.wfCode"
        :result-type="1"
        ref="firstCheckRef"
      ></PathologyList>
    </el-tab-pane>
    <el-tab-pane label="复诊" name="SecondCheck">
      <PathologyList
        :first-check-component="firstCheckComponent"
        :second-check-component="secondCheckComponent"
        :pathology-input-component="pathologyInputComponent"
        :wf-code="props.wfCode"
        :result-type="2"
        ref="secondCheckRef"
      ></PathologyList>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import Register from './register.vue'
import PathologyList from '/@/views/pathology/components/pathologylist.vue'

const activeName = ref('register')

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
  /**
   * 是否显示巨检模块
   * @default false
   */
  showGiantInspection: {
    type: Boolean,
    default: false,
  },
})

const giantInspectionRef = ref()
const registerRef = ref()
const firstCheckRef = ref()
const secondCheckRef = ref()

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(activeName.value)
  if (activeName.value === 'GiantInspection') {
    giantInspectionRef.value?.refreshSpecialResult()
  } else if (activeName.value === 'FirstCheck') {
    firstCheckRef.value?.refreshSpecialResult()
  } else if (activeName.value === 'SecondCheck') {
    secondCheckRef.value?.refreshSpecialResult()
  }
}
</script>

<style scoped>
.pathology-tabs {
  height: 100%;
  width: calc(100% - 5px) !important;
  margin-left: 5px;
}
:deep(.el-tabs__header) {
  margin-bottom: 0px !important;
}
</style>

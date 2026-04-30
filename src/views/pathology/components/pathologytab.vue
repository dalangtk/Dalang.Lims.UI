<template>
  <el-tabs v-model="activeName" class="pathology-tabs" @tab-click="handleClick">
    <el-tab-pane label="登记" name="register" style="height: 100%">
      <Register :wf-code="props.wfCode"></Register>
    </el-tab-pane>
    <el-tab-pane label="巨检" name="GiantInspection" v-if="props.showGiantInspection">
      <!-- <component :is="firstCheckComponent"></component> -->
      <PathologyList
        :first-check-component="firstCheckComponent"
        :second-check-component="secondCheckComponent"
        :pathology-input-component="pathologyInputComponent"
        :wf-code="props.wfCode"
      ></PathologyList>
    </el-tab-pane>
    <el-tab-pane label="初诊" name="FirstCheck">
      <!-- <component :is="firstCheckComponent"></component> -->
      <PathologyList
        :first-check-component="firstCheckComponent"
        :second-check-component="secondCheckComponent"
        :pathology-input-component="pathologyInputComponent"
        :wf-code="props.wfCode"
      ></PathologyList>
    </el-tab-pane>
    <el-tab-pane label="复诊" name="SecondCheck">
      <!-- <component :is="secondCheckComponent"></component> -->
      <PathologyList
        :first-check-component="firstCheckComponent"
        :second-check-component="secondCheckComponent"
        :pathology-input-component="pathologyInputComponent"
        :wf-code="props.wfCode"
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

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style scoped>
.pathology-tabs {
  height: 100%;
}
/* :deep(.el-tabs__header) {
  margin: 10px 5px 10px 5px !important;
} */
.pathology-tabs > .el-tabs__content {
  /* padding: 32px; */
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>

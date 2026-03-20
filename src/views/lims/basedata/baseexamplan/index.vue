<template>
  <my-layout>
    <pane size="60" min-size="30" max-size="70">
      <ExamPlanMaster @onCurrRowChange="masterCurrChange" ref="examPlanMasterRef" />
    </pane>
    <pane>
      <ExamPlanDetail :currExamPlan="state.currentExamPlan" ref="examPlanDetailRef" />
    </pane>
  </my-layout>
</template>

<script lang="ts" setup name="/basedata/baseexamplan">
import { Pane } from 'splitpanes'
import { defineAsyncComponent, nextTick, reactive, ref } from 'vue'
import { BaseExamPlanOutput } from '/@/api/lims/basedata/datacontract/examplan-datacontract'
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))
//主列表
const ExamPlanMaster = defineAsyncComponent(() => import('./components/exam-plan-master.vue'))
const examPlanMasterRef = ref()
//明细表
const ExamPlanDetail = defineAsyncComponent(() => import('./components/exam-plan-detail.vue'))
const examPlanDetailRef = ref()

const state = reactive({
  currentExamPlan: {} as BaseExamPlanOutput,
})

const masterCurrChange = (item: BaseExamPlanOutput) => {
  state.currentExamPlan = item
  nextTick(() => {
    examPlanDetailRef.value?.refreshDetailItem()
  })
}
</script>
<style scoped></style>

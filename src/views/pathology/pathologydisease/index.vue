<template>
  <my-layout>
    <pane size="70" min-size="30" max-size="70">
      <DiseaseMaster @onCurrRowChange="onCurrRowChange" />
    </pane>
    <pane>
      <DiseaseDetail :currDisease="satate.currentDisease" ref="diseaseDetailRef" />
    </pane>
  </my-layout>
</template>

<script lang="ts" setup name="pathology/pathologydisease">
import { Pane } from 'splitpanes'
import { defineAsyncComponent, nextTick, reactive, ref } from 'vue'
import DiseaseDetail from './components/diseasedetail.vue'
import DiseaseMaster from './components/diseasemaster.vue'
import { BasePathologyDiseaseOutput } from '/@/api/lims/pathology/datacontract/pathologydisease-datacontract'
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))

const diseaseDetailRef = ref()
const satate = reactive({
  currentDisease: {} as BasePathologyDiseaseOutput,
})
const onCurrRowChange = (row: BasePathologyDiseaseOutput) => {
  satate.currentDisease = row
  nextTick(() => {
    diseaseDetailRef.value?.refreshDiseaseDetail()
  })
}
</script>
<style scoped></style>

<template>
  <my-layout>
    <pane size="60" min-size="30" max-size="70">
      <SamplingSpotMaster @onCurrRowChange="onCurrRowChange" />
    </pane>
    <pane>
      <SamplingSpotDetail />
    </pane>
  </my-layout>
</template>

<script lang="ts" setup name="pathology/pathologytemplate">
import { Pane } from 'splitpanes'
import { defineAsyncComponent, reactive } from 'vue'
import SamplingSpotDetail from './components/sampling-spot-detail.vue'
import SamplingSpotMaster from './components/sampling-spot-master.vue'
import { BasePathologySamplingSpotOutput } from '/@/api/lims/pathology/datacontract/pathologysamplingspot-datacontract'
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))

const satate = reactive({
  currentSamplingSpot: {} as BasePathologySamplingSpotOutput,
})
const onCurrRowChange = (row: BasePathologySamplingSpotOutput) => {
  satate.currentSamplingSpot = row
}
</script>
<style scoped></style>

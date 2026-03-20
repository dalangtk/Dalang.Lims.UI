<template>
  <my-layout>
    <pane size="60" min-size="30" max-size="70">
      <InstrumentItemMaster @onCurrRowChange="masterCurrChange" ref="instrumentItemMasterRef" />
    </pane>
    <pane>
      <InstrumentItemDetail :currentInstrumentItem="state.currentInstrumentItem" ref="instrumentItemDetailRef" />
    </pane>
  </my-layout>
</template>

<script lang="ts" setup name="/basedata/baseinstrumentitem">
import { Pane } from 'splitpanes'
import { defineAsyncComponent, nextTick, reactive, ref } from 'vue'
import { BaseInstrumentItemOutput } from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))
//主列表
const InstrumentItemMaster = defineAsyncComponent(() => import('./components/instrument-item-master.vue'))
const instrumentItemMasterRef = ref()
//明细表
const InstrumentItemDetail = defineAsyncComponent(() => import('./components/instrument-item-detail.vue'))
const instrumentItemDetailRef = ref()

const state = reactive({
  currentInstrumentItem: {} as BaseInstrumentItemOutput,
})

const masterCurrChange = (item: BaseInstrumentItemOutput) => {
  console.log('masterCurrChange')
  state.currentInstrumentItem = item
  nextTick(() => {
    instrumentItemDetailRef.value?.refreshDetailItem()
  })
}
</script>
<style scoped></style>

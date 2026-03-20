<template>
  <my-layout>
    <pane size="60" min-size="30" max-size="70">
      <AskRuleMaster @onCurrRowChange="masterCurrChange" ref="askRuleMasterRef" />
    </pane>
    <pane>
      <AskRuleDetail :currAskRule="state.currentAskRule" ref="askRuleDetailRef" />
    </pane>
  </my-layout>
</template>

<script lang="ts" setup name="/basedata/baseaskrule">
import { ref, defineAsyncComponent, reactive, nextTick } from 'vue'
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))
import { Pane } from 'splitpanes'
import { BaseAskRuleOutput } from '/@/api/lims/basedata/datacontract/askrule-datacontract'
//主列表
const AskRuleMaster = defineAsyncComponent(() => import('./components/ask-rule-master.vue'))
//明细表
const AskRuleDetail = defineAsyncComponent(() => import('./components/ask-rule-detail.vue'))
const askRuleDetailRef = ref()

const state = reactive({
  currentAskRule: {} as BaseAskRuleOutput,
})

const masterCurrChange = (item: BaseAskRuleOutput) => {
  state.currentAskRule = item
  nextTick(() => {
    askRuleDetailRef.value?.refreshDetailItem()
  })
}
</script>
<style scoped></style>

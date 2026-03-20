<template>
  <div class="">
    <DoubleInput :show-item="true" ref="inputRef" :input-type="InputTypeEnum.DirectInput" />
  </div>
</template>

<script lang="ts" setup name="/pretreatment/sampleinput">
import DoubleInput from './components/doubleinput.vue';
import { InputTypeEnum } from '/@/api/lims/pretreatment/datacontract/sampleinput-datacontract';
</script>

<style scoped lang="scss"></style>

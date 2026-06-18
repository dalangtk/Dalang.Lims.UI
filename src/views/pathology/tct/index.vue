<template>
  <PathologyTab
    wf-code="tct"
    :pathology-input-component="TCTInput"
    :first-check-component="PathologyList"
    :second-check-component="PathologyList"
    :gross-examination-input-component="HistopathologyInput"
  ></PathologyTab>
</template>

<script lang="ts" setup name="/pathology/tct">
import { reactive, ref } from 'vue'
import PathologyList from '/@/views/pathology/components/pathologylist.vue'
import TCTInput from '/@/views/pathology/tct/components/tctinput.vue'
import PathologyTab from '/@/views/pathology/components/pathologytab.vue'
import HistopathologyInput from '/@/views/pathology/histopathology/components/histopathologyinput.vue'
</script>

<style scoped lang="scss"></style>

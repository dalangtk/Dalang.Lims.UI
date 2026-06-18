<template>
  <PathologyTab
    wf-code="histology"
    :pathology-input-component="HistopathologyInput"
    :first-check-component="PathologyList"
    :second-check-component="PathologyList"
    :gross-examination-input-component="GrossExamination"
    :show-giant-inspection="true"
  ></PathologyTab>
</template>

<script lang="ts" setup name="/pathology/histopathology">
import PathologyList from '/@/views/pathology/components/pathologylist.vue'
import PathologyTab from '/@/views/pathology/components/pathologytab.vue'
import GrossExamination from '/@/views/pathology/histopathology/components/grossexamination.vue'
import HistopathologyInput from '/@/views/pathology/histopathology/components/histopathologyinput.vue'
</script>

<style scoped lang="scss"></style>

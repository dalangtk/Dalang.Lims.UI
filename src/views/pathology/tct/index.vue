<template>
  <PathologyTab
    wf-code="tct"
    :pathology-input-component="TCTInput"
    :first-check-component="PathologyList"
    :second-check-component="PathologyList"
  ></PathologyTab>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import PathologyList from '/@/views/pathology/components/pathologylist.vue'
import TCTInput from '/@/views/pathology/tct/components/tctinput.vue'
import PathologyTab from '/@/views/pathology/components/pathologytab.vue'
</script>

<style scoped lang="scss"></style>

<template>
  <PurposeList :purposeTypeEnum="PurposeTypeEnum.Routine"></PurposeList>
</template>
<script setup lang="ts">
import PurposeList from './components/purposelist.vue'
import { PurposeTypeEnum } from '/@/api/lims/shared/enums/purposetypeenum'
</script>

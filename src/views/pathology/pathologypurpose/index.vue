<template>
  <PurposeList :purposeTypeEnum="PurposeTypeEnum.Pathology"></PurposeList>
</template>
<script setup lang="ts">
import PurposeList from '/@/views/lims/basedata/basepurpose/components/purposelist.vue'
import { PurposeTypeEnum } from '/@/api/lims/shared/enums/purposetypeenum'
</script>

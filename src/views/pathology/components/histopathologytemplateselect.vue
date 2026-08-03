<template>
  <div class="histopathologytemplateselect">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="疾病" name="disease"></el-tab-pane>
      <el-tab-pane label="诊断模板" name="template"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const activeTab = ref('disease')


</script>

<style scoped lang="scss">
</style>
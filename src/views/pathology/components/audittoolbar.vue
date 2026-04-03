<template>
  <div class="audit-toolbar">
    <el-button type="primary">诊断模板</el-button>
    <el-button type="primary">预览</el-button>
    <el-button type="primary">保存</el-button>
    <el-dropdown split-button type="primary" v-if="props.showMutilAudit">
      审核
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>批量审核</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button v-else-if="!props.showMutilAudit" type="primary">审核</el-button>
    <el-button type="primary">反审核</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    showMutilAudit?: boolean
  }>(),
  {
    showMutilAudit: false,
  }
)
</script>

<style scoped lang="scss">
.audit-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>

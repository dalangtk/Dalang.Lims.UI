<template>
  <!-- 注意要包一层div根元素，否则css样式可能会不生效，原因不详 -->
  <div :class="{ 'hidden-select-all': !props.mutilSelect }">
    <el-table ref="taskTableRef" v-bind="$attrs" border highlight-current-row @current-change="currentRowChange" @select="selectClick">
      <el-table-column type="selection" width="55" />
      <slot />
    </el-table>
  </div>
</template>

<script setup lang="ts" name="my-select-table">
import { ref } from 'vue'
const taskTableRef = ref() // 表格ref

const props = defineProps({
  mutilSelect: {
    type: Boolean,
    default() {
      return false
    },
  },
  titleText: {
    type: String,
    default() {
      return '请选择'
    },
  },
})

const currentRowChange = (row: any) => {
  if (!props.mutilSelect && row) {
    taskTableRef.value.clearSelection()
    taskTableRef.value.toggleRowSelection(row, true)
  }
}

// table选择项发生变化时会触发该事件
const selectClick = (selection: any, row: any) => {
  if (selection.length > 1) {
    if (!props.mutilSelect) {
      // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      let del_row = selection.shift()
      taskTableRef.value.toggleRowSelection(del_row, false)
    }
  }
}

const getSelectionRows = () => {
  let selectList = taskTableRef.value.getSelectionRows()
  return selectList
}
defineExpose({ getSelectionRows })
</script>

<style scoped lang="scss">
// 隐藏全选按钮
// :deep(.el-table th.el-table__cell:nth-child(1) .cell) {
//   visibility: hidden;
// }
.hidden-select-all {
  :deep(.el-table th.el-table__cell:nth-child(1) .cell) {
    visibility: hidden;
  }
}
</style>

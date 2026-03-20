<template>
  <el-dialog v-model="state.show">
    <!-- 注意要包一层div根元素，否则css样式可能会不生效，原因不详 -->
    <div>
      <el-table ref="taskTableRef" :data="state.dataList" border highlight-current-row @current-change="currentRowChange" @select="selectClick">
        <el-table-column type="selection" width="55" />
        <slot />
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="my-select-table">
import { ref, reactive, nextTick } from 'vue'
const taskTableRef = ref() // 表格ref

const state = reactive({
  show: false,
  dataList: [],
})
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
    console.log('444')
    console.log('row', row)
    console.log('state.data', state.dataList)
    taskTableRef.value.toggleRowSelection(row, true)
  }
}
const open = () => {
  let tmp = []
  for (let index = 0; index < 10; index++) {
    tmp.push({
      purNode: 'name' + index,
      purCode: 'code' + index,
    })
  }
  console.log('open')
  state.show = true
  nextTick(() => {
    taskTableRef.value.clearSelection()
    state.dataList = tmp
  })
}
// table选择项发生变化时会触发该事件
const selectClick = (selection: any, row: any) => {
  if (selection.length > 1) {
    console.log('1')
    if (!props.mutilSelect) {
      console.log('2')
      // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      let del_row = selection.shift()
      console.log('3')
      taskTableRef.value.toggleRowSelection(del_row, false)
    }
  }
}

const getSelectionRows = () => {
  let selectList = taskTableRef.value.getSelectionRows()
  return selectList
}
defineExpose({ open, getSelectionRows })
</script>

<style scoped lang="scss">
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>

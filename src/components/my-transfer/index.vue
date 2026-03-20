<template>
  <div class="bpo-table-transfer">
    <div class="bpo-table-transfer-panel">
      <p class="transfer-panel-header">
        <span>{{ titleTexts && titleTexts[0] }}</span>
        <span>{{ state.leftSelection.length }}/{{ slicedData.length }}</span>
      </p>
      <div class="bpo-table-transfer-left-header">
        <slot name="left-header" />
      </div>
      <el-table
        ref="leftTable"
        size="small"
        :max-height="maxHeight"
        :height="minHeight"
        :data="slicedData"
        :row-key="rowKey"
        @selection-change="handleLeftSelectionChange"
        border
        stripe
      >
        <el-table-column width="40px" type="selection" />
        <slot name="left-table-columns" />
      </el-table>
      <slot name="left-footer" />
    </div>
    <div class="bpo-table-transfer-button-tray">
      <el-button type="primary" :class="buttonClasses" :disabled="disabledLeftButton" @click="addToRight">
        <span v-if="buttonTexts[0] !== undefined" class="button-text">{{ buttonTexts[0] }}</span>
        <SvgIcon name="ele-ArrowRight" />
      </el-button>
      <el-button type="primary" :class="buttonClasses" :disabled="state.rightSelection.length === 0" @click="addToLeft">
        <SvgIcon name="ele-ArrowLeft" />
        <span v-if="buttonTexts[1] !== undefined" class="button-text">{{ buttonTexts[1] }}</span>
      </el-button>
    </div>
    <div class="bpo-table-transfer-panel">
      <p class="transfer-panel-header">
        <span>{{ titleTexts && titleTexts[1] }}</span>
        <span>{{ state.rightSelection.length }}/{{ state.valueCopy.length }}</span>
      </p>
      <div class="bpo-table-transfer-right-header">
        <slot name="right-header" />
      </div>

      <el-table
        ref="rightTable"
        size="small"
        :max-height="maxHeight"
        :height="minHeight"
        :data="state.valueCopy"
        :row-key="rowKey"
        @selection-change="handleRightSelectionChange"
        border
        stripe
      >
        <el-table-column width="40px" type="selection" />
        <slot name="right-table-columns" />
      </el-table>
      <slot name="right-footer" v-if="props.showPaging">
        <el-pagination style="float: right; margin: 5px" :total="state.valueCopy.length" layout="total"> </el-pagination>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash' //引用 loadsh
import { reactive, computed } from 'vue'

const props = defineProps({
  value: {
    type: Array<any>,
    required: true,
  },
  data: {
    type: Array<any>,
    default() {
      return []
    },
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  // 标题文本
  //TODO: i18n
  titleTexts: {
    type: Array,
    default() {
      return ['待选项', '已选项']
    },
  },
  // 按钮文本
  buttonTexts: {
    type: Array,
    default() {
      return []
    },
  },
  // 表格最小高度
  minHeight: {
    type: String,
    default: '300px',
  },
  // 表格最大高度
  maxHeight: {
    type: String,
    default: '500px',
  },
  selectionChange: {
    type: Function,
    default: null,
    required: true,
    parameters: Array<any>,
  },
  showPaging: {
    type: Boolean,
    default: true,
  },
})

const state = reactive({
  valueCopy: [...props.value],
  totalSize: 0,
  leftSelection: [],
  rightSelection: [],
})

const hasButtonTexts = computed(() => {
  return props.buttonTexts.length === 2
})
const buttonClasses = computed(() => {
  return ['transfer-button', { 'is-with-texts': hasButtonTexts }]
})
const disabledLeftButton = computed(() => {
  return !state.leftSelection.some((leftRow) => !props.value.some((rightRow: any) => leftRow[props.rowKey] === rightRow[props.rowKey]))
})

const slicedData = computed(() => {
  return props.data.filter((item: any) => !state.valueCopy.some((o) => o[props.rowKey] === item[props.rowKey]))
})

const handleLeftSelectionChange = (selection: any) => {
  state.leftSelection = selection
}
const handleRightSelectionChange = (selection: any) => {
  state.rightSelection = selection
}
const addToRight = () => {
  state.valueCopy.push(...state.leftSelection)
  props.selectionChange(state.valueCopy)
}
const addToLeft = () => {
  //差集 _.xorWith   需要npm install lodash
  state.valueCopy = _.xorWith(state.rightSelection, state.valueCopy)
  // this.$emit('input', this.valueCopy)
  props.selectionChange(state.valueCopy)
  console.log(state.valueCopy)
}
</script>

<style scoped>
.bpo-table-transfer {
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-icon-arrow-right,
.el-icon-arrow-left {
  font-size: 40px;
  cursor: pointer;
}

.bpo-table-transfer-panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  display: inline-block;
  width: calc((100% - 100px) / 2);
  max-height: 100%;
  box-sizing: border-box;
  position: relative;
}

.bpo-table-transfer-panel .transfer-panel-header {
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  margin: 0;
  padding-left: 15px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #000;
}

.transfer-panel-header span:last-child {
  position: absolute;
  right: 15px;
}

.bpo-table-transfer-button-tray {
  display: inline-block;
  vertical-align: middle;
  width: 100px;
}

.transfer-button {
  display: block;
  margin: 0 auto;
  padding: 10px;
  border-radius: 4px;
  color: #fff;
  background-color: #409eff;
  font-size: 0;
}

.transfer-button .button-text {
  margin-left: 2px;
  margin-right: 5px;
}

.transfer-button.is-with-texts {
  border-radius: 4px;
}

.transfer-button.is-disabled,
.transfer-button.is-disabled:hover {
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  color: #c0c4cc;
}

.transfer-button:first-child {
  margin-bottom: 10px;
}

.transfer-button:nth-child(2) {
  margin: 0 auto;
}

.transfer-button i,
.transfer-button span {
  font-size: 14px;
}

.bpo-table-transfer-left-header {
  padding: 10px;
}

.bpo-table-transfer-right-header {
  padding: 10px;
}
</style>

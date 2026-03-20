<template>
  <div>
    <el-tree
      :data="[state.dataTree]"
      :props="state.defaultProps"
      :expand-on-click-node="false"
      :default-expand-all="true"
      :indent="16"
      class="my-search-filter"
    >
      <template #default="{ node, data }">
        <template v-if="data.logic != null && !data.field">
          <div class="my-flex">
            <el-radio-group v-model="data.logic" :size="props.size" :disabled="props.disabled">
              <el-radio value="And">并且</el-radio>
              <el-radio value="Or">或者</el-radio>
            </el-radio-group>
            <el-button text icon="ele-Plus" @click="onAddGroup(data)" class="ml16" :size="props.size" :disabled="props.disabled">分组</el-button>
            <el-button text icon="ele-Plus" @click="onAddCondition(data)" :size="props.size" :disabled="props.disabled">条件</el-button>
            <el-button v-if="!data.root" icon="ele-Minus" class="ml8" @click="onDelete(node, data)" :size="props.size" :disabled="props.disabled" />
          </div>
        </template>
        <template v-else>
          <div style="display: flex; flex-direction: row">
            <el-select
              v-model="data.field"
              :style="{ width: props.size === 'small' ? '100px' : '120px', 'margin-right': '5px', 'min-width': '100px' }"
              @change="onChangeField(data)"
              :size="props.size"
              :disabled="props.disabled"
            >
              <el-option v-for="(o, index) in props.fields" :key="index" :label="o.description" :value="o.field" />
            </el-select>
            <el-select
              v-model="data.operator"
              :style="{ width: props.size === 'small' ? '90px' : '120px', 'margin-right': '5px', 'min-width': '100px' }"
              @change="onChangeOperator(data)"
              :size="props.size"
              :disabled="props.disabled"
            >
              <el-option v-for="(op, index) in getOperators(data.type)" :key="index" :label="op.label" :value="op.value" />
            </el-select>

            <template v-if="data.type === 'date'">
              <component
                :is="data.componentName"
                v-model="data.value"
                :type="data.config.type"
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :format="data.config.format"
                :value-format="data.config.valueFormat"
                :disabled-date="disabledDate"
                :disabled="props.disabled"
                :style="{ width: data.config.type === 'date' ? '160px' : '160px', 'margin-right': '5px', 'min-width': '160px' }"
              ></component>
            </template>
            <el-input-number
              v-else-if="data.type === 'number'"
              v-model="data.value"
              controls-position="right"
              style="width: 160px; margin-right: 5px"
              :size="props.size"
              :disabled="props.disabled"
            />
            <el-switch v-else-if="data.type === 'bool'" v-model="data.value" style="margin-right: 5px" :size="props.size" />
            <el-select
              v-else-if="data.type === 'select'"
              v-model="data.value"
              style="margin-right: 5px; min-width: 160px; width: 160px"
              clearable
              :multiple="data.multipleable"
              :filterable="data.filterable"
              :remote="data.remoteable"
              :size="props.size"
              :reserve-keyword="false"
              :remote-method="(query: string) => handleRemoteMethod(data, query)"
              :disabled="props.disabled"
            >
              <el-option v-for="o in data.options" :key="o.value" :label="o.label" :value="o.value" />
            </el-select>
            <el-input
              v-else
              v-model="data.value"
              style="width: 160px; margin-right: 5px; background-color: red"
              :size="props.size"
              :disabled="props.disabled"
            />

            <el-button icon="ele-Minus" style="margin-right: 5px" @click="onDelete(node, data)" :size="props.size" :disabled="props.disabled" />
          </div>
        </template>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRaw, nextTick, onMounted } from 'vue'
import { cloneDeep } from 'lodash-es'
import { commonSelectQuery } from '/@/utils/commonSelectRemoteQuery'

const props = defineProps({
  // {field: '', operator: 'Contains', description: '', value: '', componentName: 'el-input', config: {type: '', format:'', valueFormat:''}}
  // 默认字段 default: true
  // 字段类型 type: 'string:字符串 | date:日期 | number:数字 | bool:布尔'
  // 日期操作符 operator: 'datetimerange'
  // 日期控件配置 config: {type: 'datetimerange', format:''yyyy-MM-dd HH:mm'', valueFormat:''yyyy-MM-dd HH:mm'', defaultTime : ['00:00:00', '00:00:00']}
  fields: {
    type: Array as any,
    default() {
      return []
    },
  },
  size: {
    type: String,
    default: 'default',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

//const emits = defineEmits(['sure'])

const operators = {
  equal: { label: '等于', value: 0, tag: 'Equal' },
  contains: { label: '包含', value: 1, tag: 'Like' },
  greaterThan: { label: '大于', value: 2, tag: 'GreaterThan' },
  greaterThanOrEqual: { label: '大于等于', value: 3, tag: 'GreaterThanOrEqual' },
  lessThan: { label: '小于', value: 4, tag: 'LessThan' },
  lessThanOrEqual: { label: '小于等于', value: 5, tag: 'LessThanOrEqual' },
  any: { label: '在列表', value: 6, tag: 'In' },
  notAny: { label: '不在列表', value: 7, tag: 'NotIn' },
  notEqual: { label: '不等于', value: 10, tag: 'NotEqual' },
  notContains: { label: '不包含', value: 13, tag: 'NoLike' },
  dateRange: { label: '时间段', value: -1, tag: 'dateRange' },
}

const handleRemoteMethod = async (data: any, query: string) => {
  //console.log('handleRemoteMethod', data, query)
  if (data.options && !query) return
  if (data.remoteMethod) {
    const results = await commonSelectQuery(query, data.remoteMethod) //data.remoteMethod(query)
    data.options = results.map((result: any) => ({
      label: result.label,
      value: result.value,
    }))
    if (!data.allOptions) {
      data.allOptions = cloneDeep(data.options)
    } else {
      for (let index = 0; index < data.options.length; index++) {
        const element = data.options[index]
        let curr = data.allOptions.find((v: any) => v.value === element.value)
        if (curr) {
          curr.label = element.label
        } else {
          data.allOptions.push(cloneDeep(element))
        }
      }
      for (let index = 0; index < data.allOptions.length; index++) {
        const element = data.allOptions[index]
        data.options.find((item: any) => {
          if (item.value === element.value) {
            element.label = item.label
          }
        })
      }
    }
  }
}

const operatorGroups = {
  string: [
    operators.equal,
    operators.notEqual,
    operators.contains,
    operators.notContains,
    //operators.startsWith,
    //operators.notStartsWith,
    //operators.endsWith,
    //operators.notEndsWith,
  ],
  date: [
    operators.equal,
    operators.notEqual,
    operators.lessThan,
    operators.lessThanOrEqual,
    operators.greaterThan,
    operators.greaterThanOrEqual,
    operators.dateRange,
  ],
  number: [operators.equal, operators.notEqual, operators.lessThan, operators.lessThanOrEqual, operators.greaterThan, operators.greaterThanOrEqual],
  bool: [operators.equal, operators.notEqual],
  select: [
    operators.equal,
    operators.notEqual,
    operators.contains,
    operators.notContains,
    //operators.startsWith,
    //operators.notStartsWith,
    //operators.endsWith,
    //operators.notEndsWith,
  ],
}

let firstField = {
  field: '',
  value: '',
  operator: '',
  description: '',
  componentName: '',
  type: '',
  config: {},
  remoteMethod: null,
} as any

if (props.fields && props.fields.length > 0) {
  const field = props.fields.find((a: any) => a.defaultSelect === true)
  if (field) {
    firstField = field
  } else {
    firstField = props.fields[0]
  }
}

const state = reactive({
  showDialog: false,
  dataTree: {
    root: true,
    logic: 'And',
    filters: [],
  },
  defaultProps: {
    label: '',
    children: 'filters',
  },
  operatorGroups: operatorGroups as any,
  firstField: firstField,
})
// onMounted(() => {
//   let obj = {
//     root: true,
//     logic: 'And',
//     filters: [
//       {
//         field: 'groupCode',
//         description: '组别',
//         operator: 'Equal',
//         value: ['8888'],
//         type: 'select',
//         componentName: 'el-select',
//         config: {},
//         filterable: true,
//         remoteable: true,
//         multipleable: true,
//         options: [
//           {
//             label: '外送',
//             value: '8888',
//           },
//           {
//             label: '测试分组',
//             value: '1001',
//           },
//           {
//             label: '测试分组2',
//             value: '1002',
//           },
//         ],
//         allOptions: [
//           {
//             label: '外送',
//             value: '8888',
//           },
//           {
//             label: '测试分组',
//             value: '1001',
//           },
//           {
//             label: '测试分组2',
//             value: '1002',
//           },
//         ],
//       },
//       {
//         logic: 'And',
//         filters: [
//           {
//             field: 'customerCode',
//             description: '客户',
//             operator: 'Equal',
//             value: ['C00001'],
//             type: 'select',
//             componentName: 'el-select',
//             config: {},
//             filterable: true,
//             remoteable: true,
//             multipleable: true,
//             options: [
//               {
//                 label: '测试客户',
//                 value: 'C00001',
//               },
//             ],
//             allOptions: [
//               {
//                 label: '测试客户',
//                 value: 'C00001',
//               },
//             ],
//           },
//           {
//             logic: 'And',
//             filters: [
//               {
//                 field: 'groupCode',
//                 description: '组别',
//                 operator: 'Equal',
//                 value: ['8888', '1001'],
//                 type: 'select',
//                 componentName: 'el-select',
//                 config: {},
//                 filterable: true,
//                 remoteable: true,
//                 multipleable: true,
//                 options: [
//                   {
//                     label: '外送',
//                     value: '8888',
//                   },
//                   {
//                     label: '测试分组',
//                     value: '1001',
//                   },
//                   {
//                     label: '测试分组2',
//                     value: '1002',
//                   },
//                 ],
//                 allOptions: [
//                   {
//                     label: '外送',
//                     value: '8888',
//                   },
//                   {
//                     label: '测试分组',
//                     value: '1001',
//                   },
//                   {
//                     label: '测试分组2',
//                     value: '1002',
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   }
//   state.dataTree.filters = obj.filters
// })
const disabledDate = (time: any) => {
  return time.getTime() > Date.now()
}

const getOperators = (type: any) => {
  const ops = state.operatorGroups[type || 'string']
  return ops && ops.length > 0 ? ops : ops['string']
}

const onChangeField = (data: any) => {
  data.remoteMethod = props.fields.find((a: any) => a.field === data.field).remoteMethod
  data.filterable = props.fields.find((a: any) => a.field === data.field).filterable
  data.remoteable = props.fields.find((a: any) => a.field === data.field).remoteable
  data.multipleable = props.fields.find((a: any) => a.field === data.field).multipleable
  data.options = props.fields.find((a: any) => a.field === data.field).options

  const field = props.fields.find((a: any) => a.field === data.field) as any
  data.value = ''
  data.componentName = field.componentName
  data.description = field.description
  data.type = field.type ? field.type : ''
  const operators = getOperators(data.type)
  let defaultOprator = ''
  if (field.operator) {
    const operatorIndex = operators.findIndex((a: any) => a.value === field.operator)
    defaultOprator = operatorIndex >= 0 ? field.operator : ''
  }
  if (!defaultOprator) {
    defaultOprator = operators[0].value
  }
  data.operator = defaultOprator
  data.config = { ...field.config }
  if (data.type === 'date') {
    let dateType = 'date'
    if (data.operator === 'dateRange') {
      dateType = dateType + 'range'
    }
    data.config.type = data.config.type ? data.config.type : dateType
    if (data.config.type.indexOf('range') >= 0) {
      data.operator = 'dateRange'
    }
    data.config.format = data.config.format ? data.config.format : 'YYYY-MM-DD'
    data.config.valueFormat = data.config.valueFormat ? data.config.valueFormat : 'YYYY-MM-DD'
    data.config.defaultTime = data.config.defaultTime ? data.config.defaultTime : ['00:00:00', '00:00:00']
  }
}

const onChangeOperator = (data: any) => {
  data.value = ''
  if (data.type === 'date') {
    if (data.operator === 'dateRange') {
      data.config.type = data.config.type + 'range'
    } else {
      if (data.config.type.indexOf('range') >= 0) {
        data.config.type = data.config.type.replace(/range$/, '')
      }
    }
  }
}

const onAddGroup = (data: any) => {
  const newFilter = {
    logic: 'And',
  }
  if (!data.filters) {
    data.filters = []
  }
  data.filters.push(newFilter)
}

const onAddCondition = (data: any) => {
  const firstOprator = getOperators(data.type)[0]
  const newFilter = {
    field: state.firstField.value,
    description: state.firstField.description,
    operator: firstOprator.operator,
    value: state.firstField.value || '',
    type: state.firstField.type,
    componentName: state.firstField.componentName,
    config: { ...state.firstField.config },
    remoteMethod: state.firstField.remoteMethod,
  }
  if (!data.filters) {
    data.filters = []
  }
  const index = data.filters.findIndex((a: any) => a.logic != null && !a.field)
  if (index >= 0) {
    data.filters.splice(index, 0, newFilter)
  } else {
    data.filters.push(newFilter)
  }
}

const onDelete = (node: any, data: any) => {
  const parent = node.parent
  const filters = parent.data.filters || parent.data
  const index = filters.findIndex((d: any) => d === data)
  filters.splice(index, 1)
}

const reset = () => {
  state.dataTree.filters = []
}
const setFilter = (data: any) => {
  //console.log('setFilter', data)
  // setOptions(data)
  state.dataTree.filters = cloneDeep(data.filters)
}

const getDynamicFilter = () => {
  const cloneData = cloneDeep(state.dataTree)
  clearFilter(cloneData)
  //console.log('getDynamicFilter', cloneData)
  return cloneData
}

const clearFilter = (data: any) => {
  //递归循环删除options节点
  if (data.filters) {
    data.filters.$treeNodeId = null
    for (let i = data.filters.length - 1; i >= 0; i--) {
      if (data.filters[i].allOptions) {
        data.filters[i].allOptions = data.filters[i].allOptions.filter(
          (item: any) => data.filters[i].value.findIndex((c: any) => c == item.value) > -1
        )
      }
      if (data.filters[i].options) {
        data.filters[i].options = null
      }
      if (data.filters[i].filters) {
        clearFilter(data.filters[i])
      }
    }
  }
}

defineExpose({ getDynamicFilter, reset, setFilter })
</script>

<style lang="scss" scoped>
:deep() {
  .el-radio {
    margin-right: 20px;
    &:last-child {
      margin-right: 0px;
    }
  }
  .el-tree-node {
    white-space: unset;
  }
  .el-tree-node__content {
    height: auto;
    line-height: 40px;
    min-height: 40px;
    &:hover {
      background-color: unset;
      cursor: unset;
    }
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: unset;
  }
}
</style>

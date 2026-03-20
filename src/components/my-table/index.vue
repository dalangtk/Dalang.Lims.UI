<template>
  <div class="table-container">
    <div class="table-footer-tool">
      <slot name="headerButton">
        <div></div>
      </slot>
      <div class="headerright" v-if="props.showToolbox">
        <SvgIcon name="iconfont icon-dayin" :size="19" title="打印" @click="onPrintTable" />
        <SvgIcon name="iconfont icon-yunxiazai_o" :size="22" title="导出" @click="onImportTable" />
        <SvgIcon name="iconfont icon-shuaxin" :size="22" title="刷新" @click="onRefreshTable" />
        <el-popover placement="top-end" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false" @show="onSetTable">
          <template #reference>
            <SvgIcon name="iconfont icon-quanjushezhi_o" :size="22" title="设置" />
          </template>
          <template #default>
            <div class="tool-box">
              <el-tooltip content="拖动进行排序" placement="top-start">
                <SvgIcon name="fa fa-question-circle-o" :size="17" color="#909399" />
              </el-tooltip>
              <!-- <el-checkbox v-model="state.checkListAll" :indeterminate="state.checkListIndeterminate" class="ml10 mr1"
                  label="列显示" @change="onCheckAllChange" />
                <el-checkbox class="ml12 mr1" label="序号" />
                <el-checkbox class="ml12 mr1" label="多选" /> -->
              <el-button class="toolbox-btn" size="small" @click="resetColumn">重置</el-button>
            </div>
            <el-scrollbar>
              <div ref="toolSetRef" class="tool-sortable">
                <div class="tool-sortable-item" v-for="(v, i) in displayCol" :key="v.prop" :data-key="v.prop">
                  <div>
                    <i class="fa fa-arrows-alt handle cursor-pointer" style="font-size: 10px"></i>
                    <el-checkbox size="small" class="mr8" :title="v.label" v-model="v.visiable" :label="v.label" @change="toggleVisiable(v, i)" />
                  </div>
                  <div>
                    <el-button :type="v.fixed === 'left' ? 'primary' : 'default'" size="small" @click="setFixed(v, i, 'left')">左固定</el-button>
                    <el-button :type="v.fixed === 'right' ? 'primary' : 'default'" size="small" @click="setFixed(v, i, 'right')">右固定</el-button>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </template>
        </el-popover>
      </div>
    </div>
    <el-table ref="table" v-bind="$attrs" v-loading="$attrs.loading">
      <children :key="key" />
    </el-table>
    <div class="table-footer mt15" v-if="props.showPaging">
      <el-pagination
        v-model:current-page="state.page.currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        v-model:page-size="state.page.pageSize"
        layout="total,pager,sizes,prev,next,jumper"
        v-model:total="$attrs.total"
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import table2excel from 'js-table2excel'
import { cloneVNode, Component, computed, reactive, ref, VNode, readonly, useSlots, watch, nextTick, toRaw, onMounted } from 'vue'
import * as storage from './storage'
import Sortable from 'sortablejs'
import { useKeepScroll } from './useKeepScroll'
import { ElMessageBox } from 'element-plus'
import printJs from 'print-js'

export interface IMyTableColumnProps {
  prop?: string
  label?: string
  fixed?: 'left' | 'right' | boolean
  visiable?: boolean
}
interface IExportHeader {
  title: string
  key: string
  type: string
}

const props = defineProps({
  tableName: {
    type: String,
    default: () => '',
  },
  showPaging: {
    type: Boolean,
    default: true,
  },
  showToolbox: {
    type: Boolean,
    default: true,
  },
})

const state = reactive({
  page: {
    pageSize: 20 as any,
    currentPage: 1 as any,
  },
  selectlist: [] as EmptyObjectType[],
  checkListAll: true,
  checkListIndeterminate: false,
})

onMounted(() => {})

// 定义子组件向父组件传值/事件
const emit = defineEmits(['delRow', 'pageOrSizeChange', 'sortHeader'])

const onHandleSizeChange = () => {
  emit('pageOrSizeChange', state.page)
}
const onHandleCurrentChange = () => {
  emit('pageOrSizeChange', state.page)
}
const onRefreshTable = () => {
  emit('pageOrSizeChange', state.page)
}

const onImportTable = () => {
  var headers: IExportHeader[] = toRaw(table.value.columns)
    .filter((v: any) => v.type != 'selection')
    .map((v: any) => {
      let o = {
        title: v.label,
        key: v.property,
        type: v.type === 'default' ? 'text' : v.type,
      } as IExportHeader
      return o
    })
  let tableData = convertNullToString(toRaw(table.value.data))
  table2excel(headers, tableData, `${props.tableName} ${new Date().toLocaleString()}.xls`)
}
const convertNullToString = (arr: any) => {
  return arr.map((obj: any) => {
    const newObj = {} as any
    for (const key in obj) {
      newObj[key] = obj[key] === null || obj[key] === undefined ? '' : obj[key]
    }
    return newObj
  })
}
const pageReset = () => {
  state.page.currentPage = 1
  state.page.pageSize = 10
  emit('pageOrSizeChange', state.page)
}
// 打印
const onPrintTable = () => {
  // https://printjs.crabbly.com/#documentation
  // 自定义打印
  let tableTh = ''
  let tableTrTd = ''
  let tableTd: any = {}
  // 表头
  var headers = toRaw(table.value.columns)
  headers.forEach((v: any) => {
    tableTh += `<th class="table-th">${v.label}</th>`
  })
  var tableData = toRaw(table.value.data) as Array<any>
  // 表格内容
  tableData.forEach((val, idx) => {
    if (!tableTd[idx]) tableTd[idx] = []

    headers.forEach((v: any) => {
      if (v.type === 'text' || v.type === 'default') {
        tableTd[idx].push(`<td class="table-th table-center">${val[v.property]}</td>`)
      } else if (v.type === 'image') {
        tableTd[idx].push(
          `<td class="table-th table-center"><img src="${val[v.property]}" style="width:${v.realWidth}px;height:${v.height}px;"/></td>`
        )
      }
    })
    tableTrTd += `<tr>${tableTd[idx].join('')}</tr>`
  })
  // 打印
  printJs({
    printable: `<div style=display:flex;flex-direction:column;text-align:center><h3>${props.tableName}</h3></div><table border=1 cellspacing=0><tr>${tableTh}${tableTrTd}</table>`,
    type: 'raw-html',
    css: ['//at.alicdn.com/t/c/font_2298093_rnp72ifj3ba.css', '//unpkg.com/element-plus/dist/index.css'],
    style: `@media print{.mb15{margin-bottom:15px;}.el-button--small i.iconfont{font-size: 12px !important;margin-right: 5px;}}; .table-th{word-break: break-all;white-space: pre-wrap;}.table-center{text-align: center;}`,
  })
}

function isElTableColumn(vnode: VNode) {
  return (vnode.type as Component)?.name === 'ElTableColumn'
}

const table = ref()
const toolSetRef = ref()

const slotsOrigin = useSlots()
const slots = computed(() => {
  /* 对 slot 进行分类 */
  const main: VNode[] = [] // ElTableColumn 且存在 prop 属性
  const left: VNode[] = [] // ElTableColumn 不存在 prop 属性，但 fixed="left"
  const other: VNode[] = [] // 其他

  slotsOrigin.default?.()?.forEach((vnode) => {
    if (isElTableColumn(vnode)) {
      const { prop, fixed, type } = vnode.props ?? {}
      if (prop !== undefined || type == 'selection') return main.push(vnode)
      if (fixed === 'left') return left.push(vnode)
    }
    other.push(vnode)
  })

  return {
    main,
    left,
    other,
  }
})

const displayCol = computed(() => readonly(columns.render))
const columnsFormStorage = ref<IMyTableColumnProps[]>(storage.get('columns') ?? [])
const resetColumn = () => {
  ElMessageBox.confirm('确定重置列设置吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      columns.storage = []
    })
    .catch(() => {})
}

const setCurrentRow = (row: any) => {
  table.value.setCurrentRow(row)
}

const toggleVisiable = (data: any, index: any) => {
  const newData = { ...data }
  newData.visiable = !newData.visiable
  const _columns = [...displayCol.value]
  _columns[index] = newData
  columns.storage = _columns
}
function setFixed(data: IMyTableColumnProps, index: number, value: 'left' | 'right') {
  const newData = { ...data }
  const _columns = [...displayCol.value]
  const oldFixed = newData.fixed
  if (oldFixed) {
    if (oldFixed === value) {
      newData.fixed = false
    } else {
      newData.fixed = oldFixed === 'left' ? 'right' : 'left'
    }
  } else {
    newData.fixed = value
  }
  _columns[index] = newData
  columns.storage = _columns
}

const onSetTable = () => {
  nextTick(() => {
    const sortable = Sortable.create(toolSetRef.value, {
      handle: '.handle',
      dataIdAttr: 'data-key',
      animation: 150,
      onEnd: () => {
        const headerList: EmptyObjectType[] = []
        sortable.toArray().forEach((val: string) => {
          columns.slot.forEach((v) => {
            if (v.prop === val) headerList.push({ ...v })
          })
        })
        columns.storage = headerList
      },
    })
  })
}

/* 列的排序与部分属性 */
const columns = reactive({
  // 本地储存的
  storage: computed<IMyTableColumnProps[]>({
    get() {
      return columnsFormStorage.value
    },
    set(value) {
      columnsFormStorage.value = value
      storage.set('columns', value)
    },
  }),

  // slot 中获取的
  slot: computed(() =>
    slots.value.main.map(({ props }) => ({
      prop: props!.prop,
      label: props!.label,
      fixed: props!.fixed,
      visiable: props!.visiable ?? true,
    }))
  ),

  // 渲染使用的
  render: computed(() => {
    const slot = [...columns.slot]
    const storage = [...columns.storage]

    const res: IMyTableColumnProps[] = []
    storage.forEach((props) => {
      const index = slot.findIndex(({ prop }) => prop === props.prop)
      if (~index) {
        const propsFromSlot = slot[index]
        res.push({
          ...propsFromSlot,
          ...props,
        })
        slot.splice(index, 1)
      }
    })
    res.push(...slot)

    return res
  }),
})

/* 重构 slot.main */
const refactorSlot = computed(() => {
  const { main } = slots.value

  /* 对 slot.main 进行改写 */
  const refactorySlot: VNode[] = []
  columns.render.forEach(({ prop, visiable, fixed }) => {
    if (!visiable) return

    const vnode = main.find((vnode) => prop === vnode.props?.prop)
    if (!vnode) return

    const cloned = cloneVNode(vnode, {
      fixed,
    })

    refactorySlot.push(cloned)
  })

  return refactorySlot
})

const getSelectionRows = () => {
  return table.value.getSelectionRows()
}
/* 强制更新 el-table-column */
const key = ref(0)
watch(refactorSlot, () => (key.value += 1))

/* 对外暴露的内容 */
defineExpose({
  table, // el-table 实例的访问
  columns: computed(() => readonly(columns.render)),
  updateColumns(value: IMyTableColumnProps[]) {
    columns.storage = value
  },
  pageReset,
  setCurrentRow,
  getSelectionRows,
})

const children = () => [slots.value.left, refactorSlot.value, slots.value.other]

/* 追加功能 */
// 记录滚动条位置
useKeepScroll(computed(() => table.value?.$refs.bodyWrapper))
</script>
<style scoped lang="scss">
.el-checkbox {
  margin-right: 10px;
  margin-left: 8px;
  /* 根据需要调整间距 */
  vertical-align: middle;
  /* 垂直居中 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 80px;
}

.el-button {
  vertical-align: middle;
  /* 垂直居中 */
}

.tool-sortable-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-box {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: flex-start;

  .toolbox-btn {
    margin-left: 11px;
  }
}

.table-container {
  display: flex;
  flex-direction: column;

  .el-table {
    flex: 1;
  }

  .table-footer {
    display: flex;
  }

  .table-footer-tool {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 5px 10px;
    background-color: #fff;
    .headerright {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      i {
        margin-right: 10px;

        &:last-of-type {
          margin-right: 0;
        }
      }

      i:hover {
        cursor: pointer;
        color: blue;
      }
    }
  }
}
</style>

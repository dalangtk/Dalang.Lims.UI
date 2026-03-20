<template>
  <div class="sortshelf">
    <div class="shelf">
      <vxe-toolbar v-if="props.isEdit">
        <template #buttons>
          <el-button v-if="auth(perms.add)" type="primary" size="small" @click="addShelf(1)">
            <SvgIcon name="ele-Plus" />
            新增</el-button
          >
          <el-button v-if="isAdd()" type="primary" size="small" @click="addall">
            <SvgIcon name="ele-Plus" />
            一键新增</el-button
          >
        </template>
      </vxe-toolbar>
      <vxe-table
        border
        show-overflow
        :data="state.shelfList"
        ref="shelfTableRef"
        keep-source
        height="85%"
        :row-config="{ isCurrent: true }"
        :edit-config="shelfRuleEditConfig"
        @current-row-change="({ row }) => shelfChange(row)"
      >
        <vxe-column field="shelfPosition" title="位置" :width="70" show-overflow-tooltip />
        <vxe-column field="shelfName" title="名称" :edit-render="{ autoFocus: 'input' }">
          <template #edit="{ row }">
            <vxe-input v-if="props.isEdit" v-model="row.shelfName"></vxe-input>
            <span v-else>{{ row.shelfName }}</span>
          </template>
        </vxe-column>
        <vxe-column field="shelfType" title="类型" :edit-render="{}" show-overflow-tooltip>
          <template #edit="{ row }">
            <vxe-select
              :disabled="!props.isEdit"
              v-model="row.shelfType"
              :options="state.shelfTypeList"
              :option-props="{ value: 'code', label: 'name' }"
            ></vxe-select>
          </template>
          <template #default="{ row }">
            <span>{{ row.shelfType == 0 ? '常规' : '分血' }}</span>
          </template>
        </vxe-column>
        <vxe-column v-if="props.isEdit" title="操作" fixed="right" width="100">
          <template #default="{ row }">
            <el-button circle type="danger" size="small" v-if="auth(perms.delete)" @click="deleteShelf(row)" icon="ele-Delete"></el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="shelfrule">
      <vxe-toolbar v-if="props.isEdit">
        <template #buttons>
          <el-button type="primary" size="small" @click="addShelfRule">
            <SvgIcon name="ele-Plus" />
            新增</el-button
          >
        </template>
      </vxe-toolbar>
      <vxe-table border show-overflow height="85%" :data="state.shelfRuleList" :edit-config="shelfRuleEditConfig">
        <vxe-column field="sex" title="规则" :edit-render="{}" show-overflow-tooltip>
          <template #edit="{ row }">
            <vxe-select
              :disabled="!props.isEdit"
              v-model="row.sortRuleCode"
              :options="state.sortRuleList"
              :option-props="{ value: 'ruleCode', label: 'ruleName' }"
              @change="({ value }) => ruleChange(row, value)"
            ></vxe-select>
          </template>
          <template #default="{ row }">
            <span>{{ row.sortRuleName }}</span>
          </template>
        </vxe-column>
        <vxe-column field="sequenceCode" title="序列代码" show-overflow-tooltip />
        <vxe-column field="sequenceName" title="序列名称" show-overflow-tooltip />
        <vxe-column field="sort" title="排序" :edit-render="{ autoFocus: 'input' }">
          <template #edit="{ row }">
            <vxe-number-input :readonly="!props.isEdit" v-model="row.sort" step="10"></vxe-number-input>
          </template>
        </vxe-column>
        <vxe-column :disabled="!props.isEdit" v-if="props.isEdit" title="操作" fixed="right" width="100">
          <template #default="{ row }">
            <el-button
              v-if="auth(perms.update) && 'id' in props.sorterInfo && props.sorterInfo.id > 0"
              icon="ele-EditPen"
              size="small"
              type="primary"
              circle
            ></el-button>
            <el-button circle type="danger" size="small" v-if="auth(perms.delete)" @click="deleteShelfRule(row)" icon="ele-Delete"></el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance, PropType, onMounted, nextTick, watch } from 'vue'
import { auth, auths, authAll } from '/@/utils/authFunction'
import { BaseSorterAddInput, BaseSorterOutput, BaseSorterUpdateInput } from '/@/api/lims/pretreatment/datacontract/basesorter-datacontract'
import { BaseSorterApi } from '/@/api/lims/pretreatment/basesorter'
const { proxy } = getCurrentInstance() as any
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import {
  BaseSorterShelfAddInput,
  BaseSorterShelfOutput,
  BaseSorterShelfUpdateInput,
} from '/@/api/lims/pretreatment/datacontract/basesortershelf-datacontract'
import { BaseSorterShelfApi } from '/@/api/lims/pretreatment/basesortershelf'
import { BaseSorterShelfRuleOutput } from '/@/api/lims/pretreatment/datacontract/basesortershelfrule-datacontract'
import { BaseSortRuleApi } from '/@/api/lims/pretreatment/basesortrule'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseSortRuleListOutput, BaseSortRuleQueryListInput } from '/@/api/lims/pretreatment/datacontract/sortrule-datacontract'
import { BaseSorterShelfRuleApi } from '/@/api/lims/pretreatment/basesortershelfrule'
import _, { max } from 'lodash' //引用 loadsh
import type { VxeSelectPropTypes } from 'vxe-pc-ui'
import type { VxeTablePropTypes } from 'vxe-table'

//权限配置
const perms = {
  add: 'api:lims:base-sorter:add',
  update: 'api:lims:base-sorter:update',
  delete: 'api:lims:base-sorter:delete',
}
const actionColWidth = authAll([perms.update, perms.delete]) ? 135 : 70
const shelfTableRef = ref()

// let aa = VxeTablePropTypes.OptionProps
const shelfRuleEditConfig = reactive<VxeTablePropTypes.EditConfig<BaseSorterShelfRuleOutput>>({
  mode: 'row',
  trigger: 'click',
})

const props = defineProps({
  sorterInfo: {
    type: Object as PropType<BaseSorterAddInput | BaseSorterUpdateInput>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: true,
  },
})

const state = reactive({
  loading: false,
  currentShelf: null as BaseSorterShelfOutput | null,
  shelfList: [] as Array<BaseSorterShelfOutput>,
  shelfListOrg: [] as Array<BaseSorterShelfOutput>,
  shelfRuleList: [] as BaseSorterShelfRuleOutput[],
  shelfRuleAllList: [] as BaseSorterShelfRuleOutput[],
  shelfRuleAllListOrg: [] as BaseSorterShelfRuleOutput[],
  shelfTypeList: [
    { code: 0, name: '常规' },
    { code: 1, name: '分血' },
  ],
  getRulePageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseSortRuleQueryListInput>,
  sortRuleList: [] as BaseSortRuleListOutput[],
})

// watch(
//   () => state.shelfRuleAllList,
//   async (newVal, oldVal) => {
//     console.log('watch1oldVal', oldVal)
//     console.log('watch2newVal', newVal)
//   },
//   { deep: true }
// )

onMounted(async () => {
  await new BaseSortRuleApi().getPage(state.getRulePageInput, { showErrorMessage: true }).then((ret) => {
    state.sortRuleList = ret!.data!.list!
    console.log('sortRuleList', state.sortRuleList)
  })

  if (!('id' in props.sorterInfo) || props.sorterInfo.id <= 0) {
    return
  }
  refreshDetailData()
})
const refreshDetailData = async () => {
  let ret = await new BaseSorterShelfApi().getSorterShelf({ sorterCode: props.sorterInfo.sorterCode }, { showErrorMessage: true }).catch(() => {
    modal.closeLoading()
    return
  })
  state.shelfList = ret!.data!
  state.shelfList.forEach((v) => (v.rowStatus = 0))
  state.shelfListOrg = _.cloneDeep(state.shelfList)

  new BaseSorterShelfRuleApi().getList({ sorterCode: props.sorterInfo.sorterCode }, { showErrorMessage: true }).then((res) => {
    state.shelfRuleAllList = res.data!
    state.shelfRuleAllList.forEach((v) => (v.rowStatus = 0))
    state.shelfRuleAllListOrg = _.cloneDeep(state.shelfRuleAllList)

    if (state.shelfList) {
      refreshShelfRule(state.shelfList[0].shelfPosition!)
    }
  })
}
const isAdd = () => {
  let b = !('id' in props.sorterInfo) || props.sorterInfo.id <= 0
  return b
}
const shelfChange = (shelf: BaseSorterShelfOutput) => {
  state.currentShelf = shelf
  shelfTableRef.value.setCurrentRow(state.currentShelf)
  refreshShelfRule(shelf.shelfPosition!)
}
const addShelf = (addCount: number) => {
  var minId = -1
  var maxPosition = 0
  if (state.shelfList.length > 0) {
    minId = state.shelfList.reduce((prev, curr) => (prev.id < curr.id ? prev : curr)).id
    maxPosition = state.shelfList.reduce((prev, curr) => ((prev.shelfPosition ?? 0) > (curr.shelfPosition ?? 0) ? prev : curr)).shelfPosition ?? 0
  }

  for (let index = 0; index < addCount; index++) {
    if (state.shelfList.length >= props.sorterInfo.shelfCount!) {
      return
    }

    let currShelf = {
      id: --minId,
      sorterCode: props.sorterInfo.sorterCode,
      shelfName: '架子' + (maxPosition + 1),
      shelfPosition: ++maxPosition,
      shelfType: index < 15 ? 0 : 1,
      isValid: true,
      rowStatus: 1,
    }
    state.shelfList.push(currShelf)
  }
}
const addall = () => {
  if (!('id' in props.sorterInfo) || props.sorterInfo.id <= 0) {
    // 新增
    if (!props.sorterInfo.shelfCount || props.sorterInfo.shelfCount <= 0) {
      modal.msgError('请填正确的架子数！')
      return
    }
    if (state.shelfList.length > 0) {
      modal.msgError('架子不为空，无法生成！')
      return
    }

    addShelf(props.sorterInfo.shelfCount)
  }
}
const ruleChange = (row: BaseSorterShelfRuleOutput, value: any) => {
  let currRule = state.sortRuleList.find((item) => item.ruleCode == value)
  row.sortRuleName = currRule?.ruleName
  nextTick(() => {
    row.sequenceCode = currRule?.sequenceCode
    row.sequenceName = currRule?.sequenceName
  })
}
const deleteShelfRule = (row: BaseSorterShelfRuleOutput) => {
  proxy.$modal.confirmDelete(`确定要删除规则?`).then(async () => {
    state.shelfRuleList.forEach((v) => {
      if (v.id == row.id) {
        if (row.id < 0) {
          state.shelfRuleList = state.shelfRuleList.filter((item) => item.id != v.id)
          state.shelfRuleAllList = state.shelfRuleAllList.filter((item) => item.id != v.id)
        } else {
          v.rowStatus = 2
          state.shelfRuleList = state.shelfRuleList.filter((item) => item.sortRuleCode != row.sortRuleCode && item.rowStatus != 2)
        }
      }
    })
  })
}
const refreshShelfRule = (shelfPosition: number) => {
  state.shelfRuleList = state.shelfRuleAllList.filter((item) => item.shelfPosition == shelfPosition && item.rowStatus != 2)
}

const addShelfRule = () => {
  let maxObj = _.maxBy(state.shelfRuleList, 'sort')
  let minObj = _.maxBy(state.shelfRuleList, 'id')
  let newObj = {
    id: (minObj?.id ?? -1) > 0 ? -1 : minObj?.id,
    sorterCode: props.sorterInfo.sorterCode,
    sortRuleCode: '',
    shelfPosition: state.currentShelf!.shelfPosition,
    sort: (maxObj?.sort ?? 0) + 10,
    rowStatus: 1,
  } as BaseSorterShelfRuleOutput
  state.shelfRuleList.push(newObj)
  state.shelfRuleAllList.push(newObj)
}
const deleteShelf = (row: BaseSorterShelfOutput) => {
  proxy.$modal.confirmDelete(`确定要删除【${row.shelfName}】?`).then(async () => {
    state.shelfRuleList = []

    if (row.id < 0) {
      state.shelfList = state.shelfList.filter((item) => item.shelfPosition != row.shelfPosition)
    } else {
      state.shelfList.forEach((v) => {
        if (v.id == row.id) v.rowStatus = 2
      })
    }

    state.shelfRuleAllList.forEach((v) => {
      if (v.shelfPosition == row.shelfPosition) {
        v.rowStatus = 2
      }
    })
    state.shelfRuleAllList = state.shelfRuleAllList.filter((item) => item.id > 0 && item.rowStatus != 2)
    state.currentShelf = null
  })
}
const getSorterDetail = () => {
  let obj = {
    shelfList: [] as BaseSorterShelfOutput[],
    shelfRuleList: [] as BaseSorterShelfRuleOutput[],
  }
  if (!('id' in props.sorterInfo) || props.sorterInfo.id <= 0) {
    obj.shelfList = state.shelfList
    obj.shelfRuleList = state.shelfRuleAllList
  }

  return obj
}

const getModified = () => {
  let obj = {
    shelfList: [] as BaseSorterShelfOutput[],
    shelfRuleList: [] as BaseSorterShelfRuleOutput[],
  }
  state.shelfRuleAllList.forEach((v) => {
    if (v.rowStatus == 0 && v.id > 0) {
      let curr = state.shelfRuleAllListOrg.find((item) => item.id == v.id)
      if (v.sort != curr?.sort || v.sortRuleCode != curr?.sortRuleCode) {
        v.rowStatus = 3
      }
    }
  })
  state.shelfList.forEach((v) => {
    if (v.rowStatus == 0 && v.id > 0) {
      let curr = state.shelfListOrg.find((item) => item.id == v.id)
      if (v.shelfName != curr?.shelfName || v.shelfType != curr?.shelfType) {
        v.rowStatus = 3
      }
    }
  })
  let modifiedShelfList = _.cloneDeep(state.shelfList) //.filter((v) => v.rowStatus != 0)
  let modifiedRuleList = _.cloneDeep(state.shelfRuleAllList) //.filter((v) => v.rowStatus != 0)
  obj.shelfRuleList = modifiedRuleList
  obj.shelfList = modifiedShelfList
  return obj
}

defineExpose({
  getSorterDetail,
  getModified,
  refreshDetailData,
})
</script>

<style scoped lang="scss">
.sortshelf {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.shelf {
  flex: 1;
  min-height: 0;
}
.shelfrule {
  flex: 1;
  min-height: 0;
}
</style>

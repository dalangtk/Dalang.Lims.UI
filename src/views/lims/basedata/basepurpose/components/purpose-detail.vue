<template>
  <div class="pdiv h100">
    <div class="ddiv">
      <!-- <el-button size="small" type="primary" @click="onAdd">add</el-button> -->
      <el-card :body-style="{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }">
        <!-- <el-table class="my-table" :data="DetailModel.purposeInstrumentItem" border>
          <el-table-column prop="instrumentItemCode" label="上机项目代码" show-overflow-tooltip width />
          <el-table-column prop="instrumentItemName" label="上机项目名称" show-overflow-tooltip width />
          <el-table-column label="操作" v-auths="[perms.delete, perms.update]" :width="actionColWidth" fixed="right">
            <template #default="{ row }">
              <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table> -->
        <MyTable
          border
          tableName="目的-上机项目"
          class="my-table"
          :data="DetailModel.purposeInstrumentItem"
          ref="table"
          :loading="state.loading"
          stripe
          :show-paging="false"
        >
          <template #headerButton>
            <div>
              <el-tag type="primary" size="small">上机项目</el-tag>
              <el-button size="small" type="primary" @click="onAdd" style="margin-left: 5px">
                <SvgIcon name="ele-Plus" />
                新增</el-button
              >
            </div>
          </template>
          <el-table-column prop="instrumentItemCode" label="上机项目代码" show-overflow-tooltip width />
          <el-table-column prop="instrumentItemName" label="上机项目名称" show-overflow-tooltip width />
          <el-table-column label="操作" v-auths="[perms.delete, perms.update]" :width="actionColWidth" fixed="right">
            <template #default="{ row }">
              <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
            </template>
          </el-table-column>
        </MyTable>
      </el-card>
    </div>
    <!-- :body-style="{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }" -->
    <div class="ddiv">
      <el-card :loading="state.loading" stripe :show-paging="false" border tableName="目的-项目明细" class="my-table">
        <MyTable :data="DetailModel.purposeItemDetail" style="height: 100%" @cell-click="showUnitInput" border>
          <template #headerButton>
            <el-tag type="primary" size="small">目的明细</el-tag>
          </template>
          <el-table-column prop="instrumentItemName" label="上机项目名称" show-overflow-tooltip width="120" />
          <el-table-column prop="itemCode" label="项目代码" show-overflow-tooltip width />
          <el-table-column prop="itemName" label="项目名称" show-overflow-tooltip width />
          <el-table-column prop="resultType" label="结果类型" show-overflow-tooltip width />
          <el-table-column prop="method" label="方法学" show-overflow-tooltip width>
            <template #default="{ row, column }">
              <el-select
                size="small"
                v-if="tableRowEditId === row.id && tableColumnEditIndex === column.id"
                @blur="blurValueInput(row, column)"
                v-model="row.method"
                filterable
                clearable
              >
                <el-option v-for="item in state.methodList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
              <span v-else>{{ state.methodList?.find((v) => v.code == row.method)?.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="isReportShow" label="报告显示" show-overflow-tooltip width>
            <template #default="{ row, column }">
              <el-checkbox
                size="small"
                v-if="tableRowEditId === row.id && tableColumnEditIndex === column.id"
                v-model="row.isReportShow"
                @blur="blurValueInput(row, column)"
              />
              <span v-else>
                <el-tag :type="row.isReportShow === true ? 'success' : 'warning'">
                  {{ row.isReportShow === true ? '是' : '否' }}
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="defaultValue" label="默认值" show-overflow-tooltip width>
            <template #default="{ row, column }">
              <el-input
                size="small"
                v-if="tableRowEditId === row.id && tableColumnEditIndex === column.id"
                v-model="row.defaultValue"
                @blur="blurValueInput(row, column)"
              />
              <span v-else>{{ row.defaultValue }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" v-auths="[perms.delete, perms.update]" :width="actionColWidth" fixed="right">
            <template #default="{ row }">
              <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
            </template>
          </el-table-column> -->
        </MyTable>
      </el-card>
    </div>
    <ItemSelect ref="itemSelectRef" @confirm="itemSelectConfirm"></ItemSelect>
  </div>
</template>

<script lang="ts" setup>
import 'splitpanes/dist/splitpanes.css'
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseInstrumentItemApi, BaseInstrumentItemDetailApi } from '/@/api/lims/basedata/baseinstrumentitem'
import { BasePurposeApi } from '/@/api/lims/basedata/basepurpose'
import { BaseInstrumentItemOutput } from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'
import {
  BasePurposeDetailAddInput,
  BasePurposeDetailOutput,
  BasePurposeDetailUpdateInput,
  PurposeDetailInput
} from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { auth, authAll } from '/@/utils/authFunction'
const MyLayout = defineAsyncComponent(() => import('/@/components/my-layout/index.vue'))
const ItemSelect = defineAsyncComponent(() => import('./instrument-item-select.vue'))
const itemSelectRef = ref()
var table = ref()

const emit = defineEmits(['beginWatchPurDetail'])

let tableRowEditId = ref(null) // 控制可编辑的每一行
let tableColumnEditIndex = ref(null) //控制可编辑的每一列
const showUnitInput = (row: any, column: any) => {
  // console.log('blurValueInputrow', row)
  // console.log('blurValueInputcolumn', column.property)
  tableRowEditId.value = row.id //确定点击的单元格在哪行 如果数据中有ID可以用ID判断，没有可以使用其他值判断，只要能确定是哪一行即可
  tableColumnEditIndex.value = column.id //确定点击的单元格在哪列
}
const blurValueInput = (row: { [x: string]: boolean }, column: any) => {
  tableRowEditId.value = null
  tableColumnEditIndex.value = null

  // console.log('blurValueInputrow', row)
  // console.log('blurValueInputcolumn', column)

  // const id = row.id
  // const key = column.property
  // const value = row[key]
}
//权限配置
const perms = {
  add: 'api:lims:base-instrument-item:add',
  update: 'api:lims:base-instrument-item:update',
  delete: 'api:lims:base-instrument-item:delete',
  batDelete: 'api:lims:base-instrument-item:batch-delete',
  softDelete: 'api:lims:base-instrument-item:soft-delete',
  batSoftDelete: 'api:lims:base-instrument-item:batch-soft-delete',
}

const DetailModel = defineModel({
  type: Object as () => PurposeDetailInput,
  default: {} as PurposeDetailInput,
})

const actionColWidth = authAll([perms.update, perms.softDelete]) || authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  sels: [] as Array<BasePurposeDetailOutput>,
  methodList: [] as DictGetListDto[] | null,
})

onMounted(async () => {
  new DictApi().getList(['Method']).then((res) => {
    state.methodList = res.data!.method
  })
})

const refreshDetailItem = () => {
  onQuery()
}

const onQuery = async () => {
  state.loading = true
  const res = await new BasePurposeApi()
    .getPurposeDetail({ groupCode: DetailModel.value.purpose.groupCode, purCode: DetailModel.value.purpose.purCode })
    .catch(() => {
      state.loading = false
    })
  let currDetail = res?.data ?? []
  if (res!.data != null && res!.data.length > 0) {
    let instrumentItemCodes = currDetail.map((v: BasePurposeDetailAddInput | BasePurposeDetailUpdateInput) => v.instrumentItemCode!)
    instrumentItemCodes = instrumentItemCodes.filter((f, index) => instrumentItemCodes.indexOf(f) == index)
    const res = await new BaseInstrumentItemApi().getByCodeList(instrumentItemCodes).catch(() => {
      state.loading = false
    })
    DetailModel.value.purposeInstrumentItem = res?.data ?? []

    if (DetailModel.value.purposeInstrumentItem.length > 0) {
      currDetail.forEach((element) => {
        element.instrumentItemName = DetailModel.value.purposeInstrumentItem.find(
          (f) => f.instrumentItemCode === element.instrumentItemCode
        )?.instrumentItemName
      })
    }
  }
  DetailModel.value.purposeItemDetail = currDetail
  state.loading = false

  beginWatch()
}

const onAdd = () => {
  if (!DetailModel.value.purpose) {
    modal.msgError('请先选择上机项目！')
    return
  }
  if (!DetailModel.value.purpose.groupCode) {
    modal.msgError('请选择组别！')
    return
  }
  itemSelectRef.value.open(DetailModel.value.purpose.groupCode, DetailModel.value.purpose.purCode)
}

const itemSelectConfirm = async (selectItems: Array<BaseInstrumentItemOutput>) => {
  selectItems.forEach((v) => (v.id = 0))
  let instrumentItemCodes = selectItems.map((v) => v.instrumentItemCode!)
  //根据上机项目代码获取上机项目明细
  let res = await new BaseInstrumentItemDetailApi().getListByInstrumentItemCode(instrumentItemCodes)
  if (res.data && res?.data?.length > 0) {
    let currItems = res.data
    //取出currItems里面ItemCode重复的对象
    let repeatItems = currItems.filter((item, index) => currItems.findIndex((f) => f.itemCode === item.itemCode) !== index)
    if (repeatItems && repeatItems.length > 0) {
      modal.alertError('所选上机项目存在重复小项!')
      return
    }

    //找出DetailModel.value.currPurposeDetail中包含currItems的项，根据ItemCode找
    let existItems = currItems.filter((v) => DetailModel.value.purposeItemDetail!.some((d) => d.itemCode === v.itemCode))
    if (existItems && existItems.length > 0) {
      modal.alertError(`当前项目已存在${existItems[0].itemCode}-${existItems[0].itemName}`)
      return
    }
    let addList = currItems
      .filter((addItem) => !DetailModel.value.purposeItemDetail!.some((baseItem) => baseItem.itemCode === addItem.itemCode))
      .map(
        (a) =>
          ({
            id: 0,
            groupCode: DetailModel.value.purpose.groupCode,
            purCode: DetailModel.value.purpose.purCode,
            instrumentItemCode: a.instrumentItemCode,
            itemCode: a.itemCode,
            resultType: a.resultType,
            method: a.method,
            isReportShow: true,
            isValid: true,
            itemName: a.itemName,
            instrumentItemName: a.instrumentItemName,
          }) as BasePurposeDetailUpdateInput
      )
    DetailModel.value.purposeItemDetail = DetailModel.value.purposeItemDetail!.concat(addList)
    DetailModel.value.purposeInstrumentItem = DetailModel.value.purposeInstrumentItem.concat(selectItems)
  }
}
const onDelete = (row: BaseInstrumentItemOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.instrumentItemName}】?`, null)
    .then(async () => {
      DetailModel.value.purposeInstrumentItem = DetailModel.value.purposeInstrumentItem.filter((v) => v.instrumentItemCode !== row.instrumentItemCode)
      DetailModel.value.purposeItemDetail = DetailModel.value.purposeItemDetail!.filter((v) => v.instrumentItemCode !== row.instrumentItemCode)
    })
    .catch(() => {})
}
const beginWatch = () => {
  emit('beginWatchPurDetail')
}
defineExpose({
  refreshDetailItem,
})
</script>

<style scoped>
.my-table {
  flex: 1;
  overflow: hidden;
}
.pdiv {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.ddiv {
  height: 50%;
  .el-card {
    height: 100%;
  }
}
.card-header {
  display: flex;
}
.el-table {
  flex: 1; /* 让表格占据剩余空间 */
  height: auto; /* 让表格高度自适应 */
}
</style>

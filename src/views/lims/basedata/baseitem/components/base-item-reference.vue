<template class="referenceContainer">
  <div class="oper">
    <el-button @click="onAdd" size="small" v-auth="perms.add">新增</el-button>
    <!-- <el-button @click="saveReference">保存</el-button> -->
  </div>
  <div class="tablediv">
    <el-table
      class="reftable"
      ref="multipleTableRef"
      size="small"
      :data="state.tableData"
      border
      table-layout="auto"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column property="resultType" label="结果类型" width="100">
                <template #default="scope">
                    <el-select v-model="scope.row.resultType" placeholder="请选择" clearable filterable size="small">
                        <el-option v-for="r in state.resultTypeList" :key="r.id" :label="r.name" :value="r.value" />
                    </el-select>
                </template>
            </el-table-column> -->
      <el-table-column property="method" label="方法学" width="120">
        <template #default="scope">
          <el-select v-model="scope.row.method" placeholder="" clearable filterable size="small" disabled>
            <el-option v-for="r in state.methodList" :key="r.id" :label="r.name" :value="r.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="customerCode" label="客户" width="120">
        <template #default="scope">
          <span>{{ scope.row.customerCode }}</span>
        </template>
      </el-table-column>
      <el-table-column property="sampleTypeCode" label="标本类型" width="100">
        <template #default="scope">
          <el-select v-model="scope.row.sampleTypeCode" placeholder="请选择年龄单位" clearable filterable size="small" disabled>
            <el-option v-for="r in state.sampleTypeList" :key="r.id" :label="r.sampleTypeName" :value="r.sampleTypeCode" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="instrumentCode" label="仪器" width="120">
        <template #default="scope">
          <el-input v-model="scope.row.instrumentCode" placeholder="请选择仪器" size="small" />
        </template>
      </el-table-column>
      <el-table-column property="reagentCode" label="试剂" width="120">
        <template #default="scope">
          <el-input v-model="scope.row.reagentCode" placeholder="请选择试剂" size="small" />
        </template>
      </el-table-column>
      <el-table-column property="genderCode" label="性别" width="100">
        <template #default="scope">
          <el-select v-model="scope.row.genderCode" placeholder="" clearable filterable size="small" disabled>
            <el-option v-for="r in state.genderList" :key="r.id" :label="r.name" :value="r.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="entrustHospitalCode" label="委托医院" width="120" disabled>
        <template #default="scope">
          <el-select
            v-model="scope.row.entrustHospitalCode"
            placeholder=""
            clearable
            filterable
            remote
            :remote-method="searchEntrustHos"
            remote-show-suffix
            :loading="state.loading"
            size="small"
            disabled
          >
            <el-option v-for="r in state.entrustHosList" :key="r.id" :label="r.entrustHospitalName" :value="r.entrustHospitalCode" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="ageLowLimit" label="年龄下限" width="90">
        <template #default="scope">
          <span>{{ scope.row.ageLowLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column property="ageUpperLimit" label="年龄上限" width="90">
        <template #default="scope">
          <span>{{ scope.row.ageUpperLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column property="ageUnit" label="年龄单位" width="100">
        <template #default="scope">
          <el-select v-model="scope.row.ageUnit" placeholder="请选择年龄单位" clearable filterable size="small" disabled>
            <el-option v-for="r in state.ageUnitList" :key="r.id" :label="r.name" :value="r.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column property="warningRange" label="警告范围" width="120">
        <template #default="scope">
          <span>{{ scope.row.warningRange }}</span>
        </template>
      </el-table-column>
      <el-table-column property="referenceRange" label="参考范围" width="120">
        <template #default="scope">
          <span>{{ scope.row.referenceRange }}</span>
        </template>
      </el-table-column>
      <el-table-column property="criticalRange" label="危急范围" width="120">
        <template #default="scope">
          <span>{{ scope.row.criticalRange }}</span>
        </template>
      </el-table-column>
      <el-table-column property="displayRange" label="报告显示范围" width="120">
        <template #default="scope">
          <span>{{ scope.row.displayRange }}</span>
        </template>
      </el-table-column>
      <el-table-column property="sort" label="排序" width="90">
        <template #default="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column v-auths="[perms.delete]" label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <BaseItemReferenceForm ref="baseItemReferenceFormRef" :title="state.FormTitle"></BaseItemReferenceForm>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, onMounted, defineAsyncComponent } from 'vue'
import { BaseItemReferenceAddInput, BaseItemReferenceOutput } from '/@/api/lims/basedata/datacontract/itemreference-datacontract'
import { BaseItemReferenceApi } from '/@/api/lims/basedata/baseitemreference'
import { DictApi } from '/@/api/admin/Dict'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { BaseItemOutput } from '/@/api/lims/basedata/datacontract/item-datacontract'
import { BaseEntrustHospitalApi } from '/@/api/lims/basedata/baseentrusthospital'
import { BaseEntrustHospitalOutput } from '/@/api/lims/basedata/datacontract/entrusthospital-datacontract'
import modal from '/@/globalProperties/modal'
import eventBus from '/@/utils/mitt'
import { auth, auths, authAll } from '/@/utils/authFunction'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'

const BaseItemReferenceForm = defineAsyncComponent(() => import('./base-item-reference-form.vue'))
const baseItemReferenceFormRef = ref()

//权限配置
const perms = {
  add: 'api:lims:base-item-reference:add',
  update: 'api:lims:base-item-reference:update',
  delete: 'api:lims:base-item-reference:delete',
}
const actionColWidth = 135

const state = reactive({
  tableData: [] as BaseItemReferenceAddInput[],
  resultTypeList: [] as DictGetListDto[] | null,
  genderList: [] as DictGetListDto[] | null,
  methodList: [] as DictGetListDto[] | null,
  ageUnitList: [] as DictGetListDto[] | null,
  currItem: {} as BaseItemOutput,
  entrustHosList: [] as BaseEntrustHospitalOutput[],
  loading: false,
  FormTitle: '',
  sampleTypeList: [] as BaseSampleTypeOutput[],
})

onMounted(async () => {
  new DictApi().getList(['ResultType', 'Method', 'Gender', 'AgeUnit']).then((res) => {
    state.resultTypeList = res.data!.resultType
    state.methodList = res.data!.method
    state.genderList = res.data!.gender
    state.ageUnitList = res.data!.ageUnit
  })
  await new BaseSampleTypeApi()
    .getAll()
    .then((res) => {
      state.sampleTypeList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
  eventBus.off('refreshBaseItemReference')
  eventBus.on('refreshBaseItemReference', async () => {
    refreshItemReference(state.currItem)
  })
})

const searchEntrustHos = (query: string) => {
  if (query) {
    state.loading = true
    let param = {
      currentPage: 1,
      pageSize: 10,
      filter: {
        entrustHospitalCode: query,
      },
    }
    new BaseEntrustHospitalApi().getPage(param).then((res) => {
      state.entrustHosList = res.data?.list ?? []
      state.loading = false
    })
  } else {
    state.entrustHosList = []
  }
}

const refreshItemReference = (item: BaseItemOutput) => {
  state.currItem = item
  if (!state.currItem || !state.currItem?.itemCode) return
  new BaseItemReferenceApi().getItemReference({ itemCode: state.currItem.itemCode! }).then((res) => {
    state.tableData = res.data!
  })
}
const onAdd = () => {
  if (!state.currItem || !state.currItem?.itemCode) {
    modal.alertError('请选中项目！')
    return
  }
  state.FormTitle = '新增参考范围'
  baseItemReferenceFormRef.value.open({}, state.currItem)
}
const onEdit = (row: BaseItemReferenceOutput) => {
  if (!state.currItem || !state.currItem?.itemName) {
    modal.alertError('请选中项目！')
    return
  }
  state.FormTitle = '新增参考范围'
  baseItemReferenceFormRef.value.open(row, state.currItem)
}
const onDelete = (row: BaseItemReferenceOutput) => {
  modal
    .confirmDelete(`确定要删除？`, undefined)
    .then(async () => {
      await new BaseItemReferenceApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      refreshItemReference(state.currItem)
    })
    .catch(() => {})
}

watch(
  () => ({}) as BaseItemReferenceAddInput,
  (newValues, oldValues) => {
    // if (newValues.resultType !== oldValues.resultType) {
    //   console.log(`resultType changed from ${oldValues.resultType} to ${newValues.resultType}`)
    // }
  },
  {
    deep: true,
  }
)
const defaultToAdd = (): BaseItemReferenceAddInput => {
  return {
    groupCode: state.currItem?.groupCode,
    itemCode: state.currItem?.itemCode,
    resultType: null,
    method: null,
    customerCode: null,
    instrumentCode: null,
    reagentCode: null,
    sampleTypeCode: null,
    genderCode: null,
    entrustHospitalCode: null,
    ageLowLimit: 0,
    ageUpperLimit: 200,
    ageUnit: '101',
    warningRange: null,
    referenceRange: null,
    criticalRange: null,
    remark: null,
    sort: 0,
    isValid: true,
  } as BaseItemReferenceAddInput
}

defineExpose({
  refreshItemReference,
})
</script>

<style scoped lang="scss">
.referenceContainer {
  display: flex;
}
</style>

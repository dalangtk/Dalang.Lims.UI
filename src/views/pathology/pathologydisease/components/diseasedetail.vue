<template>
  <div class="my-flex-column w100 h100">
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.subDiseaseListData"
      ref="table"
      :show-paging="false"
      :show-toolbox="false"
      size="small"
      :loading="state.loading"
      stripe
    >
      <template #headerButton>
        <el-button v-if="auth(perms.add)" type="primary" size="small" @click="onAdd">
          <SvgIcon name="ele-Plus" />
          新增</el-button
        >
      </template>
      <el-table-column prop="subDiseaseCode" label="子疾病代码" show-overflow-tooltip width />
      <el-table-column prop="subDiseaseName" label="子疾病名称" show-overflow-tooltip width />
      <el-table-column v-auths="[perms.delete]" label="操作" width="70" fixed="right">
        <template #default="{ row }">
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <SubDiseaseSelect ref="subDiseaseSelectRef" @confirm="onSubDiseaseSelectConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import SubDiseaseSelect from './subdiseaseselect.vue'
import { BasePathologyDiseaseOutput } from '/@/api/lims/pathology/datacontract/pathologydisease-datacontract'
import { BasePathologyDiseaseDetailOutput } from '/@/api/lims/pathology/datacontract/pathologydiseasedetail-datacontract'
import MyTable from '/@/components/my-table/index.vue'
import { auth } from '/@/utils/authFunction'
import { BasePathologyDiseaseApi } from '/@/api/lims/pathology/pathologydisease'
import modal from '/@/globalProperties/modal'
//权限配置
const perms = {
  add: 'api:lims:base-pathology-sub-disease:add',
  delete: 'api:lims:base-pathology-sub-disease:delete',
}
const subDiseaseSelectRef = ref()

const props = defineProps({
  currDisease: {
    type: Object as () => BasePathologyDiseaseOutput,
    default: null,
  },
})
const state = reactive({
  subDiseaseListData: [] as BasePathologyDiseaseDetailOutput[],
  loading: false,
})
const onAdd = () => {
  if (!props.currDisease) return
  subDiseaseSelectRef.value.open()
}
const onSubDiseaseSelectConfirm = (val: Array<BasePathologyDiseaseDetailOutput>) => {
  // console.log(val)
  // state.subDiseaseListData = val.map((item) => ({
  //   diseaseCode: props.currDisease.diseaseCode,
  //   ...item,
  // }))

  let param = val.map((item) => ({
    diseaseCode: props.currDisease.diseaseCode,
    ...item,
  }))

  new BasePathologyDiseaseApi().addDiseaseDetail(param).then((res) => {
    if (res.success) {
      state.loading = false
      refreshDiseaseDetail()
    }
  })
}
const onDelete = (row: BasePathologyDiseaseDetailOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.subDiseaseName}】?`, null)
    .then(async () => {
      new BasePathologyDiseaseApi().deleteDiseaseDetail({ id: row.id! }).then((res) => {
        if (res.success) {
          state.loading = false
          refreshDiseaseDetail()
        }
      })
    })
    .catch(() => {})
}
const refreshDiseaseDetail = () => {
  if (!props.currDisease) return
  new BasePathologyDiseaseApi().getDiseaseDetails({ diseaseCode: props.currDisease.diseaseCode! }).then((res) => {
    state.subDiseaseListData = res.data || []
  })
}

defineExpose({
  refreshDiseaseDetail,
})
</script>

<style scoped lang="scss">
.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

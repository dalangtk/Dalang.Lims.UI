<template>
  <div class="my-flex-column w100 h100">
    <MyTable
      border
      tableName="baseGroup"
      class="my-table"
      :data="state.sampleTypeList"
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
      <el-table-column prop="sampleTypeCode" label="样本类型代码" show-overflow-tooltip width />
      <el-table-column prop="sampleTypeName" label="样本类型名称" show-overflow-tooltip width />
      <el-table-column v-auths="[perms.delete]" label="操作" width="70" fixed="right">
        <template #default="{ row }">
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <SampleTypeSelect ref="sampleTypeSelectRef" @confirm="onSampleTypeSelectConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import SampleTypeSelect from './sampletypeselect.vue'
import { BasePathologySampleTypeOutput } from '/@/api/lims/pathology/datacontract/pathologysampletype-datacontract'
import { BasePathologySamplingSpotOutput } from '/@/api/lims/pathology/datacontract/pathologysamplingspot-datacontract'
import { BasePathologySamplingSpotDetailOutput } from '/@/api/lims/pathology/datacontract/pathologysamplingspotdetail-datacontract'
import { BasePathologySamplingSpotApi } from '/@/api/lims/pathology/pathologysamplingspot'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { auth } from '/@/utils/authFunction'
//权限配置
const perms = {
  add: 'api:lims:base-pathology-sample-type:add',
  delete: 'api:lims:base-pathology-sample-type:delete',
}
const sampleTypeSelectRef = ref()

const props = defineProps({
  currSamplingSpot: {
    type: Object as () => BasePathologySamplingSpotOutput,
    default: null,
  },
})
const state = reactive({
  sampleTypeList: [] as BasePathologySampleTypeOutput[],
  loading: false,
})
const onAdd = () => {
  if (!props.currSamplingSpot) return
  sampleTypeSelectRef.value.open()
}
const onSampleTypeSelectConfirm = (val: Array<BasePathologySampleTypeOutput>) => {
  console.log('val',val)
  let param = val.map((item) => ({
    samplingSpotCode: props.currSamplingSpot.samplingSpotCode!,
    ...item,
  }))

  new BasePathologySamplingSpotApi().addSamplingSpotDetail(param).then((res) => {
    if (res.success) {
      state.loading = false
      refreshSamplingSpotDetail()
    }
  })
}
const onDelete = (row: BasePathologySamplingSpotDetailOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.sampleTypeName}】?`, null)
    .then(async () => {
      new BasePathologySamplingSpotApi().deleteSamplingSpotDetail({ id: row.id! }).then((res) => {
        if (res.success) {
          state.loading = false
          refreshSamplingSpotDetail()
        }
      })
    })
    .catch(() => {})
}
const refreshSamplingSpotDetail = () => {
  if (!props.currSamplingSpot) return
  new BasePathologySamplingSpotApi().getSamplingSpotDetails({ samplingSpotCode: props.currSamplingSpot.samplingSpotCode! }).then((res) => {
    state.sampleTypeList = res.data || []
  })
}

defineExpose({
  refreshSamplingSpotDetail,
})
</script>

<style scoped lang="scss">
.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

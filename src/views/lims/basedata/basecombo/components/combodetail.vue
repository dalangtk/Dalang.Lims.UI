<template>
  <div class="combo-detail">
    <MyTable :data="state.comboDetail" :show-paging="false" :show-toolbox="false">
      <template #headerButton v-if="!props.readonly">
        <el-button type="primary" size="small" @click="addComboDetail">
          <SvgIcon name="ele-Plus" />
          新增</el-button
        >
      </template>
      <el-table-column prop="" type="index" width="50" />
      <el-table-column prop="groupName" label="组别" show-overflow-tooltip width />
      <el-table-column prop="purCode" label="目的代码" show-overflow-tooltip width />
      <el-table-column prop="purName" label="目的名称" show-overflow-tooltip width />
      <el-table-column :width="100" fixed="right">
        <template #default="{ row }">
          <el-button text type="danger" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <BasePurposeTransfer ref="purposeTransferRef" :on-confirm="confirmSelectPurpose" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import MyTable from '/@/components/my-table/index.vue'
import { BaseComboDetailOutput } from '/@/api/lims/basedata/datacontract/combo-datacontract'
import BasePurposeTransfer from '/@/views/lims/basedata/basepurpose/components/purpose-transfer.vue'
import { BasePurposeOutput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import { BaseComboApi } from '/@/api/lims/basedata/basecombo'
import modal from '/@/globalProperties/modal'

const purposeTransferRef = ref()

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
})

const state = reactive({
  comboDetail: [] as BaseComboDetailOutput[],
})

const refreshDetail = (comboCode: string) => {
  new BaseComboApi().getComboDetail({ comboCode }).then((res) => {
    if (res?.success) {
      state.comboDetail = res.data!
    }
  })
}

const getComboDetail = () => {
  return state.comboDetail
}

const addComboDetail = () => {
  purposeTransferRef.value.open()
}

const confirmSelectPurpose = (purposes: BasePurposeOutput[]) => {
  console.log('selectedpurposes', purposes)

  purposes.forEach((item) => {
    if (state.comboDetail.find((a) => a.purCode === item.purCode)) return
    state.comboDetail.push({
      id: 0,
      groupName: item.groupName,
      purCode: item.purCode,
      purName: item.purName,
    })
  })
}
const onDelete = (row: BaseComboDetailOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.purName}】?`, null)
    .then(async () => {
      state.comboDetail = state.comboDetail.filter((a) => a.id !== row.id)
    })
    .catch(() => {})
}
defineExpose({
  refreshDetail,
  getComboDetail,
})
</script>

<style scoped lang="scss"></style>

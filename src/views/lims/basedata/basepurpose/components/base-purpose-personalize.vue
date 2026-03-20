<template>
  <div>
    <!-- <el-button size="small" type="primary" @click="onAdd">add</el-button> -->
    <MyTable
      border
      tableName="目的定制"
      class="my-table"
      :data="DetailModel.purposePersonalizes"
      ref="table"
      :loading="state.loading"
      stripe
      :show-paging="false"
      v-on:pageOrSizeChange="refreshBasePurposePersonalize"
    >
      <template #headerButton>
        <div>
          <el-tag type="primary" size="small">目的定制</el-tag>
          <el-button type="primary" size="small" @click="onAdd" style="margin-left: 5px">
            <SvgIcon name="ele-Plus" />
            新增</el-button
          >
        </div>
      </template>
      <el-table-column prop="sampleTypeName" label="标本类型" show-overflow-tooltip width />
      <el-table-column prop="purNamePersonalize" label="个性化目的名称" show-overflow-tooltip width />
      <el-table-column prop="customerCode" label="客户代码" show-overflow-tooltip width />
      <el-table-column prop="sort" label="排序" show-overflow-tooltip width />
      <el-table-column prop="isValid" label="状态" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.isValid === true ? 'success' : 'warning'">
            {{ row.isValid === true ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-auths="[perms.delete]" label="操作" :width="actionColWidth" fixed="right">
        <template #default="{ row }">
          <el-button v-auth="perms.update" icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button text type="danger" v-if="auth(perms.delete)" @click="onDelete(row)" icon="ele-Delete">删除</el-button>
        </template>
      </el-table-column>
    </MyTable>

    <base-purpose-personalize-form
      @PersonalizeConfirm="personalizeConfirm"
      ref="basePurposePersonalizeFormRef"
      :title="state.basePurposePersonalizeFormTitle"
    ></base-purpose-personalize-form>
  </div>
</template>

<script lang="ts" setup>
import modal from '/@/globalProperties/modal'
import other from '/@/utils/other'
import { auth, authAll } from '/@/utils/authFunction'
import MyTable from '/@/components/my-table/index.vue'
import { BasePurposePersonalizeApi } from '/@/api/lims/basedata/basepurpose'
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import {
  BasePurposePersonalizeAddInput,
  BasePurposePersonalizeOutput,
  BasePurposePersonalizeUpdateInput,
  PurposeDetailInput,
} from '/@/api/lims/basedata/datacontract/purpose-datacontract'

// 引入组件
const BasePurposePersonalizeForm = defineAsyncComponent(() => import('./base-purpose-personalize-form.vue'))
var table = ref()
const basePurposePersonalizeFormRef = ref()

const emit = defineEmits(['beginWatchPurPersonalize'])

const DetailModel = defineModel({
  type: Object as () => PurposeDetailInput,
  default: {} as PurposeDetailInput,
})

//权限配置
const perms = {
  add: 'api:lims:base-purpose-personalize:add',
  update: 'api:lims:base-purpose-personalize:update',
  delete: 'api:lims:base-purpose-personalize:delete',
  batDelete: 'api:lims:base-purpose-personalize:batch-delete',
  softDelete: 'api:lims:base-purpose-personalize:soft-delete',
  batSoftDelete: 'api:lims:base-purpose-personalize:batch-soft-delete',
}

const actionColWidth = authAll([perms.update, perms.softDelete]) || authAll([perms.update, perms.delete]) ? 135 : 70

const state = reactive({
  loading: false,
  basePurposePersonalizeFormTitle: '',
})

onMounted(() => {})

const refreshBasePurposePersonalize = () => {
  onQuery()
}

const onQuery = async () => {
  state.loading = true
  const res = await new BasePurposePersonalizeApi().getPurposePersonalizeList({ purcode: DetailModel.value.purpose.purCode }).catch(() => {
    state.loading = false
  })

  DetailModel.value.purposePersonalizes = res?.data ?? []
  state.loading = false
  beginWatch()
}

const onAdd = () => {
  state.basePurposePersonalizeFormTitle = '新增目的定制'
  basePurposePersonalizeFormRef.value.open()
}

const onEdit = (row: BasePurposePersonalizeOutput) => {
  state.basePurposePersonalizeFormTitle = '编辑目的定制'
  basePurposePersonalizeFormRef.value.open(row)
}

const onDelete = (row: BasePurposePersonalizeOutput | BasePurposePersonalizeOutput) => {
  modal
    .confirmDelete(`确定要删除个性化?`, null)
    .then(() => {
      if (row.id <= 0) {
        DetailModel.value.purposePersonalizes = DetailModel.value.purposePersonalizes!.filter((v) => v.uid !== row.uid)
      } else {
        DetailModel.value.purposePersonalizes = DetailModel.value.purposePersonalizes!.filter(
          (v: BasePurposePersonalizeAddInput | BasePurposePersonalizeUpdateInput) => (v as BasePurposePersonalizeUpdateInput).id !== row.id
        )
      }
    })
    .catch(() => {})
}
const personalizeConfirm = (obj: BasePurposePersonalizeOutput) => {
  if (obj.id <= 0) {
    obj.uid = other.getGuid()
    obj.purCode = DetailModel.value.purpose.purCode
  }
  // console.log('obj', obj)
  DetailModel.value.purposePersonalizes!.push(obj)
}

const beginWatch = () => {
  emit('beginWatchPurPersonalize')
}
defineExpose({
  refreshBasePurposePersonalize,
})
</script>
<style scoped>
.my-container {
  padding-top: 10px;
}

.my-table {
  flex: 1;
  overflow: hidden;
}
</style>

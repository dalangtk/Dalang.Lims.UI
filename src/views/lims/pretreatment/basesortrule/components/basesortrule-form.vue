<template>
  <div>
    <el-dialog
      v-model="state.showDialog"
      :title="title"
      draggable
      destroy-on-close
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="my-dialog-form"
    >
      <el-row :gutter="10" class="sortruleeditform">
        <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
          <el-form ref="formRef" :model="form" size="default" label-width="auto" style="flex: 1">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item label="组别代码" prop="groupCode" v-show="editItemIsShow(true, true)">
                  <el-select @change="groupChange" v-model="state.form.groupCode" filterable clearable>
                    <el-option v-for="item in state.groupList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规则代码" prop="ruleCode" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.ruleCode" placeholder="规则代码"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规则名称" prop="ruleName" v-show="editItemIsShow(true, true)">
                  <el-input v-model="state.form.ruleName" placeholder="规则名称"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="序列代码" prop="sequenceCode" v-show="editItemIsShow(true, true)">
                  <!-- <el-input v-model="state.form.sequenceCode" placeholder="序列代码" filterable remote :remote-method="querySequence"> </el-input> -->
                  <el-select v-model="state.form.sequenceCode" placeholder="序列代码" filterable clearable remote :remote-method="querySequence">
                    <el-option v-for="item in state.sequenceList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="匹配项目数" prop="itemCount" v-show="editItemIsShow(true, true)">
                  <el-input-number v-model="state.form.itemCount"> </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分拣所有" prop="isSortAll" v-show="editItemIsShow(true, true)">
                  <el-checkbox v-model="state.form.isSortAll" placeholder="是否分拣所有"> </el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批量规则" prop="isBatch" v-show="editItemIsShow(true, true)">
                  <el-checkbox v-model="state.form.isBatch" placeholder="是否批量规则"> </el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
                  <el-input-number v-model="state.form.sort" placeholder="排序"> </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="启用" prop="isValid" v-show="editItemIsShow(true, true)">
                  <el-switch v-model="state.form.isValid" placeholder="启用"> </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>规则</span>
                <el-button type="primary" @click="clearExpression">清空</el-button>
              </div>
            </template>
            <MyFilter ref="myFilterRef" :fields="props.filterFields" :size="state.filterSize"></MyFilter>
          </el-card>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="lims/base-sort-rule/form">
import { reactive, toRefs, getCurrentInstance, ref, onMounted, defineAsyncComponent, nextTick } from 'vue'
import { BaseSortRuleAddInput, BaseSortRuleUpdateInput } from '/@/api/lims/pretreatment/datacontract/sortrule-datacontract'
import { BaseSortRuleApi } from '/@/api/lims/pretreatment/basesortrule'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
const MyFilter = defineAsyncComponent(() => import('/@/components/my-filter/index.vue'))
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import modal from '/@/globalProperties/modal'
import { getGroupAllList, remoteQueryCustomer, remoteQueryGroup, remoteQueryPurpose, remoteQuerySequence } from '/@/utils/commonSelectRemoteQuery'

import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  filterFields: {
    type: Array,
    default: () => [],
  },
})

const { proxy } = getCurrentInstance() as any

const formRef = ref()
let myFilterRef = ref()

const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as BaseSortRuleAddInput | BaseSortRuleUpdateInput | any,
  groupList: [] as LabelValueType[],
  filterSize: 'small',
  dataTree: {} as any,
  sequenceList: [] as LabelValueType[],
})
const { form } = toRefs(state)

onMounted(async () => {
  const groupList = await getGroupAllList()
  state.groupList = groupList

  await querySequence('')
})

const querySequence = async (query: string) => {
  const sequenceList = await remoteQuerySequence(query)
  state.sequenceList = sequenceList
}

// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseSortRuleApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseSortRuleUpdateInput
      let filter = JSON.parse(state.form.ruleExpression)
      setTimeout(() => {
        console.log(myFilterRef.value)
        setOptions(filter)
        myFilterRef.value.setFilter(filter)
      }, 100)
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}
const setOptions = (data: any) => {
  if (data.filters) {
    for (let i = data.filters.length - 1; i >= 0; i--) {
      if (data.logic == 0) {
        data.logic = 'And'
      } else if (data.logic == 1) {
        data.logic = 'Or'
      }
      if (data.filters[i].allOptions) {
        data.filters[i].options = data.filters[i].allOptions
      }
      if (data.filters[i].filters) {
        setOptions(data.filters[i])
      }
    }
  }
}
const onNameChange = (val: string) => {
  state.form.pinYin = makePy(state.form.instrumentName)
  state.form.wuBi = makeWb(state.form.instrumentName)
}
const groupChange = (val: string) => {
  state.form.groupName = state.groupList.find((item) => item.value == val)?.label
}
const defaultToAdd = (): BaseSortRuleAddInput => {
  return {
    groupCode: '',
    groupName: '',
    ruleCode: '',
    ruleName: '',
    ruleExpression: null,
    sequenceCode: null,
    itemCount: 0,
    isSortAll: false,
    isBatch: false,
    sort: 0,
    isValid: true,
    proId: null,
    proName: null,
    proTime: new Date(),
    modId: null,
    modName: null,
    modTime: null,
    isModified: false,
  } as BaseSortRuleAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    state.dataTree = myFilterRef.value.getDynamicFilter()

    console.log('state.dataTree', JSON.stringify(state.dataTree))

    state.form.ruleExpressionObj = state.dataTree //JSON.stringify()
    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BaseSortRuleApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseSortRuleApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseSortRule')
      state.showDialog = false
    }
  })
}

const editItemIsShow = (add: Boolean, edit: Boolean): Boolean => {
  if (add && edit) return true
  let isEdit = state.form.id != undefined && state.form.id > 0
  if (add && !isEdit) return true
  if (edit && isEdit) return true
  return false
}
const clearExpression = () => {
  let filter = myFilterRef.value.getDynamicFilter()
  console.log(filter)
  state.dataTree = filter
  myFilterRef.value.reset()
}
defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.sortruleeditform {
  display: flex;
  flex-direction: row;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>

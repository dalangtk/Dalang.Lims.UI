<template>
  <div>
    <vxe-modal :title="title" v-model="state.showDialog" height="70%" width="60%" show-maximize show-footer>
      <div class="dialog-content">
        <div class="sorterinfo">
          <el-form ref="formRef" :model="form" size="default" label-width="auto" :rules="rules">
            <el-row :gutter="15">
              <el-col :span="24" v-show="editItemIsShow(true, false)">
                <el-form-item label="分拣仪代码" prop="sorterCode">
                  <el-input v-model="state.form.sorterCode" placeholder="分拣仪代码"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-show="editItemIsShow(true, true)">
                <el-form-item label="分拣仪名称" prop="sorterName">
                  <el-input v-model="state.form.sorterName" placeholder="分拣仪名称"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-show="editItemIsShow(true, true)">
                <el-form-item label="架子数" prop="shelfCount">
                  <el-input v-model="state.form.shelfCount" placeholder="架子数"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-show="editItemIsShow(true, true)">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="state.form.remark" placeholder="备注"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-show="editItemIsShow(true, true)">
                <el-form-item label="排序" prop="sort">
                  <el-input-number v-model="state.form.sort" placeholder="排序"> </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-show="editItemIsShow(true, true)">
                <el-form-item label="启用" prop="isValid">
                  <el-switch v-model="state.form.isValid" placeholder="启用"> </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="sorterdetail">
          <SorterShelf v-if="state.showDialog" ref="sortshelf" style="" :sorter-info="state.form"></SorterShelf>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </vxe-modal>
  </div>
</template>

<script lang="ts" setup name="lims/base-sorter/form">
import { reactive, toRefs, getCurrentInstance, ref, defineAsyncComponent } from 'vue'
import { BaseSorterApi } from '/@/api/lims/pretreatment/basesorter'
import { auth, auths, authAll } from '/@/utils/authFunction'
const MyDialog = defineAsyncComponent(() => import('/@/components/my-dialog/index.vue'))

import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'
import { BaseSorterAddInput, BaseSorterUpdateInput } from '/@/api/lims/pretreatment/datacontract/basesorter-datacontract'
import { BaseSorterShelfOutput } from '/@/api/lims/pretreatment/datacontract/basesortershelf-datacontract'
import modal from '/@/globalProperties/modal'
import { BaseSorterShelfApi } from '/@/api/lims/pretreatment/basesortershelf'
import { BaseSorterShelfRuleOutput } from '/@/api/lims/pretreatment/datacontract/basesortershelfrule-datacontract'
import type { FormInstance, FormRules } from 'element-plus'

const SorterShelf = defineAsyncComponent(() => import('./sortershelf.vue'))

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const { proxy } = getCurrentInstance() as any

const formRef = ref()
const sortshelf = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as BaseSorterAddInput | BaseSorterUpdateInput | any,
  isFullscreen: false,
})
const { form } = toRefs(state)
const rules = reactive<FormRules<any>>({
  sorterCode: [{ required: true, message: '请输入代码', trigger: 'blur' }],
  sorterName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
})
// 打开对话框
const open = async (row: any = {}) => {
  if (formRef.value) formRef.value.resetFields()
  if (row.id > 0) {
    const res = await new BaseSorterApi().get({ id: row.id }, { loading: true, showErrorMessage: true }).catch(() => {
      modal.closeLoading()
      return
    })
    if (res?.success) {
      state.form = res.data as BaseSorterUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const onNameChange = (val: string) => {
  state.form.pinYin = makePy(state.form.instrumentName)
  state.form.wuBi = makeWb(state.form.instrumentName)
}

const defaultToAdd = (): BaseSorterAddInput => {
  return {
    sorterCode: null,
    sorterName: null,
    shelfCount: 16,
    remark: null,
    sort: 0,
    isValid: true,
    proId: null,
    proName: null,
    proTime: new Date(),
    modId: null,
    modName: null,
    modTime: null,
    isModified: false,
  } as BaseSorterAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}
const findDuplicateGroups = (shelfRuleAllList: any[]) => {
  const grouped = shelfRuleAllList.reduce((acc: Record<string, any[]>, item: any) => {
    const key = `${item.sortRuleCode}_${item.shelfPosition}`
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  // 返回重复的分组信息
  return Object.entries(grouped)
    .filter(([key, items]) => items.length > 1)
    .map(([key, items]) => ({
      sortRuleCode: items[0].sortRuleCode,
      sortRuleName: items[0].sortRuleName,
      shelfPosition: items[0].shelfPosition,
      count: items.length,
      items: items,
    }))
}
// 确定
const onSure = () => {
  let modified = sortshelf.value.getModified()

  let aa = findDuplicateGroups(modified.shelfRuleList)
  if (aa.length > 0) {
    let msg = `架子${aa[0].shelfPosition},规则【${aa[0].items[0].sortRuleName}】设置重复！`
    modal.alertError(msg)
    return
  }
  //console.log('findDuplicateGroups', aa)
  //console.log('getModified', modified)
  //return
  let param = {
    sorterInfo: state.form,
    sorterShelfList: [] as BaseSorterShelfOutput[],
    sorterShelfRuleList: [] as BaseSorterShelfRuleOutput[],
  }
  param.sorterShelfList = modified.shelfList.filter((v: any) => v.rowStatus != 0)
  param.sorterShelfRuleList = modified.shelfRuleList.filter((v: any) => v.rowStatus != 0)

  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BaseSorterApi().update(param, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseSorterApi().add(param, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseSorter')
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

defineExpose({
  open,
})
</script>
<style scoped lang="scss">
.dialog-content {
  display: flex;
  height: 100%;
  flex-direction: row;
  overflow: hidden;
}
.sorterinfo {
  width: 30%;
}
.sorterdetail {
  margin-left: 10px;
  width: 70%;
  overflow: hidden;
}
</style>

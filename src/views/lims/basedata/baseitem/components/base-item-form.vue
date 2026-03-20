<template>
  <el-dialog
    v-model="state.showDialog"
    :title="title"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="my-dialog-form"
  >
    <el-form ref="formRef" :model="state.form" size="small" label-width="auto">
      <el-row :gutter="5">
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="组别" prop="baseItem.groupCode" :rules="[{ required: true, message: '请选择组别', trigger: ['blur', 'change'] }]">
            <el-select @change="groupChange" v-model="state.form.baseItem.groupCode" filterable clearable>
              <el-option v-for="item in state.groupList" :key="item.groupCode" :label="item.groupName" :value="item.groupCode"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item
            label="项目代码"
            prop="baseItem.itemCode"
            :rules="[{ required: true, message: '请输入项目代码', trigger: ['blur', 'change'] }]"
          >
            <el-input v-model="state.form.baseItem.itemCode" clearable :disabled="editItemIsDisable(false, true)" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item
            label="项目名称"
            prop="baseItem.itemName"
            :rules="[{ required: true, message: '请输入项目名称', trigger: ['blur', 'change'] }]"
          >
            <el-input v-model="state.form.baseItem.itemName" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item
            label="结果类型"
            prop="baseItem.resultType"
            v-show="editItemIsShow(true, true)"
            :rules="[{ required: true, message: '请选择结果类型', trigger: ['blur', 'change'] }]"
          >
            <el-select v-model="state.form.baseItem.resultType" placeholder="请选择" clearable filterable>
              <el-option v-for="r in state.resultTypeList" :key="r.id" :label="r.name" :value="r.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item
            label="判定方式"
            prop="baseItem.decideType"
            v-show="editItemIsShow(true, true)"
            :rules="[{ required: true, message: '请选择判定方式', trigger: ['blur', 'change'] }]"
          >
            <el-select v-model="state.form.baseItem.decideType" placeholder="请选择" clearable filterable>
              <el-option v-for="r in state.decideTypeList" :key="r.id" :label="r.name" :value="r.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="简称" prop="baseItem.itemNameAB">
            <el-input v-model="state.form.baseItem.itemNameAB" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="英文" prop="baseItem.itemNameEN">
            <el-input v-model="state.form.baseItem.itemNameEN" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="个性名称" prop="baseItemPersonal.itemNamePersonalize">
            <template #label>
              <span class="label-personal-color">个性名称</span>
            </template>
            <el-input v-model="state.form.baseItemPersonal.itemNamePersonalize" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="计算项" prop="baseItemPersonal.isCalculcate">
            <template #label>
              <span class="label-personal-color">计算项</span>
            </template>
            <el-switch v-model="state.form.baseItemPersonal.isCalculcate" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="计算公式" prop="baseItemPersonal.calcExpression">
            <template #label>
              <span class="label-personal-color">计算公式</span>
            </template>
            <el-input v-model="state.form.baseItemPersonal.calcExpression" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="方法学" prop="baseItemPersonal.methodCode">
            <template #label>
              <span class="label-personal-color">方法学</span>
            </template>
            <el-select v-model="state.form.baseItemPersonal.methodCode" filterable clearable>
              <el-option v-for="item in state.methodList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="项目单位" prop="baseItemPersonal.itemUnit">
            <template #label>
              <span class="label-personal-color">项目单位</span>
            </template>
            <el-input v-model="state.form.baseItemPersonal.itemUnit" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="结果精度" prop="baseItemPersonal.resultAccuracy">
            <template #label>
              <span class="label-personal-color">结果精度</span>
            </template>
            <el-input v-model="state.form.baseItemPersonal.resultAccuracy" type="number" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="默认结果" prop="baseItemPersonal.defaultValue">
            <template #label>
              <span class="label-personal-color">默认结果</span>
            </template>
            <el-input v-model="state.form.baseItemPersonal.defaultValue" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="调整系数" prop="baseItemPersonal.resultCoefficient">
            <template #label>
              <span class="label-personal-color">调整系数</span>
            </template>
            <el-input v-model="state.form.baseItemPersonal.resultCoefficient" type="number" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="报告显示" prop="baseItemPersonal.isReportShow">
            <template #label>
              <span class="label-personal-color">报告显示</span>
            </template>
            <el-switch v-model="state.form.baseItemPersonal.isReportShow" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="结果复核" prop="baseItemPersonal.isReviewResult">
            <template #label>
              <span class="label-personal-color">结果复核</span>
            </template>
            <el-switch v-model="state.form.baseItemPersonal.isReviewResult" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="必须参考范围" prop="baseItemPersonal.isMustReference">
            <template #label>
              <span class="label-personal-color">必须参考范围</span>
            </template>
            <el-switch v-model="state.form.baseItemPersonal.isMustReference" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="打印排序" prop="baseItemPersonal.printOrder">
            <template #label>
              <span class="label-personal-color">打印排序</span>
            </template>
            <el-input v-model="state.form.baseItemPersonal.printOrder" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="方法依据" prop="baseItemPersonal.methodBasis">
            <template #label>
              <span class="label-personal-color">方法依据</span>
            </template>
            <el-input v-model="state.form.baseItemPersonal.methodBasis" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="排序" prop="baseItem.sort">
            <el-input-number v-model="state.form.baseItem.sort" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="启用" prop="baseItem.isValid">
            <el-switch v-model="state.form.baseItem.isValid" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel" size="default">取 消</el-button>
        <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import {
  BaseItemAddInput,
  BaseItemPersonalizeAddInput,
  BaseItemPersonalizeUpdateInput,
  BaseItemUpdateInput,
  ItemWithPersonalAddInput,
  ItemWithPersonalUpdateInput,
} from '/@/api/lims/basedata/datacontract/item-datacontract'
import { BaseItemApi } from '/@/api/lims/basedata/baseitem'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import eventBus from '/@/utils/mitt'
import modal from '/@/globalProperties/modal'
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const formRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {
    baseItem: {} as BaseItemAddInput | BaseItemUpdateInput | any,
    baseItemPersonal: {} as BaseItemPersonalizeAddInput | BaseItemPersonalizeUpdateInput | any,
  } as ItemWithPersonalAddInput | ItemWithPersonalUpdateInput | any,

  groupList: [] as BaseGroupOutput[],
  resultTypeList: [] as DictGetListDto[] | null,
  decideTypeList: [] as DictGetListDto[] | null,
  methodList: [] as DictGetListDto[] | null,
})
// const { form } = toRefs(state)

onMounted(async () => {
  new DictApi().getList(['ResultType', 'DecideType', 'Method']).then((res) => {
    state.resultTypeList = res.data!.resultType
    state.decideTypeList = res.data!.decideType
    state.methodList = res.data!.method
  })

  new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.groupList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
})
// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseItemApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })
    if (res?.success) {
      state.form.baseItem = res.data?.baseItem as BaseItemUpdateInput
      state.form.baseItemPersonal = res.data?.baseItemPersonal as BaseItemPersonalizeUpdateInput
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const defaultToAdd = (): ItemWithPersonalAddInput => {
  return {
    baseItem: {
      itemCode: '',
      itemName: '',
      groupCode: '',
      groupName: '',
      itemNameAB: null,
      itemNameEN: null,
      sort: 0,
      isValid: true,
      proTime: new Date(),
      proId: null,
      proName: null,
      modId: null,
      modName: null,
      modTime: null,
      isModified: false,
    } as BaseItemAddInput,
    baseItemPersonal: {
      itemCode: '',
      itemNamePersonalize: null,
      itemNameAB: '',
      itemNameEN: '',
      resultType: '',
      decideType: '',
      isCalculcate: false,
      calcExpression: '',
      methodCode: '',
      itemUnit: '',
      resultAccuracy: null,
      defaultValue: '',
      resultCoefficient: null,
      isReportShow: true,
      isReviewResult: false,
      isMustReference: false,
      resultExplain: '',
      printOrder: '',
      methodBasis: '',
      itemStaticType: '',
      itemSeriesType: '',
      pinYin: '',
      wuBi: '',
      remark: '',
      isValid: true,
    } as BaseItemPersonalizeAddInput,
  }
}

const groupChange = (val: string) => {
  state.form.baseItem.groupName = state.groupList.find((item) => item.groupCode == val)?.groupName
}
// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  // return
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    state.sureLoading = true
    let res = {} as any
    if (state.form.baseItem.id != undefined && state.form.baseItem.id > 0) {
      state.form.baseItemPersonal.itemCode = state.form.baseItem.itemCode
      res = await new BaseItemApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      state.form.baseItemPersonal.itemCode = state.form.baseItem.itemCode
      res = await new BaseItemApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseItem')
      state.showDialog = false
    }
  })
}

const editItemIsShow = (add: Boolean, edit: Boolean): Boolean => {
  if (add && edit) return true
  let isEdit = state.form.baseItem.id != undefined && state.form.baseItem.id > 0
  if (add && !isEdit) return true
  if (edit && isEdit) return true
  return false
}
const editItemIsDisable = (add: Boolean, edit: Boolean): Boolean => {
  if (add && edit) return true
  let isEdit = state.form.baseItem.id != undefined && state.form.baseItem.id > 0
  if (add && !isEdit) return true
  if (edit && isEdit) return true
  return false
}

defineExpose({
  open,
})
</script>

<style scoped>
.itemformcontainer {
  display: flex;
  flex-direction: row;
}
.label-personal-color {
  color: blue;
}
</style>

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
      <el-form ref="formRef" :model="form" size="default" label-width="auto">
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item label="结果类型" prop="resultType" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.resultType" placeholder="请选择" clearable filterable>
                <el-option v-for="r in state.resultTypeList" :key="r.id" :label="r.name" :value="r.value" />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="方法学" prop="method" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.method" placeholder="请选择" clearable filterable>
                <el-option v-for="r in state.methodList" :key="r.id" :label="r.name" :value="r.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户代码" prop="customerCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.customerCode" placeholder="客户代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器" prop="instrumentCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.instrumentCode" placeholder="仪器"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试剂" prop="reagentCode" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.reagentCode" placeholder="试剂"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标本类型" prop="sampleTypeCode" v-show="editItemIsShow(true, true)">
              <!-- <el-input v-model="state.form.sampleTypeCode" placeholder="标本类型"> </el-input> -->
              <el-select v-model="state.form.sampleTypeCode" placeholder="请选择标本类型" clearable filterable>
                <el-option v-for="r in state.sampleTypeList" :key="r.id" :label="r.sampleTypeName" :value="r.sampleTypeCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="genderCode" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.genderCode" placeholder="请选择性别" clearable filterable>
                <el-option v-for="r in state.genderList" :key="r.id" :label="r.name" :value="r.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="委托医院" prop="entrustHospitalCode" v-show="editItemIsShow(true, true)">
              <el-select
                v-model="state.form.entrustHospitalCode"
                placeholder="请选择委托医院"
                clearable
                filterable
                remote
                :remote-method="searchEntrustHos"
                remote-show-suffix
                :loading="state.loading"
              >
                <el-option v-for="r in state.entrustHosList" :key="r.id" :label="r.entrustHospitalName" :value="r.entrustHospitalCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄下限" prop="ageLowLimit" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.ageLowLimit" placeholder="年龄下限"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄上限" prop="ageUpperLimit" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.ageUpperLimit" placeholder="年龄上限"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄单位" prop="ageUnit" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.ageUnit" placeholder="请选择年龄单位" clearable filterable>
                <el-option v-for="r in state.ageUnitList" :key="r.id" :label="r.name" :value="r.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="警告范围" prop="warningRange" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.warningRange" placeholder="警告范围"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参考范围" prop="referenceRange" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.referenceRange" placeholder="参考范围"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报告范围" prop="displayRange" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.displayRange" placeholder="报告范围"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="危急值范围" prop="criticalRange" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.criticalRange" placeholder="危急值范围"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.remark" placeholder="备注"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
              <el-input-number v-model="state.form.sort" />
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
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { BaseItemReferenceAddInput, BaseItemReferenceUpdateInput } from '/@/api/lims/basedata/datacontract/itemreference-datacontract'
import { BaseItemReferenceApi } from '/@/api/lims/basedata/baseitemreference'
import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'
import { BaseItemOutput } from '/@/api/lims/basedata/datacontract/item-datacontract'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseEntrustHospitalApi } from '/@/api/lims/basedata/baseentrusthospital'
import { BaseEntrustHospitalOutput } from '/@/api/lims/basedata/datacontract/entrusthospital-datacontract'
import modal from '/@/globalProperties/modal'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'

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
  loading: false,
  form: {} as BaseItemReferenceAddInput | BaseItemReferenceUpdateInput | any,
  genderList: [] as DictGetListDto[] | null,
  methodList: [] as DictGetListDto[] | null,
  ageUnitList: [] as DictGetListDto[] | null,
  entrustHosList: [] as BaseEntrustHospitalOutput[],
  sampleTypeList: [] as BaseSampleTypeOutput[],
})
const { form } = toRefs(state)

onMounted(async () => {
  new DictApi().getList(['ResultType', 'Method', 'Gender', 'AgeUnit']).then((res) => {
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
})
// 打开对话框
const open = async (row: any = {}, itemInfo: BaseItemOutput) => {
  if (row.id > 0) {
    const res = await new BaseItemReferenceApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseItemReferenceUpdateInput
    }
  } else {
    state.form = defaultToAdd(itemInfo)
  }
  state.showDialog = true
}

const defaultToAdd = (itemInfo: BaseItemOutput): BaseItemReferenceAddInput => {
  return {
    groupCode: itemInfo.groupCode,
    itemCode: itemInfo.itemCode,
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

// 取消
const onCancel = () => {
  state.showDialog = false
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BaseItemReferenceApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseItemReferenceApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false
    if (res?.success) {
      eventBus.emit('refreshBaseItemReference')
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

defineExpose({
  open,
})
</script>

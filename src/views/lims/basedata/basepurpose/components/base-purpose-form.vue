<template>
  <div>
    <el-dialog
      v-model="state.showDialog"
      :title="title"
      draggable
      :show-close="false"
      v-if="state.showDialog"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="pdlg"
      :fullscreen="state.isFullScreen"
      :before-close="beforeclose"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="dialogheader">
          <h4 :id="titleId" :class="titleClass">{{ title }}</h4>
          <div>
            <el-button link @click="fullScreen">
              <SvgIcon name="ele-FullScreen" />
            </el-button>
            <el-button link @click="close">
              <SvgIcon name="ele-Close" />
            </el-button>
          </div>
        </div>
      </template>
      <div class="pcontainer">
        <div class="purposeform">
          <div class="purheader">
            <el-form class="purform" ref="formRef" :model="state.purposeModel" size="default" label-width="auto">
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item
                    label="组别"
                    prop="purpose.groupCode"
                    :rules="[{ required: true, message: '请选择组别', trigger: ['blur', 'change'] }]"
                  >
                    <el-select @change="groupChange" v-model="state.purposeModel.purpose.groupCode" filterable clearable>
                      <el-option v-for="item in state.groupList" :key="item.groupCode" :label="item.groupName" :value="item.groupCode"> </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="目的代码" prop="purCode" v-show="editItemIsShow(true, true)">
                    <el-input v-model="state.purposeModel.purpose.purCode" placeholder="目的代码"> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="目的名称" prop="purName" v-show="editItemIsShow(true, true)">
                    <el-input v-model="state.purposeModel.purpose.purName" placeholder="目的名称" @change="onNameChange"> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="目的简写" prop="purNameAB" v-show="editItemIsShow(true, true)">
                    <el-input v-model="state.purposeModel.purpose.purNameAB" placeholder="目的简写"> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="目的英文" prop="purNameEN" v-show="editItemIsShow(true, true)">
                    <el-input v-model="state.purposeModel.purpose.purNameEN" placeholder="目的英文"> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="临床意义" prop="clinicalSence" v-show="editItemIsShow(true, true)">
                    <el-input v-model="state.purposeModel.purpose.clinicalSence" placeholder="临床意义"> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="建议与解释" prop="suggestions" v-show="editItemIsShow(true, true)">
                    <el-input v-model="state.purposeModel.purpose.suggestions" placeholder="建议与解释"> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
                    <el-input v-model="state.purposeModel.purpose.remark" placeholder="备注"> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="标本类型" prop="sampleTypeCodeList" v-show="editItemIsShow(true, true)">
                    <el-select v-model="state.purposeModel.purpose.sampleTypeCodeList" multiple filterable clearable placeholder="标本类型">
                      <el-option
                        v-for="item in state.sampleTypeList"
                        :key="item.sampleTypeCode"
                        :label="item.sampleTypeName"
                        :value="item.sampleTypeCode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="录入隐藏" prop="isInputHide" v-show="editItemIsShow(true, true)">
                    <template #label>
                      <span class="label-tenantsetting-color">录入隐藏</span>
                    </template>
                    <el-switch v-model="state.purposeModel.purposeTenantSetting.isInputHide" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="工作流" prop="workFlowType" v-show="editItemIsShow(true, true)">
                    <template #label>
                      <span class="label-tenantsetting-color">工作流</span>
                    </template>
                    <el-input v-model="state.purposeModel.purposeTenantSetting.workFlowType" placeholder="工作流" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="检测计划" prop="examPlan" v-show="editItemIsShow(true, true)">
                    <template #label>
                      <span class="label-tenantsetting-color">检测计划</span>
                    </template>
                    <el-select
                      v-model="state.purposeModel.purposeTenantSetting.examPlan"
                      filterable
                      remote
                      clearable
                      :remote-method="queryExamPlan"
                      placeholder="检测计划"
                    >
                      <el-option v-for="item in state.examPlanList" :key="item.examPlanCode" :label="item.examPlanName" :value="item.examPlanCode" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="检测班次" prop="testShift" v-show="editItemIsShow(true, true)">
                    <template #label>
                      <span class="label-tenantsetting-color">检测班次</span>
                    </template>
                    <el-select v-model="state.purposeModel.purposeTenantSetting.testShift" clearable placeholder="检测班次">
                      <el-option v-for="item in state.testShiftList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="检测性别" prop="testSex" v-show="editItemIsShow(true, true)">
                    <template #label>
                      <span class="label-tenantsetting-color">检测性别</span>
                    </template>
                    <el-select v-model="state.purposeModel.purposeTenantSetting.testSex" multiple filterable clearable placeholder="检测性别">
                      <el-option v-for="item in state.genderList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="存储条件" prop="storageCondition" v-show="editItemIsShow(true, true)">
                    <template #label>
                      <span class="label-tenantsetting-color">存储条件</span>
                    </template>
                    <el-input v-model="state.purposeModel.purposeTenantSetting.storageCondition" placeholder="存储条件" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="存储周期" prop="storageCycle" v-show="editItemIsShow(true, true)">
                    <template #label>
                      <span class="label-tenantsetting-color">存储周期</span>
                    </template>
                    <el-input v-model="state.purposeModel.purposeTenantSetting.storageCycle" placeholder="存储周期" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="启用" prop="isEnable" v-show="editItemIsShow(true, true)">
                    <template #label>
                      <span class="label-tenantsetting-color">启用</span>
                    </template>
                    <el-switch v-model="state.purposeModel.purposeTenantSetting.isEnable" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                  <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
                    <el-input-number v-model="state.purposeModel.purpose.sort" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="purfotter">
            <BasePurposePersonalize
              @BeginWatchPurPersonalize="watchpurposepersonal"
              ref="basePurposePersonalizeRef"
              v-model="state.purposeModel"
            ></BasePurposePersonalize>
          </div>
        </div>
        <div class="pdetail">
          <PurposeDetail @BeginWatchPurDetail="watchpurposedetail" ref="purposeDetailRef" v-model="state.purposeModel" />
        </div>
      </div>
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
import { reactive, watch, ref, onMounted, defineAsyncComponent, nextTick } from 'vue'
import {
  BasePurposeAddInput,
  BasePurposeDetailOutput,
  BasePurposeTenantSettingAddInput,
  BasePurposeTenantSettingUpdateInput,
  BasePurposeUpdateInput,
  PurposeDetailInput,
} from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import { BasePurposeApi } from '/@/api/lims/basedata/basepurpose'

import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import modal from '/@/globalProperties/modal'
import { BaseInstrumentItemOutput } from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'
import PurposeDetail from './purpose-detail.vue'
const purposeDetailRef = ref()
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'

import BasePurposePersonalize from './base-purpose-personalize.vue'
import { CodeNameOutput, DictGetListDto, DictGetOutput } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseExamPlanListOutput, BaseExamPlanOutput, BaseExamPlanQueryListInput } from '/@/api/lims/basedata/datacontract/examplan-datacontract'
import { BaseExamPlanApi } from '/@/api/lims/basedata/baseexamplan'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
const basePurposePersonalizeRef = ref()
//用来监听目的是否改变，没改变不提交保存
//let purposeWatch: any = null
let purposeDetailWatch: any = null
let purposePersonalWatch: any = null
//let purposeChanged = false
let purposeDetailChanged = false
let purposePersonalChanged = false

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
  isFullScreen: false,
  groupList: [] as BaseGroupOutput[],
  testShiftList: [] as Array<CodeNameOutput>,
  examPlanList: [] as BaseExamPlanListOutput[],
  curPurDetailList: [] as Array<BasePurposeDetailOutput>,
  curPurInstrumentItemList: [] as Array<BaseInstrumentItemOutput>,
  purposeModel: {
    purpose: {},
    purposeItemDetail: [],
    purposeInstrumentItem: [],
    purposePersonalizes: [],
    purposeTenantSetting: {},
  } as PurposeDetailInput,
  genderList: [] as DictGetListDto[] | null,
  sampleTypeList: [] as BaseSampleTypeOutput[],
  getExamPlanPageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: {},
  } as GetPageInput<BaseExamPlanQueryListInput>,
})

onMounted(async () => {
  await new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.groupList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })

  queryExamPlan('')

  await new BaseSampleTypeApi()
    .getAll()
    .then((res) => {
      state.sampleTypeList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
  new DictApi().getList(['Gender']).then((res) => {
    state.genderList = res.data!.gender
  })
  state.testShiftList = [
    { code: '101', name: '白班' },
    { code: '102', name: '晚班' },
    { code: '103', name: '/' },
  ]
})
const queryExamPlan = (query: string) => {
  state.getExamPlanPageInput.filter!.examPlanCode = query
  new BaseExamPlanApi().getPage(state.getExamPlanPageInput).then((res) => {
    state.examPlanList = res!.data!.list!
  })
}
// 打开对话框
const open = async (row: any = {}) => {
  let isRefresh = false
  if (row.id > 0) {
    const res = await new BasePurposeApi().getPurposeWithTenantSetting({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })
    if (res?.success) {
      state.purposeModel.purpose = res.data?.basePurpose as BasePurposeUpdateInput
      state.purposeModel.purposeTenantSetting = res.data?.basePurposeTenantSetting as BasePurposeTenantSettingUpdateInput
      if (!state.purposeModel.purposeTenantSetting) {
        state.purposeModel.purposeTenantSetting = defaultToAddTenantSetting()
      }
      if (state.purposeModel.purpose.sampleTypeCode) {
        state.purposeModel.purpose.sampleTypeCodeList = state.purposeModel.purpose.sampleTypeCode.split(',')
      } else {
        state.purposeModel.purpose.sampleTypeCodeList = []
      }
      isRefresh = true
      //watchpurpose()
    }
  } else {
    //watchpurpose()
    state.purposeModel.purpose = defaultToAddPurpose()
  }
  state.showDialog = true
  nextTick(() => {
    if (isRefresh) {
      purposeDetailRef?.value?.refreshDetailItem()
      basePurposePersonalizeRef.value.refreshBasePurposePersonalize()
    }
  })
}
// const watchpurpose = () => {
//   if (purposeWatch == null) {
//     purposeWatch = watch(
//       () => state.purposeModel.purpose,
//       (newValue, oldValue) => {
//         purposeChanged = true
//       },
//       { deep: true }
//     )
//   }
// }
const watchpurposedetail = () => {
  if (purposeDetailWatch == null) {
    purposeDetailWatch = watch(
      () => state.purposeModel.purposeItemDetail,
      (newValue, oldValue) => {
        purposeDetailChanged = true
      },
      { deep: true }
    )
  }
}
const watchpurposepersonal = () => {
  if (purposePersonalWatch == null) {
    purposePersonalWatch = purposeDetailWatch = watch(
      () => state.purposeModel.purposePersonalizes,
      (newValue, oldValue) => {
        purposePersonalChanged = true
      },
      { deep: true }
    )
  }
}
const fullScreen = () => {
  state.isFullScreen = !state.isFullScreen
}
const onNameChange = (val: string) => {
  state.purposeModel.purpose.purNameAB = makePy(val)
}

const defaultToAddPurpose = (): BasePurposeAddInput => {
  return {
    groupCode: '',
    groupName: '',
    purCode: '',
    purName: '',
    purNameAB: null,
    purNameEN: null,
    sampleTypeCode: null,
    sampleTypeCodeList: null,
    sampleTypeName: null,
    clinicalSence: null,
    suggestions: null,
    remark: null,
    sort: 0,
    isValid: true,
  } as BasePurposeAddInput
}
const defaultToAddTenantSetting = (): BasePurposeTenantSettingAddInput => {
  return {
    isEnable: true,
    isInputHide: false,
    workFlowType: '',
    examPlan: '',
    testShift: '103',
    testSeries: '',
    testSex: '',
    storageCondition: '',
    storageCycle: '',
    sort: 0,
    isValid: true,
  } as BasePurposeTenantSettingAddInput
}
const beforeclose = (done: Function) => {
  cancelWatch()
  done()
}

// 取消
const onCancel = () => {
  state.showDialog = false
  cancelWatch()
}

// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    state.sureLoading = true

    // if (!purposeChanged) {
    //
    // }
    // if (!purposeDetailChanged) {
    //   state.purposeModel.purposeItemDetail = null
    // }
    // if (!purposePersonalChanged) {
    //   state.purposeModel.purposePersonalizes = null
    // }

    state.purposeModel.purposePersonalizes?.forEach((item) => {
      if (item.purCode === '') {
        item.purCode = state.purposeModel.purpose.purCode
      }
    })
    state.purposeModel.purposeTenantSetting.purCode = state.purposeModel.purpose.purCode
    let res = {} as any
    if (state.purposeModel.purpose.sampleTypeCodeList && state.purposeModel.purpose.sampleTypeCodeList.length > 0) {
      state.purposeModel.purpose.sampleTypeCode = state.purposeModel.purpose.sampleTypeCodeList.join(',')
    }
    if (state.purposeModel.purpose.id != undefined && state.purposeModel.purpose.id > 0) {
      // console.log(JSON.stringify(state.purposeModel))

      res = await new BasePurposeApi().update(state.purposeModel, { showSuccessMessage: true }).catch((e) => {
        // console.log(e)
        state.sureLoading = false
      })
    } else {
      res = await new BasePurposeApi().add(state.purposeModel, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      cancelWatch()
      eventBus.emit('refreshBasePurpose')
      state.showDialog = false
    }
  })
}
const groupChange = (val: string) => {
  state.purposeModel.purpose.groupName = state.groupList.find((item) => item.groupCode == val)?.groupName!
}
const editItemIsShow = (add: Boolean, edit: Boolean): Boolean => {
  if (add && edit) return true
  let isEdit = state.purposeModel.purpose.id != undefined && state.purposeModel.purpose.id > 0
  if (add && !isEdit) return true
  if (edit && isEdit) return true
  return false
}
const cancelWatch = () => {
  //purposeWatch?.stop()
  purposeDetailWatch?.stop()
  purposePersonalWatch?.stop()
  //purposeWatch = null
  purposeDetailWatch = null
  purposePersonalWatch = null
}
defineExpose({
  open,
})
</script>
<style>
.pdlg {
  width: 80% !important;
  height: 80% !important;
  > .el-dialog__body {
    height: calc(100% - 120px);
  }
}
</style>
<style scoped>
.pcontainer {
  display: flex;
  height: calc(100% - 10px);
  .purposeform {
    width: 50%;
    display: flex;
    flex-direction: column;
    .purheader {
      height: 70%;
      overflow-y: auto;
      margin: auto;
      .purform {
        width: calc(100% - 10px);
      }
    }
    .purfotter {
      height: 30%;
    }
  }
  .pdetail {
    margin-left: 10px;
    width: 50%;
    height: 100%;
  }
}
.dialogheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
.label-tenantsetting-color {
  color: blue;
}
</style>

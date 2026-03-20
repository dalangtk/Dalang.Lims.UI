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
          <el-col :span="12">
            <el-form-item
              label="规则代码"
              prop="ruleCode"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请输入规则代码', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="state.form.ruleCode" placeholder="规则代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="规则名称"
              prop="ruleName"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请输入规则名称', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="state.form.ruleName" placeholder="规则名称"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="规则描述"
              prop="ruleDescription"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请输入规则描述', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="state.form.ruleDescription" placeholder="规则描述"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="规则内容"
              prop="ruleExpression"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请输入规则内容', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="state.form.ruleExpression" placeholder="规则内容"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组别" prop="groupCode" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.groupCode" multiple clearable>
                <el-option v-for="item in state.groupList" :key="item.groupCode" :label="item.groupName" :value="item.groupCode"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="判断类型" prop="judgeType" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.judgeType" clearable>
                <el-option v-for="item in state.judgeTypes" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作流" prop="workFlowType" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.workFlowType" placeholder="工作流"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的代码" prop="purCodes" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.purCodes" placeholder="目的代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目代码" prop="itemCodes" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.itemCodes" placeholder="项目代码"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完全包含" prop="isAllContains" v-show="editItemIsShow(true, true)">
              <el-checkbox v-model="state.form.isAllContains" label="完全包含" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提示类型" prop="noticeType" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.noticeType" clearable>
                <el-option v-for="item in state.noticeTypes" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="提示消息"
              prop="noticeMessage"
              v-show="editItemIsShow(true, true)"
              :rules="[{ required: true, message: '请输入提示消息', trigger: ['blur', 'change'] }]"
            >
              <el-input v-model="state.form.noticeMessage" placeholder="提示消息"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则等级" prop="ruleProperty" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.ruleProperty" placeholder="规则等级"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核类型" prop="auditType" v-show="editItemIsShow(true, true)">
              <el-select v-model="state.form.auditType" clearable>
                <el-option v-for="item in state.auditTypes" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.remark" placeholder="备注"> </el-input>
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
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="lims/base-audit-rule/form">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { BaseAuditRuleApi } from '/@/api/lims/basedata/baseauditrule'
import { BaseAuditRuleAddInput, BaseAuditRuleUpdateInput } from '/@/api/lims/basedata/datacontract/auditrule-datacontract'

import { makePy, makeWb } from '/@/utils/cuscode'
import eventBus from '/@/utils/mitt'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import modal from '/@/globalProperties/modal'
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import { CodeNameOutput } from '/@/api/admin/data-contracts'

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
  groupList: [] as BaseGroupOutput[],
  judgeTypes: [] as Array<CodeNameOutput>,
  noticeTypes: [] as Array<CodeNameOutput>,
  auditTypes: [] as Array<CodeNameOutput>,
  form: {} as BaseAuditRuleAddInput | BaseAuditRuleUpdateInput | any,
})
const { form } = toRefs(state)

onMounted(async () => {
  await new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.groupList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })

  state.judgeTypes = [
    { code: 0, name: '项目' },
    { code: 1, name: '信息' },
  ]
  state.noticeTypes = [
    { code: 0, name: '警告' },
    { code: 1, name: '禁止' },
  ]
  state.auditTypes = [
    { code: 0, name: '单个' },
    { code: 1, name: '批量' },
  ]
})
// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseAuditRuleApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseAuditRuleUpdateInput
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

const defaultToAdd = (): BaseAuditRuleAddInput => {
  return {
    tenantId: 0,
    ruleCode: '',
    ruleName: '',
    ruleDescription: '',
    ruleExpression: '',
    groupCode: null,
    judgeType: 0,
    workFlowType: null,
    purCodes: null,
    itemCodes: null,
    isAllContains: false,
    noticeType: 0,
    noticeMessage: null,
    ruleProperty: 0,
    remark: null,
    sort: 0,
    isValid: true,
  } as BaseAuditRuleAddInput
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
      res = await new BaseAuditRuleApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseAuditRuleApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseAuditRule')
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

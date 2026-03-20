<template>
  <el-dialog v-model="state.dialogShow">
    <el-form :model="state.form" label-width="auto">
      <el-form-item label="规则名称">
        <el-input v-model="state.form.ruleCode" clearable></el-input>
      </el-form-item>
      <el-form-item label="检验Id" :rules="[{ required: true, message: '请输入检验Id', trigger: ['blur', 'change'] }]">
        <el-input v-model="state.form.examInfoId" clearable></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="state.auditResult">
      <el-table-column prop="ruleCode" label="规则代码" show-overflow-tooltip width />
      <el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip width />
      <el-table-column prop="isTrigger" label="是否触发" show-overflow-tooltip width>
        <template #default="scope">
          <el-tag v-if="scope.row.isTrigger == true" type="success">是</el-tag>
          <el-tag v-if="scope.row.isTrigger == false">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="noticeType" label="提示类型" show-overflow-tooltip width>
        <template #default="scope">
          <el-tag v-if="scope.row.noticeType == 0" type="warning">警告</el-tag>
          <el-tag v-if="scope.row.noticeType == 1" type="danger">禁止</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="noticeMessage" label="提示消息" show-overflow-tooltip width />
      <el-table-column prop="isException" label="是否异常" show-overflow-tooltip width>
        <template #default="scope">
          <el-tag v-if="scope.row.isException == true" type="danger">是</el-tag>
          <el-tag v-if="scope.row.isException == false">否</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.dialogShow = false" size="default">关 闭</el-button>
        <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">测 试</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { BaseAuditRuleOutput, TestRuleDto } from '/@/api/lims/basedata/datacontract/auditrule-datacontract'
import { BaseAuditRuleApi } from '/@/api/lims/basedata/baseauditrule'
import modal from '/@/globalProperties/modal'

const state = reactive({
  form: {
    ruleCode: '',
    examInfoId: null,
  },
  dialogShow: false,
  auditRule: {} as BaseAuditRuleOutput,
  auditResult: [] as TestRuleDto[],
  sureLoading: false,
})

const open = (row: BaseAuditRuleOutput) => {
  state.auditRule = row
  state.form.ruleCode = row.ruleCode!
  state.auditResult = []
  state.dialogShow = true
}

const onSure = async () => {
  if (!state.form.examInfoId) {
    modal.msgError('请输入检验Id')
    return
  }
  state.sureLoading = true
  await new BaseAuditRuleApi()
    .testRule(
      {
        examInfoId: state.form.examInfoId,
        ruleCode: state.form.ruleCode,
        showDetail: true,
        executeType: 0,
      },
      { loading: true, showErrorMessage: true }
    )
    .then((res) => {
      if (res.success) {
        if (res.data) {
          console.log(res.data)
          let triggerRules = res.data.triggerRules
          if (triggerRules) {
            state.auditResult = triggerRules
          }
        }
      }
    })
    .finally(() => {
      state.sureLoading = false
    })
}

defineExpose({ open })
</script>

<style scoped lang="scss"></style>

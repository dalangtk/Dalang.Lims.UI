<template>
  <div>
    <el-dialog
      v-model="state.showDialog"
      :title="title"
      draggable
      destroy-on-close
      fullscreen
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-if="state.wfCode" class="dialog-body">
        <div class="left-panel">
          <el-form ref="formRef" :model="form" size="default" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="模板代码" prop="templateCode">
                  <el-input v-model="state.form.templateCode" placeholder="请输入模板代码" clearable disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="工作流代码" prop="wfCode">
                  <el-input v-model="state.form.wfCode" placeholder="请输入工作流代码" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="模板名称" prop="templateName">
                  <el-input v-model="state.form.templateName" placeholder="请输入模板名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="模板类型" prop="templateType">
                  <el-select v-model="state.form.templateType" placeholder="请选择模板类型">
                    <el-option v-for="item in templateTypeList" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="默认结果" prop="isDefaultResult">
                  <el-switch v-model="state.form.isDefaultResult" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="有效状态" prop="isValid">
                  <el-switch v-model="state.form.isValid" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="客户代码" prop="customerCodes">
                  <el-input v-model="state.form.customerCodes" placeholder="请输入客户代码，多个用逗号分隔" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="state.form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div class="right-panel">
          <div class="template-editor">
            <div class="editor-header">
              <span>模板内容编辑</span>
            </div>
            <div class="editor-content">
              <div v-if="!currentEditorComponent" class="loading-placeholder">
                <el-empty description="请选择有效的工作流代码" />
              </div>
              <component v-else ref="pathologyTemplateInputRef" :is="currentEditorComponent" />
            </div>
          </div>
        </div>
      </div>

      <template v-else>
        <el-form ref="formRef" :model="form" size="default" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-alert type="warning" show-icon>请选择具有工作流代码的记录进行编辑</el-alert>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button v-if="state.wfCode" type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="pathology/base-pathology-template/form">
import { reactive, toRefs, getCurrentInstance, ref, defineAsyncComponent, watch, computed, nextTick } from 'vue'
import { BasePathologyTemplateAddInput, BasePathologyTemplateUpdateInput } from '/@/api/lims/pathology/datacontract/pathologytemplate-datacontract'
import { BasePathologyTemplateApi } from '/@/api/lims/pathology/pathologytemplate'
import { auth, auths, authAll } from '/@/utils/authFunction'
import eventBus from '/@/utils/mitt'
import { makePy, makeWb } from '/@/utils/cuscode'

// 动态导入不同wfcode对应的编辑组件
const editorComponents: Record<string, any> = {
  tct: () => import('/@/views/pathology/tct/components/tctinput.vue'),

  // histology: () => import('/@/views/pathology/histology/components/histologyinput-mod.vue'),
  // biopsy: () => import('/@/views/pathology/biopsy/components/biopsyinput-mod.vue'),
}

defineProps({
  title: {
    type: String,
    default: '',
  },
  wfCode: {
    type: String,
    default: '',
  },
  rowData: {
    type: Object,
    default: () => ({}),
  },
})

const { proxy } = getCurrentInstance() as any
const emit = defineEmits(['update:wfCode', 'update:rowData'])

const pathologyTemplateInputRef = ref()
const formRef = ref()

const templateTypeList = [
  { label: '诊断模板', value: 1 },
  { label: '巨检模板', value: 2 },
]
const state = reactive({
  showDialog: false,
  sureLoading: false,
  wfCode: '',
  rowData: {} as any,
  form: {} as BasePathologyTemplateAddInput | BasePathologyTemplateUpdateInput | any,
})
const { form } = toRefs(state)

// 计算当前编辑组件
const currentEditorComponent = computed(() => {
  if (!state.wfCode) return null

  const componentLoader = editorComponents[state.wfCode]
  if (!componentLoader) return null

  return defineAsyncComponent(componentLoader)
})

// 打开对话框
const open = async (row: any = {}, wfCode: string = '') => {
  state.wfCode = wfCode
  state.rowData = row
  console.log('打开对话框:', row, wfCode)
  emit('update:wfCode', wfCode)
  emit('update:rowData', row)

  // 先打开对话框，这样动态组件才能挂载
  state.showDialog = true

  if (row.id > 0) {
    const res = await new BasePathologyTemplateApi().get({ id: row.id }, { loading: true }).catch(() => {
      proxy.$modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BasePathologyTemplateUpdateInput
      // 等待动态组件挂载完成后再调用 setResult
      await nextTick()
      // 再等待一个 nextTick 确保组件完全挂载
      await nextTick()
      if (pathologyTemplateInputRef.value && typeof pathologyTemplateInputRef.value.setResult === 'function') {
        if (state.form.templateContent) {
          let tctRes = JSON.parse(state.form.templateContent)
          console.log('模板内容:', tctRes)
          pathologyTemplateInputRef.value.setResult(tctRes)
        }
      }
    }
  } else {
    state.form = defaultToAdd()
    state.form.wfCode = wfCode
  }
}

const onNameChange = (val: string) => {
  state.form.pinYin = makePy(state.form.instrumentName)
  state.form.wuBi = makeWb(state.form.instrumentName)
}

const defaultToAdd = (): BasePathologyTemplateAddInput => {
  return {
    tenantId: 0,
    wfCode: null,
    templateCode: null,
    templateName: null,
    templateContent: null,
    diagnosisResult: null,
    remark: null,
    customerCodes: null,
    customerType: null,
    templateType: 1,
    isDefaultResult: null,
    sort: 0,
    isValid: true,
    proTime: new Date(),
    proId: 0,
    proName: '',
    modId: null,
    modName: null,
    modTime: null,
    isModified: false,
  } as BasePathologyTemplateAddInput
}

const onTemplateContentChange = (content: any) => {
  state.form.templateContent = content
  console.log('模板内容变更:', content)
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

    // 获取模板内容
    if (pathologyTemplateInputRef.value && typeof pathologyTemplateInputRef.value.getResult === 'function') {
      const templateContent = await pathologyTemplateInputRef.value.getResult()
      state.form.templateContent = JSON.stringify(templateContent)
    }
    console.log('模板内容:', state.form.templateContent)
    // return
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BasePathologyTemplateApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BasePathologyTemplateApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBasePathologyTemplate')
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

<style scoped>
.dialog-body {
  display: flex;
  height: 100%;
  gap: 20px;
}

.left-panel {
  width: 400px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid #ebeef5;
  padding-right: 20px;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.template-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.editor-header {
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: 500;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  min-height: 200px;
}

.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 300px;
}

:deep(.el-form-item) {
  margin-bottom: 15px;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

:deep(.el-dialog) {
  margin: 0 auto !important;
}

:deep(.el-dialog__body) {
  padding: 10px 20px !important;
}
</style>

<template>
  <div>
    <el-dialog
      v-model="state.showDialog"
      destroy-on-close
      :title="title"
      draggable
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <el-form :model="form" ref="formRef" size="default" label-width="110px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="任务分组" prop="groupName" :rules="[{ required: true, message: '请输入任务分组', trigger: ['blur', 'change'] }]">
              <el-input v-model="form.groupName" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="任务标题" prop="taskName" :rules="[{ required: true, message: '请输入任务标题', trigger: ['blur', 'change'] }]">
              <el-input v-model="form.taskName" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="定时类型" prop="triggerType" :rules="[{ required: true, message: '请选择定时类型', trigger: ['change'] }]">
              <el-select v-model="form.triggerType" placeholder="请选择定时类型" style="width: 150px" @change="onIntervalChange">
                <el-option v-for="item in state.triggerTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-space fill class="w100">
              <el-form-item label="间隔时间" prop="interval" :rules="[{ required: true, message: '请输入间隔时间', trigger: ['blur', 'change'] }]">
                <el-input v-model="form.interval" clearable>
                  <template #append v-if="form.triggerType === 1">
                    <el-button icon="ele-Clock" @click="onOpenCronDialog" />
                  </template>
                </el-input>
              </el-form-item>
              <el-alert type="info" :closable="false" v-if="form.triggerType === 2"> simple模式单位为秒 </el-alert>
            </el-space>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="任务类型" prop="triggerType" :rules="[{ required: true, message: '请选择任务类型', trigger: ['change'] }]">
              <el-select v-model="form.taskType" placeholder="请选择任务类型" style="width: 150px" @change="onIntervalChange">
                <el-option v-for="item in state.taskTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-space fill class="w100">
              <el-form-item
                v-if="form.taskType === 1"
                label="Api地址"
                prop="apiUrl"
                :rules="[{ required: true, message: '请输入Api地址', trigger: ['blur', 'change'] }]"
              >
                <el-input v-model="form.apiUrl" clearable />
              </el-form-item>
              <el-form-item
                v-else
                label="Dll名称"
                prop="dllName"
                :rules="[{ required: true, message: '请输入dll名称', trigger: ['blur', 'change'] }]"
              >
                <el-input v-model="form.dllName" clearable />
              </el-form-item>
              <el-alert v-if="form.taskType === 2" type="info" :closable="false"> 格式：dllName.dll;nameSpace.className.methodName </el-alert>
            </el-space>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.taskType === 1">
            <el-form-item label="访问类型" prop="apiRequestType" :rules="[{ required: true, message: '请选择访问类型', trigger: ['change'] }]">
              <el-select v-model="form.apiRequestType" placeholder="请选择访问类型" style="width: 150px" @change="onIntervalChange">
                <el-option v-for="item in state.apiRequestTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-space fill class="w100">
              <el-form-item label="任务参数" prop="taskParameter">
                <el-input v-model="form.taskParameter" clearable />
              </el-form-item>
              <el-alert type="info" :closable="false">
                Api参数格式：?param1=value1<span v-pre>&</span>param2=value2
                <br />
                Dll参数格式：1,2,3
              </el-alert>
            </el-space>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.taskType === 1">
            <el-space fill class="w100">
              <el-form-item label="请求头" prop="apiRequestHeader">
                <el-input v-model="form.apiRequestHeader" type="textarea" :rows="3" clearable />
              </el-form-item>
              <el-alert type="info" :closable="false">
                请求头格式：key:value,多个请求头，换行分隔，每行一条
                <br />
                例：Authorization: Bearer token123456
              </el-alert>
            </el-space>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.taskType === 1">
            <el-space fill class="w100">
              <el-form-item label="请求body" prop="apiRequestBody">
                <el-input v-model="form.apiRequestBody" type="textarea" :rows="3" clearable />
              </el-form-item>
            </el-space>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="form.taskType === 1">
            <el-form-item label="超时时间" prop="apiTimeOut">
              <el-input v-model="form.apiTimeOut" type="number" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="任务描述" prop="describe">
              <el-input v-model="form.describe" clearable />
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

    <MyCronDialog ref="myCronDialogRef" @fill="onFillCron"></MyCronDialog>

    <JsonEditorDialog ref="jsonEditorDialogRef" @sure="onSureArgs"></JsonEditorDialog>
  </div>
</template>

<script lang="ts" setup name="admin/task/form">
import { reactive, toRefs, ref, defineAsyncComponent } from 'vue'
import { QuartzTaskUpdateInput } from '/@/api/admin/data-contracts'
import { QuartzTaskApi } from '/@/api/admin/QuartzTask'
import { cloneDeep } from 'lodash-es'
import eventBus from '/@/utils/mitt'

const MyCronDialog = defineAsyncComponent(() => import('/@/components/my-cron/dialog.vue'))

const JsonEditorDialog = defineAsyncComponent(() => import('./json-editor-dialog.vue'))

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const formRef = ref()
const myCronDialogRef = ref()
const jsonEditorDialogRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as QuartzTaskUpdateInput,
  triggerTypes: [
    { label: 'Cron', value: 1 },
    { label: 'Simple', value: 2 },
  ],
  taskTypes: [
    { label: 'Api', value: 1 },
    { label: 'Dll', value: 2 },
  ],
  apiRequestTypes: [
    { label: 'POST', value: 'POST' },
    { label: 'GET', value: 'GET' },
  ],
})

const { form } = toRefs(state)

//确定Cron表达式
const onFillCron = (value: any) => {
  form.value.interval = value
}

//确定任务参数
const onSureArgs = (task: any) => {}

// 打开对话框
const open = async (row: QuartzTaskUpdateInput = { id: 0 }) => {
  let formData = cloneDeep(row) as QuartzTaskUpdateInput
  if (row.id) {
    const res = await new QuartzTaskApi().get({ id: row.id }, { loading: true })

    if (res?.success) {
      formData = res.data as QuartzTaskUpdateInput
    }
  } else {
    formData.triggerType = 1
    formData.taskType = 1
    formData.apiRequestType = 'GET'
    formData.apiTimeOut = 60000
  }

  state.form = formData
  state.showDialog = true
}

//打开Cron对话框
const onOpenCronDialog = () => {
  myCronDialogRef.value.open(state.form.interval)
}

//打开Json对话框
const onOpenJson = () => {
  jsonEditorDialogRef.value.open(state.form)
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
    if (state.form.id) {
      res = await new QuartzTaskApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new QuartzTaskApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }

    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshTask')
      state.showDialog = false
    }
  })
}

const onIntervalChange = () => {
  state.form.interval = ''
  // if (state.form.interval === 21) state.form.round = -1
}

defineExpose({
  open,
})
</script>

<style scoped lang="scss">
.el-alert {
  border-width: 0px !important;
  margin-left: 110px;
  margin-top: 10px;
}
</style>

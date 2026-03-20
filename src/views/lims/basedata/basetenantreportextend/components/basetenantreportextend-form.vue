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
          <el-col :span="24">
            <el-form-item label="logo" prop="reportLogo" v-show="editItemIsShow(true, true)">
              <!-- <el-input v-model="state.form.reportLogo" placeholder="logo"> </el-input> -->
              <el-upload
                ref="uploadRef"
                :action="uploadAction"
                :headers="uploadHeaders"
                :data="{ fileDirectory: state.fileDirectory, fileReName: state.fileReName }"
                :file-list="state.logoList"
                accept=".jpg,.png,.gif,.jpeg,.jfif,.svg,.webp"
                multiple
                :auto-upload="true"
                :before-upload="
                  () => {
                    state.token = storesUserInfo.getToken()
                  }
                "
                :on-success="onUploadLogoSuccess"
                :on-error="onUploadError"
                list-type="picture-card"
                :limit="1"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemoveLogoPicture"
              >
                <el-icon class="el-icon--upload"><ele-UploadFilled /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报告主标题" prop="reportMainTitle" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.reportMainTitle" placeholder="报告主标题"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报告子标题" prop="reportSubTitle" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.reportSubTitle" placeholder="报告子标题"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="签章" prop="reportSignature" v-show="editItemIsShow(true, true)">
              <!-- <el-input v-model="state.form.reportSignature" placeholder="签章"> </el-input> -->
              <el-upload
                ref="uploadRef"
                :action="uploadAction"
                :headers="uploadHeaders"
                :data="{ fileDirectory: state.fileDirectory, fileReName: state.fileReName }"
                :file-list="state.signatureList"
                accept=".jpg,.png,.gif,.jpeg,.jfif,.svg,.webp"
                multiple
                :auto-upload="true"
                :before-upload="
                  () => {
                    state.token = storesUserInfo.getToken()
                  }
                "
                :on-success="onUploadSignatureSuccess"
                :on-error="onUploadError"
                list-type="picture-card"
                :limit="1"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemoveSignaturePicture"
              >
                <el-icon class="el-icon--upload"><ele-UploadFilled /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.address" placeholder="地址"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="电话" prop="telephone" v-show="editItemIsShow(true, true)">
              <el-input v-model="state.form.telephone" placeholder="电话"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-dialog v-model="state.dialogVisible">
          <img width="100%" :src="state.dialogImageUrl" alt="" />
        </el-dialog>
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

<script lang="ts" setup name="lims/base-tenant-report-extend/form">
import type { UploadFile, UploadInstance, UploadProps } from 'element-plus'
import { computed, reactive, ref, toRefs } from 'vue'
import { BaseTenantReportExtendApi } from '/@/api/lims/basedata/basetenantreportextend'
import {
  BaseTenantReportExtendAddInput,
  BaseTenantReportExtendOutput,
  BaseTenantReportExtendUpdateInput,
} from '/@/api/lims/basedata/datacontract/tenantreportextend-datacontract'

import modal from '/@/globalProperties/modal'
import { useUserInfo } from '/@/stores/userInfo'
import eventBus from '/@/utils/mitt'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const storesUserInfo = useUserInfo()
const formRef = ref()
const uploadRef = ref<UploadInstance>()

const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as BaseTenantReportExtendAddInput | BaseTenantReportExtendUpdateInput | any,
  token: storesUserInfo.getToken(),
  fileDirectory: '',
  fileReName: true,
  logoList: [] as UploadFile[],
  signatureList: [] as UploadFile[],
  dialogVisible: false,
  dialogImageUrl: '',
})
const { form } = toRefs(state)

const uploadAction = computed(() => {
  return import.meta.env.VITE_API_URL + '/api/admin/file/upload-file'
})
const uploadHeaders = computed(() => {
  return { Authorization: 'Bearer ' + state.token }
})

const imageChange = (file: any, fileList: any, name: any) => {
  console.log(file, fileList)
}
const handlePictureCardPreview = (file: any) => {
  console.log('file', file)
  state.dialogImageUrl = file.url
  state.dialogVisible = true
}
const handleRemoveLogoPicture = (file: any, fileList: any) => {
  console.log(file, fileList)
  state.form.reportLogo = null
}
const handleRemoveSignaturePicture = (file: any, fileList: any) => {
  console.log(file, fileList)
  state.form.reportSignature = null
}
// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseTenantReportExtendApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseTenantReportExtendOutput

      if (state.form.reportLogo) {
        state.logoList = [
          {
            name: ' file.reportLogo',
            url: state.form.reportLogo,
            status: 'success',
            uid: 1,
          },
        ]
      }
      if (state.form.reportSignature) {
        state.signatureList = [
          {
            name: ' file.signature',
            url: state.form.reportSignature,
            status: 'success',
            uid: 2,
          },
        ]
      }
    }
  } else {
    state.form = defaultToAdd()
  }
  state.showDialog = true
}

const defaultToAdd = (): BaseTenantReportExtendAddInput => {
  return {
    tenantId: 0,
    reportLogo: '',
    reportMainTitle: null,
    reportSubTitle: null,
    reportSignature: '',
    address: null,
    telephone: null,
    isValid: true,
    proId: null,
    proName: null,
    proTime: new Date(),
    modId: null,
    modName: null,
    modTime: null,
    isModified: false,
  } as BaseTenantReportExtendAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}
const onUploadError: UploadProps['onError'] = (error) => {
  let message = ''
  if (error.message) {
    try {
      message = JSON.parse(error.message)?.msg
    } catch (err) {
      message = error.message || ''
    }
  }
  if (message) modal.msgError(message)
}

// 上传成功
const onUploadLogoSuccess: UploadProps['onSuccess'] = async (response) => {
  console.log('onUploadLogoSuccess', response)
  if (response?.success) {
    state.form.reportLogo = response.data.linkUrl //`${response.data.fileDirectory}/${response.data.saveFileName}`
  } else {
    modal.alertError(response?.msg)
  }
}

// 上传成功
const onUploadSignatureSuccess: UploadProps['onSuccess'] = async (response) => {
  console.log('onUploadLogoSuccess', response)
  if (response?.success) {
    state.form.reportSignature = response.data.linkUrl
  } else {
    modal.alertError(response?.msg)
  }
}
// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    // uploadRef.value!.submit()
    state.sureLoading = true
    // state.form.reportLogo = response.data.id
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BaseTenantReportExtendApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseTenantReportExtendApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseTenantReportExtend')
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
:deep(.el-upload--picture-card) {
  width: 60px;
  height: 60px;
}
:deep(.el-upload) {
  width: 60px;
  height: 60px;
  line-height: 60px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 60px;
  height: 60px;
}
:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
  width: 60px;
  height: 60px;
  line-height: 60px;
}
:deep(.avatar) {
  width: 60px;
  height: 60px;
}
</style>

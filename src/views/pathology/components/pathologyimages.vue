<template>
  <div class="pathology-images">
    <div class="images-header">
      <span class="images-title">数量：{{ state.list.length }}</span>
      <el-upload
        style="width: 35px; height: 20px; margin-right: 25px"
        ref="uploadRef"
        :action="uploadAction"
        :show-file-list="false"
        :data="{ examInfoId: state.examInfoId, isGrossExamination: props.isGrossExamination }"
        :headers="uploadHeaders"
        :limit="1"
        :disabled="!state.editable || state.examInfoId <= 0"
        accept=".jpg,.png,.jpeg,.bmp,.gif,.tiff"
        :before-upload="
          () => {
            state.token = storesUserInfo.getToken()
          }
        "
        :auto-upload="true"
        :on-success="onSuccess"
        :on-error="onError"
      >
        <el-button size="small" type="primary">
          <SvgIcon name="ele-Upload" />
          上传</el-button
        >
      </el-upload>
    </div>
    <div class="images-body" v-if="state.list.length > 0">
      <div class="image-item" v-for="(item, index) in state.list" :key="item.id ?? index">
        <div class="image-wrapper">
          <el-image :src="item.fileUrl" fit="cover" :preview-src-list="previewList" :initial-index="index" />
          <div class="image-actions" v-if="state.editable">
            <el-button size="small" type="danger" circle @click="onDelete(item, index)">
              <SvgIcon name="ele-Delete" />
            </el-button>
          </div>
          <div class="image-zooms" v-if="state.editable">
            <el-select v-model="item.zoomCode" size="small" filterable @change="updateImage(item)">
              <el-option v-for="item in state.zoomList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
            <el-select v-model="item.antiBodyCode" size="small" filterable @change="updateImage(item)">
              <el-option v-for="item in state.antiBodyList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="images-empty" v-else>
      <span>暂无图片</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, onMounted } from 'vue'
import { ExamImagesOutput, ExamImagesUpdateInput } from '/@/api/lims/exam/datacontract/examimages-datacontract'
import { useUserInfo } from '/@/stores/userInfo'
import type { TabPaneName, UploadFile, UploadFiles, UploadInstance, UploadProps } from 'element-plus'
import modal from '/@/globalProperties/modal'
import { ExamImagesApi } from '/@/api/lims/exam/examimages'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'

const props = withDefaults(
  defineProps<{
    editable?: boolean
    isGrossExamination?: boolean
  }>(),
  {
    editable: true,
    isGrossExamination: false,
  }
)
const uploadRef = ref<UploadInstance>()
const storesUserInfo = useUserInfo()

const emit = defineEmits<{
  upload: []
  delete: [item: ExamImagesOutput, index: number]
}>()

const state = reactive({
  list: [] as ExamImagesOutput[],
  editable: true,
  token: storesUserInfo.getToken(),
  examInfoId: -1,
  zoomList: [] as DictGetListDto[] | null,
  antiBodyList: [] as DictGetListDto[] | null,
})
onMounted(async () => {
  await new DictApi().getList(['Zoom', 'AntiBody']).then((res) => {
    state.antiBodyList = res.data!.zoom
    state.zoomList = res.data!.antiBody
  })
})
const previewList = computed(() => state.list.map((item) => item.fileUrl ?? ''))

const setEditable = (editable: boolean) => {
  state.editable = editable
}

//#region 上传图片
const uploadAction = computed(() => {
  return import.meta.env.VITE_API_URL + '/api/exam/exam-images/upload-exam-image'
})
const uploadHeaders = computed(() => {
  return { Authorization: 'Bearer ' + state.token }
})
//上传失败
const onError: UploadProps['onError'] = (error) => {
  let message = ''
  if (error.message) {
    try {
      message = JSON.parse(error.message)?.msg
    } catch (err) {
      message = error.message || ''
    }
  }
  if (message) modal.msgError(message)
  uploadRef.value!.clearFiles(['success', 'fail'])
}

// 上传成功
const onSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response?.success) {
    modal.msgSuccess('上传成功')
    refreshData(state.examInfoId)
  } else {
    modal.msgError(response?.msg)
  }
  uploadRef.value!.clearFiles(['success', 'fail'])
}

//#endregion

const onDelete = (item: ExamImagesOutput, index: number) => {
  if (!state.examInfoId || state.examInfoId <= 0) return
  modal
    .confirmDelete(`确定要删除【${item.fileName}】?`, undefined)
    .then(async () => {
      await new ExamImagesApi().delete({ id: item.id }, { loading: true, showSuccessMessage: true })
      refreshData(state.examInfoId)
    })
    .catch(() => {})
}

const refreshData = (examInfoId: number) => {
  state.examInfoId = examInfoId
  if (!examInfoId || examInfoId <= 0) {
    state.list = []
    return
  }

  new ExamImagesApi()
    .getAll({ examInfoId: state.examInfoId, isGrossExamination: props.isGrossExamination }, { showErrorMessage: true })
    .then((res) => {
      if (res.success) {
        res.data = res.data!.map((item) => {
          item.originalZoomCode = item.zoomCode
          item.originalAntiCode = item.antiBodyCode
          item.originalIsShow = item.isShow
          return item
        })
        state.list = res.data!
      }
    })
}
const updateImage = (row: ExamImagesOutput) => {
  new ExamImagesApi().update(row as ExamImagesUpdateInput, { loading: true, showSuccessMessage: true }).then(() => {
    row.originalAntiCode = row.antiBodyCode
    row.originalZoomCode = row.zoomCode
    row.originalIsShow = row.isShow
  })
}
defineExpose({
  setEditable,
  refreshData,
})
</script>

<style scoped lang="scss">
.pathology-images {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}
.images-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}
.images-title {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
}
.images-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.image-item {
  flex-shrink: 0;
}
.image-wrapper {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  line-height: 0;

  .el-image {
    width: 100%;
    display: block;
    min-height: 100px;
  }
}
.image-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}
.image-wrapper:hover .image-actions {
  opacity: 1;
}
.image-zooms {
  margin-top: 2px;
  display: flex;
  flex-direction: row;
  gap: 4px;
}
.images-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 13px;
}
</style>

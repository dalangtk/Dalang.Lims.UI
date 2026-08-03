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
      <el-button size="small" type="primary" @click="snapShot">
        <SvgIcon name="ele-Upload" />
        拍图</el-button
      >
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
import { reactive, computed, ref, onMounted, getCurrentInstance, nextTick, onBeforeUnmount } from 'vue'
import { ExamImagesOutput, ExamImagesUpdateInput } from '/@/api/lims/exam/datacontract/examimages-datacontract'
import { useUserInfo } from '/@/stores/userInfo'
import type { TabPaneName, UploadFile, UploadFiles, UploadInstance, UploadProps } from 'element-plus'
import modal from '/@/globalProperties/modal'
import { ExamImagesApi } from '/@/api/lims/exam/examimages'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
// import { useWebSocket } from '/@/composables/useWebSocket'
// import { MessageResult, MessageType, type MessageData } from '/@/utils/websocket'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'

// const { isConnected, sendMessage, onMessage } = useWebSocket()
import { useFormium } from '/@/utils/useFormium'
import { sm4 } from 'sm-crypto-v2'
const { sendRequestAsync } = useFormium()

const { proxy } = getCurrentInstance() as any

const props = withDefaults(
  defineProps<{
    editable?: boolean
    isGrossExamination?: boolean
    resultType?: number
  }>(),
  {
    editable: true,
    isGrossExamination: false,
    resultType: 1,
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
  examInfo: {} as null | ExamInfoOutput,
  zoomList: [] as DictGetListDto[] | null,
  antiBodyList: [] as DictGetListDto[] | null,
})
onMounted(async () => {
  await new DictApi().getList(['Zoom', 'AntiBody']).then((res) => {
    state.antiBodyList = res.data!.zoom
    state.zoomList = res.data!.antiBody
  })

  const formium = proxy.$formium
  if (formium) {
    formium.removeMessageHandler('ImageMessageHandler' + props.resultType.toString())
    nextTick(() => {
      formium.addMessageHandler('ImageMessageHandler' + props.resultType.toString(), (msg: string) => {
        console.log(msg)
        console.log('props.resultType', props.resultType)
        let ret = JSON.parse(msg)
        if (ret?.success) {
          if (ret.component == props.resultType) refreshImageList()
        } else {
          modal.msgError('操作失败！' + ret?.msg)
        }
      })
    })
  }
})
onBeforeUnmount(() => {
  const formium = proxy.$formium
  if (formium != null && formium != undefined) {
    formium.removeMessageHandler('ImageMessageHandler')
  }
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
    refreshData({ id: state.examInfoId } as ExamInfoOutput)
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
      refreshData({ id: state.examInfoId } as ExamInfoOutput)
    })
    .catch(() => {})
}

const refreshData = (examInfo: ExamInfoOutput) => {
  state.examInfo = examInfo
  state.examInfoId = examInfo?.id ?? -1

  refreshImageList()
  send('ChangeExam')
}

const refreshImageList = () => {
  if (!state.examInfoId || state.examInfoId <= 0) {
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
// const send = (msgType: MessageType) => {
//   let param = {
//     component: props.resultType.toString(),
//     type: msgType,
//     data: {
//       examInfoId: state.examInfoId,
//       sampleNo: state.examInfo?.sampleNo ?? '',
//       isGrossExamination: props.isGrossExamination ?? false,
//       accessToken: state.token,
//     },
//   } as MessageData

//   return sendMessage(param)
// }

const send = (msgType: string) => {
  const formium = proxy.$formium
  console.log(formium)
  if (!formium) {
    return
  }
  let param = {
    examInfoId: state.examInfoId,
    sampleNo: state.examInfo?.sampleNo ?? '',
    isGrossExamination: props.isGrossExamination ?? false,
    accessToken: state.token,
    component: props.resultType.toString(),
  }
  console.log(param)
  // return
  sendRequestAsync(msgType, param)
    .then((res: any) => {
      console.log(res)
      if (res.success) {
        modal.msgSuccess('操作成功！')
      } else {
        modal.msgError('操作失败！' + res.msg)
      }
    })
    .catch((err: any) => {
      modal.msgError('操作失败！' + err.message)
    })
}

const snapShot = () => {
  console.log('snapShot', props.resultType)
  console.log('snapShot2', props.resultType.toString())
  send('SnapShot')
  // if (!send(MessageType.snapShot)) {
  //   modal.msgError('拍图命令发送失败！')
  //   return
  // }
}
// 订阅 WebSocket 消息
// onMessage(
//   (data: MessageResult) => {
//     console.log('PathologyImages收到消息:', data)
//     if (data.success) {
//       console.log(data.type === MessageType.snapShot)
//       if (data.type === MessageType.snapShot) refreshImageList()
//     } else {
//       modal.msgError(data.msg)
//     }
//   },
//   (data: any) => data?.component === props.resultType.toString()
// )
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

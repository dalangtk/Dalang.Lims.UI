<template>
  <div class="">
    <el-tabs v-model="state.activeName" class="demo-tabs" @tab-change="handleClick">
      <el-tab-pane label="跟踪" name="sampleTrack">
        <el-table :style="mystyle" :data="state.trackList" border stripe>
          <el-table-column prop="" label="序号" type="index" width="60" />
          <el-table-column label="内容" prop="trackContent"></el-table-column>
          <el-table-column label="操作人" prop="proName"></el-table-column>
          <el-table-column label="操作时间" prop="proTime">
            <template #default="scope">
              {{ formatDatetime(scope.row.proTime) }}
            </template>
          </el-table-column>
          <el-table-column label="组别" prop="groupName"></el-table-column>
          <el-table-column label="检测日期" prop="testDate">
            <template #default="scope">
              {{ formatDatetime(scope.row.testDate, 'YYYY-MM-DD') }}
            </template>
          </el-table-column>
          <el-table-column label="样本号" prop="sampleNo"></el-table-column>
          <el-table-column label="条码" prop="barcode"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="交接" name="handover">
        <el-table :style="mystyle"></el-table>
      </el-tab-pane>
      <el-tab-pane label="报告" name="reportList">
        <el-table :style="mystyle" :data="state.rptFiles">
          <el-table-column label="文件名" prop="fileName">
            <template #default="scope">
              <el-button
                type="primary"
                size="mini"
                @click="
                  () => {
                    previewReport(scope.row.filePath)
                  }
                "
              >
                {{ scope.row.fileName }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="图片" name="examImage">
        <MyTable :style="mystyle" :data="state.imageList" border stripe :show-paging="false" :show-toolbox="false">
          <template #headerButton v-if="imageCanEdit">
            <el-upload
              class="el-button el-button--primary el-button--default"
              style="width: 79px"
              ref="uploadRef"
              :action="uploadAction"
              :show-file-list="false"
              :data="{ examInfoId: props.examInfoId }"
              :headers="uploadHeaders"
              :limit="1"
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
              <el-button class="upload_btn" size="small" type="primary" icon="ele-UploadFilled">上传</el-button>
            </el-upload>
          </template>
          <el-table-column prop="" label="序号" type="index" width="60" />
          <el-table-column label="文件名" prop="fileName"></el-table-column>
          <el-table-column label="图片" prop="fileUrl" min-width="100">
            <template #default="{ row }">
              <div class="my-flex">
                <el-image
                  :src="row.fileUrl"
                  :lazy="true"
                  :hide-on-click-modal="true"
                  fit="scale-down"
                  preview-teleported
                  :preview-src-list="[row.fileUrl]"
                  style="width: 80px; height: 80px"
                />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="缩放" prop="zoomCode">
            <template #default="{ row }">
              <div v-if="row.zoomEditing" class="cell-editor">
                <el-select
                  v-model="row.zoomCode"
                  filterable
                  ref="zoomSelect"
                  reserve-keyword
                  @blur="finishImageEdit(row, 'zoomEditing')"
                  @keydown.enter="finishImageEdit(row, 'zoomEditing')"
                  @change="
                    (val: string) => {
                      zoomChange(val, row)
                    }
                  "
                >
                  <el-option v-for="item in state.zoomList" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </div>
              <div v-else class="cell-viewer" @click="startEdit(row, 'zoomEditing')">
                <span v-if="row.zoomName">
                  {{ row.zoomName }}
                </span>
                <span v-else class="placeholder">点击选择</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="抗体" prop="antiBodyCode">
            <template #default="{ row }">
              <div v-if="row.antiBodyEditing" class="cell-editor">
                <el-select
                  v-model="row.antiBodyCode"
                  ref="antiBodySelect"
                  filterable
                  reserve-keyword
                  @blur="finishImageEdit(row, 'antiBodyEditing')"
                  @keydown.enter="finishImageEdit(row, 'antiBodyEditing')"
                  @change="
                    (val: string) => {
                      antiBodyChange(val, row)
                    }
                  "
                >
                  <el-option v-for="item in state.antiBodyList" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </div>
              <div v-else class="cell-viewer" @click="startEdit(row, 'antiBodyEditing')">
                <span v-if="row.antiBodyName">
                  {{ row.antiBodyName }}
                </span>
                <span v-else class="placeholder">点击选择</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="显示" prop="isShow">
            <template #default="{ row }">
              <div v-if="row.isShowEditing" class="cell-editor">
                <el-select
                  v-model="row.isShow"
                  ref="isShowSelect"
                  filterable
                  reserve-keyword
                  @blur="finishImageEdit(row, 'isShowEditing')"
                  @keydown.enter="finishImageEdit(row, 'isShowEditing')"
                >
                  <el-option v-for="item in state.isShowList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
              <div v-else class="cell-viewer" @click="startEdit(row, 'isShowEditing')">
                <el-tag v-if="row.isShow" type="success"> 是 </el-tag>
                <el-tag v-else type="warning">否</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right" v-if="imageCanEdit">
            <template #default="{ row }">
              <!-- <el-button icon="ele-EditPen" size="small" text type="primary" @click="onEdit(row)"></el-button> -->
              <el-button text type="danger" @click="deleteImage(row)" icon="ele-Delete">删除</el-button>
            </template>
          </el-table-column>
        </MyTable>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="state.rptPreviewShow" width="70vw" center>
      <div style="height: 70vh">
        <!-- <iframe :src="state.previewUrl" style="height: 100%; width: 100%"></iframe> -->
        <embed :src="state.previewUrl" type="application/pdf" width="100%" height="98%" />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="tracktab">
import type { TabPaneName, UploadFile, UploadFiles, UploadInstance, UploadProps } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { DictGetListDto, LabelValueOutput } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { ExamImagesOutput, ExamImagesUpdateInput } from '/@/api/lims/exam/datacontract/examimages-datacontract'
import { ExamImagesApi } from '/@/api/lims/exam/examimages'
import { ExamInfoOutput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { ExamSampleTrackOutput } from '/@/api/lims/shared/datacontract/sampletrack-datacontract'
import { SampleStatus } from '/@/api/lims/shared/enums/samplestatusenum'
import { SampleTrackApi } from '/@/api/lims/shared/sampletrack'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { useUserInfo } from '/@/stores/userInfo'
import { formatDatetime } from '/@/utils/formatTime'
import { isBlank } from '/@/utils/toolsValidate'
import { ReportFilesListOutput } from '/@/api/lims/exam/datacontract/rptfiles-datacontract'
import { SampleTestApi } from '/@/api/lims/exam/sampletest'

const uploadRef = ref<UploadInstance>()
const antiBodySelect = ref()
const zoomSelect = ref()
const isShowSelect = ref()

const props = withDefaults(
  defineProps<{
    barcode?: string
    examInfoId?: number
    mystyle?: object
    showImage?: boolean
    currentSample?: ExamInfoOutput | null
  }>(),
  {
    barcode: '',
    examInfoId: 0,
    mystyle: () => ({ height: '300px' }),
    showImage: false,
    currentSample: null,
  }
)

const uploadAction = computed(() => {
  return import.meta.env.VITE_API_URL + '/api/exam/exam-images/upload-exam-image'
})
const uploadHeaders = computed(() => {
  return { Authorization: 'Bearer ' + state.token }
})

const storesUserInfo = useUserInfo()
const state = reactive({
  activeName: 'sampleTrack',
  trackList: [] as ExamSampleTrackOutput[],
  imageList: [] as ExamImagesOutput[],
  token: storesUserInfo.getToken(),
  antiBodyList: [] as DictGetListDto[] | null,
  zoomList: [] as DictGetListDto[] | null,
  isShowList: [
    { label: '是', value: true },
    { label: '否', value: false },
  ] as LabelValueOutput[],
  rptFiles: [] as ReportFilesListOutput[],
  rptPreviewShow: false,
  previewUrl: '',
})

onMounted(async () => {
  await new DictApi().getList(['Zoom', 'AntiBody']).then((res) => {
    state.antiBodyList = res.data!.zoom
    state.zoomList = res.data!.antiBody
  })
  refreshTrack()
})

const handleClick = (name: TabPaneName) => {
  if (name === 'sampleTrack') refreshTrack()
  else if (name === 'handover') refreshHandover()
  else if (name === 'reportList') refreshReport()
  else if (name === 'examImage') refreshExamImage()
}

const refreshTrack = () => {
  if (isBlank(props.barcode)) {
    state.trackList = []
    return
  }
  new SampleTrackApi().getTrackList({ barcode: props.barcode }, { showErrorMessage: true }).then((res) => {
    if (res.success) state.trackList = res.data!
  })
}
const refreshHandover = () => {
  if (isBlank(props.barcode)) return
}
const refreshReport = () => {
  if (isBlank(props.barcode)) return

  new SampleTestApi().getRptFiles({ examInfoId: props.examInfoId! }, { showErrorMessage: true }).then((res) => {
    if (res.success) {
      state.rptFiles = res.data!
    }
  })
}

const previewReport = (fileUrl: string) => {
  if (isBlank(fileUrl)) return
  // window.open(fileUrl, '_blank')
  state.previewUrl = fileUrl
  state.rptPreviewShow = true
}
const refreshExamImage = () => {
  if (props.examInfoId == null || props.examInfoId == undefined || props.examInfoId === 0) return

  new ExamImagesApi().getAll({ examInfoId: props.examInfoId }, { showErrorMessage: true }).then((res) => {
    if (res.success) {
      res.data = res.data!.map((item) => {
        item.originalZoomCode = item.zoomCode
        item.originalAntiCode = item.antiBodyCode
        item.originalIsShow = item.isShow
        return item
      })
      state.imageList = res.data!
    }
  })
}
const refreshSelectedTab = () => {
  if (state.activeName === 'sampleTrack') refreshTrack()
  else if (state.activeName === 'handover') refreshHandover()
  else if (state.activeName === 'reportList') refreshReport()
  else if (state.activeName === 'examImage') refreshExamImage()
}
const clearSelectedTab = () => {
  if (state.activeName === 'sampleTrack') state.trackList = []
  // else if (state.activeName === 'handover') state.handoverList = []
  // else if (state.activeName === 'reportList') state.reportList = []
  else if (state.activeName === 'examImage') state.imageList = []
}

const imageCanEdit = computed(() => {
  return (
    props.currentSample &&
    (props.currentSample.sampleStatus == SampleStatus.Testing.toString() || props.currentSample.sampleStatus == SampleStatus.ReportDelay.toString())
  )
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
    refreshExamImage()
  } else {
    modal.msgError(response?.msg)
  }
  uploadRef.value!.clearFiles(['success', 'fail'])
}
const startEdit = (row: ExamImagesOutput, col: string) => {
  if (
    props.currentSample?.sampleStatus != SampleStatus.Testing.toString() &&
    props.currentSample?.sampleStatus != SampleStatus.ReportDelay.toString()
  )
    return
  ;(row as any)[col] = true

  nextTick(() => {
    if (col === 'antiBodyEditing') antiBodySelect.value?.focus()
    if (col === 'zoomEditing') zoomSelect.value?.focus()
    if (col === 'isShowEditing') isShowSelect.value?.focus()
  })
}
const zoomChange = (value: string, row: ExamImagesOutput) => {
  row.zoomName = state.zoomList!.find((item) => item.code == value)?.name
}
const antiBodyChange = (value: string, row: ExamImagesOutput) => {
  row.antiBodyName = state.antiBodyList!.find((item) => item.code == value)?.name
}
const finishImageEdit = (row: ExamImagesOutput, col: string) => {
  console.log('finishImageEdit', row, col)
  ;(row as any)[col] = false

  if (row.antiBodyCode != row.originalAntiCode || row.zoomCode != row.originalZoomCode || row.isShow != row.originalIsShow) {
    updateImage(row)
  }
}
const updateImage = (row: ExamImagesOutput) => {
  new ExamImagesApi().update(row as ExamImagesUpdateInput, { loading: true, showSuccessMessage: true }).then(() => {
    row.originalAntiCode = row.antiBodyCode
    row.originalZoomCode = row.zoomCode
    row.originalIsShow = row.isShow
  })
}
const deleteImage = (row: ExamImagesOutput) => {
  modal
    .confirmDelete(`确定要删除【${row.fileName}】?`, undefined)
    .then(async () => {
      await new ExamImagesApi().delete({ id: row.id }, { loading: true, showSuccessMessage: true })
      refreshExamImage()
    })
    .catch(() => {})
}
const refreshAll = () => {
  refreshTrack()
  refreshHandover()
  refreshReport()
}

defineExpose({
  refreshAll,
  refreshTrack,
  refreshHandover,
  refreshReport,
  refreshSelectedTab,
  clearSelectedTab,
})
</script>

<style scoped lang="scss">
.placeholder {
  color: #ccc;
  font-size: 12px;
  font-style: italic;
}
</style>

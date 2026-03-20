<template>
  <div>
    <el-dialog
      title="报告预览"
      v-model="state.rptPreviewShow"
      draggable
      overflow
      destroy-on-close
      style="width: 80vw; height: 80vh"
      @before-close="closeDialog"
    >
      <div>
        <el-button @click="download">打印</el-button>
      </div>
      <div v-for="page in pages" :key="page">
        <VuePDF
          ref="pdfRef"
          fit-parent
          v-if="state.viewerShow"
          :pdf="pdf"
          :page="page"
          :scale="scale"
          :watermark-text="watermarkText"
          :watermark-options="watermarkOptions"
          :text-layer="text_layer"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import { nextTick, reactive, ref } from 'vue'
import { SampleTestApi } from '/@/api/lims/exam/sampletest'
import modal from '/@/globalProperties/modal'

const props = defineProps<{
  examInfoId: number
}>()

const state = reactive({
  rptPreviewShow: false,
  viewerShow: false,
})

const pdfRef = ref({})
const scale = ref(1.5)
const pdfSource = ref<any>(null)
const text_layer = ref(true)
const { pdf, pages, print } = usePDF(pdfSource)

const watermarkText = ref('预览')
const watermarkOptions = ref({
  columns: 6,
  rows: 6,
  color: 'rgba(211, 210, 211, 0.8)',
  rotation: 45,
  fontSize: 18,
})

const download = async () => {
  print()
}
const closeDialog = () => {
  state.viewerShow = false
  pdfSource.value = null
}
const preview = async () => {
  state.rptPreviewShow = true
  state.viewerShow = false
  nextTick(() => {
    modal.loading('正在加载...')
    console.log('props.examInfoId', props.examInfoId)
    if (props.examInfoId <= 0 || !props.examInfoId) return
    new SampleTestApi()
      .rptPreview({ examInfoId: props.examInfoId }, { showErrorMessage: false })
      .then(async (res) => {
        if (res.type.includes('application/json')) {
          let fileReader = new FileReader()
          fileReader.readAsText(res)
          fileReader.onload = (result) => {
            let jsondata = JSON.parse(result.target!.result!.toString())
            modal.alertError(jsondata.msg)
            return
          }
        }

        const arrayBuffer = await res.arrayBuffer()
        const byteArray = new Uint8Array(arrayBuffer)
        pdfSource.value = byteArray
        state.viewerShow = true
      })
      .catch((error) => {
        modal.alertError(error.message)
      })
      .finally(() => {
        modal.closeLoading()
      })
  })
}
defineExpose({
  preview,
})
</script>

<style scoped lang="scss">
.dlg {
  width: 80vw;
  height: 80vh;
}
:deep(.el-dialog__body) {
  max-height: calc(90vh - 150px) !important;
  overflow: scroll !important;
  padding: 0;
}
</style>

<template>
  <div class="audit-toolbar">
    <el-button type="primary" @click="selectTemplate">诊断模板</el-button>
    <el-button type="primary" @click="handlePreview">预览</el-button>
    <el-button type="primary" @click="handleSave">保存</el-button>
    <el-dropdown split-button type="primary" v-if="props.showMutilAudit" @click="handleAudit">
      审核
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>批量审核</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button v-else-if="!props.showMutilAudit" type="primary" @click="handleAudit">审核</el-button>
    <el-button type="primary" @click="handleUnAudit">反审核</el-button>
  </div>

  <el-dialog v-model="state.selectTemplateDialogShow" destroy-on-close title="选择诊断模板">
    <MySelectTable ref="mySelectTableRef" :data="state.selectTemplateList" :mutil-select="false" style="width: 100%">
      <el-table-column prop="templateName" label="模板名称" show-overflow-tooltip resizable />
      <el-table-column prop="templateCode" label="模板代码" show-overflow-tooltip resizable />
    </MySelectTable>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.selectTemplateDialogShow = false">取消</el-button>
        <el-button type="primary" @click="confirmSelectTemplate">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import MySelectTable from '/@/components/my-select-table/index.vue'
import { BasePathologyTemplateOutput } from '/@/api/lims/pathology/datacontract/pathologytemplate-datacontract'
import { BasePathologyTemplateApi } from '/@/api/lims/pathology/pathologytemplate'
import modal from '/@/globalProperties/modal'

const props = withDefaults(
  defineProps<{
    showMutilAudit?: boolean
    wfCode: string
  }>(),
  {
    showMutilAudit: false,
  }
)

const state = reactive({
  selectTemplateDialogShow: false,
  selectTemplateList: [] as BasePathologyTemplateOutput[],
})

const emit = defineEmits<{
  (e: 'selectTemplate', value: any[]): void
  (e: 'save'): void
  (e: 'preview'): void
  (e: 'audit'): void
}>()

const mySelectTableRef = ref()

const handleSave = () => {
  emit('save')
}
const selectTemplate = () => {
  new BasePathologyTemplateApi().getListByWfCode({ wfCode: props.wfCode }).then((res) => {
    state.selectTemplateList = res.data || []
    state.selectTemplateDialogShow = true
  })
}

const confirmSelectTemplate = () => {
  var selectList = mySelectTableRef.value.getSelectionRows()
  if (selectList.length === 0) {
    return
  }
  var id = selectList[0].id
  new BasePathologyTemplateApi().get({ id: id }).then((res) => {
    if (res.success) {
      emit('selectTemplate', [res.data])
    }
  })
  state.selectTemplateDialogShow = false
}
const handlePreview = () => {
  modal.msgWarning('病理预览功能开发中...')
  emit('preview')
}
const handleAudit = () => {
  modal.msgWarning('病理审核功能开发中...')
  emit('audit')
}
const handleUnAudit = () => {
  modal.msgWarning('病理反审核审核功能开发中...')
}
</script>

<style scoped lang="scss">
.audit-toolbar {
  display: flex;
  gap: 10px;
  // margin-bottom: 20px;
}
</style>

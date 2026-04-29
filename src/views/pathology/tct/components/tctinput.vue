<template>
  <div class="tct-container">
    <el-form :model="state.formData" class="result-form" label-position="left" label-width="150px" size="small">
      <el-row :gutter="10" class="h100">
        <!-- 左侧栏：标本情况与微生物选项 -->
        <el-col :span="10">
          <div class="form-section">
            <div class="section-title">标本情况</div>
            <el-form-item label="标本满意度">
              <el-select v-model="state.formData.satisfaction" placeholder="请选择">
                <el-option label="满意" value="满意" />
                <el-option label="不满意" value="不满意" />
              </el-select>
            </el-form-item>
            <el-form-item label="鳞状细胞量">
              <el-select v-model="state.formData.squamousCount" placeholder="请选择">
                <el-option label="<5000" value="<5000" />
                <el-option label=">5000" value=">5000" />
              </el-select>
            </el-form-item>
            <el-form-item label="颈管/化生细胞">
              <el-select v-model="state.formData.metaplasticCells" placeholder="请选择">
                <el-option label="可见" value="可见" />
                <el-option label="未见" value="未见" />
              </el-select>
            </el-form-item>
            <el-form-item label="红细胞">
              <el-select v-model="state.formData.rbc" placeholder="请选择">
                <el-option label="未见" value="未见" />
                <el-option label="少量" value="少量" />
              </el-select>
            </el-form-item>
            <el-form-item label="炎细胞覆盖率">
              <el-select v-model="state.formData.inflammationRate" placeholder="请选择">
                <el-option label="<25%" value="<25%" />
                <el-option label="25%-50%" value="25%-50%" />
                <el-option label=">50%" value=">50%" />
              </el-select>
            </el-form-item>
            <el-form-item label="炎症">
              <el-select v-model="state.formData.inflammation" placeholder="请选择">
                <el-option label="无" value="" />
                <el-option label="轻度" value="轻度" />
              </el-select>
            </el-form-item>

            <div class="section-title mt-4">微生物选项</div>
            <el-form-item label="滴虫">
              <el-select v-model="state.formData.trichomonad" placeholder="请选择">
                <el-option label="未见" value="未见" />
                <el-option label="可见" value="可见" />
              </el-select>
            </el-form-item>
            <el-form-item label="真菌">
              <el-select v-model="state.formData.fungi" placeholder="请选择">
                <el-option label="未见" value="未见" />
                <el-option label="可见" value="可见" />
              </el-select>
            </el-form-item>
            <el-form-item label="菌群变化">
              <el-select v-model="state.formData.floraChange" placeholder="请选择">
                <el-option label="未见" value="未见" />
                <el-option label="可见" value="可见" />
              </el-select>
            </el-form-item>
            <el-form-item label="细胞形态学符合放线菌">
              <el-select v-model="state.formData.actinomyces" placeholder="请选择">
                <el-option label="未见" value="未见" />
              </el-select>
            </el-form-item>
            <el-form-item label="符合单纯疱疹病毒改变">
              <el-select v-model="state.formData.hsv" placeholder="请选择">
                <el-option label="未见" value="未见" />
              </el-select>
            </el-form-item>
            <el-form-item label="其他">
              <el-select v-model="state.formData.others" placeholder="请选择">
                <el-option label="未见" value="未见" />
              </el-select>
            </el-form-item>
            <el-form-item label="制片方法">
              <el-select v-model="state.formData.prepMethod" placeholder="请选择">
                <el-option label="TCT" value="TCT" />
              </el-select>
            </el-form-item>
          </div>
        </el-col>

        <!-- 中间与右侧：诊断意见、备注 -->
        <el-col :span="14">
          <div class="full-height-container">
            <div class="textarea-item memo-group">
              <label>判读意见/结果</label>
              <el-input v-model="state.formData.diagnosis" type="textarea" :autosize="false" placeholder="请输入判读意见" />
            </div>
            <div class="textarea-item memo-group">
              <label>结果备注</label>
              <el-input v-model="state.formData.remarks" type="textarea" :autosize="false" placeholder="请输入结果备注" />
            </div>
            <div class="textarea-item memo-group">
              <label>内注</label>
              <el-input v-model="state.formData.internalNote" type="textarea" :autosize="false" placeholder="请输入内注" />
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { PathologyAuditTypeEnum } from '/@/api/lims/shared/enums/pathologyaudittypeenum'
import { TctResult } from '/@/api/lims/pathology/datacontract/pathologyresult-datacontract'

const props = withDefaults(
  defineProps<{
    auditType?: PathologyAuditTypeEnum
  }>(),
  {
    auditType: PathologyAuditTypeEnum.FirstAudit,
  }
)

const state = reactive({
  formData: {} as TctResult,
})

const getResult = () => {
  return state.formData
}

const setResult = (result: any) => {
  console.log('设置结果:', result)
  state.formData = {
    satisfaction: result?.satisfaction ?? '',
    squamousCount: result?.squamousCount ?? '',
    metaplasticCells: result?.metaplasticCells ?? '',
    rbc: result?.rbc ?? '',
    inflammationRate: result?.inflammationRate ?? '',
    inflammation: result?.inflammation ?? '',
    trichomonad: result?.trichomonad ?? '',
    fungi: result?.fungi ?? '',
    floraChange: result?.floraChange ?? '',
    actinomyces: result?.actinomyces ?? '',
    hsv: result?.hsv ?? '',
    others: result?.others ?? '',
    prepMethod: result?.prepMethod ?? '',
    diagnosis: result?.diagnosis ?? '',
    diagnosisEn: result?.diagnosisEn ?? '',
    remarks: result?.remarks ?? '',
    remarksEn: result?.remarksEn ?? '',
    internalNote: result?.internalNote ?? '',
  }
  console.log(state.formData)
}
const defaultToAdd = () => {
  let val = {
    satisfaction: '满意',
    squamousCount: '<5000',
    metaplasticCells: '可见',
    rbc: '未见',
    inflammationRate: '<25%',
    inflammation: '',
    trichomonad: '未见',
    fungi: '未见',
    floraChange: '未见',
    actinomyces: '未见',
    hsv: '未见',
    others: '未见',
    prepMethod: '',
    diagnosis: '未见上皮内病变或恶性细胞（NILM）。',
    diagnosisEn: '',
    remarks: '宫颈细胞学检查主要用于鳞状细胞癌及癌前病变的筛查，其总体敏感性约为90%左右...建议做p16/Ki-67双染检测（ASCCP阴道镜实践专家共识推荐）。',
    remarksEn: '',
    internalNote: '',
  }
  state.formData = val
}

defineExpose({
  getResult,
  setResult,
})
</script>

<style scoped>
.tct-container {
  background-color: #f5f7fa;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 10px;
  padding-top: 15px;
}

.result-form {
  /* margin-top: 10px; 
  padding: 10px;*/
  height: 100%;
}

.form-section {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  height: 100%;
}

.section-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 15px;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 8px;
}

.memo-group {
  background: #fff;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.memo-group label {
  display: block;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
  color: #606266;
}

/* 深度调整 Element Plus 样式以适应紧凑布局 */
:deep(.el-form .el-col) {
  margin-bottom: 0px;
}

:deep(.el-form-item) {
  margin-bottom: 8px;
}

:deep(.el-form-item__label) {
  font-size: 13px;
}

:deep(.el-textarea__inner) {
  font-family: sans-serif;
  line-height: 1.6;
}

.full-height-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px; /* 可选：文本域之间的间距 */
  padding: 8px; /* 可选：整体内边距 */
  box-sizing: border-box;
}

.textarea-item {
  flex: 1; /* 平均分配垂直空间 */
  display: flex;
  flex-direction: column;
  min-height: 0; /* 防止 flex 子项溢出 */
}

/* 让 .el-textarea 及内部 textarea 填满父容器高度 */
:deep(.el-textarea) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-textarea__inner) {
  flex: 1;
  resize: vertical; /* 允许用户垂直调整大小，可选改为 none */
}
</style>

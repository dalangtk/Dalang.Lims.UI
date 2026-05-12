<template>
  <div class="doctor-container">
    <el-form size="small" :model="formData" inline ref="formRef">
      <el-row :gutter="1">
        <el-col :span="6">
          <el-form-item label="" prop="firstDoctor">
            <el-input v-model="formData.firstDoctor" placeholder="初诊医生"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="secondDoctor">
            <el-input v-model="formData.secondDoctor" placeholder="复诊医生"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="reportDoctor">
            <el-input v-model="formData.reportDoctor" placeholder="报告医生"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="reportTime">
            <el-date-picker style="width: 100%" v-model="formData.reportTime" type="date" value-format="yyyy-MM-dd" placeholder="报告日期" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
const formData = reactive({
  firstDoctor: '',
  secondDoctor: '',
  reportDoctor: '',
  reportTime: '',
})
</script>

<style scoped lang="scss">
.doctor-container {
  padding: 5px;
  // margin-right: 65px;
}
.el-form .el-col {
  margin-bottom: 0 !important; /* 根据需要调整或移除 */
}
.el-form.el-form--inline .el-form-item--default.el-form-item:last-of-type,
.el-form.el-form--inline .el-form-item--small.el-form-item:last-of-type {
  margin-bottom: 0 !important;
}
</style>

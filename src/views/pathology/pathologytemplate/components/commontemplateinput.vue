<template>
  <div class="">
    <el-input v-model="state.formData.diagnosis" :rows="8" type="textarea" placeholder="Please input" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const state = reactive({
  formData: {
    diagnosis: '',
  } as any,
})

const defaultToAdd = () => {
  state.formData.diagnosis = ''
}

const getResult = () => {
  return state.formData
}

const setResult = (result: any) => {
  state.formData = {
    diagnosis: result.diagnosis ?? '',
  }
}

defineExpose({
  getResult,
  setResult,
})
</script>

<style scoped lang="scss"></style>

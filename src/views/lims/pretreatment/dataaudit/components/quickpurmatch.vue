<template>
  <div class="">
    <!-- <MyTable
      border
      tableName="customerPurpose"
      class="my-table"
      :data="state.customerPurMatchMain"
      ref="sampleInfoRef"
      :total="state.total"
      v-on:pageOrSizeChange="onTablePageOrSizeChange"
      @current-change="currentRowChange"
      :loading="state.loading"
      :showToolbox="false"
      :show-paging="false"
      stripe
    >
      <el-table-column prop="customerPurCode" label="客户目的代码" show-overflow-tooltip width />
      <el-table-column prop="customerPurName" label="客户目的名称" show-overflow-tooltip width />
    </MyTable> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
</script>

<style scoped lang="scss"></style>

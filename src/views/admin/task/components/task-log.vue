<template>
  <div class="my-layout my-container">
    <el-dialog title="任务日志" v-model="state.visible" width="80%" @close="state.tooltipShow = false">
      <div class="log-content">
        <MyTable
          :data="state.tableData"
          :total="state.total"
          :show-pagination="true"
          class="my-table"
          size="small"
          :show-toolbox="false"
          stripe
          v-on:pageOrSizeChange="onTablePageOrSizeChange"
        >
          <el-table-column prop="beginDate" label="开始时间" width="180">
            <template #default="{ row }">
              {{ formatDatetime(row.beginDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="endDate" label="结束时间" width="180">
            <template #default="{ row }">
              {{ formatDatetime(row.endDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="durationMs" label="持续时间" width="100" />
          <el-table-column prop="msg" label="消息">
            <template #default="{ row }">
              <el-tooltip show-after="200" hide-after="200" placement="top" effect="light" popper-class="custom-width-tooltip">
                <template #content>
                  <div style="max-height: 300px; overflow: auto">{{ row.msg }}</div>
                </template>
                <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ row.msg }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
        </MyTable>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { QuartzTaskLogOutput } from '/@/api/admin/data-contracts'
import { QuartzTaskApi } from '/@/api/admin/QuartzTask'
import { GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import MyTable from '/@/components/my-table/index.vue'
import { formatDatetime } from '/@/utils/formatTime'

const state = reactive({
  visible: false,
  id: 0,
  tableData: [] as QuartzTaskLogOutput[],
  total: 0,
  tooltipShow: false,
  pageInput: {
    currentPage: 1,
    pageSize: 20,
    filter: 0,
  } as GetPageInput<number>,
})

const open = (id: number) => {
  state.visible = true
  state.id = id
  onQuery()
}
const onQuery = async () => {
  state.pageInput.filter = state.id
  new QuartzTaskApi().getLogPage(state.pageInput).then((res) => {
    state.tableData = res.data?.list || []
    state.total = res.data?.total || 0
  })
}
const onTablePageOrSizeChange = async (page: TablePageType) => {
  state.pageInput.currentPage = page.currentPage
  state.pageInput.pageSize = page.pageSize
  await onQuery()
}
defineExpose({
  open,
})
</script>

<style scoped lang="scss">
.my-table {
  flex: 1;
  overflow: hidden;
}
:deep(.el-dialog__body) {
  height: 60vh !important;
  display: flex;
  flex-direction: column;
  padding: 0 !important;
}
.log-content {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
</style>

<style lang="scss">
.custom-width-tooltip {
  width: 80vw;
}
</style>

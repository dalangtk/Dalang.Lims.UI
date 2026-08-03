<template>
  <div class="task-page">
    <div class="task-container">
      <el-card v-show="state.cur == 1" class="table-card">
        <el-card class="mt8 search-card" shadow="never" :body-style="{ paddingBottom: '0' }">
          <el-form :inline="true" @submit.stop.prevent>
            <el-form-item label="任务名">
              <el-input v-model="state.taskOrGroupName" placeholder="任务名/分组名" @keyup.enter="onLoadJobs" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="ele-Search" @click="onLoadJobs"> 查询 </el-button>
              <el-button type="primary" icon="ele-Plus" @click="addJob"> 新增 </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <div class="table-wrapper">
          <MyTable
            ref="tb"
            :data="state.treeData"
            border
            stripe
            class="my-table"
            row-key="id"
            default-expand-all
            :show-toolbox="false"
            :total="0"
            :show-pagination="false"
            highlight-current-row
            :default-sort="{ prop: 'groupName', order: 'ascending' }"
            :header-cell-style="{ backgroundColor: '#F5F7FA', color: '#000000' }"
            @current-change="handleSelect"
          >
            <el-table-column prop="" type="index" width="60" label="序号" align="center"> </el-table-column>
            <el-table-column prop="groupName" label="分组" width="120" align="center"> </el-table-column>
            <el-table-column prop="taskName" label="任务" width="120" align="center"> </el-table-column>
            <el-table-column prop="taskType" label="任务类型" width="90" align="center">
              <template v-slot="scope">
                <span v-if="scope.row.taskType == 1"> Api </span>
                <span v-if="scope.row.taskType == 2"> Dll </span>
              </template>
            </el-table-column>
            <el-table-column prop="interval" label="间隔时间" width="100" align="center"> </el-table-column>
            <el-table-column prop="apiUrl" label="ApiUrl" align="center"> </el-table-column>
            <el-table-column prop="stateDisplay" width="100" label="运行状态" align="center">
              <template v-slot="{ row }">
                <template v-if="row.stateDisplay === '暂停'">
                  <el-tag type="warning">{{ row.stateDisplay }}</el-tag>
                </template>
                <template v-else-if="row.stateDisplay === '正常'">
                  <el-tag type="success">{{ row.stateDisplay }}</el-tag>
                </template>
                <template v-else-if="row.stateDisplay === '阻塞'">
                  <el-tag type="success">{{ row.stateDisplay }}</el-tag>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="lastRunTime" label="上次运行时间" align="center">
              <template v-slot="scope">
                {{ scope.row.lastRunTime ? formatDatetime(scope.row.lastRunTime) : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="nextRunTime" label="下次运行时间" align="center">
              <template v-slot="scope">
                {{ scope.row.nextRunTime ? formatDatetime(scope.row.nextRunTime) : '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="describe" label="任务描述" :show-overflow-tooltip="true" align="center"> </el-table-column>
            <el-table-column label="操作" align="center" width="220" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button
                    v-if="row.isGroup == false && (row.status == 4 || row.status == 5)"
                    icon="ele-VideoPlay"
                    size="small"
                    type="danger"
                    @click="onStart(row)"
                    >开启</el-button
                  >
                  <el-button v-if="row.isGroup == false && row.status == 6" icon="ele-VideoPause" size="small" @click="onPause(row)" type="danger"
                    >暂停</el-button
                  >
                  <el-button v-if="row.isGroup == false" icon="ele-Delete" size="small" type="info">删除</el-button>
                  <el-dropdown v-if="row.isGroup == false">
                    <el-button size="small"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="editJob(row)">编辑</el-dropdown-item>
                        <el-dropdown-item @click="onExecute(row)">执行</el-dropdown-item>
                        <el-dropdown-item @click="onOpenLog(row.id)">日志</el-dropdown-item>
                        <!-- <el-dropdown-item>清除日志</el-dropdown-item> -->
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-button-group>
              </template>
            </el-table-column>
          </MyTable>
        </div>
      </el-card>
    </div>
    <TaskForm ref="taskFormRef"></TaskForm>
    <TaskLog ref="taskLogRef"></TaskLog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import TaskForm from './components/task-form.vue'
import TaskLog from './components/task-log.vue'
import { QuartzTaskApi } from '/@/api/admin/QuartzTask'
import { QuartzTaskListOutput } from '/@/api/admin/data-contracts'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { formatDatetime } from '/@/utils/formatTime'

const taskFormRef = ref()
const taskLogRef = ref()

const state = reactive({
  cur: 1,
  activeIndex: '1',
  tableData: [] as QuartzTaskListOutput[],
  treeData: [] as any[],
  dialogFormVisible: false,
  dialogRecordVisible: false,
  taskOrGroupName: null,
  currentPage: 1,
  total: 0,
  pageSize: 20,
  pageSizes: [20, 30, 40, 50],
  recordData: [],
  dashboardData: { JobCounts: 0, ErrorCounts: 0, AverageTime: 0, RunJobs: '' },
  execTrend: null,
  failureRate: null,
})

onMounted(() => {
  onLoadJobs()
  onLoadClassJobs()
})

const onLoadJobs = () => {
  const params = {
    taskOrGroupName: state.taskOrGroupName,
  }
  new QuartzTaskApi().getList(params).then((res) => {
    if (res?.success) {
      console.log(res.data)
      // state.tableData = res.data || []
      state.treeData = convertToTreeData(res.data || [])
    }
  })
}
const onStart = (row: QuartzTaskListOutput) => {
  new QuartzTaskApi().start(row).then((res) => {
    if (res?.success) {
      modal.msgSuccess('任务已启动')
      onLoadJobs()
    }
  })
}
const onLoadClassJobs = () => {
  
}
const editJob = (row: QuartzTaskListOutput) => {
  taskFormRef.value.open(row)
}
const onTabClick = (curvalue: any) => {
  state.activeIndex = curvalue
}
const handleSelect = () => {}
const addJob = () => {
  taskFormRef.value.open()
}
const convertToTreeData = (data: QuartzTaskListOutput[]) => {
  // 按 groupName 分组
  const groupMap = new Map()

  data.forEach((item) => {
    const groupName = item.groupName || '未分组'
    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, [])
    }
    groupMap.get(groupName).push(item)
  })

  // 构建树形结构
  const treeData: any[] = []
  groupMap.forEach((children, groupName) => {
    // 创建父节点
    const parentNode = {
      id: `group-${groupName}`, // 为父节点生成唯一ID
      // taskName: groupName,
      groupName: groupName,
      isGroup: true, // 标记为分组节点
      children: children.map((item: any) => ({
        ...item,
        isGroup: false, // 标记为子节点
      })),
    }
    treeData.push(parentNode)
  })

  return treeData
}
const onPause = (row: QuartzTaskListOutput) => {
  new QuartzTaskApi().pause(row).then((res) => {
    if (res?.success) {
      modal.msgSuccess('任务已暂停')
      onLoadJobs()
    }
  })
}
const onExecute = (row: QuartzTaskListOutput) => {
  new QuartzTaskApi().run(row).then((res) => {
    if (res?.success) {
      modal.msgSuccess('任务已执行')
      onLoadJobs()
    }
  })
}
const onOpenLog = (id: number) => {
  console.log(id)
  taskLogRef.value.open(id)
}
</script>

<style scoped lang="scss">
.task-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.task-container {
  flex: 1;
  display: flex;
  min-height: 0;
  height: 100%;
}

.table-card {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 10px;
  }
}

.search-card {
  flex-shrink: 0;
}

.table-wrapper {
  flex: 1;
  min-height: 0;
  margin-top: 10px;
}

.card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.card h2 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.card p {
  margin: 5px 0 0;
  color: #666;
  font-size: 14px;
}
.chart {
  height: 350px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
}
.my-table {
  flex: 1;
  overflow: hidden;
  height: 100%;
}
</style>

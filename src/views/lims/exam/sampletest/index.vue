<template>
  <div class="lis-layout" @mouseup="stopResize" @mousemove="onResize">
    <!-- 顶部 Header -->
    <header class="lis-header">
      <div style="display: flex; flex-direction: row">
        <el-select v-model="state.groupCode" style="width: 130px; margin-right: 10px" @change="groupChange">
          <el-option v-for="g in state.groupList" :key="g.groupCode" :label="g.groupName" :value="g.groupCode"></el-option>
        </el-select>
        <el-button type="primary" @click="audit(OperationTypeEnum.FirstCheck)">{{ $t('message.sampleTest.firstCheck') }}</el-button>
        <el-button type="primary" @click="audit(OperationTypeEnum.SecondCheck)">{{ $t('message.sampleTest.secondCheck') }}</el-button>
        <el-button type="primary" @click="unAudit">{{ $t('message.sampleTest.unCheck') }}</el-button>
        <el-button type="primary" @click="preView">{{ $t('message.sampleTest.preview') }}</el-button>
        <el-dropdown style="margin-left: 10px" @command="handleOperation">
          <el-button type="primary">
            操作<el-icon class="el-icon--right"><ele-ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="RefreshItemInfo">刷新项目信息</el-dropdown-item>
              <el-dropdown-item command="AddItem">增项</el-dropdown-item>
              <el-dropdown-item command="DeleteItem">退项</el-dropdown-item>
              <el-dropdown-item command="CancelTest">取消检测</el-dropdown-item>
              <el-dropdown-item>Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown style="margin-left: 10px">
          <el-button type="primary">
            批量<el-icon class="el-icon--right"><ele-ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item>Action 4</el-dropdown-item>
              <el-dropdown-item>Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-tag effect="dark" type="success">显示: {{ state.filteredList.length }} / 总量: {{ state.totalCount }}</el-tag>
    </header>

    <div class="lis-body">
      <!-- 1. 左侧：患者信息 -->
      <aside class="panel-left" :style="{ width: leftWidth + 'px' }">
        <el-card shadow="never" class="info-card">
          <template #header>
            <div class="panel-header">
              <span
                ><el-icon><User /></el-icon> 患者信息</span
              >
              <el-tag :color="GetStatusColor(SampleStatusUtils.getSampleStatus(currentSample?.sampleStatus))">{{
                currentSample?.sampleStatusName
              }}</el-tag>
              <el-button
                type="primary"
                link
                @click="openEditDialog"
                :disabled="
                  !currentSample ||
                  (currentSample.sampleStatus != SampleStatus.Testing.toString() && currentSample.sampleStatus != SampleStatus.ReportDelay.toString())
                "
              >
                <el-icon><Edit /></el-icon>
              </el-button>
            </div>
          </template>

          <div v-if="currentSample" class="info-content">
            <el-descriptions :column="1" border size="small" label-width="100">
              <el-descriptions-item label="检测日期">
                <span>{{ formatDate(currentSample.testDate, 'YYYY-mm-dd') }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="样本号">
                <span>{{ currentSample.sampleNo }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="条码">
                <span class="barcode-text">{{ currentSample.barcode }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="姓名">
                <span>{{ currentSample.patientName }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="性别">
                <span>{{ currentSample.genderName }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="年龄">
                <span>{{ currentSample.ageDesc }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="目的">
                <span>{{ currentSample.purNames }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="标本类型">
                <span>{{ currentSample.sampleTypeName }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="标本性状">
                <span>{{ currentSample.samplePropertyName }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="科室">{{ currentSample.department }}</el-descriptions-item>
              <el-descriptions-item label="医生">{{ currentSample.doctor }}</el-descriptions-item>
              <el-descriptions-item label="床号">{{ currentSample.bedNo }}</el-descriptions-item>
              <el-descriptions-item label="病员号">{{ currentSample.patientId }}</el-descriptions-item>
              <el-descriptions-item label="客户条码">{{ currentSample.customerBarcode }}</el-descriptions-item>
              <el-descriptions-item label="采样时间">{{ formatDatetime(currentSample.collectTime) }}</el-descriptions-item>
              <el-descriptions-item label="接收时间">{{ formatDatetime(currentSample.receiveTime) }}</el-descriptions-item>
              <el-descriptions-item label="检测时间">{{ formatDatetime(currentSample.inTestTime) }}</el-descriptions-item>
              <el-descriptions-item label="临床诊断">
                <div class="text-wrap">{{ currentSample.clinicalDiagnosis }}</div>
              </el-descriptions-item>
              <el-descriptions-item label="结果说明">{{ currentSample.resultDescription }}</el-descriptions-item>
              <el-descriptions-item label="建议解释">{{ currentSample.suggestion }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{ currentSample.remarks }}</el-descriptions-item>
              <el-descriptions-item label="初审人">{{ currentSample.firstAuditName }}</el-descriptions-item>
              <el-descriptions-item label="初审时间">{{ formatDatetime(currentSample.firstAuditTime) }}</el-descriptions-item>
              <el-descriptions-item label="复审人">{{ currentSample.secondAuditName }}</el-descriptions-item>
              <el-descriptions-item label="复审时间">{{ formatDatetime(currentSample.secondAuditTime) }}</el-descriptions-item>
              <el-descriptions-item label="Id">{{ currentSample.id }}</el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-else class="empty-state">
            <el-empty description="请选择标本" :image-size="60" />
          </div>
        </el-card>
      </aside>

      <!-- Resizer Left -->
      <div class="resizer" @mousedown="startResize($event, 'left')">
        <div class="resizer-grip"></div>
      </div>

      <!-- 2. 中间：检验结果 -->
      <main class="panel-center">
        <el-card shadow="never" class="result-card">
          <template #header>
            <div class="panel-header">
              <span>
                <el-icon><Operation /></el-icon>
                检验结果
              </span>
            </div>
          </template>
          <MyTable
            tableName="examResultTable"
            v-if="currentSample"
            :data="state.resultList"
            height="100%"
            style="flex: 1"
            :showToolbox="false"
            :showPaging="false"
            stripe
            border
            size="small"
            :row-class-name="tableRowClassName"
          >
            <el-table-column prop="itemName" label="项目名称" min-width="120" />
            <el-table-column prop="itemResult" label="结果 (点击编辑)" min-width="140">
              <template #default="{ row }">
                <div v-if="row.isEditing" class="cell-editor">
                  <el-input
                    v-model="row.itemResult"
                    size="small"
                    v-focus
                    @blur="finishEdit(row)"
                    @keydown.enter="finishEdit(row)"
                    :class="getAbnormalClass(row.status)"
                  />
                </div>
                <div v-else class="cell-viewer" @click="startEdit(row)">
                  <span v-if="row.itemResult" :class="getAbnormalTextClass(row.status)">
                    {{ row.itemResult }}
                    <span v-if="row.hlFlag === 'H'" class="flag-high">↑</span>
                    <span v-if="row.hlFlag === 'L'" class="flag-low">↓</span>
                    <span v-if="row.hlFlag === 'HH'" class="flag-critical">↑↑</span>
                    <span v-if="row.hlFlag === 'LL'" class="flag-critical">↓↓</span>
                  </span>
                  <span v-else class="placeholder">点击录入</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="hlFlag" label="" width="35" />
            <el-table-column prop="itemUnit" label="单位" width="70" />
            <el-table-column prop="displayReference" label="参考值" width="100" />
            <el-table-column prop="reagentName" label="试剂" width="100" />
            <el-table-column prop="instrumentName" label="仪器" width="100" />
          </MyTable>
          <div v-else class="empty-state"><el-empty description="暂无数据" /></div>
          <el-collapse v-model="state.actived" expand-icon-position="left" accordion @change="moreTabVisableChange">
            <el-collapse-item title="更多" name="1" style="height: 100%; overflow-y: hidden">
              <tracktab
                :mystyle="{ height: '300px' }"
                ref="moreTab"
                :barcode="currentSample?.barcode"
                :exam-info-id="currentSample?.id"
                :current-sample="currentSample"
              ></tracktab>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </main>

      <!-- Resizer Right -->
      <div class="resizer" @mousedown="startResize($event, 'right')">
        <div class="resizer-grip"></div>
      </div>

      <!-- 3. 右侧：列表 + 综合筛选 -->
      <aside class="panel-right" :style="{ width: rightWidth + 'px' }">
        <el-card shadow="never" class="list-card">
          <template #header>
            <div class="list-header-wrapper">
              <!-- 日期 -->
              <el-date-picker
                v-model="state.queryDateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始"
                end-placeholder="结束"
                size="small"
                value-format="YYYY-MM-DD"
                style="width: 100%; margin-bottom: 6px"
              />
              <!-- 状态筛选 -->
              <el-select
                v-model="state.statusFilter"
                multiple
                collapse-tags
                collapse-tags-tooltip
                clearable
                placeholder="状态 (全部)"
                size="small"
                style="width: 100%; margin-bottom: 6px"
                @change="handleFilter"
              >
                <el-option v-for="s in state.allSampleStatus" :key="s.code" :label="s.name" :value="s.code">{{ s.name }}</el-option>
                <!-- <el-option label="待检" value="待检"> <span class="dot danger">●</span> 待检 </el-option>
                <el-option label="检测中" value="检测中"> <span class="dot warning">●</span> 检测中 </el-option>
                <el-option label="已审" value="已审"> <span class="dot success">●</span> 已审 </el-option> -->
              </el-select>
              <!-- 搜索 -->
              <div style="display: flex">
                <el-input v-model="state.searchText" placeholder="筛选" prefix-icon="Search" size="small" clearable @input="handleFilter" />
                <el-button @click="querySampleList" type="primary">查询</el-button>
              </div>
            </div>
          </template>

          <div class="virtual-list-container">
            <vxe-table
              style="height: 100%"
              max-height="100%"
              min-height="100%"
              border="full"
              ref="sampleListTableRef"
              :data="state.filteredList"
              :row-config="{ isCurrent: true, isHover: true }"
              :aggregate-config="aggregateConfig"
              :virtual-y-config="{ enabled: true, gt: 0 }"
              @current-row-change="({ row }) => switchSample(row)"
            >
              <!-- <vxe-column field="sampleNo" title="sampleNo" row-group-node>
                <template #default="{ row, column }">
                  <div v-if="row.id >= 0" class="virtual-item-card" :class="{ 'is-active': activeId === row.id }" @click="switchSample(row)">
                    <div class="item-top">
                      <span class="item-name">{{ row.sampleNo }}</span>
                      <span class="item-name">{{ row.patientName }}</span>
                      <el-tag size="small" :color="GetStatusColor(SampleStatusUtils.getSampleStatus(row?.sampleStatus))" effect="plain">{{
                        row.sampleStatusName
                      }}</el-tag>
                    </div>
                    <div class="item-mid">
                      <span class="text-ellipsis">{{ row.purNames }}</span>
                    </div>
                    <div class="item-bottom">
                      <span class="item-barcode">{{ row.barcode }}</span>
                      <span>{{ formatDate(row.testDate, 'YYYY-mm-dd') }}</span>
                    </div>
                  </div>
                  <div v-else>
                    <span>{{ formatDate(row.testDate, 'YYYY-mm-dd') }}</span>
                  </div>
                </template>
              </vxe-column> -->
              <vxe-column field="sampleNo" title="样本号" width="150" row-group-node>
                <template #default="{ row }">
                  <el-badge :is-dot="row.hasCritical" class="item">
                    <el-tag size="large" :color="GetStatusColor(SampleStatusUtils.getSampleStatus(row?.sampleStatus))" effect="plain">{{
                      row.sampleNo
                    }}</el-tag>
                  </el-badge>
                </template>
              </vxe-column>
              <vxe-column field="barcode" title="条码" width="120"></vxe-column>
              <vxe-column field="patientName" title="姓名" width="auto"></vxe-column>
              <vxe-column field="purCodes" title="目的代码" width="150"></vxe-column>
              <vxe-column field="purNames" title="目的名称" width="150"></vxe-column>
            </vxe-table>
            <!-- <el-auto-resizer>
              <template #default="{ height, width }">
                <el-table-v2
                  :columns="[{ key: 'testDate', dataKey: 'id', title: 'List', width: width, align: 'center' }]"
                  :data="state.filteredList"
                  :width="width"
                  :height="height"
                  ref="sampleListTable"
                  row-key="id"
                  expand-column-key="testDate"
                  :default-expanded-keys="state.defaultExpandedKeys"
                  :row-height="84"
                  :header-height="20"
                  fixed
                >
                  <template #cell="{ rowData }">
                    <div
                      v-if="rowData.id >= 0"
                      class="virtual-item-card"
                      :class="{ 'is-active': activeId === rowData.id }"
                      @click="switchSample(rowData)"
                    >
                      <div class="item-top">
                        <span class="item-name">{{ rowData.sampleNo }}</span>
                        <span class="item-name">{{ rowData.patientName }}</span>
                        <el-tag size="small" :color="GetStatusColor(SampleStatusUtils.getSampleStatus(rowData?.sampleStatus))" effect="plain">{{
                          rowData.sampleStatusName
                        }}</el-tag>
                      </div>
                      <div class="item-mid">
                        <span class="text-ellipsis">{{ rowData.purNames }}</span>
                      </div>
                      <div class="item-bottom">
                        <span class="item-barcode">{{ rowData.barcode }}</span>
                        <span>{{ rowData.inTestTime }}</span>
                      </div>
                    </div>
                    <div v-else>
                      <span>{{ formatDate(rowData.testDate, 'YYYY-mm-dd') }}</span>
                    </div>
                  </template>
                </el-table-v2>
              </template>
            </el-auto-resizer> -->
          </div>
          <div class="list-footer">共 {{ state.allSamples.length }} 条</div>
        </el-card>
      </aside>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" title="修改患者信息" width="30%">
      <el-form :model="editForm" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.patientName" :class="{ 'is-modified': isModified('patientName') }">
            <!-- 如果修改了，显示一个小红点或者提示 -->
            <template #suffix v-if="isModified('patientName')">
              <el-tooltip content="该字段已修改" placement="top">
                <el-icon color="#E6A23C"><EditPen /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
          <!-- 显示原值提示 -->
          <!-- <div v-if="isModified('name')" class="original-value-tip">原值: {{ originalSnapshot.name }}</div> -->
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="editForm.genderCode" :class="{ 'is-modified-border': isModified('genderCode') }">
            <el-radio v-for="gender in state.genderList" :key="gender.code" :label="gender.name" :value="gender.code">{{ gender.name }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="年龄">
          <div style="display: flex">
            <el-input v-model="editForm.age1" :class="{ 'is-modified': isModified('age1') }"></el-input>
            <el-select
              v-model="editForm.ageUnit1"
              placeholder="单位"
              style="width: 120px; margin-left: 6px"
              :class="{ 'is-modified-border': isModified('ageUnit1') }"
            >
              <el-option v-for="unit in state.ageUnitList" :key="unit.code" :label="unit.name" :value="unit.code"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="年龄2">
          <div style="display: flex">
            <el-input v-model="editForm.age2" :class="{ 'is-modified': isModified('age2') }"></el-input>
            <el-select
              v-model="editForm.ageUnit2"
              placeholder="单位2"
              style="width: 120px; margin-left: 6px"
              :class="{ 'is-modified-border': isModified('ageUnit2') }"
            >
              <el-option v-for="unit in state.ageUnitList" :key="unit.code" :label="unit.name" :value="unit.code"></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="标本类型">
          <el-select v-model="editForm.sampleTypeCode" placeholder="标本类型" :class="{ 'is-modified-border': isModified('sampleTypeCode') }">
            <el-option v-for="t in state.sampleTypeList" :key="t.sampleTypeCode" :label="t.sampleTypeName" :value="t.sampleTypeCode"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标本性状">
          <el-select v-model="editForm.samplePropertyCode" placeholder="标本性状" :class="{ 'is-modified-border': isModified('samplePropertyCode') }">
            <el-option v-for="t in state.samplePropertyList" :key="t.code" :label="t.name" :value="t.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="科室">
          <el-input v-model="editForm.department" :class="{ 'is-modified': isModified('department') }"> </el-input>
        </el-form-item>
        <el-form-item label="医生">
          <el-input v-model="editForm.doctor" :class="{ 'is-modified': isModified('doctor') }"> </el-input>
        </el-form-item>
        <el-form-item label="床号">
          <el-input v-model="editForm.bedNo" :class="{ 'is-modified': isModified('bedNo') }"> </el-input>
        </el-form-item>
        <el-form-item label="病员号">
          <el-input v-model="editForm.patientId" :class="{ 'is-modified': isModified('patientId') }"> </el-input>
        </el-form-item>
        <el-form-item label="客户条码">
          <el-input v-model="editForm.customerBarcode" :class="{ 'is-modified': isModified('customerBarcode') }"> </el-input>
        </el-form-item>

        <el-form-item label="采样时间">
          <div :class="{ 'is-modified-border': isModified('collectTime') }">
            <el-date-picker
              v-model="editForm.collectTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY-MM-DD HH:mm:ss"
              :class="{ 'is-modified-border': isModified('collectTime') }"
            />
          </div>
        </el-form-item>
        <el-form-item label="接收时间">
          <div :class="{ 'is-modified-border': isModified('collectTime') }">
            <el-date-picker
              v-model="editForm.receiveTime"
              type="datetime"
              placeholder="Pick a Date"
              format="YYYY-MM-DD HH:mm:ss"
              :class="{ 'is-modified-border': isModified('receiveTime') }"
            />
          </div>
        </el-form-item>

        <el-form-item label="诊断">
          <el-input v-model="editForm.clinicalDiagnosis" type="textarea" :rows="2" :class="{ 'is-modified': isModified('clinicalDiagnosis') }" />
        </el-form-item>
        <el-form-item label="结果说明">
          <el-input v-model="editForm.resultDescription" type="textarea" :rows="2" :class="{ 'is-modified': isModified('resultDescription') }" />
        </el-form-item>
        <el-form-item label="建议解释">
          <el-input v-model="editForm.suggestion" type="textarea" :rows="2" :class="{ 'is-modified': isModified('suggestion') }" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea" :rows="2" :class="{ 'is-modified': isModified('remark') }" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePatientInfo">保存修改</el-button>
      </template>
    </el-dialog>

    <PurposeSelect :group-code="state.groupCode" ref="purposeSelectRef" @confirm="confirmSelectItem"></PurposeSelect>

    <el-dialog v-model="state.delItemDialogShow">
      <template #header>
        <span>请选择需要退项的目的</span>
      </template>
      <MySelectTable :data="state.delItemDataList" ref="delItemSelectRef" :mutil-select="true">
        <el-table-column prop="purCode" label="目的代码" show-overflow-tooltip width />
        <el-table-column prop="purName" label="目的名称" show-overflow-tooltip width />
      </MySelectTable>
      <template #footer>
        <el-button @click="state.delItemDialogShow = false">取消</el-button>
        <el-button type="primary" @click="onConfirmSelectDelItem">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="state.historyResultShow" style="width: 100vw; height: 100vh">
      <HistoryResult></HistoryResult>
    </el-dialog>

    <RptPreview ref="previewRef" :exam-info-id="activeId"></RptPreview>
  </div>
</template>

<script lang="ts" setup name="/exam/sampletest">
import { Edit, EditPen, Operation, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-table-v2.css'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

import { useRoute } from 'vue-router'
import { VxeGridInstance, VxeTablePropTypes } from 'vxe-table'
import HistoryResult from './components/historyresult.vue'
import RptPreview from './components/reportpreview.vue'
import tracktab from './components/tracktab.vue'
import { DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseSampleTypeApi } from '/@/api/lims/basedata/basesampletype'
import { BaseUserGroupApi } from '/@/api/lims/basedata/baseusergroup'
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import { BasePurposeOutput, PurposeAndComboOutput } from '/@/api/lims/basedata/datacontract/purpose-datacontract'
import { BaseSampleTypeOutput } from '/@/api/lims/basedata/datacontract/sampletype-datacontract'
import { BaseUserGroupQueryListInput } from '/@/api/lims/basedata/datacontract/usergroup-datacontract'
import {
  AddOrDeletePurposeInput,
  AuditInput,
  CancelTestInput,
  UnAuditInput,
  UpdatePatientInfoInput,
} from '/@/api/lims/exam/datacontract/sampletest-datacontract'
import { SampleTestApi } from '/@/api/lims/exam/sampletest'
import { ExamInfoOutput, ExamListQueryInput } from '/@/api/lims/shared/datacontract/examinfo-datacontract'
import { ExamResultOutput } from '/@/api/lims/shared/datacontract/examresult-datacontract'
import { ExecuteTypeEnum, OperationTypeEnum } from '/@/api/lims/shared/enums/operationtypeenum'
import { GetStatusColor, SampleStatus, SampleStatusUtils } from '/@/api/lims/shared/enums/samplestatusenum'
import MySelectTable from '/@/components/my-select-table/index.vue'
import MyTable from '/@/components/my-table/index.vue'
import modal from '/@/globalProperties/modal'
import { formatDate, formatDatetime, parseDate, subtractDays } from '/@/utils/formatTime'
import DateTimeComparator from '/@/utils/timeCompare'
import PurposeSelect from '/@/views/lims/basedata/basepurpose/components/purpose-select.vue'
const route = useRoute()
const examId = history.state.examId

console.log('examId', history.state.examId)

interface ExamListTreeData extends ExamInfoOutput {
  parent: ''
  children: ExamInfoOutput[]
}
const sampleListTable = ref()
const moreTab = ref()
const purposeSelectRef = ref()
const delItemSelectRef = ref()
const sampleListTableRef = ref<VxeGridInstance<ExamInfoOutput>>()
const previewRef = ref()

const aggregateConfig = reactive<VxeTablePropTypes.AggregateConfig<ExamInfoOutput>>({
  groupFields: ['testDate'],
  showTotal: true,
  expandAll: true,
  contentMethod({ groupValue }) {
    return `${formatDatetime(parseDate(groupValue), 'YY/MM/DD')}`
  },
})
const cellStyle: VxeTablePropTypes.CellStyle<ExamInfoOutput> = ({ row, column }) => {
  if (column.field === 'sampleNo') {
    let color = GetStatusColor(SampleStatusUtils.getSampleStatus(row?.sampleStatus))
    console.log('cellClassName', color)
    return { backgroundColor: color }
  }
  return null
}
const spanMethod: VxeTablePropTypes.SpanMethod<ExamInfoOutput> = ({ row, column }) => {
  const $table = sampleListTableRef.value
  if ($table && $table.isAggregateRecord(row)) {
    if (column.field === 'sampleNo') {
      return { rowspan: 1, colspan: 5 }
    }
    return { rowspan: 0, colspan: 0 }
  }
  return { rowspan: 1, colspan: 1 }
}

const state = reactive({
  totalCount: 0,
  groupList: [] as BaseGroupOutput[],
  groupCode: '1001',
  allSamples: [] as ExamInfoOutput[],
  filteredList: [] as ExamInfoOutput[],
  resultList: [] as ExamResultOutput[],
  allSampleStatus: [] as Array<{ code: number; name: string }>,
  statusFilter: [] as any[],
  queryDateRange: [] as any,
  defaultExpandedKeys: [-1, -2, -3],
  searchText: '',
  genderList: [] as DictGetListDto[] | null,
  ageUnitList: [] as DictGetListDto[] | null,
  sampleTypeList: [] as BaseSampleTypeOutput[],
  samplePropertyList: [] as DictGetListDto[] | null,
  actived: '1',
  addOrRemoveItemInput: {} as AddOrDeletePurposeInput,
  delItemDialogShow: false,
  delItemDataList: [] as BasePurposeOutput[],
  historyResultShow: false,
})
const activeId = ref(-1)

onMounted(async () => {
  state.allSampleStatus = SampleStatusUtils.getAllOptions()
  new BaseUserGroupApi().getUserCanTestGroup({} as BaseUserGroupQueryListInput).then((res) => {
    state.groupList = res.data!
    if (res.data!.length > 0) state.groupCode = res.data![0].groupCode!
  })

  let endDate = new Date()
  let startDate = subtractDays(new Date(), 7)
  state.queryDateRange = [formatDate(startDate, 'YYYY-mm-dd'), formatDate(endDate, 'YYYY-mm-dd')]

  await new BaseSampleTypeApi()
    .getAll()
    .then((res) => {
      state.sampleTypeList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
  new DictApi().getList(['Gender', 'AgeUnit', 'SampleProperty']).then((res) => {
    state.genderList = res.data!.gender
    state.ageUnitList = res.data!.ageUnit
    state.samplePropertyList = res.data!.sampleProperty
  })

  if (examId != undefined && examId > 0) {
    querySampleList(examId)
  }
})

//#region 筛选逻辑

const handleFilter = () => {
  let res = state.allSamples
  // 状态筛选
  if (state.statusFilter && state.statusFilter.length > 0) {
    res = res.filter((item) => state.statusFilter.includes(item.sampleStatus))
  }
  // 文本筛选
  if (state.searchText) {
    const lower = state.searchText.toLowerCase()
    res = res.filter((item) => item.barcode?.toLowerCase().includes(lower) == true || item.patientName?.toLowerCase()?.includes(lower) == true)
  }
  state.filteredList = res
  console.log(state.filteredList)
  const $table = sampleListTableRef.value
  if (res && res.length > 0) {
    if (res.findIndex((v) => v.id == activeId.value) < 0) {
      switchSample(res[0])
      $table!.setCurrentRow(res[0])
    }
  }
  nextTick(() => {
    $table!.setAllRowGroupExpand(true)
  })
}

watch([state.statusFilter], handleFilter) //searchText
//#endregion 1. 筛选逻辑

//#region 拖拽布局
const leftWidth = ref(280)
const rightWidth = ref(300)
const isResizing = ref(false)
const resizeTarget = ref('')
const startX = ref(0)
const startWidth = ref(0)

const startResize = (e: any, target: string) => {
  isResizing.value = true
  resizeTarget.value = target
  startX.value = e.clientX
  startWidth.value = target === 'left' ? leftWidth.value : rightWidth.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}
const onResize = (e: any) => {
  if (!isResizing.value) return
  const offset = e.clientX - startX.value
  if (resizeTarget.value === 'left') {
    const w = startWidth.value + offset
    if (w > 200 && w < 500) leftWidth.value = w
  } else {
    const w = startWidth.value - offset
    if (w > 220 && w < 600) rightWidth.value = w
  }
}
const stopResize = () => {
  isResizing.value = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}
//#endregion 拖拽布局

//#region 业务逻辑
const groupChange = (value: String) => {
  state.allSamples = []
  state.filteredList = []
  state.resultList = []
  currentSample.value = null
}
const querySampleList = (examId?: number) => {
  var queryParam = {}

  if (examId != undefined && examId > 0) {
    queryParam = {
      examInfoId: examId,
    } as ExamListQueryInput
  } else {
    queryParam = {
      groupCode: state.groupCode,
      beginDate: state.queryDateRange[0],
      endDate: state.queryDateRange[1],
    } as ExamListQueryInput
  }
  console.log(queryParam)
  new SampleTestApi().getSampleList(queryParam, { showErrorMessage: true }).then((res) => {
    if (res.data && res.data.length > 0) {
      res.data.forEach((item) => {
        item.testDate = new Date(item.testDate)
        if (item.collectTime) item.collectTime = new Date(item.collectTime)
      })

      if (examId != undefined && examId > 0) {
        state.queryDateRange = [formatDate(res.data![0].testDate, 'YYYY-mm-dd'), formatDate(res.data![0].testDate, 'YYYY-mm-dd')]
        state.groupCode = res.data![0].groupCode!
        history.state.examId = null
      }

      state.allSamples = res.data ?? []
      state.totalCount = state.allSamples.length
      if (state.allSamples.length > 0) {
        activeId.value = state.allSamples[0].id
        let filterData = state.allSamples
        state.filteredList = filterData
        console.log('state.filteredList', state.filteredList)
        switchSample(state.allSamples[0])

        const $table = sampleListTableRef.value
        $table!.setCurrentRow(state.allSamples[0])
        nextTick(() => {
          $table!.setAllRowGroupExpand(true)
        })
      }
    } else {
      console.log('no data')
      state.allSamples = []
      state.totalCount = 0
      activeId.value = -1
      state.filteredList = []
      state.resultList = []
      moreTab.value.clearSelectedTab()
    }
  })
}
const convertToTreeData = (examList: ExamInfoOutput[]): ExamListTreeData[] => {
  // 按 testDate 分组
  const grouped = examList.reduce(
    (acc, item) => {
      const dateKey = formatDate(item.testDate!, 'YYYY-mm-dd')
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(item)
      return acc
    },
    {} as Record<string, ExamInfoOutput[]>
  )

  // 转换为树形结构
  return Object.entries(grouped).map(([dateString, items], index) => {
    // 创建父节点
    const parentNode: ExamListTreeData = {
      testDate: new Date(dateString),
      parent: '',
      children: items,
      id: -index - 1,
      barcode: '',
      hasCritical: false,
    }

    return parentNode
  })
}
// const currentSample = computed(() => state.allSamples.find((i) => i.id === state.activeId))
const currentSample = ref({} as ExamInfoOutput | null)

watch(activeId, (newValue) => {
  let curr = state.allSamples.find((i) => i.id === activeId.value)
  if (curr) {
    currentSample.value = curr
    nextTick(() => {
      moreTab.value.refreshSelectedTab()
    })
  } else currentSample.value = null
  console.log('currentSample', currentSample.value)
})

const switchSample = (row: ExamInfoOutput) => {
  const $table = sampleListTableRef.value
  if ($table && !$table.isAggregateRecord(row)) {
    activeId.value = row.id
    console.log('activeId', activeId.value)
    if (activeId.value > 0) {
      new SampleTestApi().getResultList({ examInfoId: row.id }, { showErrorMessage: true }).then((res) => {
        if (res.data) {
          res.data.forEach((item) => {
            item.isEditing = false
            item.originalItemResult = item.itemResult
          })
        }
        state.resultList = res.data!
        console.log(state.resultList)
      })
    }
  }
}
/**
 * 操作
 */
const handleOperation = (command: string | number | object) => {
  console.log(command)
  if (currentSample.value == null || currentSample.value.id == 0) {
    return
  }
  if (command === 'RefreshItemInfo') {
    new SampleTestApi().refreshItemInfo({ examInfoId: currentSample.value!.id, isForce: 0 }, { showErrorMessage: true }).then((res) => {
      if (res.success) {
        modal.msgSuccess('刷新成功')
      }
    })
  } else if (command === 'AddItem') {
    addItem()
  } else if (command === 'DeleteItem') {
    deleteItem()
  } else if (command === 'CancelTest') {
    cancelTest()
  }
}
/**
 * 审核
 * @param type
 */
const audit = (type: OperationTypeEnum, ignoreRuleCodes?: string[]) => {
  if (currentSample.value == null) return
  let param = {
    examInfoId: currentSample.value!.id,
    auditType: type,
    executeType: ExecuteTypeEnum.Single,
    ignoreAuditRuleCodes: ignoreRuleCodes,
  } as AuditInput
  new SampleTestApi().audit(param).then((res) => {
    if (res.success) {
      if (res.data?.triggerRules != null && res.data?.triggerRules.length > 0) {
        if (res.data?.triggerRules.some((item) => item.noticeType == 1)) {
          let forbidendRules = res.data?.triggerRules.filter((item) => item.noticeType == 1)
          modal.msgError('审核失败：' + forbidendRules.map((item) => item.noticeMessage).join('\n'))
        } else if (res.data?.triggerRules.some((item) => item.noticeType == 0)) {
          let warningRules = res.data?.triggerRules.filter((item) => item.noticeType == 0)
          let warningRuleCodes = warningRules.map((item) => item.ruleCode!)
          modal.confirm('审核失败：' + warningRules.map((item) => item.noticeMessage).join('\n'), {}).then(() => {
            audit(type, warningRuleCodes)
          })
        }
        return
      }
      let cur = state.allSamples.find((item) => item.id == currentSample.value!.id)
      if (cur) {
        let exam = res.data?.examInfo
        cur!.sampleStatus = exam?.sampleStatus
        cur!.sampleStatusName = exam?.sampleStatusName
        if (type == OperationTypeEnum.FirstCheck) {
          cur!.firstAuditId = exam?.firstAuditId
          cur!.firstAuditName = exam?.firstAuditName
          cur!.firstAuditTime = exam?.firstAuditTime
          cur!.firstAuditAuthorizedId = exam?.firstAuditAuthorizedId
        } else if (type == OperationTypeEnum.SecondCheck) {
          cur!.secondAuditId = exam?.secondAuditId
          cur!.secondAuditName = exam?.secondAuditName
          cur!.secondAuditTime = exam?.secondAuditTime
          cur!.secondAuditAuthorizedId = exam?.secondAuditAuthorizedId
        }
      }
      modal.msgSuccess('审核成功')
    }
  })
}
/**
 * 反审核
 */
const unAudit = () => {
  if (currentSample.value == null) return

  modal.prompt('请输入反审核原因', null).then(({ value }) => {
    let param = {
      examInfoId: currentSample.value!.id,
      reasonCode: '1001',
      reasonContent: value,
      executeType: ExecuteTypeEnum.Single,
    } as UnAuditInput

    new SampleTestApi().unAudit(param).then((res) => {
      if (res.success) {
        let cur = state.allSamples.find((item) => item.id == currentSample.value!.id)
        if (cur) {
          cur!.sampleStatus = res.data?.sampleStatus
          cur!.sampleStatusName = res.data?.sampleStatusName
          cur!.firstAuditId = res.data?.firstAuditId
          cur!.firstAuditName = res.data?.firstAuditName
          cur!.firstAuditTime = res.data?.firstAuditTime
          cur!.firstAuditAuthorizedId = res.data?.firstAuditAuthorizedId
          cur!.secondAuditId = res.data?.secondAuditId
          cur!.secondAuditName = res.data?.secondAuditName
          cur!.secondAuditTime = res.data?.secondAuditTime
          cur!.secondAuditAuthorizedId = res.data?.secondAuditAuthorizedId
          cur!.printReportTime = res.data?.printReportTime
          cur!.downloadFlag = res.data?.downloadFlag
          cur!.createReportTime = res.data?.createReportTime
        }
        modal.msgSuccess('反审核成功')
      }
    })
  })
}

const preView = () => {
  if (activeId.value <= 0) return
  previewRef.value.preview()
}
/**
 * 增项
 */
const addItem = () => {
  // state.historyResultShow = true
  // return

  if (activeId.value < 0) return
  console.log('purposeSelectRef', purposeSelectRef.value)
  purposeSelectRef.value.open(currentSample.value!.customerCode, '')
}
const confirmSelectItem = (selectItems: PurposeAndComboOutput[]) => {
  if (selectItems && selectItems.findIndex((v) => v.isCombo == false) >= 0) {
    state.addOrRemoveItemInput.purCodes = selectItems.filter((v) => v.isCombo == false).map((v) => v.purCode!)
  } else if (selectItems && selectItems.findIndex((v) => v.isCombo) >= 0) {
    state.addOrRemoveItemInput.comboCodes = selectItems.filter((v) => v.isCombo).map((v) => v.purCode!)
  }
  state.addOrRemoveItemInput.examInfoId = currentSample.value!.id

  new SampleTestApi().addItem(state.addOrRemoveItemInput).then((res) => {
    if (res.success) {
      modal.msgSuccess('增项成功')
      nextTick(() => {
        let curr = state.allSamples.find((i) => i.id === activeId.value)
        if (curr) {
          curr!.purCodes = res.data?.purCodes
          curr!.purNames = res.data?.purNames
          moreTab.value.refreshSelectedTab()
          switchSample(curr)
        }
      })
    }
  })
}
/**
 * 退项
 */
const deleteItem = () => {
  console.log('resultList.length', state.resultList.length)
  if (activeId.value < 0) return
  if (state.resultList.length <= 0) return

  state.delItemDataList = Array.from(
    new Map(state.resultList.map((item) => [item.purCode, { purCode: item.purCode, purName: item.purName } as BasePurposeOutput])).values()
  )
  console.log('state.delItemDataList', state.delItemDataList)
  state.delItemDialogShow = true
}
const onConfirmSelectDelItem = () => {
  let selectItems = (delItemSelectRef.value.getSelectionRows() ?? []) as BasePurposeOutput[]
  console.log('selectItems', selectItems)
  state.delItemDialogShow = false
  if (selectItems.length <= 0) return
  new SampleTestApi().backItem({ examInfoId: currentSample.value!.id, purCodes: selectItems.map((v) => v.purCode!) }).then((res) => {
    if (res.success) {
      modal.msgSuccess('退项成功')
      nextTick(() => {
        let curr = state.allSamples.find((i) => i.id === activeId.value)
        if (curr) {
          curr!.purCodes = res.data?.purCodes
          curr!.purNames = res.data?.purNames
          moreTab.value.refreshSelectedTab()
          switchSample(curr)
        }
      })
    }
  })
}

/**
 * 取消检测
 */
const cancelTest = () => {
  if (activeId.value < 0) return

  modal.prompt('请输入反审核原因', null).then(({ value }) => {
    let param = {
      examInfoId: currentSample.value!.id,
      reasonCode: '1001',
      reasonContent: value,
      executeType: ExecuteTypeEnum.Single,
    } as CancelTestInput

    new SampleTestApi().cancelTest(param).then((res) => {
      if (res.success) {
        modal.msgSuccess('取消检测成功')
        let curr = state.allSamples.find((i) => i.id === activeId.value)
        if (curr) {
          curr!.sampleStatus = res.data?.sampleStatus
          curr!.sampleStatusName = res.data?.sampleStatusName
          // moreTab.value.refreshSelectedTab()
          switchSample(curr)
        }
      }
    })
  })
}

const moreTabVisableChange = (tabName: string) => {
  if (tabName) {
    console.log('tabName', tabName)
    moreTab.value.refreshSelectedTab()
  }
}
//#endregion 业务逻辑

//#region 检验结果编辑
const vFocus = { mounted: (el: any) => el.querySelector('input')?.focus() }
const startEdit = (row: ExamResultOutput) => {
  console.log('currentSample', currentSample.value)
  if (
    currentSample.value?.sampleStatus != SampleStatus.Testing.toString() &&
    currentSample.value?.sampleStatus != SampleStatus.ReportDelay.toString()
  )
    return
  row.isEditing = true
}
const finishEdit = (row: ExamResultOutput) => {
  console.log('row', row)
  row.isEditing = false
  if (row.itemResult !== row.originalItemResult) saveResult(row)
}

const saveResult = (row: ExamResultOutput) => {
  new SampleTestApi().saveItemResult(row).then((res) => {
    if (res.success) {
      state.resultList.forEach((v) => {
        if (v.id == row.id) {
          v.hlFlag = res.data?.hlFlag
          v.itemResult = res.data?.itemResult
          v.originalItemResult = res.data?.itemResult
          console.log('v', v)
          if (v.isCriticalValue) {
            state.allSamples.find((x) => x.id == v.examInfoId)!.hasCritical = true
          }
        }
      })
      modal.msgSuccess('保存成功')
    }
  })
}

//#endregion 检验结果编辑

//#region 基础信息编辑
const editDialogVisible = ref(false)
const editForm = reactive({} as any)
let originalSnapshot = {} as any // 不需要响应式，普通对象即可

const openEditDialog = () => {
  if (!currentSample.value) return
  if (
    currentSample.value?.sampleStatus != SampleStatus.Testing.toString() &&
    currentSample.value?.sampleStatus != SampleStatus.ReportDelay.toString()
  )
    return

  // 1. 深拷贝或浅拷贝创建快照
  // 这里的 patient 是扁平结构，浅拷贝 { ...obj } 足够
  originalSnapshot = { ...currentSample.value }

  // 2. 赋值给表单
  Object.keys(editForm).forEach((k: any) => delete editForm[k]) // 清理旧key
  Object.assign(editForm, originalSnapshot)

  editDialogVisible.value = true
}

// 辅助：判断是否修改
const isModified = (key: string) => {
  let editVal = editForm[key]
  let oriVal = originalSnapshot[key]
  if (editVal instanceof Date || oriVal instanceof Date) {
    var result = DateTimeComparator.compare(editVal, oriVal, { useUTC: true })
    return !result
  } else {
    return editForm[key] !== originalSnapshot[key]
  }
}

const savePatientInfo = () => {
  const target = state.allSamples.find((i) => i.id === activeId.value)
  if (!target) return

  // 1. 计算差异
  const changes = {} as any
  Object.keys(editForm).forEach((key) => {
    if (editForm[key] !== originalSnapshot[key]) {
      changes[key] = editForm[key]
    }
  })

  // 2. 判断是否有修改
  const changedKeys = Object.keys(changes)
  if (changedKeys.length === 0) {
    ElMessage.info('数据未发生变化')
    editDialogVisible.value = false
    return
  }

  let param = {
    examInfo: { id: target.id, ...changes },
    updateFields: changedKeys,
  } as UpdatePatientInfoInput

  console.log('param', param)

  new SampleTestApi().updatePatientInfo(param).then((res) => {
    if (res.success) {
      modal.msgSuccess('保存成功')
      Object.assign(target, changes)
      state.allSamples = [...state.allSamples] // 触发视图更新
      handleFilter() // 刷新列表显示的姓名等

      ElMessage.success(`已更新字段: ${changedKeys.join(', ')}`)
      editDialogVisible.value = false
    }
  })
  // 3. (模拟) 发送请求
  // API.patch(`/patient/${target.patient.id}`, changes)
  // console.log('提交到后端的 Payload:', {
  //   sampleId: target.id,
  //   patientId: target.id,
  //   ...changes, // 只包含 { name: '新名字' } 这种
  // })

  // 4. 更新前端本地数据
  // Object.assign(target, changes)
  // state.allSamples = [...state.allSamples] // 触发视图更新
  // handleFilter() // 刷新列表显示的姓名等

  // ElMessage.success(`已更新字段: ${changedKeys.join(', ')}`)
  // editDialogVisible.value = false
}
//#endregion 基础信息编辑

// 样式辅助
const tableRowClassName = (row: ExamResultOutput) => (row.hlFlag === 'H' ? 'row-high' : row.hlFlag === 'L' ? 'row-low' : '')
const getAbnormalClass = (s: string) => (s === 'H' ? 'input-high' : s === 'L' ? 'input-low' : '')
const getAbnormalTextClass = (s: string) => (s === 'H' ? 'text-high' : s === 'L' ? 'text-low' : '')
</script>

<style lang="scss" scoped>
/* 保持之前的 CSS 样式，增加 dot 样式 */
.lis-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
}
.lis-header {
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  flex-shrink: 0;
  z-index: 0;
}
.brand {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
  display: flex;
  align-items: center;
}
.lis-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  height: calc(100vh - 48px);
}
.panel-left,
.panel-right {
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;
}
.panel-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  height: 100%;
}
.el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: none;
  :deep(.el-card__header) {
    padding: 8px 12px;
    background: #fafafa;
    flex-shrink: 0;
  }
  :deep(.el-card__body) {
    padding: 0;
    flex: 1;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }
}
.virtual-list-container {
  flex: 1;
  width: 100%;
  height: 400px;
  overflow: hidden;
}
.resizer {
  width: 6px;
  background: #f2f2f2;
  cursor: col-resize;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  &:hover {
    background: #e6e6e6;
    .resizer-grip {
      background: #409eff;
    }
  }
}
.resizer-grip {
  width: 2px;
  height: 16px;
  background: #ccc;
}

.virtual-item-card {
  box-sizing: border-box;
  height: 76px;
  width: 100%;
  margin: 4px 8px;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    background: #f9fafc;
  }
  &.is-active {
    background: #ecf5ff;
    border-color: #409eff;
    box-shadow: inset 3px 0 0 #409eff;
  }
  .item-top {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 14px;
  }
  .item-mid {
    font-size: 12px;
    color: #606266;
  }
  .item-bottom {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #909399;
  }
}
.list-header-wrapper {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}
.list-footer {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  color: #909399;
  background: #fafafa;
  border-top: 1px solid #ebeef5;
  flex-shrink: 0;
}

.cell-viewer {
  width: 100%;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  &:hover {
    background: #f5f7fa;
  }
  .placeholder {
    color: #ccc;
    font-size: 12px;
    font-style: italic;
  }
}
.cell-editor :deep(.el-input__inner) {
  height: 24px;
  padding: 0 5px;
}

.text-high {
  color: #f56c6c;
  font-weight: bold;
}
.text-low {
  color: #409eff;
  font-weight: bold;
}
.flag-high {
  color: #f56c6c;
  margin-left: 3px;
}
.flag-critical {
  color: #f84747;
  margin-left: 3px;
}
.flag-low {
  color: #409eff;
  margin-left: 3px;
}

:deep(.row-high) {
  --el-table-tr-bg-color: #fef0f0;
}
:deep(.row-low) {
  --el-table-tr-bg-color: #ecf5ff;
}
.input-high :deep(.el-input__inner) {
  color: #f56c6c;
  font-weight: bold;
}
.input-low :deep(.el-input__inner) {
  color: #409eff;
  font-weight: bold;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: bold;
}
.info-content {
  padding: 15px;
  overflow-y: auto;
  height: 100%;
}
.empty-state {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-lg {
  font-size: 16px;
  font-weight: bold;
}
.barcode-text {
  color: #409eff;
  font-family: monospace;
  font-weight: 600;
}
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 标记修改样式 */
.is-modified :deep(.el-input__wrapper),
.is-modified :deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #e6a23c inset;
  background-color: #fdf6ec;
}
.dot {
  margin-right: 4px;
  font-weight: bold;
  &.danger {
    color: #f56c6c;
  }
  &.warning {
    color: #e6a23c;
  }
  &.success {
    color: #67c23a;
  }
}
/* 修改后的输入框边框变色 */
.is-modified :deep(.el-input__wrapper),
.is-modified :deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #e6a23c inset; /* 橙色高亮 */
  background-color: #fdf6ec;
}

/* Radio Group 的特殊处理 */
.is-modified-border {
  padding: 5px;
  border: 1px dashed #e6a23c;
  border-radius: 4px;
  background-color: #fdf6ec;
}

.original-value-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
  line-height: 1.2;
}
</style>

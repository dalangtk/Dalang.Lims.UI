<template>
  <div class="my-layout w100 lims-layout">
    <!-- 1. 左侧：基本信息录入 -->
    <aside class="panel left-panel">
      <div class="panel-header">
        <el-icon><User /></el-icon> 患者基本信息
      </div>
      <el-scrollbar>
        <el-form :model="formData" size="small" label-position="right" label-width="70" class="entry-form">
          <el-form-item label="条码">
            <el-input
              v-model="formData.barcode"
              placeholder="请输入条码"
              @dblclick.native="onCtrlDoubleClick('barcode')"
              @change="barcodeChange"
              clearable
            />
          </el-form-item>
          <el-form-item label="患者姓名">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.patientName" class="item" :offset="[10, 5]">
                <span>患者姓名</span>
              </el-badge>
            </template>
            <el-input v-model="formData.patientName" @dblclick.native="onCtrlDoubleClick('patientName')" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="性别">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.genderCode" class="item" :offset="[10, 5]">
                <span>性别</span>
              </el-badge>
            </template>
            <el-select
              v-model="formData.genderCode"
              @dblclick.native="onCtrlDoubleClick('genderCode')"
              @change="genderChange"
              placeholder="性别"
              clearable
            >
              <el-option v-for="item in state.genderList" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="年龄1">
                <template #label>
                  <el-badge is-dot :hidden="!rememberProp.age1" class="item" :offset="[10, 5]">
                    <span>年龄1</span>
                  </el-badge>
                </template>
                <el-input v-model="formData.age1" @dblclick.native="onCtrlDoubleClick('age1')" placeholder="年龄1" clearable> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位1">
                <template #label>
                  <el-badge is-dot :hidden="!rememberProp.ageUnit1" class="item" :offset="[10, 5]">
                    <span>单位1</span>
                  </el-badge>
                </template>
                <el-select
                  v-model="formData.ageUnit1"
                  @dblclick.native="onCtrlDoubleClick('ageUnit1')"
                  placeholder="单位1"
                  @change="(value: string) => ageUnitChange('1', value)"
                >
                  <el-option v-for="item in state.ageUnitList" :key="item.value" :label="item.name" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="年龄2">
                <template #label>
                  <el-badge is-dot :hidden="!rememberProp.age2" class="item" :offset="[10, 5]">
                    <span>年龄2</span>
                  </el-badge>
                </template>
                <el-input v-model="formData.age2" @dblclick.native="onCtrlDoubleClick('age2')" placeholder="年龄2" clearable> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位2">
                <template #label>
                  <el-badge is-dot :hidden="!rememberProp.ageUnit2" class="item" :offset="[10, 5]">
                    <span>单位2</span>
                  </el-badge>
                </template>
                <el-select
                  v-model="formData.ageUnit2"
                  @dblclick.native="onCtrlDoubleClick('ageUnit2')"
                  placeholder="单位2"
                  @change="(value: string) => ageUnitChange('2', value)"
                >
                  <el-option v-for="item in state.ageUnitList" :key="item.value" :label="item.name" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="加急">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.isUrgent" class="item" :offset="[10, 5]">
                <span>加急</span>
              </el-badge>
            </template>
            <el-select v-model="formData.isUrgent" @dblclick.native="onCtrlDoubleClick('isUrgent')" placeholder="加急状态" clearable>
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>

          <el-form-item label="科室/病区">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.department" class="item" :offset="[10, 5]">
                <span>科室/病区</span>
              </el-badge>
            </template>
            <el-select v-model="formData.department" @dblclick.native="onCtrlDoubleClick('department')" filterable placeholder="选择科室" clearable>
              <el-option v-for="d in state.depts" :key="d.code" :label="d.name" :value="d.name" />
            </el-select>
          </el-form-item>

          <el-form-item label="病区">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.ward" class="item" :offset="[10, 5]">
                <span>病区</span>
              </el-badge>
            </template>
            <el-input v-model="formData.ward" @dblclick.native="onCtrlDoubleClick('ward')" placeholder="病区" clearable />
          </el-form-item>

          <el-form-item label="送检医生">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.doctor" class="item" :offset="[10, 5]">
                <span>送检医生</span>
              </el-badge>
            </template>
            <el-input v-model="formData.doctor" @dblclick.native="onCtrlDoubleClick('doctor')" placeholder="医生姓名" clearable />
          </el-form-item>

          <el-form-item label="床号">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.bedNo" class="item" :offset="[10, 5]">
                <span>床号</span>
              </el-badge>
            </template>
            <el-input v-model="formData.bedNo" @dblclick.native="onCtrlDoubleClick('bedNo')" placeholder="床号" clearable />
          </el-form-item>

          <el-form-item label="病员号">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.patientId" class="item" :offset="[10, 5]">
                <span>病员号</span>
              </el-badge>
            </template>
            <el-input v-model="formData.patientId" @dblclick.native="onCtrlDoubleClick('patientId')" placeholder="病员号" clearable />
          </el-form-item>
          <el-form-item label="客户条码">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.customerBarcode" class="item" :offset="[10, 5]">
                <span>客户条码</span>
              </el-badge>
            </template>
            <el-input v-model="formData.customerBarcode" @dblclick.native="onCtrlDoubleClick('customerBarcode')" placeholder="客户条码" clearable />
          </el-form-item>
          <el-form-item label="采集时间">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.collectTime" class="item" :offset="[10, 5]">
                <span>采集时间</span>
              </el-badge>
            </template>
            <el-date-picker
              v-model="formData.collectTime"
              :show-now="false"
              popper-style="display:none"
              type="datetime"
              placeholder="采集时间"
              @dblclick.native="onCtrlDoubleClick('collectTime')"
              format="YYYY-MM-DD HH:mm"
            />
          </el-form-item>

          <el-form-item label="送检类型">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.patientTypeCode" class="item" :offset="[10, 5]">
                <span>送检类型</span>
              </el-badge>
            </template>
            <el-select
              v-model="formData.patientTypeCode"
              @dblclick.native="onCtrlDoubleClick('patientTypeCode')"
              placeholder="送检类型"
              @change="patientTypeChange"
              clearable
            >
              <el-option v-for="d in state.patientTypeList" :key="d.value" :label="d.name" :value="d.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="联系电话">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.phone" class="item" :offset="[10, 5]">
                <span>联系电话</span>
              </el-badge>
            </template>
            <el-input v-model="formData.phone" @dblclick.native="onCtrlDoubleClick('phone')" placeholder="电话" clearable />
          </el-form-item>

          <el-form-item label="备注">
            <template #label>
              <el-badge is-dot :hidden="!rememberProp.remark" class="item" :offset="[10, 5]">
                <span>备注</span>
              </el-badge>
            </template>
            <el-input v-model="formData.remark" @dblclick.native="onCtrlDoubleClick('remark')" type="textarea" placeholder="备注" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="finalSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </aside>

    <!-- 2. 中间：申请单图片查看 -->
    <main class="panel middle-panel">
      <div class="item-select">
        <el-select
          value-key="code"
          v-if="props.showItem"
          v-model="state.selectedItems"
          multiple
          filterable
          clearable
          :default-first-option="true"
          placeholder="搜索并选择项目"
          :filter-method="filterTestItem"
          style="width: 100%"
          @change="testItemChange"
        >
          <el-option v-for="p in displayOptions" :key="p.purCode" :label="p.purCode + '-' + p.purName" :value="p.purCode + '-' + p.purName">
            <template #default>
              <el-tag v-if="p.isCombo" type="success" size="small" style="margin-left: 8px">【套】</el-tag>
              <el-tag size="small" style="margin-left: 8px">{{ p.purCode }}</el-tag>
              <el-tag size="small" style="margin-left: 8px">{{ p.purName }}</el-tag>
              <el-tag v-if="p.sampleTypeName" size="small" style="margin-left: 8px">{{ p.sampleTypeName }}</el-tag>
              <el-tag v-if="p.purNameAB" size="small" style="margin-left: 8px">{{ p.purNameAB }}</el-tag>
            </template>
          </el-option>
        </el-select>
      </div>
      <div class="image-container" @wheel.passive="handleWheel" @mousedown="handleMouseDown">
        <img :src="props.imageUrl" :style="imageStyle" class="preview-img" draggable="false" />
        <!-- 悬浮操作栏 -->
        <div class="image-tools">
          <el-button-group>
            <el-button :icon="ZoomIn" @click="scale += 0.2" circle />
            <el-button :icon="ZoomOut" @click="scale > 0.2 && (scale -= 0.2)" circle />
            <el-button :icon="RefreshLeft" @click="rotate -= 90" circle />
            <el-button :icon="Refresh" @click="resetImage" circle />
          </el-button-group>
        </div>
      </div>
    </main>

    <!-- 3. 右侧：检测项目录入及列表 -->
    <aside class="panel right-panel" v-show="props.showItem">
      <el-tabs v-model="state.activeTab" class="right-tabs" default-value="itempane">
        <el-tab-pane label="项目" name="itempane">
          <el-table :data="tableData" size="small" border stripe height="100%">
            <el-table-column prop="comboName" label="套餐名称">
              <template #default="scope">
                <el-tag v-if="scope.row.isCombo" type="success">{{ scope.row.comboName }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="purName" label="项目名称" min-width="120" />
            <el-table-column prop="sampleTypeName" label="标本类型" width="130">
              <template #default="scope">
                <el-select v-model="scope.row.sampleTypeName" @change="(value: string) => handleSampleTypeChange(scope.row, value)">
                  <el-option v-for="item in scope.row.sampleTypeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width="50" align="center">
              <template #default="scope">
                <el-button type="danger" :icon="Delete" link @click="removeListItem(scope.$index)" />
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已录入" name="inputlist"> 已录入</el-tab-pane>
      </el-tabs>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { Refresh, RefreshLeft, User, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import { computed, onMounted, reactive, ref } from 'vue'
import { CodeNameOutput, DictGetListDto } from '/@/api/admin/data-contracts'
import { DictApi } from '/@/api/admin/Dict'
import { BaseComboApi } from '/@/api/lims/basedata/basecombo'
import { BasePurposeApi } from '/@/api/lims/basedata/basepurpose'
import { BaseComboWithPurcodesDto } from '/@/api/lims/basedata/datacontract/combo-datacontract'
import { InputOrderEnum, InputSaveDto, InputTypeEnum, TestItemOption } from '/@/api/lims/pretreatment/datacontract/sampleinput-datacontract'
import { SampleInputApi } from '/@/api/lims/pretreatment/sampleinput'
import modal from '/@/globalProperties/modal'
import { getTodayHour } from '/@/utils/formatTime'

const props = withDefaults(
  defineProps<{
    barcode?: string
    showItem?: boolean
    inputOrder?: InputOrderEnum
    inputType?: InputTypeEnum
    imageUrl?: string
  }>(),
  {
    barcode: '',
    showItem: true,
    inputOrder: InputOrderEnum.First,
    inputType: InputTypeEnum.Info,
    imageUrl: '', //https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg
  }
)

const state = reactive({
  genderList: [] as DictGetListDto[],
  ageUnitList: [] as DictGetListDto[],
  patientTypeList: [] as DictGetListDto[],
  activeTab: 'itempane',
  selectedItems: [] as string[],
  searchQuery: '',
  depts: [] as CodeNameOutput[],
  doctors: [] as CodeNameOutput[],
  purposeList: [] as TestItemOption[],
  testItemOptions: [] as TestItemOption[],
  generateComboList: [] as BaseComboWithPurcodesDto[],
  customerComboList: [] as BaseComboWithPurcodesDto[],
})
onMounted(() => {
  new DictApi().getList(['Gender', 'AgeUnit', 'InspectionType']).then((res) => {
    if (res.success) {
      state.genderList = res.data!.gender!
      state.ageUnitList = res.data!.ageUnit!
      state.patientTypeList = res.data!.inspectionType!
    }
  })

  new BaseComboApi().getComboWithPurcodes({ customerCode: '' }, { showErrorMessage: true }).then((res) => {
    if (res.success) {
      state.generateComboList = res.data!
    }
  })
})

const tableData = computed(() => {
  //根据state.selecteditems中，用-分隔，-前面的是目的代码，取testItemOptions中对应的项目名称和标本类型，显示在表格中
  let res = state.selectedItems.map((v) => {
    const purCode = v.split('-')[0]
    let tmp: TestItemOption[] = [] as TestItemOption[]
    if (purCode.startsWith('TC')) {
      let allCombo = [...state.customerComboList, ...state.generateComboList]
      let combo = allCombo.find((c) => c.comboCode === purCode)
      console.log('combo', combo)
      if (combo) {
        for (let i = 0; i < combo?.purposeList!.length; i++) {
          let currentPurCode = combo.purposeList[i]
          const option = state.testItemOptions.find((o) => o.purCode === currentPurCode)
          console.log('匹配选项1:', currentPurCode, option)
          let t = {
            purCode: currentPurCode,
            purName: option?.purName,
            groupCode: option?.groupCode,
            groupName: option?.groupName,
            sampleTypeCode: option?.sampleTypeCode,
            sampleTypeName: option?.sampleTypeName,
            isCombo: true,
            comboName: combo?.comboName,
            comboCode: combo.comboCode,
            sampleTypeList: option?.sampleTypeList,
          } as TestItemOption

          if (combo.sampleTypeCode && combo.sampleTypeName) {
            t.sampleTypeCode = combo.sampleTypeCode
            t.sampleTypeName = combo.sampleTypeName
            t.sampleTypeList = [
              {
                value: combo.sampleTypeCode!,
                label: combo.sampleTypeName!,
              },
            ]
          }

          tmp.push(t)
        }
      } else {
        console.warn('未找到对应的套餐信息:', purCode)
      }
    } else {
      const option = state.testItemOptions.find((o) => o.purCode === purCode)
      console.log('匹配选项2:', purCode, option)
      let t = {
        purCode: purCode,
        purName: option?.purName,
        groupCode: option?.groupCode,
        groupName: option?.groupName,
        sampleTypeCode: option?.sampleTypeCode,
        sampleTypeName: option?.sampleTypeName,
        isCombo: false,
        sampleTypeList: option?.sampleTypeList,
      } as TestItemOption
      tmp.push(t)
    }
    return tmp
  })
  console.log('表格数据:', res.flat())
  return res.flat()
})
const genderChange = (value: string) => {
  formData.genderName = state.genderList.find((g) => g.value === value)?.name!
}
const patientTypeChange = (value: string) => {
  formData.patientTypeName = state.patientTypeList.find((g) => g.value === value)?.name!
}
const ageUnitChange = (unitNo: string, value: string) => {
  if (unitNo == '1') {
    formData.ageUnitName1 = state.ageUnitList.find((g) => g.value === unitNo)?.name!
  } else {
    formData.ageUnitName2 = state.ageUnitList.find((g) => g.value === unitNo)?.name!
  }
}
const displayOptions = computed(() => {
  console.log('原始选项:', state.testItemOptions)
  const selectedCodes = state.selectedItems.map((v) => v.split('-')[0])
  return state.testItemOptions.filter((p) => {
    if (!formData.barcode) return false
    // 1. 隐藏已选项目
    if (selectedCodes.includes(p.purCode!)) return false

    // 2. 搜索过滤（支持名称和拼音）
    if (state.searchQuery) {
      const match = p.purName!.includes(state.searchQuery) || p.purNameAB?.toLowerCase()?.includes(state.searchQuery.toLowerCase())
      if (!match) return false
    }

    return true
  })
})

// --- 修改 filterTestItem 只更新搜索词 ---
const filterTestItem = (query: string) => {
  state.searchQuery = query
}

const rememberProp = reactive<Record<string, boolean>>({
  patientName: false,
  genderCode: false,
  age1: false,
  ageUnit1: false,
  age2: false,
  ageUnit2: false,
  isUrgent: false,
  doctor: false,
  department: false,
  ward: false,
  bedNo: false,
  patientId: false,
  customerBarcode: false,
  collectTime: false,
  patientTypeCode: false,
  phone: false,
  remark: false,
})

const onCtrlDoubleClick = (prop: string) => {
  rememberProp[prop] = !rememberProp[prop]
}

const formData = reactive({
  barcode: '',
  patientName: '',
  genderCode: '',
  genderName: '',
  age1: '',
  ageUnit1: '101',
  ageUnitName1: '岁',
  age2: '',
  ageUnit2: '101',
  ageUnitName2: '岁',
  isUrgent: 0,
  doctor: '',
  department: '',
  ward: '',
  bedNo: '',
  patientId: '',
  customerBarcode: '',
  collectTime: getTodayHour(8),
  patientTypeCode: '',
  patientTypeName: '',
  phone: '',
  remark: '',
})
const testItemChange = (value: string[]) => {
  console.log('选中项目:', value)
}
const barcodeChange = async () => {
  if (!formData.barcode) return
  if (formData.barcode.length !== 12) return

  let isUse = await checkBarcodeInUse(formData.barcode)
  if (isUse) {
    modal.alertError('条码已使用，请检查')
    return
  }

  let customerCode = formData.barcode.substring(0, 6)
  await getTestItems(customerCode)
}
const handleSampleTypeChange = (row: TestItemOption, value: string) => {
  row.sampleTypeCode = value
  row.sampleTypeName = value
}
const checkBarcodeInUse = async (barcode: string): Promise<boolean> => {
  const res = await new SampleInputApi().checkBarcodeInUse({ barcode }, { showErrorMessage: true })
  // 根据原有逻辑，res.success 为 true 表示条码已使用
  return res.data!
}
const getTestItems = async (customerCode: string) => {
  state.customerComboList = []
  await new BasePurposeApi().getPurposeWithPersonalizeName({ purCodes: [], customerCode }).then(async (res) => {
    if (res.success) {
      let tmp = res.data || []
      state.purposeList = tmp.map((item) => {
        return {
          purCode: item.purCode!,
          purName: item.purName!,
          groupCode: item.groupCode!,
          groupName: item.groupName!,
          purNameAB: item.purNameAB!,
          purNameEN: item.purNameEN!,
          sampleTypeCode: item.sampleTypeCode!,
          sampleTypeName: item.sampleTypeName!,
          isCombo: false,
          comboName: '',
          comboCode: '',
          //根据item.sampletypecode和sampletypename，可能会有逗号，按逗号分隔转成对应的下拉列表选项
          sampleTypeList:
            item.sampleTypeCode && item.sampleTypeName
              ? item.sampleTypeCode.split(',').map((code, index) => ({
                  value: code,
                  label: item.sampleTypeName!.split(',')[index] || '',
                }))
              : [],
        }
      })

      let r = await new BaseComboApi().getComboWithPurcodes({ customerCode: customerCode }, { showErrorMessage: true })
      if (r.success) {
        state.customerComboList = r.data!
      }
      state.testItemOptions = cloneDeep(state.purposeList)
      let customerCombo = state.customerComboList.map((c) => ({
        purCode: c.comboCode!,
        purName: c.comboName!,
        groupCode: '',
        groupName: '',
        purNameAB: '',
        purNameEN: '',
        sampleTypeCode: c.sampleTypeCode!,
        sampleTypeName: c.sampleTypeName!,
        isCombo: true,
        comboName: c.comboName || '',
        comboCode: c.comboCode || '',
        sampleTypeList: c.sampleTypeCode
          ? [
              {
                value: c.sampleTypeCode!,
                label: c.sampleTypeName!,
              },
            ]
          : [],
      }))

      let generateCombo = state.generateComboList.map((c) => ({
        purCode: c.comboCode!,
        purName: c.comboName!,
        groupCode: '',
        groupName: '',
        purNameAB: '',
        purNameEN: '',
        sampleTypeCode: c.sampleTypeCode!,
        sampleTypeName: c.sampleTypeName!,
        isCombo: true,
        comboName: c.comboName || '',
        comboCode: c.comboCode || '',
        sampleTypeList: c.sampleTypeCode
          ? [
              {
                value: c.sampleTypeCode!,
                label: c.sampleTypeName!,
              },
            ]
          : [],
      }))

      //把customerCombo插入到state.testItemOptions的前面
      state.testItemOptions = [...customerCombo, ...generateCombo, ...state.testItemOptions]
    }
  })
}
// --- 图片查看逻辑 ---
const scale = ref(1)
const rotate = ref(0)
const offset = reactive({ x: 0, y: 0 })
const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotate.value}deg) translate(${offset.x}px, ${offset.y}px)`,
}))

const resetImage = () => {
  scale.value = 1
  rotate.value = 0
  offset.x = 0
  offset.y = 0
}

const handleWheel = (e: any) => {
  e.deltaY < 0 ? (scale.value += 0.1) : scale.value > 0.2 && (scale.value -= 0.1)
}

const handleMouseDown = (e: any) => {
  const startX = e.clientX - offset.x
  const startY = e.clientY - offset.y
  const move = (me: any) => {
    offset.x = me.clientX - startX
    offset.y = me.clientY - startY
  }
  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

const finalSubmit = () => {
  if (props.showItem && state.selectedItems.length === 0) {
    modal.alertError('请至少选择一个检测项目')
    return
  }
  if (!formData.patientName) return modal.alertError('患者姓名必填')

  let item = [...tableData.value] as TestItemOption[]
  if (item.length > 0) {
    const seen = new Set()
    for (const i of item) {
      if (i.sampleTypeName?.indexOf(',')! > -1) {
        modal.alertError(`${i.purCode}-${i.purName}项目多标本类型，请调整！`)
        return
      }
      if (seen.has(i.purCode)) {
        modal.alertError(`${i.purCode}-${i.purName}项目重复，请检查！`)
        return
      }
      seen.add(i.purCode)
    }
  }
  const payload = {
    inputType: props.inputType,
    inputOrder: props.inputOrder,
    inputInfo: { ...formData },
    inputItems: [...tableData.value],
  } as InputSaveDto
  console.log('最终提交数据:', payload)
  new SampleInputApi().saveInfoAndItem(payload).then((res) => {
    console.log('saveInfoAndItem', res)
    if (res.success) {
      modal.msgSuccess('保存成功')
      resetData()
    }
  })
}

const resetData = () => {
  if (!rememberProp['patientName']) formData.patientName = ''
  if (!rememberProp['genderCode']) {
    formData.genderCode = ''
    formData.genderName = ''
  }
  if (!rememberProp['age1']) formData.age1 = ''
  if (!rememberProp['ageUnit1']) formData.ageUnit1 = '101'
  if (!rememberProp['age2']) formData.age2 = ''
  if (!rememberProp['ageUnit2']) formData.ageUnit2 = '101'
  if (!rememberProp['isUrgent']) formData.isUrgent = 0
  if (!rememberProp['doctor']) formData.doctor = ''
  if (!rememberProp['department']) formData.department = ''
  if (!rememberProp['ward']) formData.ward = ''
  if (!rememberProp['bedNo']) formData.bedNo = ''
  if (!rememberProp['patientId']) formData.patientId = ''
  if (!rememberProp['customerBarcode']) formData.customerBarcode = ''
  formData.collectTime = getTodayHour(8)
  if (!rememberProp['patientTypeCode']) {
    formData.patientTypeCode = ''
    formData.patientTypeName = ''
  }
  if (!rememberProp['phone']) formData.phone = ''
  if (!rememberProp['remark']) formData.remark = ''
  state.selectedItems = []

  formData.barcode = incrementBarcode(formData.barcode)
}

const incrementBarcode = (barcode: string): string => {
  const prefix = barcode.slice(0, 6)
  const suffix = barcode.slice(6)
  const suffixNum = parseInt(suffix)
  const newSuffixNum = suffixNum + 1
  const newSuffix = newSuffixNum.toString().padStart(6, '0')
  return prefix + newSuffix
}

defineExpose({
  // finalSubmit,
  // resetData
})
</script>

<style scoped>
.lims-layout {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  background-color: #f5f7fa;
  color: #333;
}

/* 通用面板样式 */
.panel {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e0e0e0;
}

.panel-header {
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  background: #fdfdfd;
  font-weight: bold;
  font-size: 14px;
  color: #409eff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 左侧栏 */
.left-panel {
  width: 280px;
  max-width: 280px;
  flex-shrink: 0;
  height: 100%;
}
.entry-form {
  padding: 15px;
}

/* 中间图片栏 */
.middle-panel {
  flex: 1;
  border-right: none;
  display: flex;
  flex-direction: column;
}
.item-select {
}
.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  position: relative;
}
.preview-img {
  max-width: 95%;
  max-height: 95%;
  transition: transform 0.1s;
}
.image-tools {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border-radius: 4px;
}

/* 右侧栏 */
.right-panel {
  margin-left: 5px;
  width: 350px;
  max-width: 350px;
  flex-shrink: 0;
  border-left: 1px solid #e0e0e0;
}
.right-tabs {
  height: 100%;
}

/* 覆盖 ElementPlus 紧凑样式 */
:deep(.el-form-item) {
  margin-bottom: 12px;
}
:deep(.el-form-item__label) {
  padding-bottom: 2px !important;
  font-size: 13px;
}
</style>

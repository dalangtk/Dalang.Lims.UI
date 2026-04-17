<template>
  <div>
    <el-dialog
      v-model="state.showDialog"
      :title="title"
      :show-close="false"
      draggable
      destroy-on-close
      :close-on-click-modal="false"
      :fullscreen="state.isFullScreen"
      class="my-dialog-form"
      :close-on-press-escape="false"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="dialogheader">
          <h4 :id="titleId" :class="titleClass">{{ title }}</h4>
          <div>
            <el-button link @click="fullScreen">
              <SvgIcon name="ele-FullScreen" />
            </el-button>
            <el-button link @click="close">
              <SvgIcon name="ele-Close" />
            </el-button>
          </div>
        </div>
      </template>
      <div class="itemcontainer">
        <el-form ref="formRef" :model="state.form" size="default" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="组别" prop="groupCode" :rules="[{ required: true, message: '请选择组别', trigger: ['blur', 'change'] }]">
                <el-select @change="groupChange" v-model="form.groupCode" filterable clearable>
                  <el-option v-for="item in state.groupList" :key="item.groupCode" :label="item.groupName" :value="item.groupCode"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组别名称" prop="groupName" v-show="editItemIsShow(true, true)">
                <el-input v-model="state.form.groupName" placeholder="组别名称"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目代码" prop="instrumentItemCode" v-show="editItemIsShow(true, true)">
                <el-input v-model="state.form.instrumentItemCode" placeholder="项目代码" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目名称" prop="instrumentItemName" v-show="editItemIsShow(true, true)">
                <el-input v-model="state.form.instrumentItemName" placeholder="项目名称"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="打印排序" prop="printOrder" v-show="editItemIsShow(true, true)">
                <el-input v-model="state.form.printOrder" placeholder="打印排序"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark" v-show="editItemIsShow(true, true)">
                <el-input v-model="state.form.remark" placeholder="备注"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" prop="sort" v-show="editItemIsShow(true, true)">
                <el-input v-model="state.form.sort" placeholder="排序"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="启用" prop="isValid" v-show="editItemIsShow(true, true)">
                <el-switch v-model="state.form.isValid" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSure" size="default" :loading="state.sureLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted } from 'vue'
import {
  BaseInstrumentItemAddInput,
  BaseInstrumentItemUpdateInput,
  BaseInstrumentItemDetailOutput,
} from '/@/api/lims/basedata/datacontract/instrumentitem-datacontract'
import { BaseInstrumentItemApi } from '/@/api/lims/basedata/baseinstrumentitem'
import eventBus from '/@/utils/mitt'
import { BaseGroupOutput } from '/@/api/lims/basedata/datacontract/group-datacontract'
import { BaseGroupApi } from '/@/api/lims/basedata/basegroup'
import modal from '/@/globalProperties/modal'

defineProps({
  title: {
    type: String,
    default: '',
  },
})
const formRef = ref()
const state = reactive({
  showDialog: false,
  sureLoading: false,
  form: {} as BaseInstrumentItemAddInput | BaseInstrumentItemUpdateInput | any,
  groupList: [] as BaseGroupOutput[],
  isFullScreen: false,
  itemDetailList: [] as BaseInstrumentItemDetailOutput[],
})
const { form } = toRefs(state)

onMounted(() => {
  new BaseGroupApi()
    .getAll()
    .then((res) => {
      state.groupList = res!.data!
    })
    .catch((e) => {
      modal.msgError(e)
    })
})
// 打开对话框
const open = async (row: any = {}) => {
  if (row.id > 0) {
    const res = await new BaseInstrumentItemApi().get({ id: row.id }, { loading: true }).catch(() => {
      modal.closeLoading()
    })

    if (res?.success) {
      state.form = res.data as BaseInstrumentItemUpdateInput
    }
  } else {
    state.form = defaultToAdd()
    state.itemDetailList = []
  }
  state.showDialog = true
}

const groupChange = (val: string) => {
  state.form.groupName = state.groupList.find((item) => item.groupCode == val)?.groupName!
}

const defaultToAdd = (): BaseInstrumentItemAddInput => {
  return {
    groupCode: '',
    groupName: '',
    instrumentItemCode: '',
    instrumentItemName: '',
    printOrder: null,
    remark: null,
    sort: 0,
    isValid: true,
  } as BaseInstrumentItemAddInput
}

// 取消
const onCancel = () => {
  state.showDialog = false
}

const fullScreen = () => {
  state.isFullScreen = !state.isFullScreen
}
// 确定
const onSure = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    state.sureLoading = true
    let res = {} as any
    if (state.form.id != undefined && state.form.id > 0) {
      res = await new BaseInstrumentItemApi().update(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    } else {
      res = await new BaseInstrumentItemApi().add(state.form, { showSuccessMessage: true }).catch(() => {
        state.sureLoading = false
      })
    }
    state.sureLoading = false

    if (res?.success) {
      eventBus.emit('refreshBaseInstrumentItem')
      state.showDialog = false
    }
  })
}

const editItemIsShow = (add: Boolean, edit: Boolean): Boolean => {
  if (add && edit) return true
  let isEdit = state.form.id != undefined && state.form.id > 0
  if (add && !isEdit) return true
  if (edit && isEdit) return true
  return false
}

defineExpose({
  open,
})
</script>

<style scoped lang="scss">
.itemcontainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .master {
    height: 50%;
  }
}

.dialogheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>

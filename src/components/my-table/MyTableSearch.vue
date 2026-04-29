<template>
  <div class="table-search-container" v-if="props.search.length > 0">
    <el-form ref="tableSearchRef" :model="state.form" size="default" class="table-form">
      <el-row :gutter="4" style="display: flex; align-items: center">
        <div style="flex: 1; display: flex">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="(val, key) in search" :key="key" v-show="key === 0 || key === 1 || state.isToggle">
            <template v-if="val.type !== ''">
              <el-form-item
                :label="val.label"
                :prop="val.prop"
                :rules="[{ required: val.required, message: `${val.label}不能为空`, trigger: val.type === 'input' ? 'blur' : 'change' }]"
              >
                <el-input
                  size="small"
                  v-model="state.form[val.prop]"
                  :placeholder="val.placeholder"
                  clearable
                  v-if="val.type === 'input'"
                  style="width: 100%"
                />
                <el-date-picker
                  size="small"
                  v-model="state.form[val.prop]"
                  :type="val.type"
                  :placeholder="val.placeholder"
                  v-else-if="val.type === 'date' || val.type === 'daterange'"
                  style="width: 100%"
                  :default-value="val.defaultVal"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
                <el-select
                  size="small"
                  v-model="state.form[val.prop]"
                  :placeholder="val.placeholder"
                  v-else-if="val.type === 'select'"
                  style="width: 100%"
                  clearable
                >
                  <el-option v-for="item in val.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-col>
        </div>
        <div style="width: 120px">
          <!-- :label-width="search.length <= 1 ? '10px' : '100px'" -->
          <el-form-item class="table-form-btn">
            <template #label v-if="search.length > 2">
              <div class="table-form-btn-toggle ml10" @click="state.isToggle = !state.isToggle">
                <span>{{ state.isToggle ? '收筛选' : '展筛选' }}</span>
                <SvgIcon :name="state.isToggle ? 'ele-ArrowUp' : 'ele-ArrowDown'" />
              </div>
            </template>
            <div>
              <el-button size="small" type="primary" @click="onSearch(tableSearchRef)">查询 </el-button>
              <el-button size="small" type="info" class="ml10" @click="onReset(tableSearchRef)"> 重置 </el-button>
            </div>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
interface NObject {
  [key: string]: string | number | undefined | null | void
}
// 定义父组件传过来的值
const props = defineProps({
  // 搜索表单
  search: {
    type: Array<TableSearchType>,
    default: () => [],
  },
})

// 定义子组件向父组件传值/事件
const emit = defineEmits(['search'])

// 定义变量内容
const tableSearchRef = ref<FormInstance>()
const state = reactive({
  form: {} as NObject,
  isToggle: false,
})

// 查询
const onSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('state.form',state.form)
      emit('search', state.form)
      console.log(state.form)
    } else {
      return false
    }
  })
}
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  emit('search', state.form)
}
// 初始化 form 字段，取自父组件 search.prop
const initFormField = () => {
  if (props.search.length <= 0) return false
  props.search.forEach((v) => {
    if (!v.defaultVal) state.form[v.prop] = ''
    else state.form[v.prop] = v.defaultVal
  })
}
// 页面加载时
onMounted(() => {
  initFormField()
})
</script>

<style scoped lang="scss">
.table-search-container {
  display: flex;
  background-color: white;
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
  .table-form {
    flex: 1;

    :deep(.el-col) {
      margin-bottom: 0 !important;
    }
    .table-form-btn {
      :deep(.el-form-item__content) {
        justify-content: flex-end !important;
      }
    }

    .table-form-btn-toggle {
      white-space: nowrap;
      user-select: none;
      display: flex;
      align-items: center;

      color: var(--el-color-primary);
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }
}
</style>

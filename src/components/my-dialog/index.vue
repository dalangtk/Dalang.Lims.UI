<template>
  <div class="fullscreen-dialog-wrapper">
    <el-dialog
      ref="dialogRef"
      v-model="visible"
      :title="title"
      :draggable="!isFullscreen"
      :class="dialogClass"
      v-bind="$attrs"
      :before-close="handleBeforeClose"
      @opened="handleOpened"
      :show-close="false"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="fullscreen-dialog-header">
          <span :id="titleId" :class="titleClass">{{ title }}</span>
          <div class="header-controls">
            <el-button v-if="showFullscreenBtn" link icon="ele-FullScreen" @click="toggleFullscreen"></el-button>
            <el-button v-if="showCloseBtn" link icon="ele-Close" @click="close"></el-button>
          </div>
        </div>
      </template>

      <div class="fullscreen-dialog-body" :class="{ 'is-fullscreen': isFullscreen }" :style="bodyStyle">
        <slot></slot>
      </div>

      <template v-if="$slots.footer" #footer>
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs, watch } from 'vue'
import { ElDialog, ElButton } from 'element-plus'

interface Props {
  modelValue?: boolean
  title?: string
  fullscreen?: boolean
  showFullscreenBtn?: boolean
  showCloseBtn?: boolean
  bodyStyle?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  fullscreen: false,
  showFullscreenBtn: true,
  showCloseBtn: true,
  bodyStyle: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'fullscreen-change', value: boolean): void
}>()

const attrs = useAttrs()
const dialogRef = ref<InstanceType<typeof ElDialog> | null>(null)

// 控制显示状态
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 全屏状态
const isFullscreen = ref(props.fullscreen)

// dialog class
const dialogClass = computed(() => ({
  'fullscreen-dialog': true,
  'is-fullscreen': isFullscreen.value,
}))

// 切换全屏状态
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('fullscreen-change', isFullscreen.value)
}

// 处理关闭前事件
const handleBeforeClose = (done: () => void) => {
  if (attrs['before-close']) {
    ;(attrs['before-close'] as Function)(done)
  } else {
    done()
  }
}

// 处理打开后事件
const handleOpened = () => {
  if (attrs['opened']) {
    ;(attrs['opened'] as Function)()
  }
}

// 监听外部 fullscreen 属性变化
watch(
  () => props.fullscreen,
  (val) => {
    isFullscreen.value = val
  }
)

defineExpose({
  dialogRef,
})
</script>

<style scoped lang="scss">
.fullscreen-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.fullscreen-dialog-body {
  height: 100%;

  &.is-fullscreen {
    height: calc(90vh - 110px);
  }
}

.header-controls {
  display: flex;
  gap: 8px;
}
</style>

<style lang="scss" scoped>
.fullscreen-dialog {
  &.is-fullscreen {
    --el-dialog-margin-top: 0;
    --el-dialog-border-radius: 0;

    .el-dialog {
      width: 100% !important;
      height: 100vh;
      margin: 0;
      border-radius: 0;

      .el-dialog__header {
        padding: 3px 3px;
      }

      .el-dialog__body {
        height: calc(100vh - 54px - 55px);
      }

      .el-dialog__footer {
        padding: 3px 3px;
      }
    }
  }
}
</style>

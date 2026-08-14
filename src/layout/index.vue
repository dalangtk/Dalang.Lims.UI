<template>
  <SuspendedBallChat
    :url="state.apiUrl"
    :app-name="state.appName"
    :domain-name="state.domainName"
    :enable-streaming="true"
    :enable-context="true"
    custom-icon-url="https://loveying.com.cn:9002/dlims/lims/2026/02/27/56a6c424-43ba-48da-aefa-04339750b6d3.png"
    :enable-local-storage="true"
    :enable-voice-input="true"
    :callbacks="state.callbacks"
    :enable-fullscreen-toggle="true"
  />
  <component :is="layouts[themeConfig.layout]" />
</template>

<script setup lang="ts" name="layout">
import { onBeforeMount, onUnmounted, defineAsyncComponent, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '/@/stores/themeConfig'
import { Local } from '/@/utils/storage'
import mittBus from '/@/utils/mitt'
import { SuspendedBallChat } from 'ai-suspended-ball-chat'

// 引入组件
const layouts: any = {
  defaults: defineAsyncComponent(() => import('/@/layout/main/defaults.vue')),
  classic: defineAsyncComponent(() => import('/@/layout/main/classic.vue')),
  transverse: defineAsyncComponent(() => import('/@/layout/main/transverse.vue')),
  columns: defineAsyncComponent(() => import('/@/layout/main/columns.vue')),
}

const state = reactive({
  apiUrl: import.meta.env.VITE_AGENT_API_URL,
  appName: 'my-app',
  domainName: 'localhost',
  callbacks: {
    onUserMessage: (message: any) => {
      console.log('用户发送消息:', message)
    },
    onAssistantMessage: (message: any, res: any) => {
      console.log('AI回复:', message, res)
    },
    onError: (error: any) => {
      console.error('发生错误:', error)
    },
  },
})

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const { themeConfig } = storeToRefs(storesThemeConfig)

// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
  if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout)
  const clientWidth = document.body.clientWidth
  if (clientWidth < 1000) {
    themeConfig.value.isCollapse = false
    mittBus.emit('layoutMobileResize', {
      layout: 'defaults',
      clientWidth,
    })
  } else {
    mittBus.emit('layoutMobileResize', {
      layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
      clientWidth,
    })
  }
}
// 页面加载前
onBeforeMount(() => {
  onLayoutResize()
  window.addEventListener('resize', onLayoutResize)
})
// 页面卸载时
onUnmounted(() => {
  window.removeEventListener('resize', onLayoutResize)
})
</script>

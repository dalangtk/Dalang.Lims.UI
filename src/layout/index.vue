<template>
  <SuspendedBallChat
    :url="state.apiUrl"
    :app-name="state.appName"
    :domain-name="state.domainName"
    :enable-streaming="true"
    :enable-context="true"
    custom-icon-url="https://loveying.com.cn:9092/api/v1/download-shared-object/aHR0cHM6Ly8xMjcuMC4wLjE6OTAwMC9kbGltcy9saW1zLzIwMjYvMDIvMjcvNTZhNmM0MjQtNDNiYS00OGRhLWFlZmEtMDQzMzk3NTBiNmQzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUg2SVlZRVc0TTlEOU1UV1VZTFFPJTJGMjAyNjA4MTElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwODExVDAyNTcwNFomWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSklOa2xaV1VWWE5FMDVSRGxOVkZkVldVeFJUeUlzSW1WNGNDSTZNVGM0TmpRMk1ERXhPQ3dpY0dGeVpXNTBJam9pWkd4cGJYTWlmUS5uQndFOVBKOHZPUjltckdmYkZoUHdxRzJJdlNBMkFUSUZ4X3NZczlvUlVacTFPYUdjZS01Qy1ZSEZwalhjM2xDa185NlVQV2V5c2FWWE9Ub3NDb0xKUSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPTYyMzg1OTk0ZmUzODcyODQ0ZDRiMTE0MzQ2OTllODE4ODQxMDAyOTI2ODgzNjViYjZhNjFiMzQwZjExOTlmY2M"
    :enable-local-storage="true"
    :enable-voice-input="true"
    :callbacks="state.callbacks"
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

import { wsInstance, MessageType, MessageCallback } from '/@/utils/websocket'
import { onUnmounted } from 'vue'

export function useWebSocket() {
  const isConnected = wsInstance.isConnected

  const sendMessage = (msg: string | Record<string, any>): boolean => {
    return wsInstance.send(msg)
  }

  // 通用订阅，支持自定义过滤
  const onMessage = (callback: MessageCallback, filter?: (data: any) => boolean): void => {
    const unsubscribe = wsInstance.subscribe(callback, filter)
    onUnmounted(() => {
      unsubscribe()
    })
  }

  // 按 MessageType 订阅
  const onMessageType = (type: MessageType, callback: (data: any) => void): void => {
    const filter = (data: any) => data?.type === type
    onMessage(callback, filter)
  }

  return {
    isConnected,
    sendMessage,
    onMessage,
    onMessageType,
  }
}

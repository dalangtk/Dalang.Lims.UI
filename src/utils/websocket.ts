import { ref, Ref } from 'vue'

export enum MessageType {
  printLabel,
  snapShot,
  changeExam,
}

// 定义消息数据类型
export type MessageData = {
  component: string
  type: MessageType
  accessToken: any
  data: any
}

export type MessageResult = {
  success: boolean
  msg: string
  type: MessageType
  component: string
}

type Subscriber = {
  callback: MessageCallback
  filter?: (data: any) => boolean
}

// 定义消息回调函数类型
export type MessageCallback = (data: MessageResult) => void

class WebSocketService {
  private url: string
  private ws: WebSocket | null = null
  public isConnected: Ref<boolean> = ref(false)
  private subscribers: Set<Subscriber> = new Set()

  // 自动重连配置
  private reconnectCount: number = 0
  private maxReconnect: number = 5000
  private reconnectTimer: number | null = null

  // 心跳配置
  private heartbeatTimer: number | null = null
  private heartbeatInterval: number = 30000

  constructor(url: string) {
    this.url = url
  }

  // 初始化连接
  public connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    this.ws = new WebSocket(this.url)

    this.ws.onopen = (): void => {
      console.log('[WebSocket] 连接成功')
      this.isConnected.value = true
      this.reconnectCount = 0
      this.startHeartbeat()
    }

    this.ws.onmessage = (event: MessageEvent): void => {
      this.startHeartbeat()

      let data: MessageResult = event.data
      try {
        data = JSON.parse(event.data as string)
      } catch (e) {
        // 如果不是 JSON 就保持原样
      }
      console.log('onmessage', data)
      // 分发消息给所有订阅者
      // this.subscribers.forEach((callback: MessageCallback) => callback(data))
      this.subscribers.forEach((sub) => {
        if (sub.filter) {
          if (sub.filter(data)) sub.callback(data)
        } else {
          sub.callback(data)
        }
      })
    }

    this.ws.onclose = (): void => {
      console.log('[WebSocket] 连接断开')
      this.isConnected.value = false
      this.stopHeartbeat()
      this.tryReconnect()
    }

    this.ws.onerror = (error: Event): void => {
      console.error('[WebSocket] 发生错误', error)
    }
  }

  // 发送消息
  public send(message: string | Record<string, any>): boolean {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const msgStr: string = typeof message === 'object' ? JSON.stringify(message) : message
        this.ws.send(msgStr)
        return true
      } else {
        console.warn('[WebSocket] 连接未建立，无法发送消息')
        return false
      }
    } catch (e) {
      console.error('[WebSocket] 发送消息失败', e)
      return false
    }
  }

  // 订阅消息
  public subscribe(callback: MessageCallback, filter?: (data: any) => boolean): () => void {
    const subscriber: Subscriber = { callback, filter }
    this.subscribers.add(subscriber)
    return () => {
      this.subscribers.delete(subscriber)
    }
  }

  // 心跳机制
  private startHeartbeat(): void {
    this.stopHeartbeat()
    this.heartbeatTimer = window.setInterval(() => {
      this.send({ type: 'ping' })
    }, this.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // 断线重连机制
  private tryReconnect(): void {
    if (this.reconnectCount >= this.maxReconnect) {
      console.log('[WebSocket] 达到最大重连次数，停止重连')
      return
    }
    // 计算指数退避时间: 1s, 2s, 4s, 8s, 16s, 最大 30s
    const delay = Math.min(1000 * Math.pow(2, this.reconnectCount), 30000)

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectCount++
      console.log(`[WebSocket] 尝试第 ${this.reconnectCount} 次重连...`)
      this.connect()
    }, delay)
  }

  // 主动关闭连接
  public close(): void {
    if (this.reconnectTimer !== null) clearTimeout(this.reconnectTimer)
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.onclose = null // 防止触发重连
      this.ws.close()
    }
  }
}

const wsUrl = 'ws://127.0.0.1:8080/ws'
export const wsInstance = new WebSocketService(wsUrl)

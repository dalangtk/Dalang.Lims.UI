// useFormium.ts
import { getCurrentInstance } from 'vue'
import modal from '../globalProperties/modal'

export const useFormium = () => {
  const instance = getCurrentInstance()
  if (!instance) throw new Error('useFormium must be called inside setup()')
  // @ts-ignore: reason: formium 是 window 上的全局变量
  const $formium = instance.proxy.$formium
  const sendRequestAsync = (handler: string, data: any) => {
    return new Promise((resolve, reject) => {
      if (!$formium) {
        reject(new Error('请在客户端打开！'))
        return
      }
      modal.loading('')
      $formium
        .sendRequestAsync(handler, JSON.stringify(data))
        .then((res: any) => {
          modal.closeLoading()
          resolve(JSON.parse(res))
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  }

  return { sendRequestAsync }
}

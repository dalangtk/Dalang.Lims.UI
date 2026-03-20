import { ElMessageBoxOptions, ElMessageBoxShortcutMethod } from 'element-plus'
export interface imodal {
  /**
   * 消息提示
   * @param content 消息提示内容
   */
  msg(content: any): void
  /**
   * 错误提示
   * @param content 错误提示内容
   */
  msgError(content: any): void
  /**
   * 成功提示
   * @param content 成功提示内容
   */
  msgSuccess(content: any): void
  /**
   * 警告提示
   * @param content 警告提示内容
   */
  msgWarning(content: any): void
  /**
   * 弹窗提醒
   * @param content 弹窗提醒内容
   */
  alert(content: any): void
  /**
   * 弹窗错误提示
   * @param content 错误提示内容
   */
  alertError(content: any): void
  /**
   * 弹窗成功提示
   * @param content 成功提示内容
   */
  alertSuccess(content: any): void
  /**
   * 弹窗警告提示
   * @param content 警告提示内容
   */
  alertWarning(content: any): void
  /**
   * 通知提醒
   * @param content 通知提醒内容
   */
  notify(content: any): void
  /**
   * 错误通知
   * @param content 错误通知内容
   */
  notifyError(content: any): void
  /**
   * 成功通知
   * @param content 成功通知内容
   */
  notifySuccess(content: any): void
  /**
   * 警告通知
   * @param content 警告通知内容
   */
  notifyWarning(content: any): void
  /**
   * 确认窗体
   * @param content 确认窗体内容
   * @param elMessageBoxOptions 对话框配置
   */
  confirm(content: any, elMessageBoxOptions: ElMessageBoxOptions): void
  /**
   * 删除确认窗体
   * @param content 删除确认窗体内容
   * @param elMessageBoxOptions 对话框配置
   */
  confirmDelete(content: any, elMessageBoxOptions: ElMessageBoxOptions | undefined | null): ElMessageBoxShortcutMethod
  /**
   * 输入窗体
   * @param content 输入窗体内容
   * @param elMessageBoxOptions 对话框配置
   */
  prompt(content: any, elMessageBoxOptions: ElMessageBoxOptions): void
  /**
   * 遮罩层
   * @param content 遮罩层内容
   */
  loading(content: any): void
  /**
   * 关闭遮罩层
   */
  closeLoading(): void
}

/**
 * 操作类型枚举
 */
export enum OperationTypeEnum {
  /**
   * 接收
   */
  Receive = 0,
  /**
   * 分拣
   */
  Sorting = 1,
  /**
   * 交接
   */
  Handover = 2,
  /**
   * 检验
   */
  Testing = 3,
  /**
   * 初审
   */
  FirstCheck = 4,
  /**
   * 复审
   */
  SecondCheck = 5,
  /**
   * 取消审核
   */
  UnChecked = 6,
}

/**
 * 批量或者单个枚举
 */
export enum ExecuteTypeEnum {
  /**
   * 单个
   */
  Single = 0,
  /**
   * 批量
   */
  Batch = 1,
}

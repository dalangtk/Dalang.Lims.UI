/**
 * 单个对象结果输出
 * T:泛型类型
 */
export interface ResultBaseOutput<T> {
  /** 是否成功标记 */
  success?: boolean
  /** 编码 */
  code?: string | null
  /** 消息 */
  msg?: string | null
  data?: T
}
/**
 * 分页结果输出
 * T:泛型类型
 */
export interface ResultBasePageOutput<T> {
  /** 是否成功标记 */
  success?: boolean
  /** 编码 */
  code?: string | null
  /** 消息 */
  msg?: string | null
  data?: {
    list?: Array<T>
    total: number
  }
}
/**
 * 分页查询
 */
export interface GetPageInput<T> {
  /**
   * 当前页标
   * @format int32
   */
  currentPage?: number
  /**
   * 每页大小
   * @format int32
   */
  pageSize?: number
  /** 用户分页查询条件 */
  filter?: T
}

/**
 * 分页高级查询
 */
export interface GetPageDynamicFilterInput<T> extends GetPageInput<T> {
  dynamicFilter?: DynamicFilterInfo
  conditionalList?: String
}

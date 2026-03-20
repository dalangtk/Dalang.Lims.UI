/**
 * 查询分拣架列表入参
 */
export interface BaseSorterShelfQueryListInput {
  sorterCode?: string | null
}

/**
 * 新增分拣架入参
 */
export interface BaseSorterShelfAddInput {
  sorterCode?: string | null
  shelfName?: string | null
  shelfPosition?: number | null
  shelfType?: number | null
  isValid?: boolean
}
/**
 * 更新分拣架入参
 */
export interface BaseSorterShelfUpdateInput extends BaseSorterShelfAddInput {
  id: number
}
/**
 * 获取单个分拣架返回
 */
export interface BaseSorterShelfOutput extends BaseSorterShelfUpdateInput {
  
  /**
   * 1 add 2 delete 3modified
   */
  rowStatus?: number
}

/**
 * 获取分拣架列表返回
 */
export interface BaseSorterShelfListOutput extends BaseSorterShelfOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

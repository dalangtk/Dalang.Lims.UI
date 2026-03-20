/**
 * 查询分拣仪器列表入参
 */
export interface BaseSorterQueryListInput {}
/**
 * 新增分拣仪器入参
 */
export interface BaseSorterAddInput {
  sorterCode?: string | null
  sorterName?: string | null
  shelfCount?: number | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新分拣仪器入参
 */
export interface BaseSorterUpdateInput extends BaseSorterAddInput {
  id: number
}
/**
 * 获取单个分拣仪器返回
 */
export interface BaseSorterOutput extends BaseSorterUpdateInput {}

/**
 * 获取分拣仪器列表返回
 */
export interface BaseSorterListOutput extends BaseSorterOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

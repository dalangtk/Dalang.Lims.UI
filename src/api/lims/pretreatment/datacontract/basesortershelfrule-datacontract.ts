/**
 * 查询架子规则列表入参
 */
export interface BaseSorterShelfRuleQueryListInput {
  sorterCode?: string | null
  shelfPosition?: number | null
}
/**
 * 新增架子规则入参
 */
export interface BaseSorterShelfRuleAddInput {
  sorterCode?: string | null
  shelfName?: string | null
  shelfPosition?: number | null
  shelfType?: number | null
  sortRuleCode?: string | null
  sort?: number | null
  isValid?: boolean
}
/**
 * 更新架子规则入参
 */
export interface BaseSorterShelfRuleUpdateInput extends BaseSorterShelfRuleAddInput {
  id: number
}
/**
 * 获取单个架子规则返回
 */
export interface BaseSorterShelfRuleOutput extends BaseSorterShelfRuleUpdateInput {
  sortRuleName?: string | null
  sequenceCode?: string | null
  sequenceName?: string | null
  /**
   * 1 add 2 delete 3modified
   */
  rowStatus?: number
}

/**
 * 获取架子规则列表返回
 */
export interface BaseSorterShelfRuleListOutput extends BaseSorterShelfRuleOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

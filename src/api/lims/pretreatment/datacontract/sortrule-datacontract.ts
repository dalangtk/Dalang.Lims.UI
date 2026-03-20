/**
 * 查询分拣规则列表入参
 */
export interface BaseSortRuleQueryListInput {
  sortRuleCode?: string
}
/**
 * 新增分拣规则入参
 */
export interface BaseSortRuleAddInput {
  groupCode?: string
  groupName?: string
  ruleCode?: string
  ruleName?: string
  ruleExpression?: string | null
  sequenceCode?: string | null
  itemCount?: number | null
  isSortAll?: boolean
  isBatch?: boolean
  sort?: number
  isValid?: boolean
}
/**
 * 更新分拣规则入参
 */
export interface BaseSortRuleUpdateInput extends BaseSortRuleAddInput {
  id: number
}
/**
 * 获取单个分拣规则返回
 */
export interface BaseSortRuleOutput extends BaseSortRuleUpdateInput {}

/**
 * 获取分拣规则列表返回
 */
export interface BaseSortRuleListOutput extends BaseSortRuleOutput {
  sequenceName: string | null
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

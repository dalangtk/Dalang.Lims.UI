/**
 * 查询问询规则列表入参
 */
export interface BaseAskRuleQueryInput {}
/**
 * 新增问询规则入参
 */
export interface BaseAskRuleAddInput {
  askRuleCode?: string
  askRuleName?: string
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新问询规则入参
 */
export interface BaseAskRuleUpdateInput extends BaseAskRuleAddInput {
  id: number
}
/**
 * 获取单个问询规则返回
 */
export interface BaseAskRuleOutput extends BaseAskRuleUpdateInput {}

/**
 * 获取问询规则列表返回
 */
export interface BaseAskRuleListOutput extends BaseAskRuleOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 查询问询规则明细列表入参
 */
export interface BaseAskRuleDetailQueryInput {}
/**
 * 新增问询规则明细入参
 */
export interface BaseAskRuleDetailAddInput {
  askRuleCode?: string
  entrustCycle?: string | null
  askDay?: number | null
  askTime?: string | null
  isIncludeHoliday?: boolean
  sort?: number
  isValid?: boolean
}
/**
 * 更新问询规则明细入参
 */
export interface BaseAskRuleDetailUpdateInput extends BaseAskRuleDetailAddInput {
  id: number
}
/**
 * 获取单个问询规则明细返回
 */
export interface BaseAskRuleDetailOutput extends BaseAskRuleDetailUpdateInput {}

/**
 * 获取问询规则明细列表返回
 */
export interface BaseAskRuleDetailListOutput extends BaseAskRuleDetailOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

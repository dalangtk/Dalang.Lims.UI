/**
 * 查询审核规则列表入参
 */
export interface BaseAuditRuleQueryListInput {}
/**
 * 新增审核规则入参
 */
export interface BaseAuditRuleAddInput {
  ruleCode?: string
  ruleName?: string
  ruleDescription?: string
  ruleExpression?: string
  groupCode?: string | null
  judgeType?: number
  workFlowType?: string | null
  purCodes?: string | null
  itemCodes?: string | null
  isAllContains?: boolean
  noticeType?: number
  ruleProperty?: number
  auditType?: number
  noticeMessage?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新审核规则入参
 */
export interface BaseAuditRuleUpdateInput extends BaseAuditRuleAddInput {
  id: number
}
/**
 * 获取单个审核规则返回
 */
export interface BaseAuditRuleOutput extends BaseAuditRuleUpdateInput {
  groupName?: string | null
}

/**
 * 获取审核规则列表返回
 */
export interface BaseAuditRuleListOutput extends BaseAuditRuleOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 测试规则入参
 */
export interface TestRuleInput {
  examInfoId: number
  ruleCode?: string | null
  ignoreRuleCodes?: string[] | null
  showDetail?: boolean
  executeType: number
}
export interface TestRuleResultDto {
  triggerRules?: TestRuleDto[] | null
  ignoreRules?: string[] | null
}

export interface TestRuleDto {
  isTrigger?: boolean
  ruleCode?: string | null
  ruleName?: string | null
  noticeType?: number
  noticeMessage?: string | null
  isException?: boolean
}

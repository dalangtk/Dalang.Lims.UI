/**
 * 查询检测计划列表入参
 */
export interface BaseExamPlanQueryListInput {
  examPlanCode?: string
}
/**
 * 新增检测计划入参
 */
export interface BaseExamPlanAddInput {
  examPlanCode?: string
  examPlanName?: string
  planType?: string
  planCycle?: string | null
  planCycleList?: Array<string>
  isIncludeHoliday?: boolean
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个检测计划返回
 */
export interface BaseExamPlanUpdateInput extends BaseExamPlanAddInput {
  id: number
}
/**
 * 获取单个检测计划返回
 */
export interface BaseExamPlanOutput extends BaseExamPlanAddInput {
  id: number
}

/**
 * 获取检测计划列表返回
 */
export interface BaseExamPlanListOutput extends BaseExamPlanOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 新增检测计划明细入参
 */
export interface BaseExamPlanDetailAddInput {
  examPlanCode?: string
  receiveTime?: Date | null
  testInterval?: number | null
  reportInterval?: number | null
  reportTimePoint?: string | null
  timePointType?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个检测计划明细返回
 */
export interface BaseExamPlanDetailUpdateInput extends BaseExamPlanDetailAddInput {
  id: number
}
/**
 * 获取单个检测计划明细返回
 */
export interface BaseExamPlanDetailOutput extends BaseExamPlanDetailAddInput {
  id: number
}

/**
 * 获取检测计划明细列表返回
 */
export interface BaseExamPlanDetailListOutput extends BaseExamPlanDetailOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

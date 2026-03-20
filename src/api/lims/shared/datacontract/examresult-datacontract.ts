/**
 * 查询检验结果列表入参
 */
export interface ExamResultQueryListInput {
  examInfoId?: number | null
}
/**
 * 新增检验结果入参
 */
export interface ExamResultAddInput {
  examInfoId?: number | null
  taskId?: number | null
  taskDetailId?: number | null
  groupCode?: string | null
  groupName?: string | null
  barcode?: string
  sampleNo?: string
  testDate?: Date | null
  comboCode?: string | null
  purCode?: string | null
  purName?: string | null
  instrumentItemCode?: string | null
  itemCode?: string
  itemName?: string
  itemNamePersonalize?: string | null
  itemNameEN?: string | null
  itemNameAB?: string | null
  itemUnit?: string | null
  itemResult?: string | null
  hlFlag?: string | null
  itemReference?: string | null
  reagentCode?: string | null
  reagentName?: string | null
  instrumentCode?: string | null
  instrumentName?: string | null
  methodCode?: string | null
  methodName?: string | null
  resultSource?: number | null
  originalValue?: string | null
  isReportShow?: boolean | null
  reportOrder?: string | null
  methodBasis?: string | null
  cutOffValue?: string | null
  oDValue?: string | null
  specificValue?: string | null
  resultType?: string | null
  isCalculate?: boolean | null
  calcExpression?: string | null
  inTestCount?: number | null
  entrustStatus?: number | null
  addType?: number | null
  reviewStatus?: number | null
}
/**
 * 更新检验结果入参
 */
export interface ExamResultUpdateInput extends ExamResultAddInput {
  id: number
}
/**
 * 获取单个检验结果返回
 */
export interface ExamResultOutput extends ExamResultUpdateInput {
  isEditing: boolean
  displayReference?: string | null
  originalItemResult?: string | null
  isCriticalValue?: boolean | null
}

/**
 * 获取检验结果列表返回
 */
export interface ExamResultListOutput extends ExamResultOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

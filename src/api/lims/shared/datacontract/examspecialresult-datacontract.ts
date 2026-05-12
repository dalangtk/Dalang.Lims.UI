/**
 * 查询特检结果列表入参
 */
export interface ExamSpecialResultQueryListInput {
    examInfoId?: number
    resultType?: number | null
}
/**
 * 新增特检结果入参
 */
export interface ExamSpecialResultAddInput {
  examInfoId?: number
  groupCode?: string
  barcode?: string
  sampleNo?: string
  testDate?: Date
  fieldCode?: string
  fieldName?: string | null
  fieldValue?: string | null
  resultType?: number | null
}
/**
 * 更新特检结果入参
 */
export interface ExamSpecialResultUpdateInput extends ExamSpecialResultAddInput {
  id: number
}
/**
 * 获取单个特检结果返回
 */
export interface ExamSpecialResultOutput extends ExamSpecialResultUpdateInput {}

/**
 * 获取特检结果列表返回
 */
export interface ExamSpecialResultListOutput extends ExamSpecialResultOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

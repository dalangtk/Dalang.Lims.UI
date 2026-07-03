/**
 * 查询切片列表入参
 */
export interface ExamPathologySectionQueryListInput {}
/**
 * 新增切片入参
 */
export interface ExamPathologySectionAddInput {
  examInfoId?: number | null
  candleNo?: number | null
  originalCandleNo?: string | null
  position?: string | null
  sectionNo?: number | null
  assessment?: string | null
  feedBack?: string | null
  isMedicalAdvice?: boolean | null
  medicalAdviceUser?: number | null
}
/**
 * 更新切片入参
 */
export interface ExamPathologySectionUpdateInput extends ExamPathologySectionAddInput {
  id: number
}
/**
 * 获取单个切片返回
 */
export interface ExamPathologySectionOutput extends ExamPathologySectionUpdateInput {}

/**
 * 获取切片列表返回
 */
export interface ExamPathologySectionListOutput extends ExamPathologySectionOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

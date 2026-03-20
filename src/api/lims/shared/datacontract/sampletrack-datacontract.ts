/**
 * 查询样本跟踪列表入参
 */
export interface ExamSampleTrackQueryListInput {
  barcode: string
}
/**
 * 新增样本跟踪入参
 */
export interface ExamSampleTrackAddInput {
  barcode?: string
  groupCode?: string
  groupName?: string
  testDate?: Date | null
  sampleNo?: string | null
  trackContent?: string | null
  operationType?: number | null
}
/**
 * 更新样本跟踪入参
 */
export interface ExamSampleTrackUpdateInput extends ExamSampleTrackAddInput {
  id: number
}
/**
 * 获取单个样本跟踪返回
 */
export interface ExamSampleTrackOutput extends ExamSampleTrackUpdateInput {}

/**
 * 获取样本跟踪列表返回
 */
export interface ExamSampleTrackListOutput extends ExamSampleTrackOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

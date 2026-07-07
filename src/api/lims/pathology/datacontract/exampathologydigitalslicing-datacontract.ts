/**
 * 查询数字切片列表入参
 */
export interface ExamPathologyDigitalSlicingQueryListInput {
  query?: string | null
  examInfoId?: number | null
}
/**
 * 新增数字切片入参
 */
export interface ExamPathologyDigitalSlicingAddInput {
  examInfoId?: number
  slicingName?: string | null
  slicingPath?: string | null
  isValid?: boolean
}
/**
 * 更新数字切片入参
 */
export interface ExamPathologyDigitalSlicingUpdateInput extends ExamPathologyDigitalSlicingAddInput {
  id: number
}
/**
 * 获取单个数字切片返回
 */
export interface ExamPathologyDigitalSlicingOutput extends ExamPathologyDigitalSlicingUpdateInput {}

/**
 * 获取数字切片列表返回
 */
export interface ExamPathologyDigitalSlicingListOutput extends ExamPathologyDigitalSlicingOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

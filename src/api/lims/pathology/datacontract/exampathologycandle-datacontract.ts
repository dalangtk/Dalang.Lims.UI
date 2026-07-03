/**
 * 查询蜡块列表入参
 */
export interface ExamPathologyCandleQueryListInput {}
/**
 * 新增蜡块入参
 */
export interface ExamPathologyCandleAddInput {
  examInfoId?: number | null
  candleNo?: number | null
  originalCandleNo?: string | null
  position?: string | null
  amount?: number | null
  operationType?: number | null
  estimatedSamplingDate?: Date | null
}
/**
 * 更新蜡块入参
 */
export interface ExamPathologyCandleUpdateInput extends ExamPathologyCandleAddInput {
  id: number
}
/**
 * 获取单个蜡块返回
 */
export interface ExamPathologyCandleOutput extends ExamPathologyCandleUpdateInput {}

/**
 * 获取蜡块列表返回
 */
export interface ExamPathologyCandleListOutput extends ExamPathologyCandleOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

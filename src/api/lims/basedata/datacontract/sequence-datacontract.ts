/**
 * 查询序列列表入参
 */
export interface BaseSequenceQueryListInput {
  sequenceCode?: string
}
/**
 * 新增序列入参
 */
export interface BaseSequenceAddInput {
  sequenceCode?: string | null
  sequenceName?: string | null
  identifier?: string | null
  perfix?: string | null
  sequenceValue?: string | null
  startNo?: number | null
  sequenceStep?: number | null
  completionLength?: number | null
  completionChar?: string | null
  suffix?: string | null
  resetType?: number | null
  resetTime?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新序列入参
 */
export interface BaseSequenceUpdateInput extends BaseSequenceAddInput {
  id: number
}
/**
 * 获取单个序列返回
 */
export interface BaseSequenceOutput extends BaseSequenceUpdateInput {}

/**
 * 获取序列列表返回
 */
export interface BaseSequenceListOutput extends BaseSequenceOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

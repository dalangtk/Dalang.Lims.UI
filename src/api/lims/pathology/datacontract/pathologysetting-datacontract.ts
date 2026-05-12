/**
 * 查询病理配置列表入参
 */
export interface BasePathologySettingQueryListInput {}
/**
 * 新增病理配置入参
 */
export interface BasePathologySettingAddInput {
  wfCode?: string | null
  auditType?: number | null
  sampleNoSymbol?: string | null
  reviewUserId?: number | null
  reviewUserName?: string | null
  reportCycle?: number | null
  canSameUserReport?: boolean | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新病理配置入参
 */
export interface BasePathologySettingUpdateInput extends BasePathologySettingAddInput {
  id: number
}
/**
 * 获取单个病理配置返回
 */
export interface BasePathologySettingOutput extends BasePathologySettingUpdateInput {}

/**
 * 获取病理配置列表返回
 */
export interface BasePathologySettingListOutput extends BasePathologySettingOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

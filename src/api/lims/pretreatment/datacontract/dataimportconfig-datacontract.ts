/**
 * 查询导入配置列表入参
 */
export interface PretreatDataImportConfigQueryListInput {
  customerCode?: string | null
}
/**
 * 新增导入配置入参
 */
export interface PretreatDataImportConfigAddInput {
  customerCode?: string | null
  cellName?: string | null
  fieldName?: string | null
  translateFunction?: string | null
  isMustExists?: boolean | null
  sort?: number | null
  isValid?: boolean

  isSystemCompare?: boolean
}
/**
 * 获取单个导入配置返回
 */
export interface PretreatDataImportConfigUpdateInput extends PretreatDataImportConfigAddInput {
  id: number
}
/**
 * 获取单个导入配置返回
 */
export interface PretreatDataImportConfigOutput extends PretreatDataImportConfigAddInput {
  id: number
}

/**
 * 获取导入配置列表返回
 */
export interface PretreatDataImportConfigListOutput extends PretreatDataImportConfigOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

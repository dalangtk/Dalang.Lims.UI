/**
 * 查询目的对照列表入参
 */
export interface PurposeMatchQueryListInput {
  customerCode: string
}
/**
 * 查询单个目的对照列表入参
 */
export interface PurposeMatchSingleQueryInput extends PurposeMatchQueryListInput {
  customerPurCode: string
}
/**
 * 查询多个目的对照列表入参
 */
export interface PurposeMatchMutilQueryInput extends PurposeMatchQueryListInput {
  customerPurCodes: Array<string>
}
/**
 * 新增目的对照入参
 */
export interface PurposeMatchAddInput {
  customerCode?: string | null
  customerPurCode?: string | null
  customerPurName?: string | null
  centralPurCode?: string | null
  centralPurName?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个目的对照返回
 */
export interface PurposeMatchUpdateInput extends PurposeMatchAddInput {
  id: number
}
/**
 * 获取单个目的对照返回
 */
export interface PurposeMatchOutput extends PurposeMatchAddInput {
  id: number
}

/**
 * 获取目的对照列表返回
 */
export interface PurposeMatchListOutput extends PurposeMatchOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}
export interface CustomerPurMatchMainDto {
  customerCode?: string | null
  customerPurCode?: string | null
  customerPurName?: string | null
}
export interface CustomerPurMatchDetailDto extends CustomerPurMatchMainDto {
  centralPurCode?: string | null
  centralPurName?: string | null
}
export interface QuickPurmatchDto extends CustomerPurMatchMainDto {
  centralPurCodes?: Array<string> | null
  centralPurList?: Array<PurMatchCentralPurposeDto> | null
}
export interface PurMatchCentralPurposeDto {
  centralPurCode?: string | null
  isCombo: boolean
}

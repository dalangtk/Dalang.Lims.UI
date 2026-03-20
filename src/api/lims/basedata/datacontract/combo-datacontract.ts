/**
 * 查询套餐列表入参
 */
export interface BaseComboQueryInput {}
/**
 * 新增套餐入参
 */
export interface BaseComboAddInput {
  comboCode?: string
  comboName?: string
  customerCode?: string | null
  beginDate?: Date | null
  endDate?: Date | null
  sampleTypeCode?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新套餐入参
 */
export interface BaseComboUpdateInput extends BaseComboAddInput {
  id: number
}
/**
 * 获取单个套餐返回
 */
export interface BaseComboOutput extends BaseComboUpdateInput {
  customerName?: string | null
  sampleTypeName?: string | null
}

/**
 * 获取套餐列表返回
 */
export interface BaseComboListOutput extends BaseComboOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

export interface BaseComboDetailOutput {
  id: number
  comboCode?: string | null
  purCode?: string
  purName?: string
  isValid?: boolean
  groupName?: string
}

export interface ComboAddOrUpdateInput {
  combo: BaseComboOutput
  comboDetail: Array<string>
}
export interface BaseComboWithPurcodesDto extends BaseComboOutput {
  purposeList: Array<string>
}

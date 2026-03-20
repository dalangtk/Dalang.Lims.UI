/**
 * 查询委托目的列表入参
 */
export interface BaseEntrustPurposeQueryListInput {}
/**
 * 新增委托目的入参
 */
export interface BaseEntrustPurposeAddInput {
  purCode?: string
  entrustHospitalCode?: string | null
  entrustHospitalName?: string | null
  askRuleCode?: string | null
  beginTime?: Date | null
  endTime?: Date | null
  receiveDays?: string | null
  receiveTime?: string | null
  customerCode?: string | null
  sampleTypeCode?: string | null
  isCustomerReverse?: boolean | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个委托目的返回
 */
export interface BaseEntrustPurposeUpdateInput extends BaseEntrustPurposeAddInput {
  id: number
}
/**
 * 获取单个委托目的返回
 */
export interface BaseEntrustPurposeOutput extends BaseEntrustPurposeUpdateInput {}

/**
 * 获取委托目的列表返回
 */
export interface BaseEntrustPurposeListOutput extends BaseEntrustPurposeOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

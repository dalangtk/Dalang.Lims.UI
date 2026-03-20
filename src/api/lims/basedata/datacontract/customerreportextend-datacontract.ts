/**
 * 查询客户报告扩展列表入参
 */
export interface BaseCustomerReportExtendQueryListInput {
  customerCode?: string | null
}
/**
 * 新增客户报告扩展入参
 */
export interface BaseCustomerReportExtendAddInput {
  customerCode?: string | null
  customerLogo?: string | null
  customerSignature?: string | null
  isGenerateReport?: boolean | null
  reportPriority?: number | null
  imageDpi?: number | null
  languageType?: string | null
  reportMainTitle?: string | null
  reportSubTitle?: string | null
  address?: string | null
  telephone?: string | null
  generateTitleType?: number | null
  canSearchReportChannel?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新客户报告扩展入参
 */
export interface BaseCustomerReportExtendUpdateInput extends BaseCustomerReportExtendAddInput {
  id: number
}
/**
 * 获取单个客户报告扩展返回
 */
export interface BaseCustomerReportExtendOutput extends BaseCustomerReportExtendUpdateInput {}

/**
 * 获取客户报告扩展列表返回
 */
export interface BaseCustomerReportExtendListOutput extends BaseCustomerReportExtendOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

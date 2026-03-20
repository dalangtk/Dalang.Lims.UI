/**
 * 查询机构报告设置列表入参
 */
export interface BaseTenantReportExtendQueryListInput {
  tenantId?: number | null
}
/**
 * 新增机构报告设置入参
 */
export interface BaseTenantReportExtendAddInput {
  reportLogo?: string | null
  reportMainTitle?: string | null
  reportSubTitle?: string | null
  reportSignature?: string | null
  address?: string | null
  telephone?: string | null
  isValid?: boolean
}
/**
 * 更新机构报告设置入参
 */
export interface BaseTenantReportExtendUpdateInput extends BaseTenantReportExtendAddInput {
  id: number
}
/**
 * 获取机构报告设置返回
 */
export interface BaseTenantReportExtendOutput extends BaseTenantReportExtendUpdateInput {}

/**
 * 获取机构报告设置列表返回
 */
export interface BaseTenantReportExtendListOutput extends BaseTenantReportExtendOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

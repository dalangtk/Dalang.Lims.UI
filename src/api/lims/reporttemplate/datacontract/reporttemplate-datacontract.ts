/**
 * 查询模板列表入参
 */
export interface ReportTemplateQueryListInput {}
/**
 * 新增模板入参
 */
export interface ReportTemplateAddInput {
  templateCode?: string
  templateName?: string
  templateDescription?: string | null
  groupCode?: string | null
  hospitalCode?: string | null
  itemCodes?: string | null
  purCodes?: string | null
  sampleNoSymbols?: string | null
  genderCode?: string | null
  beginTime?: Date | null
  endTime?: Date | null
  isSubTemplate?: boolean | null
  templateType?: number | null
  templateContent?: string | null
  templateDataSource?: string | null
  isValid?: boolean
}
/**
 * 更新模板入参
 */
export interface ReportTemplateUpdateInput extends ReportTemplateAddInput {
  id: number
}
/**
 * 获取单个模板返回
 */
export interface ReportTemplateOutput extends ReportTemplateUpdateInput {}

/**
 * 获取模板列表返回
 */
export interface ReportTemplateListOutput extends ReportTemplateOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

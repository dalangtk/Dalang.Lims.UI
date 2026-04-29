/**
 * 查询诊断模板列表入参
 */
export interface BasePathologyTemplateQueryListInput {
  templateCode?: string | null
  wfCode: string | null
}
/**
 * 新增诊断模板入参
 */
export interface BasePathologyTemplateAddInput {
  wfCode?: string | null
  templateCode?: string | null
  templateName?: string | null
  templateContent?: string | null
  diagnosisResult?: string | null
  remark?: string | null
  customerCodes?: string | null
  customerType?: string | null
  templateType?: number | null
  isDefaultResult?: boolean | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新诊断模板入参
 */
export interface BasePathologyTemplateUpdateInput extends BasePathologyTemplateAddInput {
  id: number
}
/**
 * 获取单个诊断模板返回
 */
export interface BasePathologyTemplateOutput extends BasePathologyTemplateUpdateInput {}

/**
 * 获取诊断模板列表返回
 */
export interface BasePathologyTemplateListOutput extends BasePathologyTemplateOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

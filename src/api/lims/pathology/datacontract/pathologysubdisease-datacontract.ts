/**
 * 查询子疾病列表入参
 */
export interface BasePathologySubDiseaseQueryListInput {
  subDiseaseCode?: string | null
}
/**
 * 新增子疾病入参
 */
export interface BasePathologySubDiseaseAddInput {
  subDiseaseCode?: string | null
  subDiseaseName?: string | null
  explainUrl?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新子疾病入参
 */
export interface BasePathologySubDiseaseUpdateInput extends BasePathologySubDiseaseAddInput {
  id: number
}
/**
 * 获取单个子疾病返回
 */
export interface BasePathologySubDiseaseOutput extends BasePathologySubDiseaseUpdateInput {}

/**
 * 获取子疾病列表返回
 */
export interface BasePathologySubDiseaseListOutput extends BasePathologySubDiseaseOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

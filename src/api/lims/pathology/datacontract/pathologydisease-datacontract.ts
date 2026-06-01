/**
 * 查询疾病列表入参
 */
export interface BasePathologyDiseaseQueryListInput {
  diseaseCode?: string | null
}
/**
 * 新增疾病入参
 */
export interface BasePathologyDiseaseAddInput {
  diseaseCode?: string | null
  diseaseName?: string | null
  isMalignantTumor?: boolean | null
  isNonInvasiveTumor?: boolean | null
  histologicalLevel?: string | null
  lmmuneMarkerEvaluation?: string | null
  chemotherapyReaction?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新疾病入参
 */
export interface BasePathologyDiseaseUpdateInput extends BasePathologyDiseaseAddInput {
  id: number
}
/**
 * 获取单个疾病返回
 */
export interface BasePathologyDiseaseOutput extends BasePathologyDiseaseUpdateInput {}

/**
 * 获取疾病列表返回
 */
export interface BasePathologyDiseaseListOutput extends BasePathologyDiseaseOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

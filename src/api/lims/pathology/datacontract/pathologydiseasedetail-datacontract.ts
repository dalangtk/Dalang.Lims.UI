/**
 * 查询疾病明细列表入参
 */
export interface BasePathologyDiseaseDetailQueryListInput {
  diseaseCode?: string | null
}
/**
 * 新增疾病明细入参
 */
export interface BasePathologyDiseaseDetailAddInput {
  diseaseCode?: string | null
  subDiseaseCode?: string | null
}
/**
 * 更新疾病明细入参
 */
export interface BasePathologyDiseaseDetailUpdateInput extends BasePathologyDiseaseDetailAddInput {
  id: number
}
/**
 * 获取单个疾病明细返回
 */
export interface BasePathologyDiseaseDetailOutput extends BasePathologyDiseaseDetailUpdateInput {
  diseaseName?: string | null
  subDiseaseName?: string | null
}

/**
 * 查询病理标本列表入参
 */
export interface BasePathologySampleTypeQueryListInput {
  sampleTypeCode?: string | null
  typeGrade?: number | null
  sampleTypeCodes?: Array<string>
}
/**
 * 新增病理标本入参
 */
export interface BasePathologySampleTypeAddInput {
  sampleTypeCode?: string | null
  sampleTypeName?: string | null
  parentCode?: string | null
  typeGrade?: number | null
  diseaseCode?: string | null
  templateCode?: string | null
  pinYin?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新病理标本入参
 */
export interface BasePathologySampleTypeUpdateInput extends BasePathologySampleTypeAddInput {
  id: number
}
/**
 * 获取单个病理标本返回
 */
export interface BasePathologySampleTypeOutput extends BasePathologySampleTypeUpdateInput {
  diseaseCodeList?: Array<string>
  templateCodeList?: Array<string>
  children?: Array<BasePathologySampleTypeOutput>
 }

/**
 * 获取病理标本列表返回
 */
export interface BasePathologySampleTypeListOutput extends BasePathologySampleTypeOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

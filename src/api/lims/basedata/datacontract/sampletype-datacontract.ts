/**
 * 查询标本类型列表入参
 */
export interface BaseSampleTypeQueryListInput {
  sampleTypeCode?: string | null
}
/**
 * 新增标本类型入参
 */
export interface BaseSampleTypeAddInput {
  sampleTypeCode?: string | null
  sampleTypeName?: string | null
  gender?: string | null
  pinYin?: string | null
  wuBi?: string | null
  customCode?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个标本类型返回
 */
export interface BaseSampleTypeUpdateInput extends BaseSampleTypeAddInput {
  id: number
}
/**
 * 获取单个标本类型返回
 */
export interface BaseSampleTypeOutput extends BaseSampleTypeAddInput {
  id: number
}

/**
 * 获取标本类型列表返回
 */
export interface BaseSampleTypeListOutput extends BaseSampleTypeOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

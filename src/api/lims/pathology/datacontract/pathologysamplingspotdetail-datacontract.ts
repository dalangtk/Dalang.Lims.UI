/**
 * 查询取材部位明细列表入参
 */
export interface BasePathologySamplingSpotDetailQueryListInput {}
/**
 * 新增取材部位明细入参
 */
export interface BasePathologySamplingSpotDetailAddInput {
  samplingSpotCode?: string | null
  sampleTypeCode?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新取材部位明细入参
 */
export interface BasePathologySamplingSpotDetailUpdateInput extends BasePathologySamplingSpotDetailAddInput {
  id: number
}
/**
 * 获取单个取材部位明细返回
 */
export interface BasePathologySamplingSpotDetailOutput extends BasePathologySamplingSpotDetailUpdateInput {
  samplingSpotName?: string | null
  sampleTypeName?: string | null
}

/**
 * 获取取材部位明细列表返回
 */
export interface BasePathologySamplingSpotDetailListOutput extends BasePathologySamplingSpotDetailOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

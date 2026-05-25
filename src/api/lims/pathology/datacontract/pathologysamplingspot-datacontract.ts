/**
 * 查询取材部位列表入参
 */
export interface BasePathologySamplingSpotQueryListInput {
  samplingSpotName: null
}
/**
 * 新增取材部位入参
 */
export interface BasePathologySamplingSpotAddInput {
  samplingSpotCode?: string | null
  samplingSpotName?: string | null
  gender?: string | null
  pinYin?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新取材部位入参
 */
export interface BasePathologySamplingSpotUpdateInput extends BasePathologySamplingSpotAddInput {
  id: number
}
/**
 * 获取单个取材部位返回
 */
export interface BasePathologySamplingSpotOutput extends BasePathologySamplingSpotUpdateInput {}

/**
 * 获取取材部位列表返回
 */
export interface BasePathologySamplingSpotListOutput extends BasePathologySamplingSpotOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

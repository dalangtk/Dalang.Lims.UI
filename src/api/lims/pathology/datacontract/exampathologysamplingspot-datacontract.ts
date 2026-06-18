/**
 * 查询检验取材部位列表入参
 */
export interface ExamPathologySamplingSpotQueryListInput {}
/**
 * 新增检验取材部位入参
 */
export interface ExamPathologySamplingSpotAddInput {
  examInfoId?: number | null
  samplingSpotCode?: string | null
  sampleTypeCode?: string | null
  sort?: number
}
/**
 * 更新检验取材部位入参
 */
export interface ExamPathologySamplingSpotUpdateInput extends ExamPathologySamplingSpotAddInput {
  id: number
}
/**
 * 获取单个检验取材部位返回
 */
export interface ExamPathologySamplingSpotOutput extends ExamPathologySamplingSpotUpdateInput {
    samplingSpotName?: string | null
    sampleTypeName?: string | null
}

/**
 * 获取检验取材部位列表返回
 */
export interface ExamPathologySamplingSpotListOutput extends ExamPathologySamplingSpotOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

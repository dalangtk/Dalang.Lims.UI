/**
 * 查询报告列表入参
 */
export interface ReportFilesQueryListInput {}
/**
 * 新增报告入参
 */
export interface ReportFilesAddInput {
  examInfoId?: number
  filePath?: string | null
  isValid?: boolean
}
/**
 * 更新报告入参
 */
export interface ReportFilesUpdateInput extends ReportFilesAddInput {
  id: number
}
/**
 * 获取单个报告返回
 */
export interface ReportFilesOutput extends ReportFilesUpdateInput {}

/**
 * 获取报告列表返回
 */
export interface ReportFilesListOutput extends ReportFilesOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

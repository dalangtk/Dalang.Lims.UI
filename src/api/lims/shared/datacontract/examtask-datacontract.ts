/**
 * 查询检验任务列表入参
 */
export interface ExamTaskQueryListInput {
  groupCode?: string
  barcode?: string | null
  beginDate?: Date | null
  endDate?: Date | null
  status?: number | null
  sampleTypeCode?: string | null
}
/**
 * 新增检验任务入参
 */
export interface ExamTaskAddInput {
  barcode?: string
  groupCode?: string
  groupName?: string
  customerCode?: string | null
  customerName?: string | null
  purCodes?: string | null
  purNames?: string | null
  sampleNo?: string | null
  sampleTypeCode?: string
  sampleTypeName?: string
  estimatedTestDate?: Date | null
  estimatedReportTime?: Date | null
  sortUserId?: number | null
  sortUserName?: string | null
  sortTime?: Date | null
  sortInfoCode?: number | null
  shelfBarcode?: string | null
  shelfName?: string | null
  holePosition?: number | null
  sortRuleCode?: string
  sortRuleName?: string | null
  sequenceCode?: string | null
  sequenceName?: string | null
  sortBatchNo?: number | null
  entrustHospitalCode?: string | null
  entrustHospitalName?: string | null
  entrustStatus?: number | null
  entrustConfirmId?: number | null
  entrustConfirmName?: string | null
  entrustConfirmTime?: Date | null
  entrustId?: number | null
  entrustName?: string | null
  entrustTime?: Date | null
  entrustBatchNo?: number | null
  estimateAskTime?: Date | null
  receiveTime?: Date | null
  handoverStatus?: number | null
  handoverId?: number | null
  handoverName?: string | null
  handoverTime?: Date | null
  handoverBatchNo?: number | null
  sort?: number
  applyPurposeIds?: string | null
}
/**
 * 更新检验任务入参
 */
export interface ExamTaskUpdateInput extends ExamTaskAddInput {
  id: number
}
/**
 * 获取单个检验任务返回
 */
export interface ExamTaskOutput extends ExamTaskUpdateInput {}

/**
 * 获取检验任务列表返回
 */
export interface ExamTaskListOutput extends ExamTaskOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

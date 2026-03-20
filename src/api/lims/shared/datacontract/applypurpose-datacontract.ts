/**
 * 查询申请单目的列表入参
 */
export interface ApplyPurposeQueryListInput {}
/**
 * 新增申请单目的入参
 */
export interface ApplyPurposeAddInput {
  groupCode?: string
  groupName?: string
  barcode?: string
  comboCode?: string | null
  comboName?: string | null
  purCode?: string
  purName?: string
  purNamePersonalize?: string | null
  purAmount?: number
  instrumentItemCodes?: string | null
  workFlowType?: string | null
  testExamPlanCode?: string | null
  sampleTypeCode?: string
  sampleTypeName?: string
  estimateTestDate?: Date | null
  estimateReportTime?: Date | null
  entrustHospitalCode?: string | null
  entrustHospitalName?: string | null
  entrustStatus?: number | null
  estimateAskTime?: Date | null
  originalGroupCode?: string
  originalGroupName?: string
  addType?: number | null
  sampleStatus?: number | null
  sampleStatusName?: string | null
  receiveId?: number | null
  receiveName?: string | null
  receiveTime?: Date | null
  sampleCnt?: number | null
  testShift?: string | null
  testSeries?: string | null
  sortStatus?: number | null
  dataSource?: number | null
  batchNo?: number | null
  batchScanOrder?: number | null
  taskId?: number | null
}
/**
 * 更新申请单目的入参
 */
export interface ApplyPurposeUpdateInput extends ApplyPurposeAddInput {
  id: number
}
/**
 * 获取单个申请单目的返回
 */
export interface ApplyPurposeOutput extends ApplyPurposeUpdateInput {}

/**
 * 获取申请单目的列表返回
 */
export interface ApplyPurposeListOutput extends ApplyPurposeOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

import { SampleStatusEnum } from '../enums/samplestatusenum'

/**
 * 查询标本检验列表入参
 */
export interface ExamListQueryInput {
  groupCode?: string | null
  sampleStatus?: SampleStatusEnum | null
  barcode?: string | null
  patientName?: string | null
  beginDate?: Date | null
  endDate?: Date | null
  examInfoId?: number | null
}
/**
 * 新增标本检验入参
 */
export interface ExamInfoAddInput {
  groupCode?: string | null
  groupName?: string | null
  barcode?: string
  sampleNo?: string
  virtualSampleNo?: string
  customerCode?: string | null
  customerName?: string | null
  customerBarcode?: string | null
  testDate: Date
  wfCode?: string | null
  patientTypeCode?: string | null
  patientTypeName?: string | null
  patientId?: string | null
  patientName?: string | null
  genderCode?: string | null
  genderName?: string | null
  age1?: string | null
  ageUnit1?: string | null
  ageUnitName1?: string | null
  age2?: string | null
  ageUnit2?: string | null
  ageUnitName2?: string | null
  cardTypeCode?: string | null
  cardTypeName?: string | null
  phone?: string | null
  birthDay?: Date | null
  isMenoPause?: number | null
  lastMenstrualPeriod?: Date | null
  height?: string | null
  weight?: string | null
  nTTestResult?: string | null
  cRL?: string | null
  bPD?: string | null
  gestationalWeeks?: string | null
  homeAddress?: string | null
  department?: string | null
  ward?: string | null
  doctor?: string | null
  bedNo?: string | null
  clinicalDiagnosis?: string | null
  remarks?: string | null
  purCodes?: string | null
  purNames?: string | null
  sampleTypeCode?: string | null
  sampleTypeName?: string | null
  samplePropertyCode?: string | null
  samplePropertyName?: string | null
  collectTime?: Date | null
  receiveTime?: Date | null
  sampleStatus?: string | null | number
  sampleStatusName?: string | null
  chargeType?: string | null
  isUrgent?: number
  inTestTime?: Date | null
  inspectorId?: number | null
  inspectorAuthorizedId?: number | null
  inspectorName?: string | null
  firstAuditId?: number | null
  firstAuditAuthorizedId?: number | null
  firstAuditName?: string | null
  secondAuditId?: number | null
  secondAuditAuthorizedId?: number | null
  secondAuditName?: string | null
  approverId?: number | null
  approverAuthorizedId?: number | null
  approverName?: string | null
  resultDescription?: string | null
  suggestion?: string | null
  firstAuditTime?: Date | null
  secondAuditTime?: Date | null
  createReportTime?: Date | null
  reviewCount?: number | null
  testType?: number
  isPdfReport?: boolean
  entrustHospitalCode?: string | null
  entrustHospitalName?: string | null
  entrustStatus?: number | null
  isExceptionResult?: number
  printReportTime?: Date | null
  downloadFlag?: number | null
  storageStatus?: number | null
  storageLocation?: string | null
  internalRemarks?: string | null
  ageDesc?: string | null
}
/**
 * 更新标本检验入参
 */
export interface ExamInfoUpdateInput extends ExamInfoAddInput {
  id: number
}
/**
 * 获取单个标本检验返回
 */
export interface ExamInfoOutput extends ExamInfoUpdateInput {
  hasCritical: boolean
}

/**
 * 获取标本检验列表返回
 */
export interface ExamInfoListOutput extends ExamInfoOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

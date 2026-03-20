/**
 * 查询申请单信息列表入参
 */
export interface ApplyInfoQueryListInput {}
/**
 * 新增申请单信息入参
 */
export interface ApplyInfoAddInput {
  barcode?: string
  customerCode?: string | null
  customerName?: string | null
  customerBarcode?: string | null
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
  purCodes?: string | null
  purNames?: string | null
  sampleTypeCode?: string | null
  sampleTypeName?: string | null
  collectTime?: Date | null
  receiveTime?: Date | null
  sampleStatus?: string | null
  sampleStatusName?: string | null
  chargeType?: string | null
  isUrgent?: number | null
  fromTenant?: number | null
}
/**
 * 更新申请单信息入参
 */
export interface ApplyInfoUpdateInput extends ApplyInfoAddInput {
  id: number
}
/**
 * 获取单个申请单信息返回
 */
export interface ApplyInfoOutput extends ApplyInfoUpdateInput {
  ageDesc?: string | null
}

/**
 * 获取申请单信息列表返回
 */
export interface ApplyInfoListOutput extends ApplyInfoOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 查询信息列表入参
 */
export interface PretreatSampleInfoQueryListInput {
  customerCode?: string | null
  barcode?: string | null
  begin?: Date
  end?: Date
  OnlyMySelf?: boolean
}
/**
 * 新增信息入参
 */
export interface PretreatSampleInfoAddInput {
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
  isMenoPause?: boolean | null
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
  purCodes?: string | null
  purNames?: string | null
  sampleTypeCode?: string | null
  sampleTypeName?: string | null
  collectTime?: Date | null
  sampleCnt?: number | null
  dataSource?: number | null
  auditStatus?: number | null
  auditId?: number | null
  auditName?: string | null
  auditTime?: Date | null
  importConfig?: string | null
  fileName?: string | null
}
/**
 * 获取单个信息返回
 */
export interface PretreatSampleInfoUpdateInput extends PretreatSampleInfoAddInput {
  id: number
}
/**
 * 获取单个信息返回
 */
export interface PretreatSampleInfoOutput extends PretreatSampleInfoAddInput {
  id: number
}

/**
 * 获取信息列表返回
 */
export interface PretreatSampleInfoListOutput extends PretreatSampleInfoOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

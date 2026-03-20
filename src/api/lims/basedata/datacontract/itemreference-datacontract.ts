/**
 * 查询参考范围列表入参
 */
export interface BaseItemReferenceQueryListInput {
  itemCode?: string
}
/**
 * 新增参考范围入参
 */
export interface BaseItemReferenceAddInput {
  groupCode?: string
  itemCode?: string
  // resultType?: string | null
  method?: string | null
  customerCode?: string | null
  instrumentCode?: string | null
  reagentCode?: string | null
  sampleTypeCode?: string | null
  genderCode?: string | null
  entrustHospitalCode?: string | null
  ageLowLimit?: number | null
  ageUpperLimit?: number | null
  ageUnit?: string | null
  warningRange?: string | null
  referenceRange?: string | null
  criticalRange?: string | null
  displayRange?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个参考范围返回
 */
export interface BaseItemReferenceUpdateInput extends BaseItemReferenceAddInput {
  id: number
}
/**
 * 获取单个参考范围返回
 */
export interface BaseItemReferenceOutput extends BaseItemReferenceAddInput {
  id: number
}

/**
 * 获取参考范围列表返回
 */
export interface BaseItemReferenceListOutput extends BaseItemReferenceOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

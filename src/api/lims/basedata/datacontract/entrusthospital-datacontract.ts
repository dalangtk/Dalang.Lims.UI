/**
 * 查询委托医院列表入参
 */
export interface BaseEntrustHospitalQueryListInput {
  entrustHospitalCode: string | null
}
/**
 * 新增委托医院入参
 */
export interface BaseEntrustHospitalAddInput {
  entrustHospitalCode?: string | null
  entrustHospitalName?: string | null
  contacts?: string | null
  contactPhone?: string | null
  pinYin?: string | null
  wuBi?: string | null
  customCode?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个委托医院返回
 */
export interface BaseEntrustHospitalUpdateInput extends BaseEntrustHospitalAddInput {
  id: number
}
/**
 * 获取单个委托医院返回
 */
export interface BaseEntrustHospitalOutput extends BaseEntrustHospitalAddInput {
  id: number
}

/**
 * 获取委托医院列表返回
 */
export interface BaseEntrustHospitalListOutput extends BaseEntrustHospitalOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

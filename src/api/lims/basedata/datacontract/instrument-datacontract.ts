/**
 * 查询仪器列表入参
 */
export interface BaseInstrumentQueryListInput {
  instrumentCode?: string | null
}
/**
 * 新增仪器入参
 */
export interface BaseInstrumentAddInput {
  instrumentCode?: string | null
  instrumentName?: string | null
  pinYin?: string | null
  wuBi?: string | null
  customCode?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个仪器返回
 */
export interface BaseInstrumentUpdateInput extends BaseInstrumentAddInput {
  id: number
}
/**
 * 获取单个仪器返回
 */
export interface BaseInstrumentOutput extends BaseInstrumentAddInput {
  id: number
}

/**
 * 获取仪器列表返回
 */
export interface BaseInstrumentListOutput extends BaseInstrumentOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

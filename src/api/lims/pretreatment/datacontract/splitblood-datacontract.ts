import { CodeNameOutput } from '/@/api/admin/data-contracts'

/**
 * 查询标本分血列表入参
 */
export interface PretreatSortSplitBloodQueryListInput {
  barcode?: string | null
  beginDate?: Date | null
  endDate?: Date | null
}
/**
 * 新增标本分血入参
 */
export interface PretreatSortSplitBloodAddInput {
  barcode?: string
  sampleTypeCode?: string | null
  purCodes?: string | null
  purNames?: string | null
  receiveTime?: Date | null
  splitTubeCnt?: number | null
  splitBloodStatus?: number | null
  splitBloodUserId?: number | null
  splitBloodUserName?: string | null
  splitBloodTime?: Date | null
}
/**
 * 更新标本分血入参
 */
export interface PretreatSortSplitBloodUpdateInput extends PretreatSortSplitBloodAddInput {
  id: number
}
/**
 * 获取单个标本分血返回
 */
export interface PretreatSortSplitBloodOutput extends PretreatSortSplitBloodUpdateInput {}

/**
 * 获取标本分血列表返回
 */
export interface PretreatSortSplitBloodListOutput extends PretreatSortSplitBloodOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 分血明细输出
 */
export interface PretreatSortSplitBloodDetailOutput {
  barcode?: string
  groupCode?: string
  groupName?: string
  sampleTypeCode?: string | null
  sampleTypeName?: string | null
  purCodes?: string | null
  purNames?: string | null
  entrustHospitalCode?: string | null
  entrustHospitalName?: string | null
}
/**
 * 分血入参
 */
export interface SplitBloodInput {
  barcode: string
  sampleTypeCode?: string | null
}

export interface SplitBloodOutput {
  status: number
  barcode: string
  sampleTypeList: CodeNameOutput[]
  splitBloodDetail: PretreatSortSplitBloodDetailOutput[]
  splitBlood: PretreatSortSplitBloodOutput[]
}

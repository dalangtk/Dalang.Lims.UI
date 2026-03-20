/**
 * 查询项目列表入参
 */
export interface BaseItemQueryListInput {
  itemCode?: string | null
  groupCode?: string | null
}

/**
 * 新增项目入参
 */
export interface BaseItemAddInput {
  groupCode?: string | null
  groupName?: string | null
  itemCode?: string | null
  itemName?: string | null
  resultType?: string | null
  decideType?: string | null
  itemNameAB?: string | null
  itemNameEN?: string | null
  sort?: number | null
  isValid: boolean
}
/**
 * 更新项目入参
 */
export interface BaseItemUpdateInput extends BaseItemAddInput {
  id: number
}
/**
 * 获取单个组别返回
 */
export interface BaseItemOutput extends BaseItemAddInput {
  id: number
}

/**
 * 获取组别列表返回
 */
export interface BaseItemListOutput extends BaseItemOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 查询项目个性化列表入参
 */
export interface BaseItemPersonalizeQueryListInput {
  itemCode?: string | null
}
/**
 * 新增项目个性化入参
 */
export interface BaseItemPersonalizeAddInput {
  itemCode?: string
  itemNamePersonalize?: string | null
  itemNameAB?: string | null
  itemNameEN?: string | null
  resultType?: string | null
  decideType?: string | null
  isCalculcate?: boolean | null
  calcExpression?: string | null
  methodCode?: string | null
  itemUnit?: string | null
  resultAccuracy?: number | null
  defaultValue?: string | null
  resultCoefficient?: number | null
  isReportShow?: boolean | null
  isReviewResult?: boolean | null
  isMustReference?: boolean | null
  resultExplain?: string | null
  printOrder?: string | null
  methodBasis?: string | null
  itemStaticType?: string | null
  itemSeriesType?: string | null
  pinYin?: string | null
  wuBi?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个项目个性化返回
 */
export interface BaseItemPersonalizeUpdateInput extends BaseItemPersonalizeAddInput {
  id: number
}
/**
 * 获取单个项目个性化返回
 */
export interface BaseItemPersonalizeOutput extends BaseItemPersonalizeAddInput {
  id: number
}

/**
 * 获取项目个性化列表返回
 */
export interface BaseItemPersonalizeListOutput extends BaseItemPersonalizeOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}
/**
 * 新增项目和项目个性化入参
 */
export interface ItemWithPersonalAddInput {
  baseItem: BaseItemAddInput
  baseItemPersonal: BaseItemPersonalizeAddInput
}

/**
 * 更项目和项目个性化入参
 */
export interface ItemWithPersonalUpdateInput {
  baseItem: BaseItemUpdateInput
  baseItemPersonal: BaseItemPersonalizeUpdateInput
}
/**
 * 获取项目和项目个性化返回
 */
export interface ItemWithPersonalOutput {
  baseItem: BaseItemOutput
  baseItemPersonal: BaseItemPersonalizeOutput
}

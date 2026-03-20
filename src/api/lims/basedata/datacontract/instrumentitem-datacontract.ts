/**
 * 查询上机项目列表入参
 */
export interface BaseInstrumentItemQueryListInput {
  groupCode?: string
  instrumentItemCode?: string
}

/**
 * 新增上机项目入参
 */
export interface BaseInstrumentItemAddInput {
  groupCode?: string
  groupName?: string
  instrumentItemCode?: string
  instrumentItemName?: string
  printOrder?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean | null
}
/**
 * 获取单个上机项目返回
 */
export interface BaseInstrumentItemUpdateInput extends BaseInstrumentItemAddInput {
  id: number
}
/**
 * 获取单个上机项目返回
 */
export interface BaseInstrumentItemOutput extends BaseInstrumentItemAddInput {
  id: number
}

/**
 * 获取上机项目列表返回
 */
export interface BaseInstrumentItemListOutput extends BaseInstrumentItemOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 查询上机项目明细列表入参
 */
export interface BaseInstrumentItemDetailQueryListInput {
  instrumentItemCode?: string
}
/**
 * 新增上机项目明细入参
 */
export interface BaseInstrumentItemDetailAddInput {
  instrumentItemCode?: string
  itemCode?: string | null
  itemName?: string | null
  resultType?: string | null
  instrumentItemName?: string | null
  method?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个上机项目明细返回
 */
export interface BaseInstrumentItemDetailUpdateInput extends BaseInstrumentItemDetailAddInput {
  id: number
}
/**
 * 获取单个上机项目明细返回
 */
export interface BaseInstrumentItemDetailOutput extends BaseInstrumentItemDetailAddInput {
  id: number
  itemName?: string
}

/**
 * 获取上机项目明细列表返回
 */
export interface BaseInstrumentItemDetailListOutput extends BaseInstrumentItemDetailOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

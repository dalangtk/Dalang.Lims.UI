import { BaseInstrumentItemOutput } from './instrumentitem-datacontract'

/**
 * 查询检验目的列表入参
 */
export interface BasePurposeQueryListInput {
  groupCode?: string
  purCode?: string
}
/**
 * 新增检验目的入参
 */
export interface BasePurposeAddInput {
  groupCode?: string
  groupName?: string
  purCode?: string
  purName?: string
  purNameAB?: string | null
  purNameEN?: string | null
  sampleTypeCode?: string | null
  sampleTypeCodeList?: Array<string> | null
  sampleTypeName?: string | null
  clinicalSence?: string | null
  suggestions?: string | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个检验目的返回
 */
export interface BasePurposeUpdateInput extends BasePurposeAddInput {
  id: number
}
/**
 * 获取单个检验目的返回
 */
export interface BasePurposeOutput extends BasePurposeAddInput {
  id: number
}

/**
 * 获取检验目的列表返回
 */
export interface BasePurposeListOutput extends BasePurposeOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 查询目的明细列表入参
 */
export interface BasePurposeDetailQueryListInput {
  groupCode?: ''
  purCode?: ''
}
/**
 * 新增目的明细入参
 */
export interface BasePurposeDetailAddInput {
  groupCode?: string
  purCode?: string
  instrumentItemCode?: string
  itemCode?: string
  resultType?: string | null
  method?: string | null
  isReportShow?: boolean | null
  defaultValue?: string | null
  sort?: number
  isValid?: boolean

  itemName?: string | null
  instrumentItemName?: string | null
}
/**
 * 获取单个目的明细返回
 */
export interface BasePurposeDetailUpdateInput extends BasePurposeDetailAddInput {
  id: number
}
/**
 * 获取单个目的明细返回
 */
export interface BasePurposeDetailOutput extends BasePurposeDetailAddInput {
  id: number
}

/**
 * 获取目的明细列表返回
 */
export interface BasePurposeDetailListOutput extends BasePurposeDetailOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

/**
 * 目的和目的明细
 */
export interface PurposeDetailInput {
  purpose: BasePurposeAddInput | BasePurposeUpdateInput | any
  purposeItemDetail: BasePurposeDetailAddInput[] | BasePurposeDetailUpdateInput[]
  purposeInstrumentItem: BaseInstrumentItemOutput[]
  purposePersonalizes: BasePurposePersonalizeAddInput[] | BasePurposePersonalizeUpdateInput[]
  purposeTenantSetting: BasePurposeTenantSettingAddInput | BasePurposeTenantSettingUpdateInput | any
}

/**
 * 新增目的定制入参
 */
export interface BasePurposePersonalizeAddInput {
  purCode?: string
  sampleTypeCode?: string[]
  purNamePersonalize?: string | null
  customerCode?: string | null
  sort?: number
  isValid?: boolean

  uid?: string | null
  sampleTypeName?: string | null
}
/**
 * 更新单个目的定制入参
 */
export interface BasePurposePersonalizeUpdateInput extends BasePurposePersonalizeAddInput {
  id: number
}
/**
 * 获取单个目的定制返回
 */
export interface BasePurposePersonalizeOutput extends BasePurposePersonalizeAddInput {
  id: number
}

/**
 * 获取目的定制列表返回
 */
export interface BasePurposePersonalizeListOutput extends BasePurposePersonalizeOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}
/**
 * 查询目的和套餐入参
 */
export interface PurposeAndComboQueryInput {
  purCode?: string | null
  customerCode?: string | null
  queryCombo?: Boolean | null
  groupCode?: string | null
}

/**
 * 获取目的和套餐返回
 */
export interface PurposeAndComboOutput {
  purCode: string | null
  purName: string | null
  isCombo?: Boolean | null
}

/**
 * 新增目的机构设置入参
 */
export interface BasePurposeTenantSettingAddInput {
  purCode?: string
  isEnable?: boolean | null
  isInputHide?: boolean | null
  workFlowType?: string | null
  examPlan?: string | null
  testShift?: string | null
  testSeries?: string | null
  testSex?: string | null
  storageCondition?: string | null
  storageCycle?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 更新目的机构设置入参
 */
export interface BasePurposeTenantSettingUpdateInput extends BasePurposeTenantSettingAddInput {
  id: number
}
/**
 * 获取目的机构设置返回
 */
export interface BasePurposeTenantSettingOutput extends BasePurposeTenantSettingUpdateInput {}

/**
 * 获取项目和项目个性化返回
 */
export interface PurposeWithTenantSettingOutput {
  basePurpose: BasePurposeOutput
  basePurposeTenantSetting: BasePurposeTenantSettingOutput
}

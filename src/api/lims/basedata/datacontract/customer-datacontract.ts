import {
  BaseCustomerReportExtendAddInput,
  BaseCustomerReportExtendOutput,
  BaseCustomerReportExtendUpdateInput,
} from './customerreportextend-datacontract'

/**
 * 查询客户列表入参
 */
export interface BaseCustomerQueryListInput {
  customerCode?: string | null
}
/**
 * 新增客户入参
 */
export interface BaseCustomerAddInput {
  customerCode?: string | null
  customerName?: string | null
  customerNameAB?: string | null
  area?: string | null
  address?: string | null
  longitude?: string | null
  latitude?: string | null
  customerLevel?: string | null
  customerType?: string | null
  customerNature?: string | null
  collaborationMode?: string | null
  contacts?: string | null
  contactPhone?: string | null
  criticalContacts?: string | null
  criticalContactPhone?: string | null
  doubleInputType?: string | null
  cooperateType?: string | null
  firstCooperateTime?: Date | null
  customerClassification: string | null
  belongToTenant?: number | null
  remark?: string | null
  sort?: number
  isValid?: boolean
}
/**
 * 获取单个客户返回
 */
export interface BaseCustomerUpdateInput extends BaseCustomerAddInput {
  id: number
}
/**
 * 获取单个客户返回
 */
export interface BaseCustomerOutput extends BaseCustomerAddInput {
  id: number
}

/**
 * 获取客户列表返回
 */
export interface BaseCustomerListOutput extends BaseCustomerOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

export interface GetCustomerOutput {
  customer: BaseCustomerOutput
  reportExtend: BaseCustomerReportExtendOutput
}

/**
 * 保存客户入参
 */
export interface UpdateCustomerInput {
  customer: BaseCustomerUpdateInput
  reportExtend: BaseCustomerReportExtendUpdateInput
}

export interface AddCustomerInput {
  customer: BaseCustomerAddInput
  reportExtend: BaseCustomerReportExtendAddInput
}

import { BaseCustomerApi } from '../api/lims/basedata/basecustomer'
import { BaseGroupApi } from '../api/lims/basedata/basegroup'
import { BaseItemApi } from '../api/lims/basedata/baseitem'
import { BasePurposeApi } from '../api/lims/basedata/basepurpose'
import { BaseSequenceApi } from '../api/lims/basedata/basesequence'
import { GetPageInput } from '../api/lims/basedata/datacontract/base'
type FunctionName = keyof typeof methodMap

const methodMap = {
  getGroupAllList: getGroupAllList,
  remoteQueryGroup: remoteQueryGroup,
  remoteQueryCustomer: remoteQueryCustomer,
  remoteQueryItem: remoteQueryItem,
  remoteQueryPurpose: remoteQueryPurpose,
}

/**
 * 传入方法名，动态调用对应方法，主要给分拣规则使用
 * @param query 查询字符串
 * @param functionName 要调用的方法名
 * @returns LabelValueType格式组别列表
 */
export async function commonSelectQuery(query: string, functionName: FunctionName): Promise<LabelValueType[]> {
  console.log('functionName', functionName)
  const result = await methodMap[functionName](query)
  return result
}

/**
 * 获取所有组别
 * @returns LabelValueType格式组别列表
 */
export async function getGroupAllList(): Promise<LabelValueType[]> {
  const res = await new BaseGroupApi().getAll()
  const selectData: LabelValueType[] = res!.data!.map((item) => ({
    label: item.groupName!,
    value: item.groupCode!,
  }))
  return selectData
}

/**
 * 分页查询组别，只取前10条
 * @param query 查询条件
 * @returns  LabelValueType格式组别列表
 */
export async function remoteQueryGroup(query: string): Promise<LabelValueType[]> {
  const res = await new BaseGroupApi().getPage({
    currentPage: 1,
    pageSize: 10,
    filter: {
      groupCode: query,
    },
  })
  const selectData: LabelValueType[] = res!.data!.list!.map((item) => ({
    label: item.groupName!,
    value: item.groupCode!,
  }))
  return selectData
}

/**
 * 分页查询客户，只取前10条
 * @param query 查询关键字
 * @returns LabelValueType格式客户列表
 */
export async function remoteQueryCustomer(query: string): Promise<LabelValueType[]> {
  const res = await new BaseCustomerApi().getPage({
    currentPage: 1,
    pageSize: 10,
    filter: {
      customerCode: query,
    },
  })
  const selectData: LabelValueType[] = res!.data!.list!.map((item) => ({
    label: item.customerName!,
    value: item.customerCode!,
  }))
  return selectData
}

/**
 * 分页查询项目，只取前10条
 * @param query 查询关键字
 * @returns
 */
export async function remoteQueryItem(query: string): Promise<LabelValueType[]> {
  const res = await new BaseItemApi().getPage({
    currentPage: 1,
    pageSize: 10,
    filter: {
      itemCode: query,
    },
  })
  const selectData: LabelValueType[] = res!.data!.list!.map((item) => ({
    label: item.itemName!,
    value: item.itemCode!,
  }))
  return selectData
}

/**
 * 分页查询目的，只取前10条
 * @param query 查询关键字
 * @returns
 */
export async function remoteQueryPurpose(query: string): Promise<LabelValueType[]> {
  const res = await new BasePurposeApi().getPageWithPersonalizeName({
    currentPage: 1,
    pageSize: 10,
    filter: {
      purCode: query,
    },
  })
  const selectData: LabelValueType[] = res!.data!.list!.map((item) => ({
    label: item.purName!,
    value: item.purCode!,
  }))
  return selectData
}

/**
 * 分页查询序列，只取前10条
 * @param query 搜索关键字
 * @returns 
 */
export async function remoteQuerySequence(query: string): Promise<LabelValueType[]> {
  const res = await new BaseSequenceApi().getPage({
    currentPage: 1,
    pageSize: 10,
    filter: {
      sequenceCode: query,
    },
  })
  const selectData: LabelValueType[] = res!.data!.list!.map((item) => ({
    label: item.sequenceName!,
    value: item.sequenceCode!,
  }))
  return selectData
}

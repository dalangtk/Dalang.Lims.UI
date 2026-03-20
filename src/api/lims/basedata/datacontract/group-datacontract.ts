/**
 * 查询组别列表入参
 */
export interface BaseGroupQueryListInput {
  groupCode?: string | null
}
/**
 * 新增组别入参
 */
export interface BaseGroupAddInput {
  groupCode?: string | null
  groupName?: string | null
  sort?: number | null
  isValid: boolean
}
/**
 * 获取单个组别返回
 */
export interface BaseGroupUpdateInput extends BaseGroupAddInput {
  id: number
}
/**
 * 获取单个组别返回
 */
export interface BaseGroupOutput extends BaseGroupAddInput {
  id: number
}

/**
 * 获取组别列表返回
 */
export interface BaseGroupListOutput extends BaseGroupOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

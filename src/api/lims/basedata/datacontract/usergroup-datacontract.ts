/**
 * 查询用户组别列表入参
 */
export interface BaseUserGroupQueryListInput {
  groupCode?: string | null
  userId?: number | null
}
/**
 * 新增用户组别入参
 */
export interface BaseUserGroupAddInput {
  userId?: number | null
  groupCode?: string | null
  canTest?: number | null
  canFirstCheck?: number | null
  canSecondCheck?: number | null
  canUnCheck?: number | null
  canPrintedUnCheck?: number | null
  canCancelTest?: number | null
  canDisCancel?: number | null
  canModifiedInfo?: number | null
  isValid?: boolean
}
/**
 * 更新用户组别入参
 */
export interface BaseUserGroupUpdateInput extends BaseUserGroupAddInput {
  id: number
}
/**
 * 获取单个用户组别返回
 */
export interface BaseUserGroupOutput extends BaseUserGroupUpdateInput {
  name?: string | null
  groupName?: string | null
  isChange: boolean
}

/**
 * 获取用户组别列表返回
 */
export interface BaseUserGroupListOutput extends BaseUserGroupOutput {
  proId: number
  proName?: string | null
  proTime?: Date | null
  modId: number
  modName?: string | null
  modTime?: Date | null
}

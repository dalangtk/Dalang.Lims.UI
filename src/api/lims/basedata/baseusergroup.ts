import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseUserGroupOutput,
  BaseUserGroupAddInput,
  BaseUserGroupUpdateInput,
  BaseUserGroupQueryListInput,
} from './datacontract/usergroup-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'
import { BaseGroupOutput } from './datacontract/group-datacontract'

export class BaseUserGroupApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetListByGroupCode
   * @summary 根据组别查询列表
   * @request POST:/api/lims/base-user-group/get-list-by-group-code
   * @secure
   */
  getListByGroupCode = (data: BaseUserGroupQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<BaseUserGroupOutput[]>, any>({
      path: `/api/lims/base-user-group/get-list-by-group-code`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name 根据用户查询列表
   * @summary 根据组别查询列表
   * @request POST:/api/lims/base-user-group/get-list-by-user-id
   * @secure
   */
  getListByUserId = (data: BaseUserGroupQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<BaseUserGroupOutput[]>, any>({
      path: `/api/lims/base-user-group/get-list-by-user-id`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Get
   * @summary 查询用户组别
   * @request GET:/api/lims/base-user-group/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseUserGroupOutput>, any>({
      path: `/api/lims/base-user-group/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增用户组别
   * @request POST:/api/lims/base-user-group/add
   * @secure
   */
  add = (data: BaseUserGroupAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-user-group/add`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name AddList
   * @summary 批量新增
   * @request POST:/api/lims/base-user-group/add-list
   * @secure
   */
  addList = (data: BaseUserGroupAddInput[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/lims/base-user-group/add-list`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Update
   * @summary 修改用户组别
   * @request PUT:/api/lims/base-user-group/update
   * @secure
   */
  update = (data: BaseUserGroupUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-user-group/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Update
   * @summary 修改用户组别
   * @request PUT:/api/lims/base-user-group/update
   * @secure
   */
  updateList = (data: BaseUserGroupOutput[], params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-user-group/update-list`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Delete
   * @summary 删除用户组别
   * @request DELETE:/api/lims/base-user-group/delete
   * @secure
   */
  delete = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-user-group/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name GetUserCanTestGroup
   * @summary 获取检验权限组别
   * @request POST:/api/lims/base-user-group/get-user-can-test-group
   * @secure
   */
  getUserCanTestGroup = (data: BaseUserGroupQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<BaseGroupOutput[]>, any>({
      path: `/api/lims/base-user-group/get-user-can-test-group`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags lims
   * @name Get
   * @summary 判断检验权限
   * @request GET:/api/lims/base-user-group/check-user-test-permission
   * @secure
   */
  checkUserTestPermission = (
    query?: {
      groupCode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/lims/base-user-group/check-user-test-permission`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
}

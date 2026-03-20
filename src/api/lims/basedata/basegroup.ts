import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseGroupOutput,
  BaseGroupListOutput,
  BaseGroupAddInput,
  BaseGroupUpdateInput,
  BaseGroupQueryListInput,
} from './datacontract/group-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseGroupApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags baseGroup
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-group/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseGroupQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseGroupListOutput>, any>({
      path: `/api/lims/base-group/get-page`,
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
   * @tags baseGroup
   * @name Get
   * @summary 查询组别
   * @request GET:/api/lims/base-group/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseGroupOutput>, any>({
      path: `/api/lims/base-group/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags baseGroup
   * @name GetAll
   * @summary 查询组别所有数据
   * @request GET:/api/lims/base-group/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseGroupOutput>>, any>({
      path: `/api/lims/base-group/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags baseGroup
   * @name Add
   * @summary 新增组别
   * @request POST:/api/lims/base-group/add
   * @secure
   */
  add = (data: BaseGroupAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-group/add`,
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
   * @tags baseGroup
   * @name Update
   * @summary 修改组别
   * @request PUT:/api/lims/base-group/update
   * @secure
   */
  update = (data: BaseGroupUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-group/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags baseGroup
   * @name Delete
   * @summary 生成组别
   * @request DELETE:/api/lims/base-group/delete
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
      path: `/api/lims/base-group/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

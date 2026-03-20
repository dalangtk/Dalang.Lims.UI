import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import { ParameterOutput, ParameterListOutput, ParameterAddInput, ParameterUpdateInput, ParameterQueryInput } from './data-contracts'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class ParameterApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags admin
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/admin/parameter/get-page
   * @secure
   */
  getPage = (data: GetPageInput<ParameterQueryInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ParameterListOutput>, any>({
      path: `/api/admin/parameter/get-page`,
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
   * @tags admin
   * @name Get
   * @summary 查询系统参数
   * @request GET:/api/admin/parameter/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ParameterOutput>, any>({
      path: `/api/admin/parameter/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags admin
   * @name Add
   * @summary 新增系统参数
   * @request POST:/api/admin/parameter/add
   * @secure
   */
  add = (data: ParameterAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/admin/parameter/add`,
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
   * @tags admin
   * @name Update
   * @summary 修改系统参数
   * @request PUT:/api/admin/parameter/update
   * @secure
   */
  update = (data: ParameterUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/admin/parameter/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags admin
   * @name Delete
   * @summary 删除系统参数
   * @request DELETE:/api/admin/parameter/delete
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
      path: `/api/admin/parameter/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

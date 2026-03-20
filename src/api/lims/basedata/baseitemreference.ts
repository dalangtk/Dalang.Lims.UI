import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseItemReferenceOutput,
  BaseItemReferenceListOutput,
  BaseItemReferenceAddInput,
  BaseItemReferenceUpdateInput,
  BaseItemReferenceQueryListInput,
} from './datacontract/itemreference-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseItemReferenceApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-item-reference/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseItemReferenceQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseItemReferenceListOutput>, any>({
      path: `/api/lims/base-item-reference/get-page`,
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
   * @summary 查询参考范围
   * @request GET:/api/lims/base-item-reference/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseItemReferenceOutput>, any>({
      path: `/api/lims/base-item-reference/get`,
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
   * @name POST
   * @summary 查询参考范围
   * @request POST:/api/lims/base-item-reference/get-item-reference
   * @secure
   */
  getItemReference = (data: BaseItemReferenceQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<Array<BaseItemReferenceOutput>>, any>({
      path: `/api/lims/base-item-reference/get-item-reference`,
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
   * @name GetAll
   * @summary 查询参考范围所有数据
   * @request GET:/api/lims/base-item-reference/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseItemReferenceOutput>>, any>({
      path: `/api/lims/base-item-reference/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增参考范围
   * @request POST:/api/lims/base-item-reference/add
   * @secure
   */
  add = (data: BaseItemReferenceAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-item-reference/add`,
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
   * @summary 修改参考范围
   * @request PUT:/api/lims/base-item-reference/update
   * @secure
   */
  update = (data: BaseItemReferenceUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-item-reference/update`,
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
   * @summary 生成参考范围
   * @request DELETE:/api/lims/base-item-reference/delete
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
      path: `/api/lims/base-item-reference/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

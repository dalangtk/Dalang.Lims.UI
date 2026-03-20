import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseSampleTypeOutput,
  BaseSampleTypeListOutput,
  BaseSampleTypeAddInput,
  BaseSampleTypeUpdateInput,
  BaseSampleTypeQueryListInput,
} from './datacontract/sampletype-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseSampleTypeApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-sample-type/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseSampleTypeQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseSampleTypeListOutput>, any>({
      path: `/api/lims/base-sample-type/get-page`,
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
   * @summary 查询标本类型
   * @request GET:/api/lims/base-sample-type/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseSampleTypeOutput>, any>({
      path: `/api/lims/base-sample-type/get`,
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
   * @name GetAll
   * @summary 查询标本类型所有数据
   * @request GET:/api/lims/base-sample-type/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseSampleTypeOutput>>, any>({
      path: `/api/lims/base-sample-type/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增标本类型
   * @request POST:/api/lims/base-sample-type/add
   * @secure
   */
  add = (data: BaseSampleTypeAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-sample-type/add`,
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
   * @summary 修改标本类型
   * @request PUT:/api/lims/base-sample-type/update
   * @secure
   */
  update = (data: BaseSampleTypeUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-sample-type/update`,
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
   * @summary 生成标本类型
   * @request DELETE:/api/lims/base-sample-type/delete
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
      path: `/api/lims/base-sample-type/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

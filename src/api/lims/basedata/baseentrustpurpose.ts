import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseEntrustPurposeOutput,
  BaseEntrustPurposeListOutput,
  BaseEntrustPurposeAddInput,
  BaseEntrustPurposeUpdateInput,
  BaseEntrustPurposeQueryListInput,
} from './datacontract/entrustpurpose-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseEntrustPurposeApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-entrust-purpose/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseEntrustPurposeQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseEntrustPurposeListOutput>, any>({
      path: `/api/lims/base-entrust-purpose/get-page`,
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
   * @summary 查询委托目的
   * @request GET:/api/lims/base-entrust-purpose/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseEntrustPurposeOutput>, any>({
      path: `/api/lims/base-entrust-purpose/get`,
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
   * @summary 查询委托目的所有数据
   * @request GET:/api/lims/base-entrust-purpose/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseEntrustPurposeOutput>>, any>({
      path: `/api/lims/base-entrust-purpose/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增委托目的
   * @request POST:/api/lims/base-entrust-purpose/add
   * @secure
   */
  add = (data: BaseEntrustPurposeAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-entrust-purpose/add`,
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
   * @summary 修改委托目的
   * @request PUT:/api/lims/base-entrust-purpose/update
   * @secure
   */
  update = (data: BaseEntrustPurposeUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-entrust-purpose/update`,
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
   * @summary 删除委托目的
   * @request DELETE:/api/lims/base-entrust-purpose/delete
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
      path: `/api/lims/base-entrust-purpose/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

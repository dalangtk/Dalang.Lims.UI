import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  PurposeMatchOutput,
  PurposeMatchListOutput,
  PurposeMatchAddInput,
  PurposeMatchUpdateInput,
  PurposeMatchQueryListInput,
  QuickPurmatchDto,
  PurposeMatchMutilQueryInput,
} from './datacontract/pretreatcustomerpurposematch-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class PretreatCustomerPurposeMatchApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pretreatment
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/pretreat-customer-purpose-match/get-page
   * @secure
   */
  getPage = (data: GetPageInput<PurposeMatchQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<PurposeMatchListOutput>, any>({
      path: `/api/pretreatment/pretreat-customer-purpose-match/get-page`,
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
   * @tags pretreatment
   * @name Get
   * @summary 查询目的对照
   * @request GET:/api/pretreatment/pretreat-customer-purpose-match/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<PurposeMatchOutput>, any>({
      path: `/api/pretreatment/pretreat-customer-purpose-match/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pretreatment
   * @name GetAll
   * @summary 查询目的对照所有数据
   * @request GET:/api/pretreatment/pretreat-customer-purpose-match/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<PurposeMatchOutput>>, any>({
      path: `/api/pretreatment/pretreat-customer-purpose-match/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pretreatment
   * @name Add
   * @summary 新增目的对照
   * @request POST:/api/pretreatment/pretreat-customer-purpose-match/add
   * @secure
   */
  add = (data: PurposeMatchAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pretreatment/pretreat-customer-purpose-match/add`,
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
   * @tags pretreatment
   * @name Update
   * @summary 修改目的对照
   * @request PUT:/api/pretreatment/pretreat-customer-purpose-match/update
   * @secure
   */
  update = (data: PurposeMatchUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pretreatment/pretreat-customer-purpose-match/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags pretreatment
   * @name Delete
   * @summary 删除目的对照
   * @request DELETE:/api/pretreatment/pretreat-customer-purpose-match/delete
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
      path: `/api/pretreatment/pretreat-customer-purpose-match/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags pretreatment
   * @name Add
   * @summary 快速对照
   * @request POST:/api/pretreatment/pretreat-customer-purpose-match/quick-purpose-match
   * @secure
   */
  quickMatch = (data: QuickPurmatchDto[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/pretreatment/pretreat-customer-purpose-match/quick-purpose-match`,
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
   * @tags pretreatment
   * @name getPurMatchDetail
   * @summary 快速对照
   * @request POST:/api/pretreatment/pretreat-customer-purpose-match/get-customer-pur-match-detail-list
   * @secure
   */
  getPurMatchDetail = (data: PurposeMatchMutilQueryInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<PurposeMatchOutput[]>, any>({
      path: `/api/pretreatment/pretreat-customer-purpose-match/get-customer-pur-match-detail-list`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}

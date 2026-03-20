import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseCustomerOutput,
  BaseCustomerListOutput,
  BaseCustomerAddInput,
  BaseCustomerUpdateInput,
  BaseCustomerQueryListInput,
  GetCustomerOutput,
  AddCustomerInput,
  UpdateCustomerInput,
} from './datacontract/customer-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseCustomerApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-customer/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseCustomerQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseCustomerListOutput>, any>({
      path: `/api/lims/base-customer/get-page`,
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
   * @summary 查询客户
   * @request GET:/api/lims/base-customer/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<GetCustomerOutput>, any>({
      path: `/api/lims/base-customer/get`,
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
   * @summary 查询客户所有数据
   * @request GET:/api/lims/base-customer/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseCustomerOutput>>, any>({
      path: `/api/lims/base-customer/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增客户
   * @request POST:/api/lims/base-customer/add
   * @secure
   */
  add = (data: AddCustomerInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-customer/add`,
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
   * @summary 修改客户
   * @request PUT:/api/lims/base-customer/update
   * @secure
   */
  update = (data: UpdateCustomerInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-customer/update`,
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
   * @summary 生成客户
   * @request DELETE:/api/lims/base-customer/delete
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
      path: `/api/lims/base-customer/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

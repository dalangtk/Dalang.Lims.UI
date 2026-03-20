import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseEntrustHospitalOutput,
  BaseEntrustHospitalListOutput,
  BaseEntrustHospitalAddInput,
  BaseEntrustHospitalUpdateInput,
  BaseEntrustHospitalQueryListInput,
} from './datacontract/entrusthospital-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseEntrustHospitalApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-entrust-hospital/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseEntrustHospitalQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseEntrustHospitalListOutput>, any>({
      path: `/api/lims/base-entrust-hospital/get-page`,
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
   * @summary 查询委托医院
   * @request GET:/api/lims/base-entrust-hospital/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseEntrustHospitalOutput>, any>({
      path: `/api/lims/base-entrust-hospital/get`,
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
   * @summary 查询委托医院所有数据
   * @request GET:/api/lims/base-entrust-hospital/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseEntrustHospitalOutput>>, any>({
      path: `/api/lims/base-entrust-hospital/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增委托医院
   * @request POST:/api/lims/base-entrust-hospital/add
   * @secure
   */
  add = (data: BaseEntrustHospitalAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-entrust-hospital/add`,
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
   * @summary 修改委托医院
   * @request PUT:/api/lims/base-entrust-hospital/update
   * @secure
   */
  update = (data: BaseEntrustHospitalUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-entrust-hospital/update`,
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
   * @summary 生成委托医院
   * @request DELETE:/api/lims/base-entrust-hospital/delete
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
      path: `/api/lims/base-entrust-hospital/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

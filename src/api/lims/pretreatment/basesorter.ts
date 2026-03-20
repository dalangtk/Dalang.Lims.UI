import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseSorterOutput,
  BaseSorterListOutput,
  BaseSorterAddInput,
  BaseSorterUpdateInput,
  BaseSorterQueryListInput,
} from './datacontract/basesorter-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseSorterApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pretreatment/base-sorter/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseSorterQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseSorterListOutput>, any>({
      path: `/api/pretreatment/base-sorter/get-page`,
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
   * @summary 查询分拣仪器
   * @request GET:/api/pretreatment/base-sorter/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseSorterOutput>, any>({
      path: `/api/pretreatment/base-sorter/get`,
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
   * @summary 查询分拣仪器所有数据
   * @request GET:/pretreatment/lims/base-sorter/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseSorterOutput>>, any>({
      path: `/api/pretreatment/base-sorter/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增分拣仪器
   * @request POST:/api/pretreatment/base-sorter/add
   * @secure
   */
  add = (data: any, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pretreatment/base-sorter/add`,
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
   * @summary 修改分拣仪器
   * @request PUT:/api/pretreatment/base-sorter/update
   * @secure
   */
  update = (data: any, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pretreatment/base-sorter/update`,
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
   * @summary 删除分拣仪器
   * @request DELETE:/api/pretreatment/base-sorter/delete
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
      path: `/api/pretreatment/base-sorter/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

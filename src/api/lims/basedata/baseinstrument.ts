import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseInstrumentOutput,
  BaseInstrumentListOutput,
  BaseInstrumentAddInput,
  BaseInstrumentUpdateInput,
  BaseInstrumentQueryListInput,
} from './datacontract/instrument-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from './datacontract/base'

export class BaseInstrumentApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-instrument/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseInstrumentQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseInstrumentListOutput>, any>({
      path: `/api/lims/base-instrument/get-page`,
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
   * @summary 查询仪器
   * @request GET:/api/lims/base-instrument/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseInstrumentOutput>, any>({
      path: `/api/lims/base-instrument/get`,
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
   * @summary 查询仪器所有数据
   * @request GET:/api/lims/base-instrument/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseInstrumentOutput>>, any>({
      path: `/api/lims/base-instrument/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增仪器
   * @request POST:/api/lims/base-instrument/add
   * @secure
   */
  add = (data: BaseInstrumentAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-instrument/add`,
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
   * @summary 修改仪器
   * @request PUT:/api/lims/base-instrument/update
   * @secure
   */
  update = (data: BaseInstrumentUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-instrument/update`,
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
   * @summary 生成仪器
   * @request DELETE:/api/lims/base-instrument/delete
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
      path: `/api/lims/base-instrument/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

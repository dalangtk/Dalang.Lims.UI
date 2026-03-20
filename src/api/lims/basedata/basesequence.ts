import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BaseSequenceOutput,
  BaseSequenceListOutput,
  BaseSequenceAddInput,
  BaseSequenceUpdateInput,
  BaseSequenceQueryListInput,
} from './datacontract/sequence-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BaseSequenceApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags lims
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/lims/base-sequence/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BaseSequenceQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BaseSequenceListOutput>, any>({
      path: `/api/lims/base-sequence/get-page`,
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
   * @summary 查询序列
   * @request GET:/api/lims/base-sequence/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BaseSequenceOutput>, any>({
      path: `/api/lims/base-sequence/get`,
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
   * @summary 查询序列所有数据
   * @request GET:/api/lims/base-sequence/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BaseSequenceOutput>>, any>({
      path: `/api/lims/base-sequence/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags lims
   * @name Add
   * @summary 新增序列
   * @request POST:/api/lims/base-sequence/add
   * @secure
   */
  add = (data: BaseSequenceAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/lims/base-sequence/add`,
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
   * @summary 修改序列
   * @request PUT:/api/lims/base-sequence/update
   * @secure
   */
  update = (data: BaseSequenceUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/lims/base-sequence/update`,
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
   * @summary 删除序列
   * @request DELETE:/api/lims/base-sequence/delete
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
      path: `/api/lims/base-sequence/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

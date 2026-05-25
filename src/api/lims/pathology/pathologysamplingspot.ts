import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BasePathologySamplingSpotOutput,
  BasePathologySamplingSpotListOutput,
  BasePathologySamplingSpotAddInput,
  BasePathologySamplingSpotUpdateInput,
  BasePathologySamplingSpotQueryListInput,
} from './datacontract/pathologysamplingspot-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BasePathologySamplingSpotApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/base-pathology-sampling-spot/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BasePathologySamplingSpotQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePathologySamplingSpotListOutput>, any>({
      path: `/api/pathology/base-pathology-sampling-spot/get-page`,
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
   * @tags pathology
   * @name Get
   * @summary 查询取材部位
   * @request GET:/api/pathology/base-pathology-sampling-spot/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePathologySamplingSpotOutput>, any>({
      path: `/api/pathology/base-pathology-sampling-spot/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name GetAll
   * @summary 查询取材部位所有数据
   * @request GET:/api/pathology/base-pathology-sampling-spot/get-all
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BasePathologySamplingSpotOutput>>, any>({
      path: `/api/pathology/base-pathology-sampling-spot/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Add
   * @summary 新增取材部位
   * @request POST:/api/pathology/base-pathology-sampling-spot/add
   * @secure
   */
  add = (data: BasePathologySamplingSpotAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/base-pathology-sampling-spot/add`,
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
   * @tags pathology
   * @name Update
   * @summary 修改取材部位
   * @request PUT:/api/pathology/base-pathology-sampling-spot/update
   * @secure
   */
  update = (data: BasePathologySamplingSpotUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-sampling-spot/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Delete
   * @summary 删除取材部位
   * @request DELETE:/api/pathology/base-pathology-sampling-spot/delete
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
      path: `/api/pathology/base-pathology-sampling-spot/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

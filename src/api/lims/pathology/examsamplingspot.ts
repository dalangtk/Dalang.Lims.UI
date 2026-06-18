import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  ExamPathologySamplingSpotOutput,
  ExamPathologySamplingSpotListOutput,
  ExamPathologySamplingSpotAddInput,
  ExamPathologySamplingSpotUpdateInput,
  ExamPathologySamplingSpotQueryListInput,
} from './datacontract/exampathologysamplingspot-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class ExamPathologySamplingSpotApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/exam-pathology-sampling-spot/get-page
   * @secure
   */
  getPage = (data: GetPageInput<ExamPathologySamplingSpotQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ExamPathologySamplingSpotListOutput>, any>({
      path: `/api/pathology/exam-pathology-sampling-spot/get-page`,
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
   * @summary 查询检验取材部位
   * @request GET:/api/pathology/exam-pathology-sampling-spot/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamPathologySamplingSpotOutput>, any>({
      path: `/api/pathology/exam-pathology-sampling-spot/get`,
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
   * @name getList
   * @summary 查询检验取材部位列表
   * @request GET:/api/pathology/exam-pathology-sampling-spot/get-list
   * @secure
   */
  getList = (
    query?: {
      /** @format int64 */
      examInfoId?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<ExamPathologySamplingSpotOutput>>, any>({
      path: `/api/pathology/exam-pathology-sampling-spot/get-list`,
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
   * @name Add
   * @summary 新增检验取材部位
   * @request POST:/api/pathology/exam-pathology-sampling-spot/add
   * @secure
   */
  add = (data: ExamPathologySamplingSpotAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/exam-pathology-sampling-spot/add`,
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
   * @summary 修改检验取材部位
   * @request PUT:/api/pathology/exam-pathology-sampling-spot/update
   * @secure
   */
  update = (data: ExamPathologySamplingSpotUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/exam-pathology-sampling-spot/update`,
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
   * @summary 删除检验取材部位
   * @request DELETE:/api/pathology/exam-pathology-sampling-spot/delete
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
      path: `/api/pathology/exam-pathology-sampling-spot/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

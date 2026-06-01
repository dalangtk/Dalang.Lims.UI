import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  BasePathologySubDiseaseOutput,
  BasePathologySubDiseaseListOutput,
  BasePathologySubDiseaseAddInput,
  BasePathologySubDiseaseUpdateInput,
  BasePathologySubDiseaseQueryListInput,
} from './datacontract/pathologysubdisease-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class BasePathologySubDiseaseApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/base-pathology-sub-disease/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BasePathologySubDiseaseQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePathologySubDiseaseListOutput>, any>({
      path: `/api/pathology/base-pathology-sub-disease/get-page`,
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
   * @summary 查询子疾病
   * @request GET:/api/pathology/base-pathology-sub-disease/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePathologySubDiseaseOutput>, any>({
      path: `/api/pathology/base-pathology-sub-disease/get`,
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
   * @summary 查询子疾病所有数据
   * @request GET:/api/pathology/base-pathology-sub-disease/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<BasePathologySubDiseaseOutput>>, any>({
      path: `/api/pathology/base-pathology-sub-disease/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Add
   * @summary 新增子疾病
   * @request POST:/api/pathology/base-pathology-sub-disease/add
   * @secure
   */
  add = (data: BasePathologySubDiseaseAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/base-pathology-sub-disease/add`,
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
   * @summary 修改子疾病
   * @request PUT:/api/pathology/base-pathology-sub-disease/update
   * @secure
   */
  update = (data: BasePathologySubDiseaseUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-sub-disease/update`,
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
   * @summary 删除子疾病
   * @request DELETE:/api/pathology/base-pathology-sub-disease/delete
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
      path: `/api/pathology/base-pathology-sub-disease/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

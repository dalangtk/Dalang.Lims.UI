import { AxiosResponse } from 'axios'
import {
  BasePathologyDiseaseAddInput,
  BasePathologyDiseaseListOutput,
  BasePathologyDiseaseOutput,
  BasePathologyDiseaseQueryListInput,
  BasePathologyDiseaseUpdateInput,
} from './datacontract/pathologydisease-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { GetPageInput, ResultBaseOutput, ResultBasePageOutput } from '/@/api/lims/basedata/datacontract/base'
import { BasePathologyDiseaseDetailAddInput, BasePathologyDiseaseDetailOutput } from './datacontract/pathologydiseasedetail-datacontract'

export class BasePathologyDiseaseApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/base-pathology-disease/get-page
   * @secure
   */
  getPage = (data: GetPageInput<BasePathologyDiseaseQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<BasePathologyDiseaseListOutput>, any>({
      path: `/api/pathology/base-pathology-disease/get-page`,
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
   * @summary 查询疾病
   * @request GET:/api/pathology/base-pathology-disease/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<BasePathologyDiseaseOutput>, any>({
      path: `/api/pathology/base-pathology-disease/get`,
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
   * @summary 新增疾病
   * @request POST:/api/pathology/base-pathology-disease/add
   * @secure
   */
  add = (data: BasePathologyDiseaseAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/base-pathology-disease/add`,
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
   * @summary 修改疾病
   * @request PUT:/api/pathology/base-pathology-disease/update
   * @secure
   */
  update = (data: BasePathologyDiseaseUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-disease/update`,
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
   * @summary 删除疾病
   * @request DELETE:/api/pathology/base-pathology-disease/delete
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
      path: `/api/pathology/base-pathology-disease/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name GetDiseaseDetails
   * @summary 获取疾病明细
   * @request GET:/api/pathology/base-pathology-disease/get-disease-details
   * @secure
   */
  getDiseaseDetails = (
    query?: {
      diseaseCode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<BasePathologyDiseaseDetailOutput>>, any>({
      path: `/api/pathology/base-pathology-disease/get-disease-details`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pathology
   * @name AddDiseaseDetail
   * @summary 新增疾病明细
   * @request POST:/api/pathology/base-pathology-disease/add-disease-detail
   * @secure
   */
  addDiseaseDetail = (data: BasePathologyDiseaseDetailAddInput[], params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-disease/add-disease-detail`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name DeleteDiseaseDetail
   * @summary 删除疾病明细
   * @request DELETE:/api/pathology/base-pathology-disease/delete-disease-detail
   * @secure
   */
  deleteDiseaseDetail = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/base-pathology-disease/delete-disease-detail`,
      method: 'GET',
      query: query,
      secure: true,
      ...params,
    })
}

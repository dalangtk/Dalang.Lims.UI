import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  ExamPathologySectionOutput,
  ExamPathologySectionListOutput,
  ExamPathologySectionAddInput,
  ExamPathologySectionUpdateInput,
  ExamPathologySectionQueryListInput,
} from './datacontract/exampathologysection-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class ExamPathologySectionApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/exam-pathology-section/get-page
   * @secure
   */
  getPage = (data: GetPageInput<ExamPathologySectionQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ExamPathologySectionListOutput>, any>({
      path: `/api/pathology/exam-pathology-section/get-page`,
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
   * @summary 查询切片
   * @request GET:/api/pathology/exam-pathology-section/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamPathologySectionOutput>, any>({
      path: `/api/pathology/exam-pathology-section/get`,
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
   * @summary 查询切片所有数据
   * @request GET:/api/pathology/exam-pathology-section/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<ExamPathologySectionOutput>>, any>({
      path: `/api/pathology/exam-pathology-section/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Add
   * @summary 新增切片
   * @request POST:/api/pathology/exam-pathology-section/add
   * @secure
   */
  add = (data: ExamPathologySectionAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/exam-pathology-section/add`,
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
   * @summary 修改切片
   * @request PUT:/api/pathology/exam-pathology-section/update
   * @secure
   */
  update = (data: ExamPathologySectionUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/exam-pathology-section/update`,
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
   * @summary 删除切片
   * @request DELETE:/api/pathology/exam-pathology-section/delete
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
      path: `/api/pathology/exam-pathology-section/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Get
   * @summary 查询切片列表
   * @request GET:/api/pathology/exam-pathology-section/get-sections
   * @secure
   */
  getSections = (
    query?: {
      /** @format int64 */
      examInfoId?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<ExamPathologySectionOutput>>, any>({
      path: `/api/pathology/exam-pathology-section/get-sections`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
}

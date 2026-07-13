import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  ExamPathologyDigitalSlicingOutput,
  ExamPathologyDigitalSlicingListOutput,
  ExamPathologyDigitalSlicingAddInput,
  ExamPathologyDigitalSlicingUpdateInput,
  ExamPathologyDigitalSlicingQueryListInput,
} from './datacontract/exampathologydigitalslicing-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class ExamPathologyDigitalSlicingApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/exam-pathology-digital-slicing/get-page
   * @secure
   */
  getPage = (data: GetPageInput<ExamPathologyDigitalSlicingQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ExamPathologyDigitalSlicingListOutput>, any>({
      path: `/api/pathology/exam-pathology-digital-slicing/get-page`,
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
   * @name GetList
   * @summary 查询列表
   * @request POST:/api/pathology/exam-pathology-digital-slicing/get-list
   * @secure
   */
  getList = (data: ExamPathologyDigitalSlicingQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamPathologyDigitalSlicingListOutput[]>, any>({
      path: `/api/pathology/exam-pathology-digital-slicing/get-list`,
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
   * @summary 查询数字切片
   * @request GET:/api/pathology/exam-pathology-digital-slicing/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamPathologyDigitalSlicingOutput>, any>({
      path: `/api/pathology/exam-pathology-digital-slicing/get`,
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
   * @summary 查询数字切片所有数据
   * @request GET:/api/pathology/exam-pathology-digital-slicing/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<ExamPathologyDigitalSlicingOutput>>, any>({
      path: `/api/pathology/exam-pathology-digital-slicing/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Add
   * @summary 新增数字切片
   * @request POST:/api/pathology/exam-pathology-digital-slicing/add
   * @secure
   */
  add = (data: ExamPathologyDigitalSlicingAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/exam-pathology-digital-slicing/add`,
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
   * @summary 修改数字切片
   * @request PUT:/api/pathology/exam-pathology-digital-slicing/update
   * @secure
   */
  update = (data: ExamPathologyDigitalSlicingUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/exam-pathology-digital-slicing/update`,
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
   * @summary 删除数字切片
   * @request DELETE:/api/pathology/exam-pathology-digital-slicing/delete
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
      path: `/api/pathology/exam-pathology-digital-slicing/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

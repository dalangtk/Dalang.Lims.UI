import { AxiosResponse } from 'axios'
import {
  ExamImagesAddInput,
  ExamImagesListOutput,
  ExamImagesOutput,
  ExamImagesQueryListInput,
  ExamImagesUpdateInput,
} from './datacontract/examimages-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { GetPageInput, ResultBaseOutput, ResultBasePageOutput } from '/@/api/lims/basedata/datacontract/base'

export class ExamImagesApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags exam
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/exam/exam-images/get-page
   * @secure
   */
  getPage = (data: GetPageInput<ExamImagesQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ExamImagesListOutput>, any>({
      path: `/api/exam/exam-images/get-page`,
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
   * @tags exam
   * @name Get
   * @summary 查询检验图片
   * @request GET:/api/exam/exam-images/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamImagesOutput>, any>({
      path: `/api/exam/exam-images/get`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name GetAll
   * @summary 获取检验图片所有数据
   * @request GET:/api/exam/exam-images/getAll
   * @secure
   */
  getAll = (
    query?: {
      /** @format int64 */
      examInfoId?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<ExamImagesOutput>>, any>({
      path: `/api/exam/exam-images/get-all`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name Add
   * @summary 新增检验图片
   * @request POST:/api/exam/exam-images/add
   * @secure
   */
  add = (data: ExamImagesAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/exam/exam-images/add`,
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
   * @tags exam
   * @name Update
   * @summary 修改检验图片
   * @request PUT:/api/exam/exam-images/update
   * @secure
   */
  update = (data: ExamImagesUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/exam/exam-images/update`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
  /**
   * No description
   *
   * @tags exam
   * @name Delete
   * @summary 删除检验图片
   * @request DELETE:/api/exam/exam-images/delete
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
      path: `/api/exam/exam-images/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
}

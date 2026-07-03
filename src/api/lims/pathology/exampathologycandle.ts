import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { AxiosResponse } from 'axios'
import {
  ExamPathologyCandleOutput,
  ExamPathologyCandleListOutput,
  ExamPathologyCandleAddInput,
  ExamPathologyCandleUpdateInput,
  ExamPathologyCandleQueryListInput,
} from './datacontract/exampathologycandle-datacontract'
import { ResultBaseOutput, ResultBasePageOutput, GetPageInput } from '/@/api/lims/basedata/datacontract/base'

export class ExamPathologyCandleApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name GetPage
   * @summary 查询分页
   * @request POST:/api/pathology/exam-pathology-candle/get-page
   * @secure
   */
  getPage = (data: GetPageInput<ExamPathologyCandleQueryListInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ExamPathologyCandleListOutput>, any>({
      path: `/api/pathology/exam-pathology-candle/get-page`,
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
   * @summary 查询蜡块
   * @request GET:/api/pathology/exam-pathology-candle/get
   * @secure
   */
  get = (
    query?: {
      /** @format int64 */
      id?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamPathologyCandleOutput>, any>({
      path: `/api/pathology/exam-pathology-candle/get`,
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
   * @summary 查询蜡块所有数据
   * @request GET:/api/pathology/exam-pathology-candle/getAll
   * @secure
   */
  getAll = () =>
    this.request<ResultBaseOutput<Array<ExamPathologyCandleOutput>>, any>({
      path: `/api/pathology/exam-pathology-candle/get-all`,
      method: 'GET',
      secure: true,
      format: 'json',
    })
  /**
   * No description
   *
   * @tags pathology
   * @name Add
   * @summary 新增蜡块
   * @request POST:/api/pathology/exam-pathology-candle/add
   * @secure
   */
  add = (data: ExamPathologyCandleAddInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number>, any>({
      path: `/api/pathology/exam-pathology-candle/add`,
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
   * @summary 修改蜡块
   * @request PUT:/api/pathology/exam-pathology-candle/update
   * @secure
   */
  update = (data: ExamPathologyCandleUpdateInput, params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/exam-pathology-candle/update`,
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
   * @summary 删除蜡块
   * @request DELETE:/api/pathology/exam-pathology-candle/delete
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
      path: `/api/pathology/exam-pathology-candle/delete`,
      method: 'DELETE',
      query: query,
      secure: true,
      ...params,
    })
  /**
   * No description
   *
   * @tags pathology
   * @name GetCandles
   * @summary 查询蜡块列表
   * @request GET:/api/pathology/exam-pathology-candle/get-candles
   * @secure
   */
  getCandles = (
    query?: {
      /** @format int64 */
      examInfoId?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<Array<ExamPathologyCandleOutput>>, any>({
      path: `/api/pathology/exam-pathology-candle/get-candles`,
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
   * @name SaveCandles
   * @summary 保存蜡块
   * @request POST:/api/pathology/exam-pathology-candle/save-candles
   * @secure
   */
  saveCandles = (data: ExamPathologyCandleOutput[], params: RequestParams = {}) =>
    this.request<AxiosResponse, any>({
      path: `/api/pathology/exam-pathology-candle/save-candles`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    })
}

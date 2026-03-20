import { ApplyInfoOutput } from '../shared/datacontract/applyinfo-datacontract'
import { ApplyPurposeOutput } from '../shared/datacontract/applypurpose-datacontract'
import { ExamInfoOutput } from '../shared/datacontract/examinfo-datacontract'
import { ReportQureryInput, ReportQureryOutput } from './datacontract/reportquery-datacontract'
import { SampleQueryInput } from './datacontract/samplequery-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { GetPageInput, ResultBaseOutput, ResultBasePageOutput } from '/@/api/lims/basedata/datacontract/base'

export class SampleQueryApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags sample-query
   * @name QuerySample
   * @summary 查询样本
   * @request POST:/api/statistics/sample-query/query-sample
   * @secure
   */
  querySample = (data: GetPageInput<SampleQueryInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ApplyInfoOutput>, any>({
      path: `/api/statistics/sample-query/query-sample`,
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
   * @tags sample-query
   * @name GetExamList
   * @summary 获取检验列表
   * @request GET:/api/statistics/sample-query/get-exam-list
   * @secure
   */
  getExamList = (
    query?: {
      barcode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ExamInfoOutput[]>, any>({
      path: `/api/statistics/sample-query/get-exam-list`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
  /**
   * No description
   *
   * @tags sample-query
   * @name GetPurposeList
   * @summary 获取申请目的列表
   * @request GET:/api/statistics/sample-query/get-purpose-list
   * @secure
   */
  getPurposeList = (
    query?: {
      barcode?: string
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<ApplyPurposeOutput[]>, any>({
      path: `/api/statistics/sample-query/get-purpose-list`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
}

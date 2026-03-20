import { ReportQureryInput, ReportQureryOutput } from './datacontract/reportquery-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { GetPageInput, ResultBaseOutput, ResultBasePageOutput } from '/@/api/lims/basedata/datacontract/base'

export class ReportQueryApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags report-query
   * @name QueryReport
   * @summary 取消检测
   * @request POST:/api/statistics/report-query/query-report
   * @secure
   */
  queryReport = (data: GetPageInput<ReportQureryInput>, params: RequestParams = {}) =>
    this.request<ResultBasePageOutput<ReportQureryOutput>, any>({
      path: `/api/statistics/report-query/query-report`,
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
   * @tags statistics
   * @name PrintReport
   * @summary 打印报告
   * @request GET:/api/statistics/report-query/print-report
   * @secure
   */
  printReport = (
    query?: {
      /** @format int64 */
      examId?: number
    },
    params: RequestParams = {}
  ) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/statistics/report-query/print-report`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    })
}

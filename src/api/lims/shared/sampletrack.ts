import { ExamSampleTrackListOutput, ExamSampleTrackQueryListInput } from './datacontract/sampletrack-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { ResultBaseOutput } from '/@/api/lims/basedata/datacontract/base'

export class SampleTrackApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags exam
   * @name getTrackList
   * @summary 获取样本跟踪列表
   * @request POST:/api/exam/exam-sample-track/get-list
   * @secure
   */
  getTrackList = (data: ExamSampleTrackQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamSampleTrackListOutput[]>, any>({
      path: `/api/exam/exam-sample-track/get-list`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}

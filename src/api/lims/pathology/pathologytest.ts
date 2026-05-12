import { ExamInfoOutput } from '../shared/datacontract/examinfo-datacontract'
import { ExamSpecialResultListOutput, ExamSpecialResultQueryListInput } from '../shared/datacontract/examspecialresult-datacontract'
import { PathologyBackInput, PathologyExamListQueryInput, PathologyReceiveInput } from './datacontract/pathologytest-datacontract'
import { ContentType, HttpClient, RequestParams } from '/@/api/admin/http-client'
import { ResultBaseOutput } from '/@/api/lims/basedata/datacontract/base'

export class PathologyTestApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags pathology
   * @name getPathologySampleList
   * @summary 获取病理检验样本列表
   * @request POST:/api/pathology/get-pathology-sample-list
   * @secure
   */
  getPathologySampleList = (data: PathologyExamListQueryInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput[]>, any>({
      path: `/api/pathology/pathology-test/get-pathology-sample-list`,
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
   * @name pathologyReceive
   * @summary 接收病理检验样本
   * @request POST:/api/pathology/pathology-receive
   * @secure
   */
  pathologyReceive = (data: PathologyReceiveInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamInfoOutput>, any>({
      path: `/api/pathology/pathology-test/pathology-receive`,
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
   * @name pathologyReceive
   * @summary 删除病理检验样本
   * @request POST:/api/pathology/pathology-back
   * @secure
   */
  pathologyBack = (data: PathologyBackInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<number[]>, any>({
      path: `/api/pathology/pathology-test/pathology-back`,
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
   * @name getSpecialResultList
   * @summary 获取特检结果列表
   * @request POST:/api/pathology/get-special-result-list
   * @secure
   */
  getSpecialResultList = (data: ExamSpecialResultQueryListInput, params: RequestParams = {}) =>
    this.request<ResultBaseOutput<ExamSpecialResultListOutput[]>, any>({
      path: `/api/pathology/pathology-test/get-special-result-list`,
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
   * @name saveSpecialResult
   * @summary 保存特检结果列表
   * @request POST:/api/pathology/save-special-result
   * @secure
   */
  saveSpecialResult = (data: ExamSpecialResultListOutput[], params: RequestParams = {}) =>
    this.request<ResultBaseOutput<boolean>, any>({
      path: `/api/pathology/pathology-test/save-special-result`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    })
}
